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
      description: 'Each line runs once per recursive call. Give the value of `n` **the first time each marked line is reached, before that line executes**.',
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
      // QA-only: without this the function is never called and `n < 0` is
      // indistinguishable from `n <= 0`. rec_sum(0) is what separates them.
      verify: { postlude: 'print(rec_sum(4), rec_sum(1), rec_sum(0))' },
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
      description: 'Line 4 runs once per recursive call. Give the value of `s` **the first time line 4 is reached, before that line executes**.',
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
      // QA-only: exercises the recursive call the blank creates.
      verify: { postlude: 'print(power(2, 5), power(7, 0), power(3, 1))' },
      explanation: 'To recursively compute `base^exp`, we multiply `base * power(base, exp - 1)` until `exp == 0`.'
    },
    {
      id: 'rec_07',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Class Attribute Shared Across Instances',
      type: 'mcq',
      difficulty: 'hard',
      description: 'What does this script print?',
      codeSnippet: `class Counter:
    total = 0

    def __init__(self):
        Counter.total += 1
        self.id = Counter.total

a = Counter()
b = Counter()
print(a.id, b.id, Counter.total)`,
      options: [
        { id: 'A', text: '1 1 1', isCodeFont: true },
        { id: 'B', text: '1 2 2', isCodeFont: true },
        { id: 'C', text: '2 2 2', isCodeFont: true },
        { id: 'D', text: '0 1 2', isCodeFont: true },
        { id: 'E', text: '1 2 1', isCodeFont: true }
      ],
      correctOptionId: 'B',
      explanation: '`total` is defined on the **class**, so there is exactly one copy shared by every instance. `self.id` is assigned inside `__init__`, so each instance gets its **own** copy.\nCreating `a` bumps `Counter.total` to 1 and stores `a.id = 1`. Creating `b` bumps it to 2 and stores `b.id = 2`. The class attribute keeps the latest value, 2.\nAnswer C is what you would see if `id` were also a class attribute.'
    },
    {
      id: 'rec_08',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Instance State Built in __init__',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Give the values of `name` and `tricks` **after line 10 has executed**.',
      codeSnippet: `1: class Dog:
2:     def __init__(self, name):
3:         self.name = name
4:         self.tricks = []
5:     def learn(self, t):
6:         self.tricks.append(t)
7: d = Dog('Rex')
8: d.learn('sit')
9: name = d.name
*10: tricks = d.tricks`,
      variablesToTrack: ['name', 'tricks'],
      targets: [
        { line: 10, vars: ['name', 'tricks'] }
      ],
      answers: {
        '10-name': "'Rex'",
        '10-tricks': "['sit']"
      },
      explanation: "Line 7 calls `__init__` with `self` bound to the new object and `name` bound to `'Rex'`, storing both attributes on the instance.\nLine 8 calls `learn`; Python passes the instance as `self` automatically, so `'sit'` is appended to **that object's** `tricks` list.\nLines 9 and 10 just read the attributes back out, giving `'Rex'` and `['sit']`."
    },
    {
      id: 'rec_09',
      topicId: '07_recursion_oop',
      topicTitle: 'Recursion & Advanced Control Flow',
      scope: 'final',
      title: 'Storing a Parameter on the Instance',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] so the script prints `Mai True`. The method `passed()` already reads `self.score`.',
      codeSnippet: `class Student:
    def __init__(self, name, score):
        self.name = name
        ___1___ = score

    def passed(self):
        return self.score >= 50

s = Student('Mai', 72)
print(s.name, s.passed())`,
      blanks: [
        { id: '1', label: 'Blank [1] (assignment target)', placeholder: 'e.g. self.score', hint: 'It has to survive after __init__ returns, so a plain local name will not do' }
      ],
      answers: {
        '1': 'self.score'
      },
      explanation: "Writing `score = score` would only create a local variable inside `__init__`, which disappears when the method returns — `passed()` would then fail with `AttributeError`.\nAssigning to `self.score` attaches the value to the **instance**, so any method can read it later through its own `self`."
    }
  ]
};
