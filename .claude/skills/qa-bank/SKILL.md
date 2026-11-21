---
name: qa-bank
description: Run the full question-bank QA pipeline — schema lint, grading-fairness audit, and real-CPython verification of every stored answer. Use before a release, after a merge that touches src/data/, or when a student reports a wrong answer.
---

# Question bank QA

Drives the three content agents over the bank and produces one report. Takes an optional
argument: a topic file, a question id, or nothing (= everything).

## 1. Deterministic pass — run this first, yourself

```bash
node tools/qa/audit.mjs .          # schema + grading lint
node tools/qa/verify_all.mjs .     # every stored answer vs real CPython
node tools/qa/check_grading.mjs .  # equivalent spellings pass, wrong answers still fail
node tools/qa/check_runtime.mjs .  # the worker's Python driver (skips without pyodide)
```

These are pure code — no model judgement — and they exit non-zero on real problems. If
they are clean, say so and move on; if they are not, their findings are facts, not
candidates for debate. `verify_all.mjs` also lists every tracing target on a line that
runs more than once: any of those whose `description` does not say which visit it means
is a bug, because the question then has two defensible answers.

## 2. Semantic pass — delegate

Spawn in parallel, since they do not depend on each other:

- **`question-verifier`** over the questions in scope. Brief it with the ids and tell it
  what the deterministic pass already found, so it does not re-derive it.
- **`grading-auditor`** with the `audit.mjs --json` output, to go past whitespace into
  genuinely-equivalent expressions.

For a UI-touching change, add **`quiz-ux-reviewer`**. For new questions, run
**`question-author`** first, then verify.

## 3. Report

One table, most severe first:

| id | verdict | what a student sees | fix |
|---|---|---|---|

Separate **wrong content** (the stored answer disagrees with CPython) from **unfair
grading** (the answer is right but the grader rejects correct input) from **ambiguity**
(the question has two defensible answers) — they have different owners and different fixes.

Apply nothing without asking, with one exception: a placeholder or hint that suggests a
form the grader rejects is unambiguously a bug, and fixing the suggestion text changes no
score. Everything else — especially loosening `evaluator.ts` — changes results students
may have already seen, so it is the user's call.

## Known rough edges

Some snippets cannot be graded or verified unaided. The optional `verify` block fixes
each case; it is ignored by the UI and read by both the tools and `semanticGrader.ts`:

```ts
verify: {
  probes: ['score = 85', 'score = 50', 'score = 49'],  // free variables, one per branch
  stdin: ['Love is all around'],                        // input() calls, in order
  postlude: 'print(rec_sum(4), rec_sum(0))',            // snippet only DEFINES something
}
```

Without `probes`, a single value lets `>` pass where `>=` was required. Without
`postlude`, a define-only snippet produces nothing observable, so the grader refuses it
and silently drops back to exact string matching.
