import React from 'react';
import { CompletionQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { isAnswerCorrect } from '../../utils/evaluator';
import { Edit3, CheckCircle2, XCircle, Lightbulb, HelpCircle } from 'lucide-react';

interface CompletionReaderProps {
  question: CompletionQuestion;
}

export const CompletionReader: React.FC<CompletionReaderProps> = ({ question }) => {
  const { userInputs, setUserInput, submittedQuestions } = useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;

  return (
    <div className="space-y-6">
      {/* Code snippet with blank placeholders */}
      <CodeViewer code={question.codeSnippet} />

      {/* Fill-in Blanks Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-amber-400">
          <Edit3 className="w-5 h-5" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Fill in the Missing Code
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Complete the code by providing the missing expressions, operators, or syntax for each blank.
        </p>

        <div className="grid grid-cols-1 gap-4 pt-2">
          {question.blanks.map((blank) => {
            const key = blank.id;
            const expectedAns = question.answers[key];
            const userVal = userInputs[key] || '';
            const correct = isAnswerCorrect(userVal, expectedAns);

            let inputStyles =
              'w-full p-3 rounded-xl font-mono text-sm border bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 transition-all';
            if (isSubmitted) {
              if (correct) {
                inputStyles =
                  'w-full p-3 rounded-xl font-mono text-sm border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 focus:outline-none';
              } else {
                inputStyles =
                  'w-full p-3 rounded-xl font-mono text-sm border border-rose-500/60 bg-rose-950/40 text-rose-300 focus:outline-none';
              }
            } else {
              inputStyles += ' border-slate-700/80 focus:border-amber-500 focus:ring-amber-500/20';
            }

            return (
              <div key={key} className="space-y-1.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold">
                      [{blank.id}]
                    </span>
                    <span>{blank.label}</span>
                  </label>

                  {blank.hint && !isSubmitted && (
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{blank.hint}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={userVal}
                    onChange={(e) => setUserInput(key, e.target.value)}
                    disabled={isSubmitted && correct}
                    placeholder={blank.placeholder || 'Enter expression...'}
                    className={inputStyles}
                  />
                  {isSubmitted && (
                    <div className="absolute right-3 top-3.5">
                      {correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  )}
                </div>

                {isSubmitted && !correct && (
                  <div className="text-xs text-emerald-400 font-mono font-medium pt-1">
                    Expected Answer: <span className="underline">{expectedAns}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Box on submission */}
      {isSubmitted && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Explanation</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};