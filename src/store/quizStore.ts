import { create } from 'zustand';
import { ExamScope, Question, Topic } from '../data/types';
import { ALL_TOPICS, getTopicsByScope, getQuestionsByScope } from '../data';
import { isAnswerCorrect } from '../utils/evaluator';
import { gradeQuestion, Verdict } from '../utils/semanticGrader';
import confetti from 'canvas-confetti';

/** Honours the OS "reduce motion" setting before firing the celebration. */
function celebrate() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
}

interface QuizState {
  scope: 'all' | ExamScope;
  activeTopicId: string;
  activeQuestionId: string;
  userInputs: Record<string, string>;
  submittedQuestions: Record<string, boolean>;
  revealedAnswers: Record<string, boolean>;
  scores: Record<string, { correct: number; total: number; isPassed: boolean }>;
  /** Per-question, per-answer-key verdicts from the last submission. */
  verdicts: Record<string, Record<string, Verdict>>;
  /** Set when a submit was blocked because fields are still empty. */
  submitBlockedReason: string | null;
  isGrading: boolean;
  showScoreModal: boolean;
  isSidebarOpen: boolean;

  // Actions
  setScope: (scope: 'all' | ExamScope) => void;
  selectTopic: (topicId: string) => void;
  selectQuestion: (questionId: string) => void;
  setUserInput: (key: string, value: string) => void;
  /** Reads an input for the active question. */
  getInput: (key: string) => string;
  clearSubmitBlocked: () => void;
  submitQuestion: () => Promise<void>;
  retryQuestion: (questionId?: string) => void;
  toggleRevealAnswer: (questionId?: string) => void;
  resetQuestion: (questionId?: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleScoreModal: (show?: boolean) => void;
  toggleSidebar: (open?: boolean) => void;
  
  // Helpers
  getVerdict: (questionId: string, key: string) => Verdict | undefined;
  getActiveTopic: () => Topic | undefined;
  getActiveQuestion: () => Question | undefined;
  getFilteredTopics: () => Topic[];
  getFilteredQuestions: () => Question[];
  getTotalProgress: () => { answered: number; total: number; totalPassed: number };
}

export const useQuizStore = create<QuizState>((set, get) => ({
  scope: 'all',
  activeTopicId: ALL_TOPICS[0].id,
  activeQuestionId: ALL_TOPICS[0].questions[0].id,
  userInputs: {},
  submittedQuestions: {},
  revealedAnswers: {},
  scores: {},
  verdicts: {},
  submitBlockedReason: null,
  isGrading: false,
  showScoreModal: false,
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,

  setScope: (scope) => {
    const filteredTopics = getTopicsByScope(scope);
    const firstTopic = filteredTopics[0] || ALL_TOPICS[0];
    const firstQ = firstTopic.questions[0];

    set({
      scope,
      activeTopicId: firstTopic.id,
      activeQuestionId: firstQ ? firstQ.id : '',
      submitBlockedReason: null,
    });
  },

  selectTopic: (topicId) => {
    const topic = ALL_TOPICS.find((t) => t.id === topicId);
    if (topic && topic.questions.length > 0) {
      set({
        activeTopicId: topicId,
        activeQuestionId: topic.questions[0].id,
        submitBlockedReason: null,
      });
    }
  },

  selectQuestion: (questionId) => {
    const question = get().getFilteredQuestions().find((q) => q.id === questionId);
    if (question) {
      set({
        activeTopicId: question.topicId,
        activeQuestionId: questionId,
        submitBlockedReason: null,
      });
    }
  },

  setUserInput: (key, value) => {
    // Keys are namespaced by question. Before this, `userInputs` was a flat map
    // keyed by blank id ('1', '4-total', 'mcq'), so ids collided across
    // questions and the app only survived by wiping the map on every
    // navigation -- which is also what threw away the student's work.
    const qid = get().activeQuestionId;
    set((state) => ({
      userInputs: { ...state.userInputs, [`${qid}:${key}`]: value },
      submitBlockedReason: null,
    }));
  },

  getInput: (key) => get().userInputs[`${get().activeQuestionId}:${key}`] ?? '',

  clearSubmitBlocked: () => set({ submitBlockedReason: null }),

  submitQuestion: async () => {
    const state = get();
    const currentQ = state.getActiveQuestion();
    if (!currentQ || state.isGrading) return;

    const read = (key: string) => state.userInputs[`${currentQ.id}:${key}`] ?? '';
    const filled = (key: string) => read(key).trim().length > 0;

    // Previously an incomplete question made submit return silently, so the
    // button looked broken. Say what is missing instead.
    let missing = 0;
    if (currentQ.type === 'tracing') {
      missing = currentQ.targets
        .flatMap((t) => t.vars.map((v) => `${t.line}-${v}`))
        .filter((k) => !filled(k)).length;
    } else if (currentQ.type === 'completion') {
      missing = currentQ.blanks.filter((b) => !filled(b.id)).length;
    } else if (!filled('mcq')) {
      missing = 1;
    }
    if (missing > 0) {
      set({
        submitBlockedReason:
          currentQ.type === 'mcq'
            ? 'Choose an option before submitting.'
            : `Fill in ${missing} more ${missing === 1 ? 'field' : 'fields'} before submitting.`,
      });
      return;
    }

    set({ isGrading: true, submitBlockedReason: null });

    // Semantic grading runs the student's answer in real Python and compares
    // behaviour, so `range(2, 11, 2)` and `range(2,11,2)` both pass. It falls
    // back to exact matching whenever the runtime is not ready.
    const inputs: Record<string, string> = {};
    const keys =
      currentQ.type === 'mcq'
        ? ['mcq']
        : Object.keys((currentQ as { answers: Record<string, unknown> }).answers);
    for (const k of keys) inputs[k] = read(k);

    let verdicts: Record<string, Verdict>;
    try {
      verdicts = await gradeQuestion(currentQ, inputs);
    } catch {
      verdicts = Object.fromEntries(
        keys.map((k) => [
          k,
          {
            correct:
              currentQ.type === 'mcq'
                ? inputs.mcq === currentQ.correctOptionId
                : isAnswerCorrect(inputs[k], (currentQ as { answers: Record<string, string | number> }).answers[k]),
            method: 'exact' as const,
          },
        ]),
      );
    }

    const totalCount = keys.length;
    const correctCount = keys.filter((k) => verdicts[k]?.correct).length;
    const isPassed = correctCount === totalCount;

    if (isPassed) celebrate();

    set((prev) => ({
      isGrading: false,
      submittedQuestions: { ...prev.submittedQuestions, [currentQ.id]: true },
      verdicts: { ...prev.verdicts, [currentQ.id]: verdicts },
      scores: {
        ...prev.scores,
        [currentQ.id]: { correct: correctCount, total: totalCount, isPassed },
      },
    }));
  },

  retryQuestion: (qId) => {
    const targetId = qId || get().activeQuestionId;
    set((prev) => {
      const newSubmitted = { ...prev.submittedQuestions };
      delete newSubmitted[targetId];
      return {
        submittedQuestions: newSubmitted,
      };
    });
  },

  toggleRevealAnswer: (qId) => {
    const targetId = qId || get().activeQuestionId;
    set((prev) => ({
      revealedAnswers: {
        ...prev.revealedAnswers,
        [targetId]: !prev.revealedAnswers[targetId],
      },
    }));
  },

  resetQuestion: (qId) => {
    const targetId = qId || get().activeQuestionId;
    set((prev) => {
      const newSubmitted = { ...prev.submittedQuestions };
      const newRevealed = { ...prev.revealedAnswers };
      const newVerdicts = { ...prev.verdicts };
      delete newSubmitted[targetId];
      delete newRevealed[targetId];
      delete newVerdicts[targetId];
      // Only this question's inputs -- not every question's.
      const newInputs = Object.fromEntries(
        Object.entries(prev.userInputs).filter(([k]) => !k.startsWith(`${targetId}:`)),
      );
      return {
        submittedQuestions: newSubmitted,
        revealedAnswers: newRevealed,
        verdicts: newVerdicts,
        userInputs: newInputs,
        submitBlockedReason: null,
      };
    });
  },

  nextQuestion: () => {
    const questions = get().getFilteredQuestions();
    const currentIndex = questions.findIndex((q) => q.id === get().activeQuestionId);
    if (currentIndex >= 0 && currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      set({
        activeTopicId: nextQ.topicId,
        activeQuestionId: nextQ.id,
        submitBlockedReason: null,
      });
    }
  },

  prevQuestion: () => {
    const questions = get().getFilteredQuestions();
    const currentIndex = questions.findIndex((q) => q.id === get().activeQuestionId);
    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      set({
        activeTopicId: prevQ.topicId,
        activeQuestionId: prevQ.id,
        submitBlockedReason: null,
      });
    }
  },

  toggleScoreModal: (show) => {
    set((state) => ({
      showScoreModal: show !== undefined ? show : !state.showScoreModal,
    }));
  },

  toggleSidebar: (open) => {
    set((state) => ({
      isSidebarOpen: open !== undefined ? open : !state.isSidebarOpen,
    }));
  },

  getVerdict: (questionId, key) => get().verdicts[questionId]?.[key],

  getActiveTopic: () => {
    const { activeTopicId } = get();
    return ALL_TOPICS.find((t) => t.id === activeTopicId);
  },

  getActiveQuestion: () => {
    const { activeQuestionId } = get();
    return get().getFilteredQuestions().find((q) => q.id === activeQuestionId);
  },

  getFilteredTopics: () => {
    return getTopicsByScope(get().scope);
  },

  getFilteredQuestions: () => {
    return getQuestionsByScope(get().scope);
  },

  getTotalProgress: () => {
    const questions = get().getFilteredQuestions();
    const total = questions.length;
    let answered = 0;
    let totalPassed = 0;

    questions.forEach((q) => {
      if (get().submittedQuestions[q.id]) {
        answered++;
        if (get().scores[q.id]?.isPassed) {
          totalPassed++;
        }
      }
    });

    return { answered, total, totalPassed };
  },
}));
