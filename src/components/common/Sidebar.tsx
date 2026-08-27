import React from 'react';
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
  HelpCircle,
  LucideIcon
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

export const Sidebar: React.FC = () => {
  const { 
    getFilteredTopics, 
    activeTopicId, 
    activeQuestionId, 
    selectTopic, 
    selectQuestion,
    submittedQuestions,
    scores 
  } = useQuizStore();

  const topics = getFilteredTopics();

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-auto md:h-[calc(100vh-65px)] flex-shrink-0">
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Topics & Question Navigation
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {topics.map((topic, topicIdx) => {
          const IconComp = ICON_MAP[topic.iconName] || HelpCircle;
          const isTopicActive = activeTopicId === topic.id;

          // Topic progress
          const topicPassed = topic.questions.filter((q) => scores[q.id]?.isPassed).length;
          const topicSubmitted = topic.questions.filter((q) => submittedQuestions[q.id]).length;
          const topicTotal = topic.questions.length;
          const isTopic100 = topicPassed === topicTotal && topicTotal > 0;
          const isTopicPartial = !isTopic100 && (topicSubmitted > 0);

          let topicBorderClass = 'border-slate-800 bg-slate-950/40 hover:border-slate-700';
          if (isTopicActive) {
            if (isTopic100) {
              topicBorderClass = 'border-emerald-500/70 bg-slate-800/80 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/30';
            } else if (isTopicPartial) {
              topicBorderClass = 'border-amber-500/70 bg-slate-800/80 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/30';
            } else {
              topicBorderClass = 'border-indigo-500/50 bg-slate-800/50 shadow-lg shadow-indigo-950/20';
            }
          } else {
            if (isTopic100) {
              topicBorderClass = 'border-emerald-500/40 bg-emerald-950/15 hover:border-emerald-500/60';
            } else if (isTopicPartial) {
              topicBorderClass = 'border-amber-500/40 bg-amber-950/15 hover:border-amber-500/60';
            }
          }

          let topicIconClass = 'bg-slate-800 text-slate-400 group-hover:text-slate-200';
          if (isTopic100) {
            topicIconClass = isTopicActive
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          } else if (isTopicPartial) {
            topicIconClass = isTopicActive
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
          } else if (isTopicActive) {
            topicIconClass = 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30';
          }

          let topicBadgeClass = 'text-slate-400 bg-slate-900 border-slate-800';
          if (isTopic100) {
            topicBadgeClass = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50 font-bold';
          } else if (isTopicPartial) {
            topicBadgeClass = 'text-amber-300 bg-amber-950/80 border-amber-500/50 font-bold';
          }

          return (
            <div
              key={topic.id}
              className={`rounded-2xl border transition-all overflow-hidden ${topicBorderClass}`}
            >
              {/* Topic Header */}
              <button
                onClick={() => selectTopic(topic.id)}
                className="w-full text-left p-3.5 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${topicIconClass}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-500">0{topicIdx + 1}.</span>
                      <h3 className={`text-sm font-semibold ${isTopic100 ? 'text-emerald-300' : isTopicPartial ? 'text-amber-300' : isTopicActive ? 'text-white' : 'text-slate-300'}`}>
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {topic.questions.length} questions • {topic.scope.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full border ${topicBadgeClass}`}>
                    {isTopic100 ? `✓ ${topicPassed}/${topicTotal}` : `${topicSubmitted}/${topicTotal}`}
                  </span>
                </div>
              </button>

              {/* Questions List under active topic */}
              {isTopicActive && (
                <div className="px-2 pb-3 space-y-1.5 border-t border-slate-800/50 pt-2">
                  {topic.questions.map((q, qIdx) => {
                    const isQActive = activeQuestionId === q.id;
                    const isSubmitted = submittedQuestions[q.id];
                    const score = scores[q.id];
                    const isPassed = Boolean(score?.isPassed);
                    const isPartial = isSubmitted && !isPassed && (score?.correct ?? 0) > 0;
                    const isFailed = isSubmitted && !isPassed && (score?.correct ?? 0) === 0;

                    let typeBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    if (q.type === 'completion') typeBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    if (q.type === 'mcq') typeBadgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

                    let qItemClass = 'hover:bg-slate-800/80 text-slate-400 border border-transparent';
                    let qNumClass = 'bg-slate-800 text-slate-400';

                    if (isPassed) {
                      // 100% -> Green
                      qNumClass = 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold';
                      qItemClass = isQActive
                        ? 'bg-emerald-950/40 border border-emerald-500/60 text-emerald-100 font-semibold ring-1 ring-emerald-500/30'
                        : 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300/90 hover:bg-emerald-950/40';
                    } else if (isPartial) {
                      // Partial -> Yellow
                      qNumClass = 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold';
                      qItemClass = isQActive
                        ? 'bg-amber-950/40 border border-amber-500/60 text-amber-100 font-semibold ring-1 ring-amber-500/30'
                        : 'bg-amber-950/20 border border-amber-500/30 text-amber-300/90 hover:bg-amber-950/40';
                    } else if (isFailed) {
                      // Failed -> Rose/Red
                      qNumClass = 'bg-rose-500/25 text-rose-300 border border-rose-500/50 font-bold';
                      qItemClass = isQActive
                        ? 'bg-rose-950/40 border border-rose-500/60 text-rose-100 font-semibold ring-1 ring-rose-500/30'
                        : 'bg-rose-950/20 border border-rose-500/30 text-rose-300/90 hover:bg-rose-950/40';
                    } else if (isQActive) {
                      // Active, unattempted
                      qItemClass = 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 font-semibold';
                      qNumClass = 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => selectQuestion(q.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${qItemClass}`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] flex-shrink-0 ${qNumClass}`}>
                            {qIdx + 1}
                          </span>
                          <span className="truncate">{q.title}</span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {isSubmitted ? (
                            isPassed ? (
                              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>100%</span>
                              </div>
                            ) : isPartial ? (
                              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-[10px]">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>{score?.correct}/{score?.total}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono font-bold text-[10px]">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>0/{score?.total || 1}</span>
                              </div>
                            )
                          ) : (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${typeBadgeColor}`}>
                              {q.type}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </aside>
  );
};
