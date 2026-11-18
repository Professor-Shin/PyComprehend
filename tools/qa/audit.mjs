#!/usr/bin/env node
/**
 * audit.mjs — deterministic lint of the question bank.
 *
 * Two classes of check, neither of which requires a model:
 *  1. SCHEMA   — answer keys line up with blanks/targets/options, ids unique, etc.
 *  2. GRADING  — would src/utils/evaluator.ts reject an answer a student is
 *                entitled to give? The strongest signal is the question's own
 *                placeholder/hint: if the UI suggests a form the grader rejects,
 *                that is unambiguously a bug.
 *
 * Usage: node tools/qa/audit.mjs [projectRoot] [--json]
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.');
const AS_JSON = process.argv.includes('--json');
const HERE = resolve(fileURLToPath(import.meta.url), '..');

const bank = JSON.parse(
  execFileSync(process.execPath, [join(HERE, 'extract.mjs'), ROOT], { encoding: 'utf8', maxBuffer: 1 << 26 })
);

/* ---- mirror of src/utils/evaluator.ts (keep in sync) ---------------------- */
const normalize = (v) => (v === undefined || v === null ? '' : v.toString().trim().replace(/'/g, '"'));
const graderAccepts = (user, expected) => {
  const s = user?.toString().trim();
  if (!s) return false;
  return normalize(user) === normalize(expected);
};

/* ---- plausible-variant generator ----------------------------------------- */
/** Forms of the same answer a competent student could reasonably type. */
function variants(ans) {
  const a = ans.toString().trim();
  const out = new Set([a]);
  out.add(a.replace(/\s+/g, ''));                              // all spaces removed
  out.add(a.replace(/,(?!\s)/g, ', '));                        // space after commas
  out.add(a.replace(/:(?!\s)/g, ': '));                        // space after colons
  out.add(a.replace(/\s*(<=|>=|==|!=|\+=|-=)\s*/g, ' $1 '));   // spaced operators
  out.add(a.replace(/\s*(<=|>=|==|!=|\+=|-=)\s*/g, '$1'));     // tight operators
  out.add(a.replace(/"/g, "'"));                               // single quotes
  out.add(a.replace(/'/g, '"'));                               // double quotes
  out.delete(a);
  return [...out];
}

const findings = [];
const add = (f) => findings.push(f);
const seenIds = new Map();

for (const topic of bank.topics) {
  for (const q of topic.questions) {
    const at = { file: topic.sourceFile, questionId: q.id, title: q.title };

    /* ---------------- SCHEMA ---------------- */
    if (seenIds.has(q.id)) add({ ...at, severity: 'high', check: 'schema/duplicate-id', detail: `id also used in ${seenIds.get(q.id)}` });
    seenIds.set(q.id, topic.sourceFile);

    if (q.topicId !== topic.id) add({ ...at, severity: 'medium', check: 'schema/topic-id-mismatch', detail: `question.topicId=${q.topicId} but topic.id=${topic.id}` });
    if (q.scope !== topic.scope) add({ ...at, severity: 'medium', check: 'schema/scope-mismatch', detail: `question.scope=${q.scope} but topic.scope=${topic.scope}` });
    if (!q.explanation?.trim()) add({ ...at, severity: 'medium', check: 'schema/missing-explanation', detail: 'explanation is empty' });

    if (q.type === 'completion') {
      const blankIds = new Set(q.blanks.map((b) => b.id));
      for (const b of q.blanks) if (!(b.id in q.answers)) add({ ...at, severity: 'high', check: 'schema/blank-without-answer', detail: `blank '${b.id}' has no entry in answers` });
      for (const k of Object.keys(q.answers)) if (!blankIds.has(k)) add({ ...at, severity: 'high', check: 'schema/answer-without-blank', detail: `answers['${k}'] has no matching blank` });
      const marks = [...new Set((q.codeSnippet.match(/___(\w+)___/g) || []).map((m) => m.replace(/_/g, '')))];
      for (const m of marks) if (!blankIds.has(m)) add({ ...at, severity: 'high', check: 'schema/orphan-placeholder', detail: `snippet shows ___${m}___ but no blank has id '${m}'` });
      for (const b of q.blanks) if (marks.length && !marks.includes(b.id)) add({ ...at, severity: 'medium', check: 'schema/blank-not-in-snippet', detail: `blank '${b.id}' never appears as ___${b.id}___ in the snippet` });
    }

    if (q.type === 'tracing') {
      const expectedKeys = new Set(q.targets.flatMap((t) => t.vars.map((v) => `${t.line}-${v}`)));
      for (const k of expectedKeys) if (!(k in q.answers)) add({ ...at, severity: 'high', check: 'schema/target-without-answer', detail: `target key '${k}' has no answer` });
      for (const k of Object.keys(q.answers)) if (!expectedKeys.has(k)) add({ ...at, severity: 'high', check: 'schema/answer-without-target', detail: `answers['${k}'] is never asked for (not in targets) — it is scored but no input field exists` });
      for (const t of q.targets) {
        if (!new RegExp(`^\\s*\\*?${t.line}:`, 'm').test(q.codeSnippet)) add({ ...at, severity: 'medium', check: 'schema/target-line-missing', detail: `targets references line ${t.line}, not found in the numbered snippet` });
        for (const v of t.vars) if (!q.variablesToTrack.includes(v)) add({ ...at, severity: 'medium', check: 'schema/untracked-var', detail: `target var '${v}' missing from variablesToTrack` });
      }
    }

    if (q.type === 'mcq') {
      const ids = q.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) add({ ...at, severity: 'high', check: 'schema/duplicate-option-id', detail: `option ids: ${ids.join(',')}` });
      if (!ids.includes(q.correctOptionId)) add({ ...at, severity: 'high', check: 'schema/bad-correct-option', detail: `correctOptionId='${q.correctOptionId}' is not among ${ids.join(',')}` });
      const texts = q.options.map((o) => o.text.trim());
      const dupes = texts.filter((t, i) => texts.indexOf(t) !== i);
      if (dupes.length) add({ ...at, severity: 'high', check: 'schema/duplicate-option-text', detail: `two options read identically: ${[...new Set(dupes)].join(' | ')}` });
    }

    /* ---------------- GRADING ROBUSTNESS ---------------- */
    if (q.type === 'completion' || q.type === 'tracing') {
      for (const [key, expected] of Object.entries(q.answers)) {
        const blank = q.type === 'completion' ? q.blanks.find((b) => b.id === key) : null;

        // The documented example answer should itself be gradeable. It is not
        // shown to students (see below), so this is a data-consistency check.
        const raw = blank?.placeholder;
        if (raw) {
          const suggestion = raw.replace(/^\s*e\.g\.?\s*/i, '').trim();
          if (suggestion && suggestion !== raw.trim() && !graderAccepts(suggestion, expected)) {
            add({ ...at, severity: 'medium', check: 'data/example-answer-not-accepted',
              detail: `placeholder documents \`${suggestion}\` but the fallback grader only accepts \`${expected}\`` });
          }
        }

        // `hint` IS rendered (behind a "Show hint" toggle), so it must not
        // contain the answer.
        if (blank?.hint) {
          const squash = (v) => String(v).replace(/\s+/g, '').replace(/"/g, "'");
          if (squash(expected).length > 2 && squash(blank.hint).includes(squash(expected))) {
            add({ ...at, severity: 'critical', check: 'content/hint-contains-answer',
              detail: `hint "${blank.hint}" contains the answer \`${expected}\` — the hint is shown to students on request` });
          }
        }
        // src/utils/semanticGrader.ts executes the answer, so these forms pass
        // in the app. They only matter on the offline fallback to exact match,
        // which is why this is informational rather than a defect.
        const rejected = variants(expected).filter((v) => !graderAccepts(v, expected));
        if (rejected.length) {
          add({ ...at, severity: 'low', check: 'grading/exact-fallback-only', key,
            detail: `answers['${key}'] = \`${expected}\` relies on semantic grading; ` +
              `if Python is unavailable the fallback rejects ${rejected.length} equivalent form(s), e.g. \`${rejected[0]}\`` });
        }
      }
    }
  }
}

/* ---- source scan: the model answer must never reach the UI ---------------- */
function scanComponents(root) {
  const dir = join(root, 'src/components');
  const files = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx|ts)$/.test(name)) files.push(full);
    }
  };
  try { walk(dir); } catch { return; }

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*)/.test(line)) return;             // comments are fine
      if (!/\bplaceholder\b/.test(line)) return;
      // A literal placeholder="..." is fine; binding it to blank data is not.
      if (/placeholder\s*=\s*["'`]/.test(line)) return;
      if (/\bblank\.placeholder\b|placeholder\s*\}|\.placeholder\b/.test(line)) {
        add({
          file: file.replace(root + '/', ''), questionId: '-', title: `line ${i + 1}`,
          severity: 'critical', check: 'content/placeholder-rendered',
          detail: `\`${line.trim()}\` renders BlankItem.placeholder. That field is the model ` +
            `answer for every blank in this bank — showing it hands the student the answer.`,
        });
      }
    });
  }
}
scanComponents(ROOT);

const order = { critical: 0, high: 1, medium: 2, low: 3 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.questionId.localeCompare(b.questionId));

if (AS_JSON) {
  console.log(JSON.stringify({ total: findings.length, findings }, null, 2));
} else {
  const counts = findings.reduce((m, f) => ((m[f.severity] = (m[f.severity] || 0) + 1), m), {});
  console.log(`\n  Question bank audit — ${bank.topics.flatMap((t) => t.questions).length} questions, ${findings.length} finding(s)`);
  console.log(`  ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join('   ') || 'clean'}\n`);
  for (const f of findings) {
    console.log(`  [${f.severity.toUpperCase()}] ${f.check}`);
    console.log(`    ${f.questionId} — ${f.title}  (${f.file})`);
    console.log(`    ${f.detail}\n`);
  }
}
process.exit(findings.some((f) => f.severity === 'critical' || f.severity === 'high') ? 1 : 0);
