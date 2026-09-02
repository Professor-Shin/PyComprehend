import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Terminal, Award, Layers, CheckCircle2, Trophy, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenInstructorModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstructorModal }) => {
  const { scope, setScope, getTotalProgress, toggleScoreModal, toggleSidebar, isSidebarOpen } = useQuizStore();
  const { answered, total, totalPassed } = getTotalProgress();
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
      {/* Burger Button & Brand Logo */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Side Burger Nav Toggle Button */}
        <button
          onClick={() => toggleSidebar()}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`p-2 sm:p-2.5 rounded-xl border text-slate-300 hover:text-white transition-all active:scale-95 flex items-center justify-center group ${
            isSidebarOpen
              ? 'bg-indigo-600/25 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-950/30'
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600 shadow-sm'
          }`}
          title="Topics & Question Navigation"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-indigo-300" />
          ) : (
            <Menu className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          )}
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono font-bold text-lg sm:text-xl flex-shrink-0">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              PyComprehend
            </h1>
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              Tutor
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden lg:block">Python Code Comprehension & Logic Tracing</p>
        </div>
      </div>

      {/* Scope Selector Tabs */}
      <div className="flex items-center p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
        <button
          onClick={() => setScope('all')}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            scope === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">All Topics</span>
          <span className="sm:hidden">All</span>
        </button>
        <button
          onClick={() => setScope('midterm')}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            scope === 'midterm'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Midterm Scope</span>
          <span className="sm:hidden">Midterm</span>
        </button>
        <button
          onClick={() => setScope('final')}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            scope === 'final'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Final Scope</span>
          <span className="sm:hidden">Final</span>
        </button>
      </div>

      {/* Progress Stats & Summary Button */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => onOpenInstructorModal?.()}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all active:scale-95 shadow-sm"
        >
          <img
            src="/assets/instructor-profile.png"
            alt="TA Shin"
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-amber-400/50"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="hidden sm:inline">TA.Shin (Credit)</span>
          <span className="sm:hidden">TA Shin</span>
        </button>

        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passed {totalPassed} of {total} Exercises</span>
          </div>
          <div className="w-32 sm:w-36 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => toggleScoreModal(true)}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 transition-all active:scale-95"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Report Card</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>
    </header>
  );
};
