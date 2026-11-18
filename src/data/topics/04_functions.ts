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
      title: 'Default Parameter Completion',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] to set a default value of 1 for argument `step`.',
      codeSnippet: `def increment(value, step ___1___ 1):
    return value + step`,
      blanks: [
        { id: '1', label: 'Blank [1] (Default parameter assignment)', placeholder: 'e.g. =' }
      ],
      answers: {
        '1': '='
      },
      // QA-only: the snippet only defines `increment`, so it must be called for
      // execution to tell a right answer from a wrong one.
      verify: { postlude: 'print(increment(5), increment(5, 3))' },
      explanation: 'In Python function signatures, default parameter values are defined using the `=` sign (e.g., `step = 1`).'
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
    },
    {
      id: 'func_07',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Mutable Default Argument',
      type: 'mcq',
      difficulty: 'hard',
      description: 'What does this script print?',
      codeSnippet: `def add_item(item, bag=[]):
    bag.append(item)
    return bag

print(add_item('a'))
print(add_item('b'))`,
      options: [
        { id: 'A', text: "['a'] then ['b']", isCodeFont: true },
        { id: 'B', text: "['a'] then ['a', 'b']", isCodeFont: true },
        { id: 'C', text: "['a', 'b'] then ['a', 'b']", isCodeFont: true },
        { id: 'D', text: "['a'] then ['a']", isCodeFont: true },
        { id: 'E', text: 'TypeError: mutable default argument', isCodeFont: false }
      ],
      correctOptionId: 'B',
      explanation: "A default argument is evaluated **once**, when the `def` statement runs — not on each call. So every call that omits `bag` shares the *same* list object.\nThe first call appends to the empty list and prints `['a']`. The second call appends to that same, now non-empty list and prints `['a', 'b']`.\nAnswer A is what most people expect, and what you get by writing `bag=None` and creating a fresh list inside the function."
    },
    {
      id: 'func_08',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Mutating an Argument versus Rebinding It',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Give the values of `data` and `result` **after line 7 has executed**.',
      codeSnippet: `1: def grow(lst, n):
2:     lst.append(n)
3:     n = n + 100
4:     return n
5: data = [1]
6: result = grow(data, 5)
*7: print(data, result)`,
      variablesToTrack: ['data', 'result'],
      targets: [
        { line: 7, vars: ['data', 'result'] }
      ],
      answers: {
        '7-data': '[1, 5]',
        '7-result': '105'
      },
      explanation: 'Both parameters receive a reference to the caller’s object, but the two lines do different things.\nLine 2 **mutates** the list that `lst` and `data` both point at, so the caller sees `[1, 5]`.\nLine 3 **rebinds** the local name `n` to a new int. Ints are immutable and rebinding a local never touches the caller, so the `5` passed in is unaffected — the only way the new value escapes is the `return` on line 4.'
    },
    {
      id: 'func_09',
      topicId: '04_functions',
      topicTitle: 'Functions & Scope',
      scope: 'final',
      title: 'Returning a Computed Value',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] so `area(3, 4)` prints `12`.',
      codeSnippet: `def area(width, height):
    return ___1___

print(area(3, 4))`,
      blanks: [
        { id: '1', label: 'Blank [1] (expression to return)', placeholder: 'e.g. width * height', hint: 'Use the parameter names, not the numbers 3 and 4' }
      ],
      answers: {
        '1': 'width * height'
      },
      explanation: 'The function must work for any arguments, so the body uses the **parameter names**. When called as `area(3, 4)`, `width` is bound to `3` and `height` to `4`, and `return` hands `12` back to `print`.\nWriting `3 * 4` would also print `12` here but would return `12` for every call, which defeats the purpose of the parameters.'
    }
  ]
};
