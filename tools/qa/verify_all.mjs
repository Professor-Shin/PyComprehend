#!/usr/bin/env node
/**
 * verify_all.mjs — compares every stored answer against what CPython does.
 *
 * Drives run_snippet.py over the whole bank and judges the result:
 *   tracing    — the stored value must appear among the observed before/after
 *                states at that line
 *   mcq        — if the snippet prints, the correct option must match stdout;
 *                if it raises, the correct option must name that error
 *   completion — the snippet, filled with the stored answers, must run clean
 *
 * Usage: node tools/qa/verify_all.mjs [projectRoot]
 */
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const ROOT = resolve(process.argv[2] ?? '.');
const HERE = resolve(fileURLToPath(import.meta.url), '..');
const tmp = mkdtempSync(join(tmpdir(), 'pyc-verify-'));

const bankJson = execFileSync(process.execPath, [join(HERE, 'extract.mjs'), ROOT], {
  encoding: 'utf8', maxBuffer: 1 << 26,
});
const bankPath = join(tmp, 'bank.json');
writeFileSync(bankPath, bankJson);
const bank = JSON.parse(bankJson);
const byId = Object.fromEntries(bank.topics.flatMap((t) => t.questions).map((q) => [q.id, q]));

const obs = JSON.parse(
  execFileSync('python3', ['-I', join(HERE, 'run_snippet.py'), '--bank', bankPath, '--all', '--use-stored-answers'],
    { encoding: 'utf8', maxBuffer: 1 << 26 }),
);

const norm = (s) => String(s).replace(/"/g, "'");
const problems = [];
const ambiguous = [];
let checks = 0;

for (const o of obs) {
  const q = byId[o.id];
  if (o.toolError) { problems.push([o.id, `tool error: ${o.toolError}`]); continue; }

  if (o.type === 'tracing') {
    if (o.error) { problems.push([o.id, `snippet raised ${o.error}`]); continue; }
    for (const [key, expected] of Object.entries(o.storedAnswers)) {
      const line = key.slice(0, key.indexOf('-'));
      const varName = key.slice(key.indexOf('-') + 1);
      const visits = (o.observations || []).filter((x) => String(x.displayLine) === line);
      if (!visits.length) { problems.push([o.id, `${key}: line ${line} never executes`]); continue; }
      const seen = visits.flatMap((x) => [x.before?.[varName], x.after?.[varName]]).filter((v) => v != null);
      if (seen.some((v) => norm(v) === norm(expected))) checks++;
      else problems.push([o.id, `${key}: stored \`${expected}\` not observed; saw ${JSON.stringify(seen)}`]);
    }
    if (o.ambiguousLines) ambiguous.push(`${o.id} (line ${o.ambiguousLines.join(', ')})`);
    continue;
  }

  if (o.type === 'mcq') {
    const correct = q.options.find((x) => x.id === q.correctOptionId);
    const printed = (o.stdout || '').split('\n').filter((l) => !/^Enter /.test(l)).join('\n').trim();
    if (o.error) {
      const errName = o.error.split(':')[0];
      if (correct.text.includes(errName)) checks++;
      else problems.push([o.id, `raised ${o.error}, but option ${q.correctOptionId} reads "${correct.text}"`]);
    } else if (printed) {
      const want = correct.text.replace(/ then /g, '\n').trim();
      if (printed === want) checks++;
      else problems.push([o.id, `prints ${JSON.stringify(printed)}, option ${q.correctOptionId} reads ${JSON.stringify(want)}`]);
    } else {
      checks++;   // nothing printed: the question is about code that is not run
    }
    continue;
  }

  // completion
  if (o.error) problems.push([o.id, `filled with stored answers it raises ${o.error}`]);
  else checks++;
}

console.log(`\n  Answer verification — ${obs.length} questions, ${checks} checks against CPython`);
console.log(`  ${problems.length ? `${problems.length} MISMATCH(ES)` : 'all stored answers confirmed'}\n`);
for (const [id, msg] of problems) console.log(`  [MISMATCH] ${id} — ${msg}`);
if (ambiguous.length) {
  console.log(`\n  Lines visited more than once (the question must say which visit it means):`);
  for (const a of ambiguous) console.log(`    ${a}`);
}
console.log('');
process.exit(problems.length ? 1 : 0);
