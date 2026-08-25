import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Trophy, CheckCircle2, XCircle, RefreshCw, X, Award, BarChart2 } from 'lucide-react';

export const ScoreModal: React.FC = () => {
  const { showScoreModal, toggleScoreModal, getFilteredQuestions, submittedQuestions, scores, scope } = useQuizStore();

  if (!showScoreModal) return null;

  const questions = getFilteredQuestions();
  const totalQuestions = questions.length;
  let totalSubmitted = 0;
  let totalPassed = 0;

  questions.forEach((q) => {
    if (submittedQuestions[q.id]) {
      totalSubmitted++;
      if (scores[q.id]?.isPassed) {
        totalPassed++;
      }
    }
  });

  const accuracy = totalSubmitted > 0 ? Math.round((totalPassed / totalSubmitted) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow backdrop effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Performance Report Card</h2>
              <p className="text-xs text-slate-400 capitalize">Scope: {scope} topics</p>
            </div>
          </div>

          <button
            onClick={() => toggleScoreModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 font-medium block">Completed</span>
            <span className="text-2xl font-bold font-mono text-slate-100 mt-1 block">
              {totalSubmitted} / {totalQuestions}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 font-medium block">Passed</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {totalPassed}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 font-medium block">Accuracy</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="space-y-2 relative z-10 max-h-60 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>Question Breakdown</span>
          </h3>

          {questions.map((q) => {
            const isSubmitted = submittedQuestions[q.id];
            const isPassed = scores[q.id]?.isPassed;

            return (
              <div
                key={q.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    {q.type}
                  </span>
                  <span className="text-slate-300 font-medium truncate max-w-[240px]">
                    {q.title}
                  </span>
                </div>

                <div>
                  {isSubmitted ? (
                    isPassed ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Passed</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-rose-400 font-semibold">
                        <XCircle className="w-4 h-4" />
                        <span>Failed</span>
                      </span>
                    )
                  ) : (
                    <span className="text-slate-500 italic">Not attempted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end relative z-10">
          <button
            onClick={() => toggleScoreModal(false)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            Continue Exercises
          </button>
        </div>
      </div>
    </div>
  );
};
