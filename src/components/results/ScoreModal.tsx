import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Modal } from '../common/Modal';
import { Trophy, CheckCircle2, XCircle, CircleDot } from 'lucide-react';

export const ScoreModal: React.FC = () => {
  const { showScoreModal, toggleScoreModal, getFilteredQuestions, submittedQuestions, scores, scope } =
    useQuizStore();

  const questions = getFilteredQuestions();
  const totalQuestions = questions.length;
  const totalSubmitted = questions.filter((q) => submittedQuestions[q.id]).length;
  const totalPassed = questions.filter((q) => scores[q.id]?.isPassed).length;
  const accuracy = totalSubmitted > 0 ? Math.round((totalPassed / totalSubmitted) * 100) : 0;

  const STATS = [
    { label: 'Completed', value: `${totalSubmitted}/${totalQuestions}`, tone: 'text-primary' },
    { label: 'Passed', value: String(totalPassed), tone: 'text-ok' },
    { label: 'Accuracy', value: `${accuracy}%`, tone: 'text-accent' },
  ];

  return (
    <Modal
      isOpen={showScoreModal}
      onClose={() => toggleScoreModal(false)}
      title="Report card"
      subtitle={`${scope === 'all' ? 'All' : scope} topics`}
      icon={<Trophy className="w-5 h-5 text-fill flex-shrink-0" aria-hidden="true" />}
      footer={
        <div className="flex justify-end">
          <button
            onClick={() => toggleScoreModal(false)}
            className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {STATS.map(({ label, value, tone }) => (
            <div key={label} className="border border-subtle rounded-xl p-3 text-center">
              <span className="text-[11px] text-faint block">{label}</span>
              <span className={`text-xl font-semibold font-mono tabular-nums mt-0.5 block ${tone}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-faint mb-2">
            Breakdown
          </h3>

          {questions.map((q) => {
            const isSubmitted = submittedQuestions[q.id];
            const score = scores[q.id];
            const isPassed = Boolean(score?.isPassed);
            const isPartial = isSubmitted && !isPassed && (score?.correct ?? 0) > 0;

            return (
              <div
                key={q.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-subtle last:border-0 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] uppercase text-faint tracking-wide w-20 flex-shrink-0">
                    {q.type}
                  </span>
                  <span className="text-muted truncate">{q.title}</span>
                </div>

                <span className="flex-shrink-0 font-mono tabular-nums">
                  {!isSubmitted ? (
                    <span className="text-faint italic font-sans">Not attempted</span>
                  ) : isPassed ? (
                    <span className="flex items-center gap-1 text-ok">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      {score?.correct}/{score?.total}
                    </span>
                  ) : isPartial ? (
                    <span className="flex items-center gap-1 text-fill">
                      <CircleDot className="w-3.5 h-3.5" aria-hidden="true" />
                      {score?.correct}/{score?.total}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-err">
                      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      0/{score?.total || 1}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
