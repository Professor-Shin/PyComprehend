import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Terminal, Award, Layers, CheckCircle2, Trophy } from 'lucide-react';

interface HeaderProps {
  onOpenInstructorModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstructorModal }) => {
  const { scope, setScope, getTotalProgress, toggleScoreModal } = useQuizStore();
  const { answered, total, totalPassed } = getTotalProgress();
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono font-bold text-xl">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              PyComprehend
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              Tutor
            </span>
          </div>
          <p className="text-xs text-slate-400">Python Code Comprehension & Logic Tracing</p>
        </div>
      </div>

      {/* Scope Selector Tabs */}
      <div className="flex items-center p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
        <button
          onClick={() => setScope('all')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            scope === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Topics</span>
        </button>
        <button
          onClick={() => setScope('midterm')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            scope === 'midterm'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Midterm Scope</span>
        </button>
        <button
          onClick={() => setScope('final')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            scope === 'final'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Final Scope</span>
        </button>
      </div>

      {/* Progress Stats & Summary Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onOpenInstructorModal?.()}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all active:scale-95 shadow-sm"
        >
          <img
            src="/assets/instructor-profile.png"
            alt="TA Shin"
            className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span>TA.Shin (Credit)</span>
        </button>

        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passed {totalPassed} of {total} Exercises</span>
          </div>
          <div className="w-36 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => toggleScoreModal(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 transition-all active:scale-95"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Report Card</span>
        </button>
      </div>
    </header>
  );
};
