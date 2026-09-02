import React from 'react';
import { TracingQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { isAnswerCorrect } from '../../utils/evaluator';
import { Eye, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { renderHighlightedCode, renderFormattedText } from '../../utils/syntaxHighlighter';

interface TracingReaderProps {
  question: TracingQuestion;
}

export const TracingReader: React.FC<TracingReaderProps> = ({ question }) => {
  const { userInputs, setUserInput, submittedQuestions, revealedAnswers, scores } = useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;
  const isRevealed = revealedAnswers[question.id] || false;
  const isPassed = scores[question.id]?.isPassed || false;

  const highlightedLineNumbers = question.targets.map((t) => t.line);

  return (
    <div className="space-y-6">
      {/* Code Viewer with highlighted target lines */}
      <CodeViewer code={question.codeSnippet} highlightedLines={highlightedLineNumbers} />

      {/* Tracing Table Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-indigo-400">
          <Eye className="w-5 h-5" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Variable State Tracking Table
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Enter the exact values of variables at each marked line (<span className="text-amber-400 font-bold">*</span>).
          <span className="text-slate-400 italic block mt-1">
            Note: Include quotes for string values (e.g., <code className="text-indigo-300">"High"</code> or <code className="text-indigo-300">'High'</code>). Boolean values should be <code className="text-indigo-300">True</code> or <code className="text-indigo-300">False</code>.
          </span>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-28">
                  Line #
                </th>
                {question.variablesToTrack.map((varName) => (
                  <th key={varName} className="p-3 text-center text-xs font-mono font-bold text-indigo-300">
                    <span className="px-2 py-1 rounded bg-indigo-950/60 border border-indigo-500/30">
                      {varName}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.targets.map((target) => (
                <tr key={target.line} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-xs font-semibold text-slate-300 font-mono align-top pt-5">
                    <span className="text-amber-400 font-bold mr-1">*</span>Line {target.line}
                  </td>
                  {target.vars.map((v) => {
                    const key = `${target.line}-${v}`;
                    const expectedAns = question.answers[key];
                    const userVal = userInputs[key] || '';
                    const correct = isAnswerCorrect(userVal, expectedAns);

                    let inputStyles =
                      'w-full p-2.5 rounded-xl text-center font-mono text-sm border bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 transition-all';
                    if (isSubmitted) {
                      if (correct) {
                        inputStyles =
                          'w-full p-2.5 rounded-xl text-center font-mono text-sm border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 focus:outline-none';
                      } else {
                        inputStyles =
                          'w-full p-2.5 rounded-xl text-center font-mono text-sm border border-rose-500/60 bg-rose-950/40 text-rose-300 focus:outline-none';
                      }
                    } else {
                      inputStyles += ' border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20';
                    }

                    return (
                      <td key={key} className="p-2.5 align-top">
                        <div className="relative">
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => setUserInput(key, e.target.value)}
                            disabled={isSubmitted && (correct || isRevealed)}
                            placeholder="-"
                            className={inputStyles}
                          />
                          {isSubmitted && (
                            <div className="absolute right-2.5 top-3">
                              {correct ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {isSubmitted && isRevealed && (
                          <div className="text-[11px] text-center font-mono font-medium mt-1.5 min-h-[20px] flex items-center justify-center">
                            {!correct ? (
                              <span className="text-emerald-400">
                                Expected: <span className="underline ml-0.5">{renderHighlightedCode(expectedAns)}</span>
                              </span>
                            ) : (
                              <span className="text-emerald-500/70">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Box on submission when passed or revealed */}
      {isSubmitted && (isPassed || isRevealed) && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Step-by-Step Explanation</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {renderFormattedText(question.explanation)}
          </p>
        </div>
      )}
    </div>
  );
};
