# Question Data Schema Specification

All questions strictly conform to the TypeScript interfaces defined in `src/data/types.ts`.

## 1. Tracing Question Schema (`tracing`)
Used for step-by-step variable state tracking at specific code lines.

```typescript
export interface TracingQuestion extends BaseQuestion {
  type: 'tracing';
  variablesToTrack: string[];
  targets: Array<{ line: number; vars: string[] }>;
  answers: Record<string, string | number>; // Key = `${line}-${varName}`
}
```

## 2. Code Completion Schema (`completion`)
Used for fill-in-the-blank exercises inside code snippets or logic expressions.

```typescript
export interface CompletionQuestion extends BaseQuestion {
  type: 'completion';
  blanks: Array<{ id: string; label: string; placeholder?: string; hint?: string }>;
  answers: Record<string, string>; // Key = blank id
}
```

## 3. Multiple Choice Schema (`mcq`)
Used for Output Prediction, Finding Errors, and Logic Comparisons.

```typescript
export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: Array<{ id: string; text: string; isCodeFont?: boolean }>;
  correctOptionId: string; // e.g. 'A', 'B', 'C'
}
```
