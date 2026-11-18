#!/usr/bin/env python3
"""
run_snippet.py -- execute a question's code snippet in real CPython and emit
structured observations as JSON.

This tool deliberately does NOT judge. It reports what Python actually does:
stdout, exceptions, and -- for tracing questions -- the value of each tracked
variable at every visit to every target line, both before and after the line
runs. Deciding whether the stored answer matches is the verifier agent's job;
guessing what Python does is nobody's job.

Usage:
  run_snippet.py --bank bank.json --id loop_02
  run_snippet.py --bank bank.json --all
  run_snippet.py --bank bank.json --id loop_01 --fill 1='range(2,11,2)'
Options:
  --stdin TEXT   value(s) fed to input(), repeatable, in order
"""
import argparse, io, json, re, sys, contextlib

LINE_PREFIX = re.compile(r'^(\s*)\*?\s*(\d+):\s?')


def strip_line_numbers(snippet):
    """`1: x = 0` / `*4:     total += 1` -> runnable source + displayed->real line map."""
    out, mapping = [], {}
    for real_idx, raw in enumerate(snippet.split('\n'), start=1):
        m = LINE_PREFIX.match(raw)
        if m:
            mapping[int(m.group(2))] = real_idx
            out.append(raw[m.end():])
        else:
            mapping.setdefault(real_idx, real_idx)
            out.append(raw)
    return '\n'.join(out), mapping


def py_repr(v):
    try:
        # Default object reprs embed a memory address that changes every run.
        return re.sub(r' at 0x[0-9a-fA-F]+', '', repr(v))
    except Exception:
        return '<unreprable>'


def execute(source, target_real_lines, track, stdin_values, prelude='', assert_expr=None, postlude=''):
    """Run `source`, snapshotting `track` vars at each visit to the target lines."""
    visits = []
    pending = {}            # real_line -> snapshot taken on entry to that line
    out = io.StringIO()
    feed = iter(stdin_values)

    def fake_input(prompt=''):
        out.write(str(prompt))
        try:
            v = next(feed)
        except StopIteration:
            raise RuntimeError('snippet called input() more times than --stdin values supplied')
        out.write(v + '\n')
        return v

    def snapshot(frame):
        scope = {**frame.f_globals, **frame.f_locals}
        return {v: (py_repr(scope[v]) if v in scope else None) for v in track}

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<snippet>':
            return tracer
        if event == 'line':
            ln = frame.f_lineno
            # a new line event closes out the previous one: record its "after" state
            for prev_ln, rec in list(pending.items()):
                rec['after'] = snapshot(frame)
                visits.append(rec)
                del pending[prev_ln]
            if ln in target_real_lines:
                pending[ln] = {'line': ln, 'before': snapshot(frame), 'after': None}
        elif event == 'return':
            for prev_ln, rec in list(pending.items()):
                rec['after'] = snapshot(frame)
                visits.append(rec)
                del pending[prev_ln]
        return tracer

    code = compile(source, '<snippet>', 'exec')
    g = {'__name__': '__main__', 'input': fake_input}
    error = None
    assert_result = None
    try:
        if prelude:
            exec(compile(prelude, '<prelude>', 'exec'), g)
    except Exception as e:  # noqa: BLE001
        return out.getvalue(), f'prelude failed: {type(e).__name__}: {e}', visits, None
    try:
        with contextlib.redirect_stdout(out):
            if target_real_lines:
                sys.settrace(tracer)
            try:
                exec(code, g)
                if postlude:
                    exec(compile(postlude, '<postlude>', 'exec'), g)
            finally:
                sys.settrace(None)
    except Exception as e:  # noqa: BLE001 - reporting, not handling
        error = f'{type(e).__name__}: {e}'
    for rec in pending.values():
        visits.append(rec)
    if assert_expr is not None and error is None:
        try:
            assert_result = bool(eval(assert_expr, g))  # noqa: S307 - QA harness, author-supplied
        except Exception as e:  # noqa: BLE001
            assert_result = f'assert failed to evaluate: {type(e).__name__}: {e}'
    return out.getvalue(), error, visits, assert_result


def observe(q, fills, stdin_values):
    spec = q.get('verify') or {}
    if not stdin_values:
        stdin_values = spec.get('stdin') or []
    snippet = q['codeSnippet']
    for bid, val in fills.items():
        snippet = snippet.replace(f'___{bid}___', val)

    unfilled = re.findall(r'___\w+___', snippet)
    source, mapping = strip_line_numbers(snippet)

    track = q.get('variablesToTrack') or []
    targets = {}
    for t in q.get('targets', []):
        real = mapping.get(t['line'], t['line'])
        targets[real] = t
    real_lines = set(targets)

    result = {
        'id': q['id'], 'type': q['type'], 'title': q['title'],
        'runnable': not unfilled,
        'unfilledBlanks': unfilled,
        'storedAnswers': q.get('answers') or (
            {'correctOptionId': q['correctOptionId']} if q['type'] == 'mcq' else {}),
    }
    if unfilled:
        result['note'] = ('snippet still contains blanks; pass --fill id=value '
                          '(e.g. the stored answer) to execute it')
        return result

    stdout, error, visits, assert_result = execute(
        source, real_lines, track, stdin_values,
        prelude=spec.get('prelude') or (spec.get('probes') or [''])[0],
        assert_expr=spec.get('assert'),
        postlude=spec.get('postlude', ''))
    result['stdout'] = stdout
    result['error'] = error
    if spec:
        result['verifySpec'] = spec
    if 'expectedStdout' in spec:
        result['stdoutMatchesExpected'] = (stdout == spec['expectedStdout'])
        if not result['stdoutMatchesExpected']:
            result['expectedStdout'] = spec['expectedStdout']
    if assert_result is not None:
        result['assertResult'] = assert_result

    if q['type'] == 'tracing':
        display_of = {v: k for k, v in mapping.items()}
        obs = []
        for v in visits:
            obs.append({
                'displayLine': display_of.get(v['line'], v['line']),
                'visit': sum(1 for o in obs if o['displayLine'] == display_of.get(v['line'], v['line'])) + 1,
                'before': v['before'], 'after': v['after'],
            })
        result['observations'] = obs
        # ambiguity signal: multiple visits means "the value at line N" is underspecified
        multi = sorted({o['displayLine'] for o in obs if sum(1 for x in obs if x['displayLine'] == o['displayLine']) > 1})
        if multi:
            result['ambiguousLines'] = multi
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bank', required=True)
    ap.add_argument('--id')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--fill', action='append', default=[], metavar='ID=VALUE')
    ap.add_argument('--stdin', action='append', default=[], metavar='TEXT')
    ap.add_argument('--use-stored-answers', action='store_true',
                    help='for completion questions, fill blanks with the stored answers')
    a = ap.parse_args()

    bank = json.load(open(a.bank))
    questions = [q for t in bank['topics'] for q in t['questions']]
    if a.id:
        questions = [q for q in questions if q['id'] == a.id]
        if not questions:
            sys.exit(f'no question with id {a.id}')
    elif not a.all:
        sys.exit('pass --id ID or --all')

    fills = dict(kv.split('=', 1) for kv in a.fill)
    results = []
    for q in questions:
        f = dict(fills)
        if a.use_stored_answers and q['type'] == 'completion':
            for k, v in (q.get('answers') or {}).items():
                f.setdefault(k, v)
        try:
            results.append(observe(q, f, a.stdin))
        except Exception as e:  # noqa: BLE001
            results.append({'id': q['id'], 'toolError': f'{type(e).__name__}: {e}'})
    print(json.dumps(results if len(results) > 1 else results[0], indent=2))


if __name__ == '__main__':
    main()
