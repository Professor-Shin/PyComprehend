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

interface SidebarProps {
  onOpenInstructorModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenInstructorModal }) => {
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
          const topicSubmitted = topic.questions.filter((q) => submittedQuestions[q.id]).length;
          const topicTotal = topic.questions.length;

          return (
            <div
              key={topic.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isTopicActive
                  ? 'border-indigo-500/50 bg-slate-800/50 shadow-lg shadow-indigo-950/20'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              {/* Topic Header */}
              <button
                onClick={() => selectTopic(topic.id)}
                className="w-full text-left p-3.5 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isTopicActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-500">0{topicIdx + 1}.</span>
                      <h3 className={`text-sm font-semibold ${isTopicActive ? 'text-white' : 'text-slate-300'}`}>
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {topic.questions.length} questions • {topic.scope.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {topicSubmitted}/{topicTotal}
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
                    const isPassed = score?.isPassed;

                    let typeBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    if (q.type === 'completion') typeBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    if (q.type === 'mcq') typeBadgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

                    return (
                      <button
                        key={q.id}
                        onClick={() => selectQuestion(q.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isQActive
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 font-semibold'
                            : 'hover:bg-slate-800/80 text-slate-400 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-400 flex-shrink-0">
                            {qIdx + 1}
                          </span>
                          <span className="truncate">{q.title}</span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${typeBadgeColor}`}>
                            {q.type}
                          </span>

                          {isSubmitted && (
                            isPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400" />
                            )
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

      {/* Instructor / TA Credit Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <button
          onClick={() => onOpenInstructorModal?.()}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3">
            <img
              src="/assets/instructor-profile.png"
              alt="TA Shin"
              className="w-9 h-9 rounded-xl object-cover border border-amber-400/60 shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-200">TA.Shin</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Credit
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Siwakorn Shin • Contact & Support</p>
            </div>
          </div>

          <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform font-medium">
            Profile →
          </span>
        </button>
      </div>
    </aside>
  );
};