import { Topic } from '../types';

export const functionsTopic: Topic = {
  id: '04_functions',
  title: 'Functions & Scope',
  scope: 'final',
  description: 'Understand scope rules (local vs global), parameter passing, multiple return values, and function call output prediction.',
  iconName: 'Box',
  questions: [
    {
      id: 'func_01',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Global vs Local Variable Tracing',
      type: 'mcq',
      difficulty: 'hard',
      description: 'What will be printed when `main()` is executed?',
      codeSnippet: `y = 10

def a():
    global y
    y = y + 5

def b(x, y):
    y = x + y

def main():
    a()
    b(3, 2)
    print(y)

main()`,
      options: [
        { id: 'A', text: '5', isCodeFont: true },
        { id: 'B', text: '10', isCodeFont: true },
        { id: 'C', text: '15', isCodeFont: true },
        { id: 'D', text: '20', isCodeFont: true },
        { id: 'E', text: 'Raises UnboundLocalError', isCodeFont: false }
      ],
      correctOptionId: 'C',
      explanation: 'Initial global `y = 10`.\nFunction `a()` uses `global y` and modifies global `y = 10 + 5 = 15`.\nFunction `b(3, 2)` receives `x=3, y=2` as local parameters. Its assignment `y = x + y` (5) only affects local `y` inside `b`.\nTherefore, `print(y)` in `main()` prints the global `y`, which is 15.'
    },
    {
      id: 'func_02',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Multiple Return Values & Tuples',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What is the printed output of this script?',
      codeSnippet: `def calculation(a, b):
    return a + b, a - b

res = calculation(40, 10)
print(res)`,
      options: [
        { id: 'A', text: '(50, 30)', isCodeFont: true },
        { id: 'B', text: '[50, 30]', isCodeFont: true },
        { id: 'C', text: '{50, 30}', isCodeFont: true },
        { id: 'D', text: 'Error because a function can only return a single value', isCodeFont: false },
        { id: 'E', text: 'None of the above', isCodeFont: false }
      ],
      correctOptionId: 'A',
      explanation: 'Returning multiple comma-separated values in Python implicitly packs them into a `tuple`. Thus `calculation(40, 10)` returns `(50, 30)`.'
    },
    {
      id: 'func_03',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Spot the Invalid Call Error',
      type: 'mcq',
      difficulty: 'medium',
      description: 'Which function call or expression will result in a TypeError or AttributeError?',
      codeSnippet: `def funny(num1, num2):
    result = (num1 * num2) // 100
    return result`,
      options: [
        { id: 'A', text: 'x = list([funny(1, 2)])', isCodeFont: true },
        { id: 'B', text: 'x = print(funny(1, 2))', isCodeFont: true },
        { id: 'C', text: 'len(funny(23, 1))', isCodeFont: true },
        { id: 'D', text: 'print(funny(1, 2, 3))', isCodeFont: true },
        { id: 'E', text: 'Both C and D cause an Error', isCodeFont: false }
      ],
      correctOptionId: 'E',
      explanation: 'In C: `funny(23, 1)` returns an integer `0`. Calling `len(0)` causes `TypeError: object of type "int" has no len()`.\nIn D: `funny` accepts 2 positional arguments, but 3 were given -> `TypeError: funny() takes 2 positional arguments but 3 were given`.\nTherefore, both C and D cause an Error (Option E).'
    },
    {
      id: 'func_04',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Function Parameter Masking Tracing',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Trace global `x` and function execution result at line 7.',
      codeSnippet: `1: x = 10
2: def f(x):
3:     x = x * 2
4:     return x
5: 
6: y = f(x)
*7: print(x, y)`,
      variablesToTrack: ['x', 'y'],
      targets: [
        { line: 7, vars: ['x', 'y'] }
      ],
      answers: {
        '7-x': '10',
        '7-y': '20'
      },
      explanation: 'Passing `x=10` into `f(x)` binds `10` to local parameter `x`. Inside `f`, `x` becomes `20` and returns `20`. The global `x` remains `10`. So `print(x, y)` outputs `10 20`.'
    },
    {
      id: 'func_05',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Default Parameter & Guard Clause Completion',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blanks [1] and [2]:\n- Blank [1]: set the default value of `step` to 1\n- Blank [2]: write the return guard to prevent division by zero',
      codeSnippet: `def safe_divide(value, step ___1___ 1):
    if step ___2___:
        return None
    return value / step`,
      blanks: [
        { id: '1', label: 'Blank [1] (Default parameter syntax)', placeholder: 'Type the assignment for the default', hint: 'Default parameters use an assignment-like syntax after the parameter name' },
        { id: '2', label: 'Blank [2] (Guard condition for division by zero)', placeholder: 'Type the condition here', hint: 'What value of step would cause division by zero?' }
      ],
      answers: {
        '1': '= 1',
        '2': '== 0'
      },
      explanation: 'In Python function signatures, default parameter values use `=` (e.g., `step = 1`).\nThe guard clause `if step == 0: return None` prevents `ZeroDivisionError` when `step` is zero.'
    },
    {
      id: 'func_06',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Chained Function Call Output',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What is printed by `print(a(x))` when `x = 10`?',
      codeSnippet: `def a(x):
    x = 5
    return b(x) * 2

def b(x):
    return x ** 2

x = 10
print(a(x))`,
      options: [
        { id: 'A', text: '50', isCodeFont: true },
        { id: 'B', text: '200', isCodeFont: true },
        { id: 'C', text: '100', isCodeFont: true },
        { id: 'D', text: '25', isCodeFont: true },
        { id: 'E', text: 'TypeError', isCodeFont: false }
      ],
      correctOptionId: 'A',
      explanation: 'When `a(x)` is called, inside `a`: `x` is set to `5`. Then `b(5)` is called, returning `5 ** 2 = 25`. Then `a` returns `25 * 2 = 50`. Thus `print(a(x))` outputs `50`.'
    }
  ]
};
