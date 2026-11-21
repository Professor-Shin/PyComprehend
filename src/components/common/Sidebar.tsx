import React, { useEffect, useRef } from 'react';
import { useQuizStore } from '../../store/quizStore';
import {
  Variable,
  GitFork,
  Repeat,
  Box,
  ListFilter,
  Database,
  Workflow,
  CheckCircle2,
  XCircle,
  CircleDot,
  HelpCircle,
  LucideIcon,
  X,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Variable,
  GitFork,
  Repeat,
  Box,
  ListFilter,
  Database,
  Workflow,
};

type Status = 'passed' | 'partial' | 'failed' | 'untouched';

/** Status is carried by an icon as well as colour — colour alone excludes
 *  colour-blind students, and this list is the main progress signal. */
const STATUS_STYLES: Record<Status, { row: string; icon: LucideIcon; iconClass: string }> = {
  passed: { row: 'border-ok-line bg-ok-tint text-ok', icon: CheckCircle2, iconClass: 'text-ok' },
  partial: { row: 'border-fill-line bg-fill-tint text-fill', icon: CircleDot, iconClass: 'text-fill' },
  failed: { row: 'border-err-line bg-err-tint text-err', icon: XCircle, iconClass: 'text-err' },
  untouched: { row: 'border-transparent text-muted hover:bg-sunken', icon: CircleDot, iconClass: 'text-faint' },
};

export const Sidebar: React.FC = () => {
  const {
    getFilteredTopics,
    activeTopicId,
    activeQuestionId,
    selectTopic,
    selectQuestion,
    submittedQuestions,
    scores,
    isSidebarOpen,
    toggleSidebar,
    scope,
  } = useQuizStore();

  const topics = getFilteredTopics();
  const panelRef = useRef<HTMLElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) toggleSidebar(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSidebarOpen, toggleSidebar]);

  // On mobile the sidebar is a modal drawer, so focus has to move into it and
  // return to whatever opened it. On desktop it just pushes content and must
  // not steal focus.
  useEffect(() => {
    if (!isMobile()) return;
    if (isSidebarOpen) {
      restoreFocusTo.current = document.activeElement as HTMLElement;
      panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    } else {
      restoreFocusTo.current?.focus();
      restoreFocusTo.current = null;
    }
  }, [isSidebarOpen]);

  const handleQuestionSelect = (questionId: string) => {
    selectQuestion(questionId);
    if (isMobile()) toggleSidebar(false);
  };

  const statusOf = (qId: string): Status => {
    if (!submittedQuestions[qId]) return 'untouched';
    const score = scores[qId];
    if (score?.isPassed) return 'passed';
    return (score?.correct ?? 0) > 0 ? 'partial' : 'failed';
  };

  return (
    <>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-canvas/80 transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => toggleSidebar(false)}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className={`
          fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-surface border-r border-subtle
          md:static md:z-20 md:h-[calc(100vh-57px)]
          flex flex-col transition-all duration-200 ease-out overflow-hidden flex-shrink-0
          ${
            isSidebarOpen
              ? 'translate-x-0 md:w-80 pointer-events-auto'
              : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 pointer-events-none'
          }
        `}
        role="dialog"
        aria-modal={isSidebarOpen && isMobile()}
        aria-label="Topics and question navigation"
        aria-hidden={!isSidebarOpen}
      >
        <div className="w-80 max-w-[85vw] h-full flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-primary">Topics</h2>
              <p className="text-[11px] text-faint capitalize">
                {scope === 'all' ? 'All topics' : `${scope} scope`} · {topics.length} modules
              </p>
            </div>
            <button
              onClick={() => toggleSidebar(false)}
              className="p-1.5 rounded-lg text-faint hover:text-primary transition-colors"
              aria-label="Close navigation menu"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {topics.map((topic, topicIdx) => {
              const IconComp = ICON_MAP[topic.iconName] || HelpCircle;
              const isTopicActive = activeTopicId === topic.id;
              const topicPassed = topic.questions.filter((q) => scores[q.id]?.isPassed).length;
              const topicTotal = topic.questions.length;
              const complete = topicPassed === topicTotal && topicTotal > 0;

              return (
                <div key={topic.id}>
                  <button
                    onClick={() => selectTopic(topic.id)}
                    aria-expanded={isTopicActive}
                    className={`w-full text-left px-2.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
                      isTopicActive ? 'bg-sunken' : 'hover:bg-sunken'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 flex-shrink-0 ${complete ? 'text-ok' : isTopicActive ? 'text-accent' : 'text-faint'}`}
                      aria-hidden="true"
                    />
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-medium truncate ${
                          isTopicActive ? 'text-primary' : 'text-muted'
                        }`}
                      >
                        <span className="text-faint font-mono mr-1.5">
                          {String(topicIdx + 1).padStart(2, '0')}
                        </span>
                        {topic.title}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-mono tabular-nums flex-shrink-0 ${
                        complete ? 'text-ok' : 'text-faint'
                      }`}
                    >
                      {topicPassed}/{topicTotal}
                    </span>
                  </button>

                  {isTopicActive && (
                    <ul className="pl-3 pr-1 py-1 space-y-0.5">
                      {topic.questions.map((q, qIdx) => {
                        const isQActive = activeQuestionId === q.id;
                        const status = statusOf(q.id);
                        const { row, icon: StatusIcon, iconClass } = STATUS_STYLES[status];
                        const score = scores[q.id];

                        return (
                          <li key={q.id}>
                            <button
                              onClick={() => handleQuestionSelect(q.id)}
                              aria-current={isQActive ? 'true' : undefined}
                              className={`w-full text-left pl-2.5 pr-2 py-2 rounded-lg text-xs flex items-center gap-2 border transition-colors ${row} ${
                                isQActive ? 'ring-1 ring-accent' : ''
                              }`}
                            >
                              <span className="font-mono text-[10px] text-faint w-4 flex-shrink-0 tabular-nums">
                                {qIdx + 1}
                              </span>
                              <span className="flex-1 truncate">{q.title}</span>
                              {submittedQuestions[q.id] ? (
                                <span className="flex items-center gap-1 flex-shrink-0 font-mono text-[10px] tabular-nums">
                                  <StatusIcon className={`w-3.5 h-3.5 ${iconClass}`} aria-hidden="true" />
                                  <span className="sr-only">
                                    {status === 'passed' ? 'All correct' : status === 'partial' ? 'Partly correct' : 'Incorrect'}:{' '}
                                  </span>
                                  {score?.correct}/{score?.total}
                                </span>
                              ) : (
                                <span className="text-[10px] uppercase text-faint flex-shrink-0 tracking-wide">
                                  {q.type}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
