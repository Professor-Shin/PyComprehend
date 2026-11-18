/**
 * Main-thread handle on the Pyodide worker.
 *
 * Everything here is best-effort by design. The runtime is a ~10MB CDN download,
 * so it is loaded lazily on first use and the app must stay fully usable when it
 * is still loading, blocked by a network, or unavailable entirely — see
 * semanticGrader.ts for the fallback path.
 */

export type RuntimeStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

export interface RunResult {
  stdout: string;
  /** Python exception as "TypeError: ...", a timeout message, or null. */
  error: string | null;
  /** Module-level bindings after the snippet ran, as `repr()` strings. */
  vars: Record<string, string>;
  timedOut?: boolean;
}

const DEFAULT_TIMEOUT_MS = 5000;

let worker: Worker | null = null;
let status: RuntimeStatus = 'idle';
let readyPromise: Promise<boolean> | null = null;
let seq = 0;

const pending = new Map<number, (r: RunResult) => void>();
const listeners = new Set<(s: RuntimeStatus) => void>();

function setStatus(next: RuntimeStatus) {
  status = next;
  listeners.forEach((l) => l(next));
}

export function getStatus(): RuntimeStatus {
  return status;
}

export function onStatusChange(fn: (s: RuntimeStatus) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function spawn(): Worker {
  const w = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
    type: 'module',
  });
  w.onmessage = (e: MessageEvent) => {
    const { type, id } = e.data ?? {};
    if (type === 'ready') setStatus('ready');
    else if (type === 'failed') setStatus('unavailable');
    else if (type === 'result') {
      const resolve = pending.get(id);
      if (resolve) {
        pending.delete(id);
        resolve({ stdout: e.data.stdout, error: e.data.error, vars: e.data.vars ?? {} });
      }
    }
  };
  w.onerror = () => setStatus('unavailable');
  return w;
}

/** Starts the download. Safe to call repeatedly; resolves false if unavailable. */
export function loadRuntime(): Promise<boolean> {
  if (readyPromise) return readyPromise;
  if (typeof Worker === 'undefined') {
    setStatus('unavailable');
    return Promise.resolve(false);
  }

  setStatus('loading');
  worker = spawn();
  worker.postMessage({ type: 'init' });

  readyPromise = new Promise<boolean>((resolve) => {
    const stop = onStatusChange((s) => {
      if (s === 'ready') { stop(); resolve(true); }
      else if (s === 'unavailable') { stop(); resolve(false); }
    });
    // A cold CDN fetch on a slow phone is legitimately slow; be generous, but
    // do not hang the caller forever.
    setTimeout(() => {
      if (status === 'loading') { setStatus('unavailable'); stop(); resolve(false); }
    }, 90_000);
  });

  return readyPromise;
}

/**
 * Terminates the worker and clears its queue. Used when a snippet runs past its
 * timeout — the only way to stop an infinite loop once it has started.
 */
function recycle(reason: string) {
  worker?.terminate();
  worker = null;
  readyPromise = null;
  setStatus('idle');
  pending.forEach((resolve) =>
    resolve({ stdout: '', error: reason, vars: {}, timedOut: true }),
  );
  pending.clear();
}

export async function runPython(
  source: string,
  opts: { stdin?: string[]; timeoutMs?: number } = {},
): Promise<RunResult> {
  const ok = await loadRuntime();
  if (!ok || !worker) {
    return { stdout: '', error: 'Python runtime unavailable', vars: {} };
  }

  const id = ++seq;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return new Promise<RunResult>((resolve) => {
    const timer = setTimeout(() => {
      if (!pending.has(id)) return;
      recycle(
        `Stopped after ${Math.round(timeoutMs / 1000)}s — the code did not finish. ` +
          'Check for a loop that never ends.',
      );
    }, timeoutMs);

    pending.set(id, (r) => { clearTimeout(timer); resolve(r); });
    worker!.postMessage({ type: 'run', id, source, stdin: opts.stdin ?? [] });
  });
}

/** Strips the display-only `N: ` / `*N: ` prefixes used by tracing snippets. */
export function stripLineNumbers(snippet: string): string {
  return snippet
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s*\d+:\s?/, ''))
    .join('\n');
}

/** True when the snippet still has unfilled `___1___` markers. */
export function hasBlanks(snippet: string): boolean {
  return /___\w+___/.test(snippet);
}
