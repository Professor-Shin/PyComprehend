import React, { useState } from 'react';
import { useQuizStore } from './store/quizStore';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { TracingReader } from './components/quiz/TracingReader';
import { CompletionReader } from './components/quiz/CompletionReader';
import { MCQReader } from './components/quiz/MCQReader';
import { ScoreModal } from './components/results/ScoreModal';
import { InstructorModal } from './components/common/InstructorModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen 
} from 'lucide-react';

export function App() {
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  const {
    getActiveQuestion,
    getActiveTopic,
    submittedQuestions,
    userInputs,
    submitQuestion,
    resetQuestion,
    nextQuestion,
    prevQuestion,
    scores,
    getFilteredQuestions,
    activeQuestionId,
  } = useQuizStore();

  const currentQ = getActiveQuestion();
  const currentTopic = getActiveTopic();
  const allQuestions = getFilteredQuestions();
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  const isSubmitted = currentQ ? submittedQuestions[currentQ.id] || false : false;
  const currentScore = currentQ ? scores[currentQ.id] : undefined;

  const isInputEmpty =
    !currentQ ||
    (currentQ.type === 'mcq' && !userInputs['mcq']) ||
    (currentQ.type !== 'mcq' && Object.keys(userInputs).length === 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <Header onOpenInstructorModal={() => setShowInstructorModal(true)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar onOpenInstructorModal={() => setShowInstructorModal(true)} />

        {/* Workspace Area */}
        <main className="flex-1 flex flex-col h-auto md:h-[calc(100vh-65px)] overflow-y-auto bg-slate-950">
          {currentQ ? (
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-6">
              {/* Question Meta Header */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {currentTopic?.title || currentQ.topicTitle}
                    </span>
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
                  <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed border-t border-slate-800/60 pt-2.5">
                    {currentQ.description}
                  </p>
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
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={nextQuestion}
                    disabled={currentIndex >= allQuestions.length - 1}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => resetQuestion(currentQ.id)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={submitQuestion}
                    disabled={isSubmitted || isInputEmpty}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2 ${
                      isSubmitted || isInputEmpty
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30 active:scale-95'
                    }`}
                  >
                    <span>Check Answer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
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
