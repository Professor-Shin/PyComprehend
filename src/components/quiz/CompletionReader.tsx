import React, { useState } from 'react';
import { CompletionQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { ExplanationPanel } from './ExplanationPanel';
import { CheckCircle2, XCircle, Sparkles, Lightbulb } from 'lucide-react';
import { renderHighlightedCode } from '../../utils/syntaxHighlighter';

export const CompletionReader: React.FC<{ question: CompletionQuestion }> = ({ question }) => {
  const { getInput, setUserInput, submittedQuestions, revealedAnswers, scores, getVerdict } =
    useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;
  const isRevealed = revealedAnswers[question.id] || false;
  const isPassed = scores[question.id]?.isPassed || false;

  // Hints are opt-in, per blank, and reset when the question changes.
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({});
  const questionRef = React.useRef(question.id);
  if (questionRef.current !== question.id) {
    questionRef.current = question.id;
    if (Object.keys(shownHints).length) setShownHints({});
  }

  return (
    <div className="space-y-5">
      <CodeViewer code={question.codeSnippet} stdin={question.verify?.stdin} />

      <section className="rounded-2xl border border-subtle bg-surface p-5 md:p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary">Fill in the missing code</h3>
          <p className="text-xs text-muted">
            Spacing does not matter — your answer is checked by running it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.blanks.map((blank) => {
            const key = blank.id;
            const expectedAns = question.answers[key];
            const userVal = getInput(key);
            const verdict = getVerdict(question.id, key);
            const correct = verdict?.correct ?? false;
            const inputId = `blank-${question.id}-${key}`;

            const state = !isSubmitted ? 'pending' : correct ? 'ok' : 'err';
            const fieldStyles = {
              pending: 'border-strong bg-sunken text-primary focus:border-accent',
              ok: 'border-ok-line bg-ok-tint text-ok',
              err: 'border-err-line bg-err-tint text-err',
            }[state];

            return (
              <div key={key} className="space-y-2">
                <label
                  htmlFor={inputId}
                  className="text-xs font-medium text-muted flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded bg-fill-tint text-fill border border-fill-line flex items-center justify-center font-mono text-[10px] font-semibold">
                    {blank.id}
                  </span>
                  {blank.label}
                </label>

                <div className="relative">
                  <input
                    id={inputId}
                    type="text"
                    value={userVal}
                    onChange={(e) => setUserInput(key, e.target.value)}
                    disabled={isSubmitted && (correct || isRevealed)}
                    placeholder="Type your answer…"
                    aria-invalid={isSubmitted ? !correct : undefined}
                    aria-describedby={blank.hint ? `${inputId}-hint` : undefined}
                    className={`w-full py-2.5 pl-3 pr-10 rounded-xl font-mono text-sm border outline-none transition-colors disabled:opacity-90 ${fieldStyles}`}
                  />
                  {isSubmitted && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {correct ? (
                        <CheckCircle2 className="w-4 h-4 text-ok" aria-label="Correct" />
                      ) : (
                        <XCircle className="w-4 h-4 text-err" aria-label="Incorrect" />
                      )}
                    </span>
                  )}
                </div>

                {blank.hint && !isSubmitted && (
                  shownHints[key] ? (
                    <p
                      id={`${inputId}-hint`}
                      className="text-[11px] text-muted flex items-start gap-1.5"
                    >
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-fill" aria-hidden="true" />
                      {blank.hint}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShownHints((h) => ({ ...h, [key]: true }))}
                      className="text-[11px] text-faint hover:text-muted flex items-center gap-1.5 transition-colors"
                    >
                      <Lightbulb className="w-3 h-3" aria-hidden="true" />
                      Show hint
                    </button>
                  )
                )}

                {/* Tell the student when their spelling differed but still ran correctly —
                    otherwise a pass that does not match the model answer looks like a bug. */}
                {isSubmitted && verdict?.acceptedVariant && (
                  <p className="text-[11px] text-ok flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    Different wording from the model answer, but it produces the same result.
                  </p>
                )}

                {isSubmitted && isRevealed && !correct && (
                  <p className="text-[11px] font-mono text-ok">
                    Expected: {renderHighlightedCode(expectedAns)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {isSubmitted && (isPassed || isRevealed) && (
        <ExplanationPanel text={question.explanation} />
      )}
    </div>
  );
};
