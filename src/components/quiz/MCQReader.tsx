import React from 'react';
import { MCQQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { HelpCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface MCQReaderProps {
  question: MCQQuestion;
}

export const MCQReader: React.FC<MCQReaderProps> = ({ question }) => {
  const { userInputs, setUserInput, submittedQuestions } = useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;
  const selectedOptionId = userInputs['mcq'] || '';

  return (
    <div className="space-y-6">
      {/* Code Snippet for MCQ context */}
      <CodeViewer code={question.codeSnippet} />

      {/* MCQ Options Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-indigo-400">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Select the Correct Option
          </h3>
        </div>

        <div className="space-y-3 pt-1">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption = question.correctOptionId === opt.id;

            let cardStyles =
              'flex items-center p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ';

            if (isSubmitted) {
              if (isCorrectOption) {
                cardStyles +=
                  'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-md shadow-emerald-950/20';
              } else if (isSelected && !isCorrectOption) {
                cardStyles +=
                  'bg-rose-950/40 border-rose-500/80 text-rose-200 shadow-md shadow-rose-950/20';
              } else {
                cardStyles += 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-50 cursor-not-allowed';
              }
            } else {
              cardStyles += isSelected
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700';
            }

            return (
              <label key={opt.id} className={cardStyles}>
                <input
                  type="radio"
                  name={`mcq-${question.id}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setUserInput('mcq', opt.id)}
                  disabled={isSubmitted}
                  className="hidden"
                />

                {/* Option Badge A, B, C, D */}
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm font-mono mr-4 flex-shrink-0 transition-colors ${
                    isSubmitted
                      ? isCorrectOption
                        ? 'bg-emerald-500 text-slate-950'
                        : isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                      : isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {opt.id}
                </span>

                <span className={`flex-1 text-sm ${opt.isCodeFont ? 'font-mono' : 'font-sans'}`}>
                  {opt.text}
                </span>

                {/* Feedback Icons */}
                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-3 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-400 ml-3 flex-shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Explanation Box on submission */}
      {isSubmitted && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Detailed Explanation</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
