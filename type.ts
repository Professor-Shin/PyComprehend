export type QuestionType = 'tracing' | 'completion' | 'mcq';
export type ExamScope = 'midterm' | 'final';

export interface BaseQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  scope: ExamScope;
  title: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  codeSnippet: string;
  explanation: string;
}

// 1. Tracing Type (Spy on Variable)
export interface TracingQuestion extends BaseQuestion {
  type: 'tracing';
  variablesToTrack: string[];
  // Key = line number, Value = Object of expected variable values at that line
  expectedTracing: Record<number, Record<string, string | number>>;
}

// 2. Code Completion Type (Fill in blanks)
export interface CompletionQuestion extends BaseQuestion {
  type: 'completion';
  // Code snippet will contain placeholders like {{blank_1}}, {{blank_2}}
  blanks: Record<string, { answer: string; hint?: string }>;
}

// 3. MCQ / Output Prediction Type
export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctOptionIndex: number;
}

export type Question = TracingQuestion | CompletionQuestion | MCQQuestion;