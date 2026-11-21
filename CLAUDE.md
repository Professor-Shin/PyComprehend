# PyComprehend

A Python code-comprehension drill app for CS students. React 18 + TypeScript + Vite +
Tailwind + Zustand. No backend, no test runner, no Python runtime in the product.

## Why this repo needs unusual care

The UI is small and stable. **All the risk lives in the data.** `src/data/topics/*.ts`
holds 63 hand-written questions whose answers were computed by hand. Two failure modes
follow, and both had live instances before the QA harness existed:

1. **A stored answer can simply be wrong.** `list_02` claimed `'Solooooo'[::-2]` was
   `'oolS'`; CPython says `'oooo'`. The explanation mis-indexed the string, so the answer
   was wrong *because* the explanation was.
2. **A correct answer can be graded wrong.** Three questions' placeholders suggested a
   form the exact-match grader rejected.

Never hand-verify Python semantics. Run the code. See `tools/qa/`.

## Grading: behaviour first, string match as fallback

`src/utils/semanticGrader.ts` is the primary grader. It runs the student's answer in real
Python (Pyodide) and compares **behaviour**, so `range(2, 11, 2)` and `range(2,11,2)` both
pass, while `"2020"` stays distinct from `2020` because the type differs.

`src/utils/evaluator.ts` (exact match after quote normalisation) is the fallback, used
whenever Pyodide is still loading, blocked, or the question cannot be graded safely.
Grading therefore never blocks on the network.

Three guards keep behavioural grading honest, and each exists because of a real failure:

- **Unobservable snippets refuse to grade.** `rec_02` only *defines* `rec_sum`, so every
  candidate behaved identically and any answer would pass. When the reference run produces
  no stdout and no bindings, the question falls back to exact match. Give such a question
  a `verify.postlude` that calls the thing it defines.
- **Free variables need several probes.** With only `score = 85`, `>=` and `>` behave the
  same. `verify.probes` runs one prelude per branch, including both boundaries.
- **Object reprs are address-stripped.** `<Student object at 0x7f…>` differs every run and
  would otherwise mark every answer wrong.

## The Python runtime

Pyodide (real CPython in WebAssembly), loaded from a CDN, free, no server. It lives in a
Web Worker (`src/workers/pyodide.worker.ts`) because this app teaches loops and two
questions are *about* non-terminating code — on the main thread a runaway loop freezes the
tab, and only a worker can be terminated. `src/utils/pythonRuntime.ts` owns the worker,
the 5s timeout and the recycle-after-timeout path.

The worker captures stdout **inside Python** with `redirect_stdout`, not via Pyodide's
`setStdout`: the batched callback buffers an unterminated line, so a prompt or
`print(..., end='')` used to spill into the next run's output.

## Layout

| Path | Role |
|---|---|
| `src/data/types.ts` | question schema — three types: `tracing`, `completion`, `mcq` |
| `src/data/topics/*.ts` | the question bank (one file per topic, 6 questions each) |
| `src/data/index.ts` | aggregation + scope filtering (`midterm` / `final`) |
| `src/utils/semanticGrader.ts` | primary grader — runs the answer, compares behaviour |
| `src/utils/evaluator.ts` | fallback grader — exact match after quote normalisation |
| `src/utils/pythonRuntime.ts` | worker lifecycle, timeouts, graceful degradation |
| `src/workers/pyodide.worker.ts` | Pyodide host; the Python DRIVER program |
| `src/store/themeStore.ts` | light/dark/system preference |
| `src/store/quizStore.ts` | all app state (zustand), scoring, navigation |
| `src/components/quiz/*` | one reader component per question type |
| `tools/qa/` | the verification harness the QA agents drive |

## Invariants

- Question `id` is globally unique and stable. It is the key for scores and progress —
  renaming one silently discards a student's result for it.
- `question.scope` must equal its topic's `scope`; `question.topicId` must equal `topic.id`.
  Scope filtering in `getTopicsByScope` reads the topic, scoring reads the question.
- Tracing: every `targets[].line`/`vars` pair must have an `answers['<line>-<var>']` entry,
  and vice versa. An answer with no target is scored but has no input field — it is
  unwinnable.
- Completion: `blanks[].id` ↔ `answers` keys ↔ `___<id>___` markers in `codeSnippet`,
  all three in sync.
- MCQ: `correctOptionId` must exist among `options[].id`; no two options may read alike.
- Snippets for `tracing` use a `N: ` line prefix, with `*N:` marking a traced line.
  These prefixes are display-only and are stripped before execution.

## Tracing convention

"Trace `v` at line N" is ambiguous whenever line N runs more than once. The bank is not
internally consistent about which visit it means — `loop_02` means the first, `loop_04`
the last, `rec_01` and `rec_04` the state *before* the first — so every such question now
states its own reading in `description`. Keep doing that: `verify_all.mjs` lists every
multi-visit target, and a question in that list without an explicit sentence is a bug.

Target only **executable** lines. A bare `else:` emits no trace event and can never be
verified; `cond_04` used to target one.

## Tooling

All dependency-free except the optional runtime check — none of them need `node_modules`.

```bash
node tools/qa/extract.mjs .        # bank -> JSON (strips the two TS-only constructs)
node tools/qa/audit.mjs .          # schema + grading lint; exits 1 on high/critical
node tools/qa/verify_all.mjs .     # every stored answer vs real CPython; exits 1 on mismatch
node tools/qa/check_grading.mjs .  # equivalent spellings pass, wrong answers still fail
node tools/qa/check_runtime.mjs .  # the worker's Python driver vs real Pyodide
                                   #   needs: npm i --no-save pyodide@0.26.2 (else skips)
python3 -I tools/qa/run_snippet.py --bank bank.json --id loop_02   # one question, in detail
```

Run `verify_all` and `audit` before any commit that touches `src/data/`.

## Agents

`.claude/agents/` — `question-verifier`, `grading-auditor`, `question-author`,
`quiz-ux-reviewer`. Run `/qa-bank` to drive the whole pipeline.

## Conventions

- **Never hardcode a palette colour.** Every colour is a semantic token backed by a CSS
  variable in `src/index.css`: `bg-canvas/surface/sunken/code`, `border-subtle/strong`,
  `text-primary/muted/faint`, and the accent families `accent`, `ok`, `err`, `fill`
  (each with `-tint` and `-line`). A `bg-slate-900` in a component is a bug — it will be
  invisible in one of the two themes.
- Meaning per accent: `accent` = navigation & explanation, `fill` = completion input,
  `ok` = correct, `err` = wrong. A new colour needs a new meaning.
- Flat and quiet: hairline borders, no blur, no glow, no gradients.
- Light/dark/system; `index.html` resolves the theme before first paint to avoid a flash.
- Sidebar pushes content on desktop, overlays on mobile (a modal there, with focus trap).
- No test framework is installed. `npm run build` (`tsc && vite build`) is the type gate,
  and `tools/qa/` is the correctness gate.

## Known environment quirk

The working copy lives on a **FAT32 SD card**, which has no symlinks, so `npm install`
fails there with `EPERM symlink` and `npm run dev` cannot work in place.

```bash
npm run dev:sd        # == bash tools/dev.sh
```

That keeps `node_modules` in `~/.cache/pycomprehend-dev` and symlinks the source back
here, so Vite serves and hot-reloads the files you actually edit. For a production build
or a typecheck, copy the tree to an ext4 path and run `npm install && npm run build`
there. None of this is caused by the project.
