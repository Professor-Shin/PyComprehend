import React, { useEffect, useState } from 'react';
import { useQuizStore } from './store/quizStore';
import { useThemeStore } from './store/themeStore';
import { loadRuntime } from './utils/pythonRuntime';
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
  Loader2,
  BookOpen,
  Eye,
  Menu,
  AlertCircle,
} from 'lucide-react';

const DIFFICULTY_STYLES = {
  easy: 'text-ok border-ok-line bg-ok-tint',
  medium: 'text-fill border-fill-line bg-fill-tint',
  hard: 'text-err border-err-line bg-err-tint',
} as const;

export function App() {
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const initTheme = useThemeStore((s) => s.init);

  const {
    getActiveQuestion,
    getActiveTopic,
    submittedQuestions,
    revealedAnswers,
    getInput,
    submitQuestion,
    retryQuestion,
    toggleRevealAnswer,
    resetQuestion,
    nextQuestion,
    prevQuestion,
    scores,
    isGrading,
    submitBlockedReason,
    getFilteredQuestions,
    activeQuestionId,
    toggleSidebar,
  } = useQuizStore();

  useEffect(() => initTheme(), [initTheme]);

  // Warm the Python runtime in the background so the first Run or submit is not
  // a cold ~10MB download. Nothing waits on it; grading degrades gracefully.
  useEffect(() => {
    const id = window.setTimeout(() => void loadRuntime(), 1500);
    return () => window.clearTimeout(id);
  }, []);

  const currentQ = getActiveQuestion();
  const currentTopic = getActiveTopic();
  const allQuestions = getFilteredQuestions();
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  const isSubmitted = currentQ ? submittedQuestions[currentQ.id] || false : false;
  const isRevealed = currentQ ? revealedAnswers[currentQ.id] || false : false;
  const currentScore = currentQ ? scores[currentQ.id] : undefined;
  const isPassed = currentScore?.isPassed || false;

  let fieldKeys: string[] = [];
  if (currentQ) {
    if (currentQ.type === 'mcq') fieldKeys = ['mcq'];
    else if (currentQ.type === 'completion') fieldKeys = currentQ.blanks.map((b) => b.id);
    else fieldKeys = currentQ.targets.flatMap((t) => t.vars.map((v) => `${t.line}-${v}`));
  }
  const totalFields = fieldKeys.length;
  const filledFields = fieldKeys.filter((k) => getInput(k).trim().length > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary font-sans">
      <Header onOpenInstructorModal={() => setShowInstructorModal(true)} />

      <div className="flex-1 flex flex-col md:flex-row relative">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col h-[calc(100vh-57px)] overflow-y-auto">
          {currentQ ? (
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-5 flex flex-col gap-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleSidebar(true)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-accent border border-accent-line bg-accent-tint flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    title="Open topics & navigation"
                  >
                    <Menu className="w-3 h-3" aria-hidden="true" />
                    {currentTopic?.title || currentQ.topicTitle}
                  </button>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium text-muted border border-subtle">
                    {currentQ.scope}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                      DIFFICULTY_STYLES[currentQ.difficulty]
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>

                  {isSubmitted && currentScore && (
                    <span
                      className={`ml-auto px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border ${
                        currentScore.isPassed
                          ? 'text-ok border-ok-line bg-ok-tint'
                          : 'text-err border-err-line bg-err-tint'
                      }`}
                    >
                      {currentScore.correct} / {currentScore.total}
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-primary">
                  {currentQ.title}
                </h2>

                {currentQ.description && (
                  <div className="text-xs md:text-sm text-muted whitespace-pre-line leading-relaxed">
                    {renderFormattedText(currentQ.description)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                {currentQ.type === 'tracing' && <TracingReader question={currentQ} />}
                {currentQ.type === 'completion' && <CompletionReader question={currentQ} />}
                {currentQ.type === 'mcq' && <MCQReader question={currentQ} />}
              </div>

              <div className="sticky bottom-0 bg-canvas pt-3 pb-3 border-t border-subtle space-y-2">
                {/* Submitting used to fail silently when fields were blank, which
                    made the button look broken. Now it says what is missing. */}
                {submitBlockedReason && (
                  <p
                    role="alert"
                    className="flex items-center gap-1.5 text-[11px] text-fill"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    {submitBlockedReason}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevQuestion}
                      disabled={currentIndex <= 0}
                      aria-label="Previous question"
                      className="px-3 py-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong text-xs font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <button
                      onClick={() => toggleSidebar(true)}
                      className="px-3 py-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong text-xs font-mono tabular-nums transition-colors"
                      title="Jump to a question"
                    >
                      {currentIndex + 1}/{allQuestions.length}
                    </button>

                    <button
                      onClick={nextQuestion}
                      disabled={currentIndex >= allQuestions.length - 1}
                      aria-label="Next question"
                      className="px-3 py-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong text-xs font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isSubmitted && totalFields > 1 && (
                      <span className="text-[11px] text-faint font-mono tabular-nums hidden sm:inline mr-1">
                        {filledFields}/{totalFields}
                      </span>
                    )}

                    {isSubmitted && !isPassed && (
                      <>
                        <button
                          onClick={() => toggleRevealAnswer(currentQ.id)}
                          aria-pressed={isRevealed}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                            isRevealed
                              ? 'border-fill-line bg-fill-tint text-fill'
                              : 'border-subtle text-muted hover:text-primary hover:border-strong'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="hidden sm:inline">
                            {isRevealed ? 'Hide answer' : 'Show answer'}
                          </span>
                        </button>

                        <button
                          onClick={() => retryQuestion(currentQ.id)}
                          className="px-3 py-2 rounded-lg border border-accent-line bg-accent-tint text-accent text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="hidden sm:inline">Retry</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => resetQuestion(currentQ.id)}
                      className="px-3 py-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>

                    {!isSubmitted && (
                      <button
                        onClick={() => void submitQuestion()}
                        disabled={isGrading}
                        className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
                      >
                        {isGrading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                            Checking…
                          </>
                        ) : (
                          <>
                            Check answer
                            <Send className="w-3.5 h-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-faint gap-3">
              <BookOpen className="w-10 h-10" aria-hidden="true" />
              <p className="text-sm">No questions found in this category.</p>
            </div>
          )}
        </main>
      </div>

      <ScoreModal />
      <InstructorModal
        isOpen={showInstructorModal}
        onClose={() => setShowInstructorModal(false)}
      />
    </div>
  );
}
