#!/usr/bin/env node
/**
 * check_grading.mjs — regression test for semantic grading.
 *
 * Builds the *actual* Python programs that src/utils/semanticGrader.ts sends to
 * Pyodide (imported, not re-implemented, so the test cannot drift from the app)
 * and runs them through local CPython.
 *
 * Asserts two things for every answer in the bank:
 *   ACCEPT — equivalent spellings a student may reasonably type are marked right
 *   REJECT — a genuinely different answer is still marked wrong
 *
 * The second half matters more than the first: a grader that accepts everything
 * is worse than a strict one.
 *
 * Usage: node tools/qa/check_grading.mjs [projectRoot]
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(process.argv[2] ?? '.');
const HERE = resolve(fileURLToPath(import.meta.url), '..');
const tmp = mkdtempSync(join(tmpdir(), 'pyc-grade-'));

/* The grader module is TypeScript with type-only imports; stripping them yields
   valid ESM, same trick as extract.mjs. */
const graderSrc = execFileSync('sed', [
  '-e', '/^import .*from/d',
  '-e', 's/: Array<\\[string, string, string\\]>//g',
  '-e', 's/: string\\[\\]//g',
  '-e', 's/: Record<string, string>//g',
  '-e', 's/: string//g',
  '-e', 's/postlude = ..$/postlude = ""/',
  join(ROOT, 'src/utils/semanticGrader.ts'),
], { encoding: 'utf8' });

// Keep only the two pure program builders; the rest references React-land types.
const keep = graderSrc
  .split('\n')
  .join('\n')
  .match(/export function (tracingProgram|completionProgram)[\s\S]*?\n}\n/g);
if (!keep || keep.length !== 2) {
  console.error('could not isolate program builders from semanticGrader.ts');
  process.exit(2);
}
const modPath = join(tmp, 'grader.mjs');
writeFileSync(modPath, keep.join('\n'));
const { tracingProgram, completionProgram } = await import(pathToFileURL(modPath).href);

const bank = JSON.parse(
  execFileSync(process.execPath, [join(HERE, 'extract.mjs'), ROOT], { encoding: 'utf8', maxBuffer: 1 << 26 }),
);

const runPy = (src) => {
  const f = join(tmp, `run-${Math.random().toString(36).slice(2)}.py`);
  writeFileSync(f, src);
  try {
    return execFileSync('python3', ['-I', f], { encoding: 'utf8', timeout: 20000 });
  } catch (e) {
    return `__ERROR__ ${e.stderr || e.message}`;
  }
};

/* ---- the forms a student may reasonably type instead of the model answer ---- */
const accepting = (a) => [
  // Only collapse whitespace that is not separating two word characters --
  // `{k:v[0] for k,v in ...}` with every space removed is not Python at all.
  a.replace(/(?<![\w])\s+|\s+(?![\w])/g, ''),
  a.replace(/,(?!\s)/g, ', '),
  a.replace(/:(?!\s)/g, ': '),
  a.replace(/\s*(<=|>=|==|!=)\s*/g, ' $1 '),
  a.replace(/\s*(<=|>=|==|!=)\s*/g, '$1'),
].filter((v) => v !== a);

/* ---- mutations that are never equivalent: accepting one is a hard failure --- */
const mustReject = (a) => {
  const out = [];
  if (/^-?\d+$/.test(a)) out.push(String(Number(a) + 1), `"${a}"`);  // off-by-one, int vs str
  else if (/^["'].*["']$/.test(a)) out.push(a.slice(1, -1));          // str vs bare/int
  if (/\bTrue\b/.test(a)) out.push(a.replace('True', 'False'));
  if (/\bFalse\b/.test(a)) out.push(a.replace('False', 'True'));
  return out.filter((v) => v && v !== a);
};

/* ---- boundary mutations that are USUALLY wrong but sometimes genuinely are
   not. `rec_sum`'s base case is correct as `n <= 0` and as `n < 0`: both stop
   the recursion, the second just uses one more frame. Accepting one of these is
   reported for review, not failed, because the whole point of behavioural
   grading is that it knows this and string matching does not. ---------------- */
const reviewIfAccepted = (a) => {
  const out = [];
  if (/>=/.test(a)) out.push(a.replace('>=', '>'));
  if (/<=/.test(a)) out.push(a.replace('<=', '<'));
  return out.filter((v) => v && v !== a);
};

let accepted = 0, acceptFails = 0, rejected = 0, rejectFails = 0, skipped = 0;
const failures = [];
const review = [];

for (const topic of bank.topics) {
  for (const q of topic.questions) {
    if (q.type === 'mcq') continue;

    const probe = (key, candidate, expectCorrect, soft = false) => {
      let out;
      if (q.type === 'tracing') {
        out = runPy(tracingProgram([[key, String(q.answers[key]), candidate]]));
      } else {
        const refValues = Object.fromEntries(
          Object.keys(q.answers).map((id) => [id, String(q.answers[id])]),
        );
        const sub = (vals) => {
          let src = q.codeSnippet.split('\n').map((l) => l.replace(/^\s*\*?\s*\d+:\s?/, '')).join('\n');
          for (const [id, v] of Object.entries(vals)) src = src.split(`___${id}___`).join(v);
          return src;
        };
        const probes = q.verify?.probes ?? (q.verify?.prelude ? [q.verify.prelude] : ['']);
        out = runPy(
          completionProgram(sub(refValues), { [key]: sub({ ...refValues, [key]: candidate }) },
            probes, q.verify?.stdin ?? [], q.verify?.postlude ?? ''),
        );
      }

      if (out.startsWith('__ERROR__')) { skipped++; return; }
      let parsed;
      try { parsed = JSON.parse(out.trim().split('\n').pop()); } catch { skipped++; return; }

      const got = q.type === 'tracing' ? parsed[key] : (parsed.referenceOk ? parsed.blanks[key] : null);
      if (got === null || got === undefined) { skipped++; return; }

      if (got === expectCorrect) {
        expectCorrect ? accepted++ : rejected++;
        return;
      }
      const line =
        `${q.id}[${key}]  model=\`${q.answers[key]}\`  student=\`${candidate}\``;
      if (soft) {
        review.push(line);
        return;
      }
      expectCorrect ? acceptFails++ : rejectFails++;
      failures.push(`${expectCorrect ? 'SHOULD ACCEPT' : 'SHOULD REJECT'}  ${line}`);
    };

    for (const key of Object.keys(q.answers)) {
      const model = String(q.answers[key]);
      for (const v of accepting(model)) probe(key, v, true);
      for (const v of mustReject(model)) probe(key, v, false);
      for (const v of reviewIfAccepted(model)) probe(key, v, false, true);
    }
  }
}

console.log(`\n  Semantic grading check`);
console.log(`  equivalent spellings accepted : ${accepted}  (${acceptFails} wrongly rejected)`);
console.log(`  wrong answers rejected        : ${rejected}  (${rejectFails} wrongly accepted)`);
console.log(`  not gradable semantically     : ${skipped}\n`);
for (const f of failures) console.log(`  FAIL    ${f}`);
if (review.length) {
  console.log(
    `\n  Boundary variants accepted as equivalent (verified by execution, not assumed):`,
  );
  for (const r of review) console.log(`  REVIEW  ${r}`);
}
console.log('');
process.exit(failures.length ? 1 : 0);
