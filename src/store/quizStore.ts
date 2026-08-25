import { create } from 'zustand';
import { ExamScope, Question, Topic } from '../data/types';
import { ALL_TOPICS, getTopicsByScope, getQuestionsByScope } from '../data';
import { isAnswerCorrect } from '../utils/evaluator';
import confetti from 'canvas-confetti';

interface QuizState {
  scope: 'all' | ExamScope;
  activeTopicId: string;
  activeQuestionId: string;
  userInputs: Record<string, string>;
  submittedQuestions: Record<string, boolean>;
  scores: Record<string, { correct: number; total: number; isPassed: boolean }>;
  showScoreModal: boolean;

  // Actions
  setScope: (scope: 'all' | ExamScope) => void;
  selectTopic: (topicId: string) => void;
  selectQuestion: (questionId: string) => void;
  setUserInput: (key: string, value: string) => void;
  submitQuestion: () => void;
  resetQuestion: (questionId?: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleScoreModal: (show?: boolean) => void;
  
  // Helpers
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
  scores: {},
  showScoreModal: false,

  setScope: (scope) => {
    const filteredTopics = getTopicsByScope(scope);
    const firstTopic = filteredTopics[0] || ALL_TOPICS[0];
    const firstQ = firstTopic.questions[0];

    set({
      scope,
      activeTopicId: firstTopic.id,
      activeQuestionId: firstQ ? firstQ.id : '',
      userInputs: {},
    });
  },

  selectTopic: (topicId) => {
    const topic = ALL_TOPICS.find((t) => t.id === topicId);
    if (topic && topic.questions.length > 0) {
      set({
        activeTopicId: topicId,
        activeQuestionId: topic.questions[0].id,
        userInputs: {},
      });
    }
  },

  selectQuestion: (questionId) => {
    const question = get().getFilteredQuestions().find((q) => q.id === questionId);
    if (question) {
      set({
        activeTopicId: question.topicId,
        activeQuestionId: questionId,
        userInputs: {},
      });
    }
  },

  setUserInput: (key, value) => {
    set((state) => ({
      userInputs: { ...state.userInputs, [key]: value },
    }));
  },

  submitQuestion: () => {
    const state = get();
    const currentQ = state.getActiveQuestion();
    if (!currentQ) return;

    let correctCount = 0;
    let totalCount = 0;

    if (currentQ.type === 'tracing') {
      totalCount = Object.keys(currentQ.answers).length;
      Object.entries(currentQ.answers).forEach(([key, expected]) => {
        const userVal = state.userInputs[key];
        if (isAnswerCorrect(userVal, expected)) {
          correctCount++;
        }
      });
    } else if (currentQ.type === 'completion') {
      totalCount = Object.keys(currentQ.answers).length;
      Object.entries(currentQ.answers).forEach(([key, expected]) => {
        const userVal = state.userInputs[key];
        if (isAnswerCorrect(userVal, expected)) {
          correctCount++;
        }
      });
    } else if (currentQ.type === 'mcq') {
      totalCount = 1;
      const userChoice = state.userInputs['mcq'];
      if (userChoice === currentQ.correctOptionId) {
        correctCount = 1;
      }
    }

    const isPassed = correctCount === totalCount;

    if (isPassed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    set((prev) => ({
      submittedQuestions: { ...prev.submittedQuestions, [currentQ.id]: true },
      scores: {
        ...prev.scores,
        [currentQ.id]: { correct: correctCount, total: totalCount, isPassed },
      },
    }));
  },

  resetQuestion: (qId) => {
    const targetId = qId || get().activeQuestionId;
    set((prev) => {
      const newSubmitted = { ...prev.submittedQuestions };
      delete newSubmitted[targetId];
      return {
        submittedQuestions: newSubmitted,
        userInputs: {},
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
        userInputs: {},
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
        userInputs: {},
      });
    }
  },

  toggleScoreModal: (show) => {
    set((state) => ({
      showScoreModal: show !== undefined ? show : !state.showScoreModal,
    }));
  },

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
