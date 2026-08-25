import { Topic } from '../types';

export const recursionOopTopic: Topic = {
  id: '07_recursion_oop',
  title: 'Recursion & Advanced Control Flow',
  scope: 'final',
  description: 'Trace recursive call stacks, base cases, call stack winding/unwinding, and state changes.',
  iconName: 'Workflow',
  questions: [
    {
      id: 'rec_01',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Recursive Factorial Call Stack Tracing',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Trace variable `n` and return value of `fact(3)`.',
      codeSnippet: `1: def fact(n):
2:     if n <= 1:
*3:         return 1
4:     else:
*5:         return n * fact(n - 1)
6: 
7: res = fact(3)`,
      variablesToTrack: ['n'],
      targets: [
        { line: 5, vars: ['n'] },
        { line: 3, vars: ['n'] }
      ],
      answers: {
        '5-n': '3',
        '3-n': '1'
      },
      explanation: 'Calling `fact(3)` hits line 5 with `n=3`, evaluating `3 * fact(2)`.\n`fact(2)` hits line 5 with `n=2`, evaluating `2 * fact(1)`.\n`fact(1)` hits line 3 with `n=1`, returning `1`.\nUnwinding: `fact(2) = 2 * 1 = 2`, `fact(3) = 3 * 2 = 6`.'
    },
    {
      id: 'rec_02',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Recursive Base Case Completion',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] for the base case condition of recursive sum function `rec_sum(n)`.',
      codeSnippet: `def rec_sum(n):
    if ___1___:
        return 0
    return n + rec_sum(n - 1)`,
      blanks: [
        { id: '1', label: 'Blank [1] (Base case condition)', placeholder: 'e.g. n <= 0' }
      ],
      answers: {
        '1': 'n <= 0'
      },
      explanation: 'When `n <= 0`, the base case stops recursion and returns 0 to prevent infinite recursion / RecursionError.'
    },
    {
      id: 'rec_03',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Predict Recursive Output',
      type: 'mcq',
      difficulty: 'hard',
      description: 'What value is printed by `mystery(4)`?',
      codeSnippet: `def mystery(n):
    if n <= 1:
        return n
    return mystery(n - 1) + mystery(n - 2)

print(mystery(4))`,
      options: [
        { id: 'A', text: '2', isCodeFont: true },
        { id: 'B', text: '3', isCodeFont: true },
        { id: 'C', text: '5', isCodeFont: true },
        { id: 'D', text: '8', isCodeFont: true },
        { id: 'E', text: 'RecursionError: maximum recursion depth exceeded', isCodeFont: false }
      ],
      correctOptionId: 'B',
      explanation: 'This is the Fibonacci function.\n`mystery(0) = 0`, `mystery(1) = 1`\n`mystery(2) = mystery(1) + mystery(0) = 1`\n`mystery(3) = mystery(2) + mystery(1) = 2`\n`mystery(4) = mystery(3) + mystery(2) = 3`.'
    },
    {
      id: 'rec_04',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Recursive String Reversal Tracing',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Trace variable `s` at line 4 for `rev("cat")`.',
      codeSnippet: `1: def rev(s):
2:     if len(s) == 0:
3:         return s
*4:     return rev(s[1:]) + s[0]
5: 
6: ans = rev("cat")`,
      variablesToTrack: ['s'],
      targets: [
        { line: 4, vars: ['s'] }
      ],
      answers: {
        '4-s': "'cat'"
      },
      explanation: '`rev("cat")` -> `rev("at") + "c"`.\n`rev("at")` -> `rev("t") + "a"`.\n`rev("t")` -> `rev("") + "t"` -> returns `"t"`.\nUnwinding: `"t" + "a" = "ta"`, `"ta" + "c" = "tac"`.'
    },
    {
      id: 'rec_05',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Infinite Recursion Error Detection',
      type: 'mcq',
      difficulty: 'medium',
      description: 'Why does `countdown(5)` fail with `RecursionError`?',
      codeSnippet: `def countdown(n):
    print(n)
    return countdown(n - 1)`,
      options: [
        { id: 'A', text: 'Because countdown is missing a base case termination condition.', isCodeFont: false },
        { id: 'B', text: 'Because n - 1 is an invalid expression.', isCodeFont: false },
        { id: 'C', text: 'Because Python does not support recursion.', isCodeFont: false },
        { id: 'D', text: 'Because print() returns None.', isCodeFont: false },
        { id: 'E', text: 'None of the above.', isCodeFont: false }
      ],
      correctOptionId: 'A',
      explanation: 'Recursive functions must have a base case to terminate execution. Without a base case (e.g. `if n <= 0: return`), `countdown` recurses infinitely until Python hits the maximum call stack depth, raising `RecursionError`.'
    },
    {
      id: 'rec_06',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Recursive Power Function Completion',
      type: 'completion',
      difficulty: 'medium',
      description: 'Complete the recursive step in blank [1] for `power(base, exp)`.',
      codeSnippet: `def power(base, exp):
    if exp == 0:
        return 1
    return base * ___1___(base, exp - 1)`,
      blanks: [
        { id: '1', label: 'Blank [1] (Recursive function call name)', placeholder: 'e.g. power' }
      ],
      answers: {
        '1': 'power'
      },
      explanation: 'To recursively compute `base^exp`, we multiply `base * power(base, exp - 1)` until `exp == 0`.'
    }
  ]
};
