import { Topic } from '../types';

export const conditionalsTopic: Topic = {
  id: '02_conditionals',
  title: 'Conditionals & Boolean Logic',
  scope: 'midterm',
  description: 'Master if-elif-else execution paths, nested conditionals, and short-circuit boolean logic.',
  iconName: 'GitFork',
  questions: [
    {
      id: 'cond_01',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Spy on Variable (Nested If-Else)',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Find the values of variables `a`, `b`, and `c` at lines 5, 8, and 12.',
      codeSnippet: `1: a = 8
2: b = "Low"
3: c = False
4: if a < 10:
*5:     a = a * 2
6: if a > 15:
7:     b = "High"
*8:     c = True
9: else:
10:     b = "Mid"
11: if c:
*12:     a = a - 1`,
      variablesToTrack: ['a', 'b', 'c'],
      targets: [
        { line: 5, vars: ['a', 'b', 'c'] },
        { line: 8, vars: ['a', 'b', 'c'] },
        { line: 12, vars: ['a', 'b', 'c'] }
      ],
      answers: {
        '5-a': '16', '5-b': '"Low"', '5-c': 'False',
        '8-a': '16', '8-b': '"High"', '8-c': 'True',
        '12-a': '15', '12-b': '"High"', '12-c': 'True'
      },
      explanation: 'Line 4: `a < 10` (8 < 10) is True -> at line 5: `a` becomes 16.\nLine 6: `a > 15` (16 > 15) is True -> at line 8: `b` becomes "High", `c` becomes True.\nLine 11: `if c` (True) -> at line 12: `a` becomes 15.'
    },
    {
      id: 'cond_02',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Grade Classifier Completion',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blanks [1] and [2] to classify scores:\n- Score >= 80 -> "Excellent"\n- 50 <= Score < 80 -> "Pass"\n- Score < 50 -> "Fail"',
      codeSnippet: `if score ___1___ 50:
    if score ___2___ 80:
        result = "Excellent"
    else:
        result = "Pass"
else:
    result = "Fail"`,
      blanks: [
        { id: '1', label: 'Blank [1] (Condition for Passing)', placeholder: 'e.g. >=', hint: 'Check if score is at least 50' },
        { id: '2', label: 'Blank [2] (Condition for Excellence)', placeholder: 'e.g. >=', hint: 'Check if score is at least 80' }
      ],
      answers: {
        '1': '>=',
        '2': '>='
      },
      // QA-only: the snippet reads a `score` it never defines. Three probes, one per
      // branch, so that `>` cannot pass where `>=` is required (85 alone would accept both).
      verify: { probes: ['score = 85', 'score = 80', 'score = 50', 'score = 49'], prelude: 'score = 85', assert: "result == 'Excellent'" },
      explanation: 'Outer condition checks if score is `>= 50`. If true, inner condition checks if score is `>= 80` for "Excellent", otherwise "Pass". If `< 50`, it hits the outer else for "Fail".'
    },
    {
      id: 'cond_03',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Function Return Logic Evaluation',
      type: 'mcq',
      difficulty: 'medium',
      description: 'Which statement is correct regarding the function `func(x)`?',
      codeSnippet: `def func(x):
    if x < 0:
        return "negative"
    elif x == 0:
        return "zero"
    else:
        return "positive"`,
      options: [
        { id: 'A', text: 'This function causes a syntax error because it has multiple return statements.', isCodeFont: false },
        { id: 'B', text: 'Calling func(10) will raise a NameError.', isCodeFont: false },
        { id: 'C', text: 'x = func(10) executes without error and assigns "positive" to x.', isCodeFont: false },
        { id: 'D', text: 'print(func(10)) will display None.', isCodeFont: false },
        { id: 'E', text: 'None of the above statements are correct.', isCodeFont: false }
      ],
      correctOptionId: 'C',
      explanation: 'Python functions can have multiple `return` statements. When `func(10)` is called, `x > 0` hits the `else` branch, returning `"positive"`. Assigning `x = func(10)` sets `x` to `"positive"` cleanly without any error.'
    },
    {
      id: 'cond_04',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Short-Circuit Evaluation Tracing',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Give the values of `x`, `y` and `flag` **immediately before line 7 executes** — that is, at the moment control reaches the `else` branch.',
      codeSnippet: `1: x = 5
2: y = 0
3: flag = False
4: if y != 0 and x / y > 2:
5:     flag = True
6: else:
*7:     flag = (x > 3 or y > 5)`,
      variablesToTrack: ['x', 'y', 'flag'],
      targets: [
        { line: 7, vars: ['x', 'y', 'flag'] }
      ],
      answers: {
        '7-x': '5',
        '7-y': '0',
        '7-flag': 'False'
      },
      explanation: 'In line 4: `y != 0` (0 != 0) evaluates to `False`. Due to short-circuit evaluation of `and`, `x / y > 2` is never executed (avoiding ZeroDivisionError!). Execution jumps to the `else` branch, and just before line 7 runs `flag` is still `False` from line 3. (Line 7 then overwrites it with `True`.)'
    },
    {
      id: 'cond_05',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Chained Comparison Operators',
      type: 'mcq',
      difficulty: 'easy',
      description: 'What is the boolean result of `10 < x <= 20` when `x = 20`?',
      codeSnippet: `x = 20
result = 10 < x <= 20
print(result)`,
      options: [
        { id: 'A', text: 'True', isCodeFont: true },
        { id: 'B', text: 'False', isCodeFont: true },
        { id: 'C', text: 'SyntaxError: invalid comparison chaining', isCodeFont: false },
        { id: 'D', text: '20', isCodeFont: true },
        { id: 'E', text: 'None', isCodeFont: true }
      ],
      correctOptionId: 'A',
      explanation: 'Python supports chained comparisons: `10 < x <= 20` is equivalent to `(10 < x) and (x <= 20)`. With `x = 20`, both `10 < 20` (True) and `20 <= 20` (True) hold, returning `True`.'
    },
    {
      id: 'cond_06',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Leap Year Condition Completion',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] to check if a year is divisible by 4.',
      codeSnippet: `year = 2024
if year ___1___ 4 == 0:
    is_leap = True
else:
    is_leap = False`,
      blanks: [
        { id: '1', label: 'Blank [1] (Divisibility operator)', placeholder: 'e.g. %' }
      ],
      answers: {
        '1': '%'
      },
      explanation: 'The `%` operator returns remainder of division. `year % 4 == 0` checks if `year` is evenly divisible by 4.'
    },
    {
      id: 'cond_07',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Truthiness of Values',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What does this script print?',
      codeSnippet: `values = [0, '', [], '0', 3]
count = 0
for v in values:
    if v:
        count += 1
print(count)`,
      options: [
        { id: 'A', text: '5', isCodeFont: true },
        { id: 'B', text: '3', isCodeFont: true },
        { id: 'C', text: '2', isCodeFont: true },
        { id: 'D', text: '0', isCodeFont: true },
        { id: 'E', text: '1', isCodeFont: true }
      ],
      correctOptionId: 'C',
      explanation: "`if v:` tests the value's **truthiness**, not whether it exists.\nFalsy: `0`, `''` (empty string), `[]` (empty list).\nTruthy: `'0'` — a string containing the character zero is **not** empty, so it counts — and `3`.\nThat gives `2`. Answer B is the trap of thinking `'0'` is falsy like `0`."
    },
    {
      id: 'cond_08',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Identity (is) versus Equality (==)',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Give the value of `x`, `y` and `z` **after line 6 has executed**. Each line runs exactly once.',
      codeSnippet: `1: a = [1, 2]
2: b = [1, 2]
3: c = a
4: x = (a == b)
5: y = (a is b)
*6: z = (a is c)`,
      variablesToTrack: ['x', 'y', 'z'],
      targets: [
        { line: 6, vars: ['x', 'y', 'z'] }
      ],
      answers: {
        '6-x': 'True',
        '6-y': 'False',
        '6-z': 'True'
      },
      explanation: '`==` asks "do these hold the same contents?" — `a` and `b` both hold `[1, 2]`, so `x` is `True`.\n`is` asks "are these the same object in memory?" Lines 1 and 2 build **two separate lists** that merely look alike, so `y` is `False`.\nLine 3 does not copy anything; it makes `c` another name for the *same* list as `a`. So `z` is `True`.\nThis is why mutating through `c` would also change `a`.'
    },
    {
      id: 'cond_09',
      topicId: '02_conditionals',
      topicTitle: 'Conditionals & Boolean Logic',
      scope: 'midterm',
      title: 'Ordering an if/elif Chain',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] so `label` is:\n- `"Hot"` when `temp` is 30 or above\n- `"Warm"` when `temp` is 15 to 29\n- `"Cold"` below 15',
      codeSnippet: `if ___1___:
    label = 'Hot'
elif temp >= 15:
    label = 'Warm'
else:
    label = 'Cold'`,
      blanks: [
        { id: '1', label: 'Blank [1] (condition)', placeholder: 'e.g. temp >= 30', hint: 'This branch is tested first, so it must catch the highest range' }
      ],
      answers: {
        '1': 'temp >= 30'
      },
      // QA-only: `temp` comes from outside the snippet. One probe per branch, both
      // boundaries included, so `>` cannot pass where `>=` is required.
      verify: { probes: ['temp = 35', 'temp = 30', 'temp = 25', 'temp = 15', 'temp = 10'] },
      explanation: 'An `if`/`elif` chain stops at the **first** branch that is true, so the branches must be ordered from most restrictive to least.\nAt `temp = 30` the condition must already be true, which is why it is `>=` and not `>`. If the chain started with `temp >= 15`, every hot day would be labelled `"Warm"` and the `"Hot"` branch would be unreachable.'
    }
  ]
};
