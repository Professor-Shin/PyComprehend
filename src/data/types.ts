export type QuestionType = 'tracing' | 'completion' | 'mcq';
export type ExamScope = 'midterm' | 'final';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface BaseQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  scope: ExamScope;
  title: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  codeSnippet: string;
  description?: string;
  explanation: string;
}

// 1. Tracing Type (Spy on Variable line-by-line step execution)
export interface TracingTarget {
  line: number;
  vars: string[];
}

export interface TracingQuestion extends BaseQuestion {
  type: 'tracing';
  variablesToTrack: string[];
  targets: TracingTarget[];
  // Key = `${line}-${varName}`, Value = expected string or number answer
  answers: Record<string, string | number>;
}

// 2. Code Completion Type (Fill in blanks in code snippet or input lines)
export interface BlankItem {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
}

export interface CompletionQuestion extends BaseQuestion {
  type: 'completion';
  blanks: BlankItem[];
  // Key = blank id (e.g. '1', '2'), Value = expected answer
  answers: Record<string, string>;
}

// 3. MCQ / Output Prediction / Spot Error Type
export interface MCQOption {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
  isCodeFont?: boolean;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: MCQOption[];
  correctOptionId: string; // e.g. 'A'
}

export type Question = TracingQuestion | CompletionQuestion | MCQQuestion;

export interface Topic {
  id: string;
  title: string;
  scope: ExamScope;
  description: string;
  iconName: string;
  questions: Question[];
}
