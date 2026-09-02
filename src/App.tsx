import React, { useState } from 'react';
import { useQuizStore } from './store/quizStore';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { TracingReader } from './components/quiz/TracingReader';
import { CompletionReader } from './components/quiz/CompletionReader';
import { MCQReader } from './components/quiz/MCQReader';
import { ScoreModal } from './components/results/ScoreModal';
import { InstructorModal } from './components/common/InstructorModal';
import { renderFormattedText } from './utils/syntaxHighlighter';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  BookOpen,
  Eye,
  Menu
} from 'lucide-react';

export function App() {
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  const {
    getActiveQuestion,
    getActiveTopic,
    submittedQuestions,
    revealedAnswers,
    userInputs,
    submitQuestion,
    retryQuestion,
    toggleRevealAnswer,
    resetQuestion,
    nextQuestion,
    prevQuestion,
    scores,
    getFilteredQuestions,
    activeQuestionId,
    toggleSidebar,
  } = useQuizStore();

  const currentQ = getActiveQuestion();
  const currentTopic = getActiveTopic();
  const allQuestions = getFilteredQuestions();
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  const isSubmitted = currentQ ? submittedQuestions[currentQ.id] || false : false;
  const isRevealed = currentQ ? revealedAnswers[currentQ.id] || false : false;
  const currentScore = currentQ ? scores[currentQ.id] : undefined;
  const isPassed = currentScore?.isPassed || false;

  let totalFields = 0;
  let filledFields = 0;

  if (currentQ) {
    if (currentQ.type === 'mcq') {
      totalFields = 1;
      filledFields = userInputs['mcq'] ? 1 : 0;
    } else if (currentQ.type === 'completion') {
      totalFields = currentQ.blanks.length;
      filledFields = currentQ.blanks.filter((b) => {
        const val = userInputs[b.id];
        return typeof val === 'string' && val.trim().length > 0;
      }).length;
    } else if (currentQ.type === 'tracing') {
      currentQ.targets.forEach((target) => {
        target.vars.forEach((v) => {
          totalFields++;
          const key = `${target.line}-${v}`;
          const val = userInputs[key];
          if (typeof val === 'string' && val.trim().length > 0) {
            filledFields++;
          }
        });
      });
    }
  }

  const isComplete = currentQ ? totalFields > 0 && filledFields === totalFields : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <Header onOpenInstructorModal={() => setShowInstructorModal(true)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Side Navigation (Overlay on Mobile, Push on Desktop) */}
        <Sidebar />

        {/* Workspace Area */}
        <main className="flex-1 min-w-0 flex flex-col h-[calc(100vh-65px)] overflow-y-auto bg-slate-950 transition-all duration-300">
          {currentQ ? (
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-6">
              {/* Question Meta Header */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSidebar(true)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all group cursor-pointer"
                      title="Click to open topics & navigation menu"
                    >
                      <Menu className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>{currentTopic?.title || currentQ.topicTitle}</span>
                    </button>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                      {currentQ.scope} Scope
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                        currentQ.difficulty === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : currentQ.difficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {currentQ.difficulty}
                    </span>
                  </div>

                  {isSubmitted && currentScore && (
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 border ${
                        currentScore.isPassed
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Score: {currentScore.correct} / {currentScore.total}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center space-x-2">
                  <span>{currentQ.title}</span>
                </h2>

                {currentQ.description && (
                  <div className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed border-t border-slate-800/60 pt-2.5">
                    {renderFormattedText(currentQ.description)}
                  </div>
                )}
              </div>

              {/* Reader View Component */}
              <div className="flex-1">
                {currentQ.type === 'tracing' && <TracingReader question={currentQ} />}
                {currentQ.type === 'completion' && <CompletionReader question={currentQ} />}
                {currentQ.type === 'mcq' && <MCQReader question={currentQ} />}
              </div>

              {/* Bottom Navigation & Action Bar */}
              <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-md pt-4 pb-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevQuestion}
                    disabled={currentIndex <= 0}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <button
                    onClick={() => toggleSidebar(true)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center space-x-1.5 transition-all"
                    title="Open navigation menu to jump questions"
                  >
                    <Menu className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-mono font-semibold text-slate-200">
                      {currentIndex + 1}/{allQuestions.length}
                    </span>
                  </button>

                  <button
                    onClick={nextQuestion}
                    disabled={currentIndex >= allQuestions.length - 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2.5">
                  {!isSubmitted && totalFields > 1 && (
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline-block mr-1">
                      {filledFields}/{totalFields} filled
                    </span>
                  )}

                  {/* Show Answer & Retry buttons when submitted and not passed */}
                  {isSubmitted && !isPassed && (
                    <>
                      <button
                        onClick={() => toggleRevealAnswer(currentQ.id)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all active:scale-95 ${
                          isRevealed
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/20'
                            : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                      </button>

                      <button
                        onClick={() => retryQuestion(currentQ.id)}
                        className="px-3.5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs flex items-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-indigo-950/20"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => resetQuestion(currentQ.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset</span>
                  </button>

                  {!isSubmitted && (
                    <button
                      onClick={submitQuestion}
                      disabled={!isComplete}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2 ${
                        !isComplete
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30 active:scale-95'
                      }`}
                    >
                      <span>Check Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600" />
              <p>No questions found in this category.</p>
            </div>
          )}
        </main>
      </div>

      {/* Performance Score Modal */}
      <ScoreModal />

      {/* Instructor / TA Credit Modal */}
      <InstructorModal
        isOpen={showInstructorModal}
        onClose={() => setShowInstructorModal(false)}
      />
    </div>
  );
}
