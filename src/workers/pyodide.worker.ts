/// <reference lib="webworker" />
/**
 * Pyodide host worker.
 *
 * Pyodide is real CPython compiled to WebAssembly: free, served from a CDN, and
 * executed entirely in the student's browser. There is no server and no API key.
 *
 * It lives in a worker for one reason that matters here: this app teaches loops,
 * and `rec_05` and `loop_05` are literally questions about non-terminating code.
 * On the main thread a runaway loop freezes the tab with no way back. A worker
 * can be terminated.
 */

const PYODIDE_VERSION = '0.26.2';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;

type Pyodide = {
  runPython: (code: string) => unknown;
  setStdin: (opts: { stdin: () => string }) => void;
};

let pyodide: Pyodide | null = null;
let loading: Promise<Pyodide> | null = null;

async function getPyodide(): Promise<Pyodide> {
  if (pyodide) return pyodide;
  if (!loading) {
    loading = (async () => {
      const mod = await import(/* @vite-ignore */ PYODIDE_URL);
      const py = (await mod.loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
      })) as Pyodide;
      pyodide = py;
      return py;
    })();
  }
  return loading;
}

/**
 * Executes the snippet in a fresh namespace and reports the resulting bindings.
 *
 * The bindings matter as much as stdout: most completion questions in this bank
 * only assign variables and never print, so stdout alone cannot tell a correct
 * answer from a wrong one.
 */
const DRIVER = `
import json as _json, re as _re, io as _io, contextlib as _contextlib

def _pyc_run(_src):
    _ns = {}
    _buf = _io.StringIO()
    try:
        # Capture inside Python rather than through setStdout. Pyodide's batched
        # stdout buffers until a newline, so a snippet ending in print(..., end='')
        # -- or an input() prompt -- would otherwise spill into the NEXT run's
        # output. Redirecting here scopes the capture to exactly one run.
        with _contextlib.redirect_stdout(_buf), _contextlib.redirect_stderr(_buf):
            exec(compile(_src, '<snippet>', 'exec'), _ns)
        _err = None
    except BaseException as e:
        _err = '%s: %s' % (type(e).__name__, e)
    _vars = {}
    for _k, _v in list(_ns.items()):
        if _k.startswith('__'):
            continue
        if callable(_v) or type(_v).__name__ == 'module':
            continue
        try:
            # Default object reprs embed a memory address that changes every run.
            _vars[_k] = _re.sub(r' at 0x[0-9a-fA-F]+', '', repr(_v))
        except Exception:
            _vars[_k] = '<unreprable>'
    return _json.dumps({'out': _buf.getvalue(), 'error': _err, 'vars': _vars})
`;

let driverLoaded = false;

async function run(source: string, stdin: string[]) {
  const py = await getPyodide();
  if (!driverLoaded) {
    py.runPython(DRIVER);
    driverLoaded = true;
  }

  const feed = [...stdin];
  py.setStdin({ stdin: () => (feed.length ? feed.shift()! : '') });

  py.runPython(`_pyc_src = ${JSON.stringify(source)}`);
  const raw = py.runPython('_pyc_run(_pyc_src)') as string;
  const parsed = JSON.parse(raw) as {
    out: string;
    error: string | null;
    vars: Record<string, string>;
  };

  return { stdout: parsed.out, error: parsed.error, vars: parsed.vars };
}

self.onmessage = async (e: MessageEvent) => {
  const { type, id, source, stdin } = e.data ?? {};
  try {
    if (type === 'init') {
      await getPyodide();
      self.postMessage({ type: 'ready' });
      return;
    }
    if (type === 'run') {
      const result = await run(source, stdin ?? []);
      self.postMessage({ type: 'result', id, ...result });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage(
      type === 'init'
        ? { type: 'failed', error: message }
        : { type: 'result', id, stdout: '', error: message, vars: {} },
    );
  }
};
export {};
