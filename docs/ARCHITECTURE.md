# CS Code Comprehension Tutor - System Architecture

## Core Objectives
An interactive Computer Science learning web platform designed for university students to practice Python **Code Comprehension** (Variable Tracing, Code Completion, and Output Prediction / Error Detection).

## System Architecture

```
src/
├── components/
│   ├── common/       # Header, Sidebar navigation, scope filters
│   ├── quiz/         # Question Type Readers (TracingReader, CompletionReader, MCQReader, CodeViewer)
│   └── results/      # Performance Score Summary & Breakdown Modal
├── data/
│   ├── index.ts      # Question Loader & Filter Helpers
│   ├── types.ts      # Question & Topic Schemas
│   └── topics/       # Curated Question Bank by Chapter (01-07)
├── store/
│   └── quizStore.ts  # Zustand Global State (scope, inputs, submissions, scores)
├── utils/
│   └── evaluator.ts  # String quote & answer normalization engine
├── App.tsx           # Layout Container
└── main.tsx          # Application Entrypoint
```

## Key Technologies
- **UI Framework**: React 18 + TypeScript + Vite
- **Styling & Aesthetics**: Tailwind CSS (Dark Glassmorphism UI tokens, JetBrains Mono font)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
