import React from 'react';
import { MCQQuestion } from '../../data/types';
import { useQuizStore } from '../../store/quizStore';
import { CodeViewer } from './CodeViewer';
import { ExplanationPanel } from './ExplanationPanel';
import { CheckCircle2, XCircle } from 'lucide-react';
import { renderHighlightedCode } from '../../utils/syntaxHighlighter';

export const MCQReader: React.FC<{ question: MCQQuestion }> = ({ question }) => {
  const { getInput, setUserInput, submittedQuestions, revealedAnswers, scores } = useQuizStore();
  const isSubmitted = submittedQuestions[question.id] || false;
  const isRevealed = revealedAnswers[question.id] || false;
  const isPassed = scores[question.id]?.isPassed || false;
  const selectedOptionId = getInput('mcq');

  return (
    <div className="space-y-5">
      <CodeViewer code={question.codeSnippet} stdin={question.verify?.stdin} />

      <fieldset className="rounded-2xl border border-subtle bg-surface p-5 md:p-6 space-y-3">
        <legend className="sr-only">Answer options</legend>
        <h3 className="text-sm font-semibold text-primary">Select the correct option</h3>

        <div className="space-y-2 pt-1">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption = question.correctOptionId === opt.id;
            const showCorrect = isCorrectOption && isSubmitted && (isPassed || isRevealed);
            const showWrong = isSubmitted && isSelected && !isCorrectOption;
            const locked = isSubmitted && (isPassed || isRevealed);

            let rowStyles =
              'flex items-center gap-3 p-3.5 rounded-xl border transition-colors ';
            if (showCorrect) rowStyles += 'border-ok-line bg-ok-tint text-ok';
            else if (showWrong) rowStyles += 'border-err-line bg-err-tint text-err';
            else if (isSubmitted) rowStyles += 'border-subtle text-faint';
            else if (isSelected) rowStyles += 'border-accent bg-accent-tint text-primary cursor-pointer';
            else rowStyles += 'border-subtle text-muted hover:border-strong cursor-pointer';

            let badgeStyles = 'w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0 border ';
            if (showCorrect) badgeStyles += 'border-ok-line bg-ok text-canvas';
            else if (showWrong) badgeStyles += 'border-err-line bg-err text-canvas';
            else if (isSelected && !isSubmitted) badgeStyles += 'border-accent bg-accent text-white';
            else badgeStyles += 'border-subtle text-faint';

            return (
              <label key={opt.id} className={rowStyles}>
                <input
                  type="radio"
                  name={`mcq-${question.id}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setUserInput('mcq', opt.id)}
                  disabled={locked}
                  className="sr-only peer"
                />
                <span className={badgeStyles} aria-hidden="true">{opt.id}</span>
                <span className={`flex-1 text-sm ${opt.isCodeFont ? 'font-mono' : 'font-sans'}`}>
                  {opt.isCodeFont ? renderHighlightedCode(opt.text) : opt.text}
                </span>
                {showCorrect && <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0" aria-label="Correct answer" />}
                {showWrong && <XCircle className="w-4 h-4 text-err flex-shrink-0" aria-label="Your answer, incorrect" />}
              </label>
            );
          })}
        </div>
      </fieldset>

      {isSubmitted && (isPassed || isRevealed) && (
        <ExplanationPanel text={question.explanation} title="Detailed explanation" />
      )}
    </div>
  );
};
