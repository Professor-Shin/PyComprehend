/**
 * Behaviour-based grading.
 *
 * The exact-string grader in evaluator.ts marks `range(2, 11, 2)` wrong against
 * `range(2,11,2)` — and three questions' own placeholders suggest the spaced
 * form. A student who hits that does not conclude the grader is picky; they
 * conclude they do not understand Python. This module grades what the answer
 * *does* instead of how it is spelled.
 *
 * It is strictly additive. If Pyodide is unavailable, still downloading, or the
 * question cannot be graded safely, every path falls back to the exact matcher,
 * so grading never depends on the network.
 */
import { Question, CompletionQuestion, TracingQuestion } from '../data/types';
import { isAnswerCorrect } from './evaluator';
import { runPython, stripLineNumbers, getStatus } from './pythonRuntime';

export type GradeMethod = 'semantic' | 'exact';

export interface Verdict {
  correct: boolean;
  method: GradeMethod;
  /** Set when semantic grading accepted a spelling the exact matcher rejects. */
  acceptedVariant?: boolean;
}

const exact = (user: string | undefined, expected: string | number): Verdict => ({
  correct: isAnswerCorrect(user, expected),
  method: 'exact',
});

/* ------------------------------------------------------------------ tracing */

/**
 * Tracing answers are *values*, not expressions, so they are compared by
 * evaluating both sides as Python literals. That makes `[[0,1],[1,2]]` equal to
 * `[[0, 1], [1, 2]]` while keeping `"2020"` distinct from `2020` — the str/int
 * distinction is the lesson in several of these questions, not an accident.
 */
export function tracingProgram(pairs: Array<[string, string, string]>): string {
  return `
import json
_pairs = ${JSON.stringify(pairs)}
_out = {}
for _key, _expected, _user in _pairs:
    try:
        _e = eval(_expected, {})
    except Exception:
        _out[_key] = None      # un-gradable expectation -> caller falls back
        continue
    try:
        _u = eval(_user, {})
    except Exception:
        _out[_key] = False
        continue
    _out[_key] = (type(_u) is type(_e)) and (repr(_u) == repr(_e))
print(json.dumps(_out))
`;
}

async function gradeTracing(
  q: TracingQuestion,
  inputs: Record<string, string>,
): Promise<Record<string, Verdict>> {
  const keys = Object.keys(q.answers);
  const pairs = keys.map(
    (k) => [k, String(q.answers[k]), (inputs[k] ?? '').trim()] as [string, string, string],
  );

  const { stdout, error } = await runPython(tracingProgram(pairs));
  if (error) return fallback(q, inputs);

  let parsed: Record<string, boolean | null>;
  try {
    parsed = JSON.parse(stdout.trim().split('\n').pop() || '{}');
  } catch {
    return fallback(q, inputs);
  }

  const verdicts: Record<string, Verdict> = {};
  for (const k of keys) {
    const semantic = parsed[k];
    if (semantic === null || semantic === undefined) {
      verdicts[k] = exact(inputs[k], q.answers[k]);
    } else {
      const strict = isAnswerCorrect(inputs[k], q.answers[k]);
      verdicts[k] = {
        correct: semantic,
        method: 'semantic',
        acceptedVariant: semantic && !strict,
      };
    }
  }
  return verdicts;
}

/* --------------------------------------------------------------- completion */

/**
 * Completion answers are *expressions*. Each blank is graded by substituting the
 * student's text for that blank, the reference answers for every other blank,
 * then comparing the program's observable behaviour against the all-reference
 * run: stdout, plus every variable the reference run bound.
 *
 * Variables are compared because most completion snippets in this bank never
 * print — stdout alone could not tell a right answer from a wrong one.
 *
 * `verify.probes` matters for snippets with free variables. With a single
 * `score = 85`, `>=` and `>` behave identically and a wrong answer would pass;
 * several probe values make the comparison discriminating. A question with no
 * probes is self-contained and one run is enough.
 */
export function completionProgram(
  reference: string,
  candidates: Record<string, string>,
  probes: string[],
  stdin: string[],
  postlude = '',
): string {
  return `
import json, io, contextlib, re as _re

def _pyc_norm(v):
    try:
        r = repr(v)
    except Exception:
        return '<unreprable>'
    # Default object reprs embed a memory address that differs on every run, so
    # comparing them would mark every answer wrong. Drop the address, keep type.
    return _re.sub(r' at 0x[0-9a-fA-F]+', '', r)

_probes = ${JSON.stringify(probes.length ? probes : [''])}
_stdin = ${JSON.stringify(stdin)}
_postlude = ${JSON.stringify(postlude)}

def _mk_input(values):
    _it = iter(list(values))
    def _input(prompt=''):
        print(prompt, end='')
        try:
            return next(_it)
        except StopIteration:
            return ''
    return _input

def _observe(src, prelude):
    ns = {'input': _mk_input(_stdin)}
    buf = io.StringIO()
    err = None
    try:
        with contextlib.redirect_stdout(buf):
            if prelude:
                exec(compile(prelude, '<probe>', 'exec'), ns)
            exec(compile(src, '<snippet>', 'exec'), ns)
            if _postlude:
                exec(compile(_postlude, '<postlude>', 'exec'), ns)
    except BaseException as e:
        err = '%s: %s' % (type(e).__name__, e)
    vars = {}
    for k, v in list(ns.items()):
        if k.startswith('_') or callable(v) or type(v).__name__ == 'module':
            continue
        vars[k] = _pyc_norm(v)
    return {'out': buf.getvalue(), 'err': err, 'vars': vars}

def _same(ref, got):
    if ref['err'] is not None or got['err'] is not None:
        return False
    if ref['out'] != got['out']:
        return False
    # Every binding the reference produced must match. Extra bindings in the
    # student's run are tolerated: a different helper name is not an error.
    for k, val in ref['vars'].items():
        if got['vars'].get(k) != val:
            return False
    return True

_reference = ${JSON.stringify(reference)}
_candidates = ${JSON.stringify(candidates)}

_result = {'referenceOk': True, 'blanks': {}}
_refs = []
for _p in _probes:
    _r = _observe(_reference, _p)
    if _r['err'] is not None:
        _result['referenceOk'] = False
        _result['referenceError'] = _r['err']
        break
    _refs.append(_r)

# A reference run with no stdout and no bindings cannot distinguish anything --
# every candidate would compare equal and the grader would accept wrong answers.
# Refusing here sends the question back to the stricter exact matcher.
if _result['referenceOk'] and not any(r['out'] or r['vars'] for r in _refs):
    _result['referenceOk'] = False
    _result['referenceError'] = 'snippet produces nothing observable; add verify.postlude'

if _result['referenceOk']:
    for _bid, _src in _candidates.items():
        _ok = True
        for _i, _p in enumerate(_probes):
            if not _same(_refs[_i], _observe(_src, _p)):
                _ok = False
                break
        _result['blanks'][_bid] = _ok

print(json.dumps(_result))
`;
}

async function gradeCompletion(
  q: CompletionQuestion,
  inputs: Record<string, string>,
): Promise<Record<string, Verdict>> {
  const substitute = (values: Record<string, string>) => {
    let src = stripLineNumbers(q.codeSnippet);
    for (const [id, val] of Object.entries(values)) {
      src = src.split(`___${id}___`).join(val);
    }
    return src;
  };

  const ids = Object.keys(q.answers);
  const refValues = Object.fromEntries(ids.map((id) => [id, String(q.answers[id])]));
  const reference = substitute(refValues);

  // One candidate program per blank: that blank from the student, the rest from
  // the reference, so a single wrong blank cannot fail the others.
  const candidates: Record<string, string> = {};
  for (const id of ids) {
    const typed = (inputs[id] ?? '').trim();
    if (!typed) continue;
    candidates[id] = substitute({ ...refValues, [id]: typed });
  }
  if (!Object.keys(candidates).length) return fallback(q, inputs);

  const probes = q.verify?.probes ?? (q.verify?.prelude ? [q.verify.prelude] : ['']);
  const { stdout, error } = await runPython(
    completionProgram(
      reference, candidates, probes, q.verify?.stdin ?? [], q.verify?.postlude ?? '',
    ),
  );
  if (error) return fallback(q, inputs);

  let parsed: { referenceOk: boolean; blanks: Record<string, boolean> };
  try {
    parsed = JSON.parse(stdout.trim().split('\n').pop() || '{}');
  } catch {
    return fallback(q, inputs);
  }

  // If the reference answers themselves do not run, the comparison is
  // meaningless — two identical errors would read as agreement.
  if (!parsed.referenceOk) return fallback(q, inputs);

  const verdicts: Record<string, Verdict> = {};
  for (const id of ids) {
    const semantic = parsed.blanks[id];
    if (semantic === undefined) {
      verdicts[id] = exact(inputs[id], q.answers[id]);
    } else {
      const strict = isAnswerCorrect(inputs[id], q.answers[id]);
      verdicts[id] = {
        correct: semantic,
        method: 'semantic',
        acceptedVariant: semantic && !strict,
      };
    }
  }
  return verdicts;
}

/* ----------------------------------------------------------------- dispatch */

function fallback(
  q: CompletionQuestion | TracingQuestion,
  inputs: Record<string, string>,
): Record<string, Verdict> {
  const verdicts: Record<string, Verdict> = {};
  for (const [k, expected] of Object.entries(q.answers)) {
    verdicts[k] = exact(inputs[k], expected);
  }
  return verdicts;
}

/**
 * Grades every answer key of a question. Never throws and never blocks on the
 * network: any failure degrades to the exact matcher.
 */
export async function gradeQuestion(
  q: Question,
  inputs: Record<string, string>,
): Promise<Record<string, Verdict>> {
  if (q.type === 'mcq') {
    return { mcq: { correct: inputs['mcq'] === q.correctOptionId, method: 'exact' } };
  }

  // Do not stall submission behind a cold ~10MB download; grade now, exactly.
  if (getStatus() !== 'ready') return fallback(q, inputs);

  try {
    return q.type === 'tracing'
      ? await gradeTracing(q, inputs)
      : await gradeCompletion(q, inputs);
  } catch {
    return fallback(q, inputs);
  }
}
