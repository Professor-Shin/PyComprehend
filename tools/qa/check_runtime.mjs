#!/usr/bin/env node
/**
 * check_runtime.mjs — exercises the browser Python runtime against real Pyodide.
 *
 * The app runs Pyodide in a Web Worker, which no Node test can reproduce. What
 * this *can* check is the part that actually broke in practice: the Python
 * DRIVER program and the Pyodide API surface the worker depends on. The driver
 * is read out of src/workers/pyodide.worker.ts rather than copied, so the test
 * cannot drift away from the code it is testing.
 *
 * Needs pyodide locally; skips (exit 0) when it is absent, since it is not a
 * project dependency:
 *     npm i --no-save pyodide@0.26.2 && node tools/qa/check_runtime.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? '.');

let loadPyodide;
try {
  ({ loadPyodide } = await import('pyodide'));
} catch {
  console.log('\n  Runtime check SKIPPED — pyodide not installed locally.');
  console.log('  Run: npm i --no-save pyodide@0.26.2\n');
  process.exit(0);
}

const workerSrc = readFileSync(resolve(ROOT, 'src/workers/pyodide.worker.ts'), 'utf8');
const DRIVER = workerSrc.split('const DRIVER = `')[1].split('`;')[0];

const py = await loadPyodide();
py.runPython(DRIVER);

const feed = ['20'];
py.setStdin({ stdin: () => (feed.length ? feed.shift() : '') });

const run = (source) => {
  py.runPython(`_pyc_src = ${JSON.stringify(source)}`);
  const p = JSON.parse(py.runPython('_pyc_run(_pyc_src)'));
  return { stdout: p.out, error: p.error, vars: p.vars };
};

const failures = [];
const check = (label, cond, detail) => {
  if (cond) return;
  failures.push(`${label}: ${detail}`);
};

let r = run('x = 2 + 3\nprint(x)');
check('stdout', r.stdout === '5\n', `expected "5\\n", got ${JSON.stringify(r.stdout)}`);
check('vars', r.vars.x === '5', `expected x=5, got ${JSON.stringify(r.vars)}`);

r = run("age = input('Enter age: ')\nprint(age + 1)");
check('error reported', /^TypeError/.test(r.error || ''), `expected TypeError, got ${r.error}`);
check('stdin', r.vars.age === "'20'", `input() should yield the fed string, got ${r.vars.age}`);

// Regression: Pyodide's batched stdout buffers an unterminated line, so a prompt
// or print(..., end='') used to spill into the NEXT run's captured output.
r = run("print('clean')");
check('no stdout bleed', r.stdout === 'clean\n', `earlier output leaked in: ${JSON.stringify(r.stdout)}`);

// Regression: default object reprs carry a memory address that differs per run,
// which would make behavioural comparison mark every answer wrong.
r = run('class S:\n    def __init__(s): s.v = 1\no = S()');
check('repr has no address', !/0x[0-9a-fA-F]+/.test(JSON.stringify(r.vars)),
  `address leaked: ${JSON.stringify(r.vars)}`);

// Infinite recursion must come back as an error, not take the runtime down.
r = run('def f(n):\n    return f(n + 1)\nf(0)');
check('recursion error', /RecursionError/.test(r.error || ''), `got ${r.error}`);

// ...and the instance must still be usable afterwards.
r = run('print(1 + 1)');
check('survives an error', r.stdout === '2\n', `runtime unusable after error: ${JSON.stringify(r)}`);

console.log(`\n  Browser runtime check — pyodide ${py.version ?? '0.26.2'}`);
console.log(`  ${failures.length ? `${failures.length} FAILURE(S)` : 'driver and API surface OK'}\n`);
for (const f of failures) console.log(`  [FAIL] ${f}`);
console.log('');
process.exit(failures.length ? 1 : 0);
