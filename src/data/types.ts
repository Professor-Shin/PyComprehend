export type QuestionType = 'tracing' | 'completion' | 'mcq';
export type ExamScope = 'midterm' | 'final';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Optional, UI-invisible metadata consumed by tools/qa/run_snippet.py so that a
 * snippet which cannot run unaided — free variables, or input() calls — can still
 * be verified against real CPython. Without this, such questions are permanently
 * unverifiable and a wrong answer in them can never be caught automatically.
 */
export interface VerifySpec {
  /** Python executed before the snippet, to bind variables the snippet assumes. */
  prelude?: string;
  /**
   * Several preludes, each run and compared independently. Needed wherever one
   * input cannot separate a right answer from a wrong one: with `score = 85`,
   * both `>=` and `>` yield "Excellent", so a single probe would pass `>`.
   */
  probes?: string[];
  /** Values returned by successive input() calls, in order. */
  stdin?: string[];
  /**
   * Python run AFTER the snippet, in the same namespace. Required wherever the
   * snippet only *defines* something: `rec_02` defines `rec_sum` and never calls
   * it, so without a postlude no execution can tell `n <= 0` from `n < 0`.
   */
  postlude?: string;
  /** Exact expected stdout once the blanks are filled with the stored answers. */
  expectedStdout?: string;
  /** Python expression that must evaluate truthy after the snippet runs. */
  assert?: string;
}

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
  /** QA-only; never rendered. See VerifySpec. */
  verify?: VerifySpec;
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
  /**
   * A worked example of the answer, for authors and for the QA tooling, which
   * checks that this form is actually accepted by the grader.
   *
   * NEVER render this to the student: in this bank it IS the answer, for every
   * blank. It was briefly used as the input's placeholder and gave away all 22.
   * `tools/qa/audit.mjs` fails the build if a component references it.
   */
  placeholder?: string;
  /**
   * Student-facing nudge, shown only when the student asks for it. Must point at
   * the idea without containing the answer -- audit.mjs checks this.
   */
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
