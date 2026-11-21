import React from 'react';
import { TracingQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { ExplanationPanel } from './ExplanationPanel';
import { CheckCircle2, XCircle } from 'lucide-react';
import { renderHighlightedCode } from '../../utils/syntaxHighlighter';

export const TracingReader: React.FC<{ question: TracingQuestion }> = ({ question }) => {
  const { getInput, setUserInput, submittedQuestions, revealedAnswers, scores, getVerdict } =
    useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;
  const isRevealed = revealedAnswers[question.id] || false;
  const isPassed = scores[question.id]?.isPassed || false;

  return (
    <div className="space-y-5">
      <CodeViewer
        code={question.codeSnippet}
        highlightedLines={question.targets.map((t) => t.line)}
        stdin={question.verify?.stdin}
        prelude={question.verify?.prelude}
      />

      <section className="rounded-2xl border border-subtle bg-surface p-5 md:p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary">Variable state at each marked line</h3>
          <p className="text-xs text-muted">
            Write values as Python would show them: quote strings (<code className="font-mono text-accent">'High'</code>),
            capitalise booleans (<code className="font-mono text-accent">True</code>). Spacing inside
            lists and dicts does not matter.
          </p>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-left border-collapse min-w-[460px]">
            <thead>
              <tr className="border-b border-subtle">
                <th scope="col" className="py-2 pr-3 text-xs font-medium text-faint uppercase tracking-wider w-24">
                  Line
                </th>
                {question.variablesToTrack.map((varName) => (
                  <th
                    key={varName}
                    scope="col"
                    className="py-2 px-2 text-center text-xs font-mono font-semibold text-accent"
                  >
                    {varName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.targets.map((target) => (
                <tr key={target.line} className="border-b border-subtle last:border-0">
                  <th
                    scope="row"
                    className="py-3 pr-3 text-xs font-mono font-medium text-muted align-top text-left"
                  >
                    <span className="text-fill mr-1" aria-hidden="true">*</span>
                    {target.line}
                  </th>
                  {question.variablesToTrack.map((v) => {
                    const key = `${target.line}-${v}`;
                    if (!target.vars.includes(v)) {
                      return (
                        <td key={key} className="py-3 px-2 text-center text-faint text-xs align-top">
                          —
                        </td>
                      );
                    }
                    const expectedAns = question.answers[key];
                    const userVal = getInput(key);
                    const verdict = getVerdict(question.id, key);
                    const correct = verdict?.correct ?? false;
                    const inputId = `trace-${question.id}-${key}`;

                    const state = !isSubmitted ? 'pending' : correct ? 'ok' : 'err';
                    const fieldStyles = {
                      pending: 'border-strong bg-sunken text-primary focus:border-accent',
                      ok: 'border-ok-line bg-ok-tint text-ok',
                      err: 'border-err-line bg-err-tint text-err',
                    }[state];

                    return (
                      <td key={key} className="py-3 px-2 align-top">
                        <label htmlFor={inputId} className="sr-only">
                          Value of {v} at line {target.line}
                        </label>
                        <div className="relative">
                          <input
                            id={inputId}
                            type="text"
                            value={userVal}
                            onChange={(e) => setUserInput(key, e.target.value)}
                            disabled={isSubmitted && (correct || isRevealed)}
                            placeholder="—"
                            aria-invalid={isSubmitted ? !correct : undefined}
                            className={`w-full py-2 pl-2.5 pr-8 rounded-lg text-center font-mono text-sm border outline-none transition-colors disabled:opacity-90 ${fieldStyles}`}
                          />
                          {isSubmitted && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2">
                              {correct ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-ok" aria-label="Correct" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-err" aria-label="Incorrect" />
                              )}
                            </span>
                          )}
                        </div>
                        {isSubmitted && isRevealed && !correct && (
                          <p className="text-[11px] text-center font-mono text-ok mt-1.5">
                            {renderHighlightedCode(expectedAns)}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isSubmitted && (isPassed || isRevealed) && (
        <ExplanationPanel text={question.explanation} title="Step-by-step" />
      )}
    </div>
  );
};
