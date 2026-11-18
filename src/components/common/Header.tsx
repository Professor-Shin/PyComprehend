import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { ThemeToggle } from './ThemeToggle';
import { Terminal, Layers, Award, Trophy, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenInstructorModal?: () => void;
}

const SCOPES = [
  { value: 'all', label: 'All', full: 'All Topics', Icon: Layers },
  { value: 'midterm', label: 'Midterm', full: 'Midterm', Icon: Award },
  { value: 'final', label: 'Final', full: 'Final', Icon: Trophy },
] as const;

export const Header: React.FC<HeaderProps> = ({ onOpenInstructorModal }) => {
  const { scope, setScope, getTotalProgress, toggleScoreModal, toggleSidebar, isSidebarOpen } =
    useQuizStore();
  const { total, totalPassed } = getTotalProgress();
  const percentage = total > 0 ? Math.round((totalPassed / total) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-subtle px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => toggleSidebar()}
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isSidebarOpen}
          className="p-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong transition-colors"
        >
          {isSidebarOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>

        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" aria-hidden="true" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-primary leading-none">
              PyComprehend
            </h1>
            <p className="text-[11px] text-faint hidden lg:block mt-0.5">
              Python code comprehension &amp; logic tracing
            </p>
          </div>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Exam scope"
        className="flex items-center p-0.5 rounded-lg border border-subtle bg-sunken order-last sm:order-none w-full sm:w-auto"
      >
        {SCOPES.map(({ value, label, full, Icon }) => (
          <button
            key={value}
            role="radio"
            aria-checked={scope === value}
            onClick={() => setScope(value)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              scope === value ? 'bg-surface text-primary' : 'text-muted hover:text-primary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{full}</span>
            <span className="sm:hidden">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-24 h-1.5 bg-sunken border border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-ok transition-[width] duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[11px] text-muted font-mono tabular-nums whitespace-nowrap">
            {totalPassed}/{total}
          </span>
        </div>

        <ThemeToggle />

        <button
          onClick={() => onOpenInstructorModal?.()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-subtle text-xs font-medium text-muted hover:text-primary hover:border-strong transition-colors"
        >
          <img
            src="/assets/instructor-profile.png"
            alt=""
            aria-hidden="true"
            className="w-4 h-4 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="hidden sm:inline">TA.Shin</span>
        </button>

        <button
          onClick={() => toggleScoreModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>
    </header>
  );
};
