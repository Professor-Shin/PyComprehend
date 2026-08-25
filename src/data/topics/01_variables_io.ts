import { Topic } from '../types';

export const variablesAndIoTopic: Topic = {
  id: '01_variables_io',
  title: 'Variables, Types & I/O',
  scope: 'midterm',
  description: 'Understand variable assignments, type conversions, string slicing, and basic input/output behavior.',
  iconName: 'Variable',
  questions: [
    {
      id: 'var_01',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'Variable Reassignment & String Multiplication',
      type: 'tracing',
      difficulty: 'easy',
      description: 'Trace the values of variables `x`, `y`, and `z` at line 5 and line 8.',
      codeSnippet: `1: x = 10
2: y = "20"
3: z = x * 2
4: x = int(y) + 5
*5: y = y * 2
6: z = z + x
7: x = x % 7
*8: y = y + "!"`,
      variablesToTrack: ['x', 'y', 'z'],
      targets: [
        { line: 5, vars: ['x', 'y', 'z'] },
        { line: 8, vars: ['x', 'y', 'z'] }
      ],
      answers: {
        '5-x': '25',
        '5-y': '"2020"',
        '5-z': '20',
        '8-x': '4',
        '8-y': '"2020!"',
        '8-z': '45'
      },
      explanation: 'At line 5: `x` was updated to `int("20") + 5 = 25`. `y` becomes `"20" * 2 = "2020"`. `z` is `10 * 2 = 20`.\nAt line 8: `z` is `20 + 25 = 45`, `x` is `25 % 7 = 4`, and `y` concatenates `"!"` becoming `"2020!"`.'
    },
    {
      id: 'var_02',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'String Slicing & Insertion',
      type: 'mcq',
      difficulty: 'medium',
      description: 'Which option produces the string `"2301170_compprog"` when given `s = "2301170compprog"`?',
      codeSnippet: `s = "2301170compprog"
# Goal: insert "_" between index 6 and 7 to produce "2301170_compprog"`,
      options: [
        { id: 'A', text: 's.insert(7, "_")', isCodeFont: true },
        { id: 'B', text: 's.split("_")', isCodeFont: true },
        { id: 'C', text: 's.join("_")', isCodeFont: true },
        { id: 'D', text: 's[:7] + "_" + s[7:]', isCodeFont: true },
        { id: 'E', text: 's.add(7, "_")', isCodeFont: true }
      ],
      correctOptionId: 'D',
      explanation: 'In Python, strings are immutable. Strings do not have `.insert()` or `.add()` methods. String slicing `s[:7]` takes `"2301170"` and `s[7:]` takes `"compprog"`, concatenating them with `"_"`.'
    },
    {
      id: 'var_03',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'Type Conversion Fill-in',
      type: 'completion',
      difficulty: 'easy',
      description: 'Complete the code so that user input `raw_input` is converted to an integer and checked if it is even.',
      codeSnippet: `raw_input = "42"
num = ___1___(raw_input)
is_even = (num ___2___ 2 == 0)`,
      blanks: [
        { id: '1', label: 'Blank [1] (Type cast function)', placeholder: 'e.g. int' },
        { id: '2', label: 'Blank [2] (Modulo operator)', placeholder: 'e.g. %' }
      ],
      answers: {
        '1': 'int',
        '2': '%'
      },
      explanation: '`int()` converts a numerical string to an integer. The modulo operator `%` calculates the remainder of division by 2.'
    },
    {
      id: 'var_04',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'Integer Division & Variable Swapping',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Trace variables `a` and `b` after integer division and tuple swapping at lines 4 and 6.',
      codeSnippet: `1: a = 17
2: b = 5
3: a = a // b
*4: b = a % b
5: a, b = b, a
*6: a = a + b * 2`,
      variablesToTrack: ['a', 'b'],
      targets: [
        { line: 4, vars: ['a', 'b'] },
        { line: 6, vars: ['a', 'b'] }
      ],
      answers: {
        '4-a': '3',
        '4-b': '3',
        '6-a': '9',
        '6-b': '3'
      },
      explanation: 'Line 3: `a = 17 // 5 = 3`.\nLine 4: `b = 3 % 5 = 3`. So at line 4, `a=3, b=3`.\nLine 5: `a, b = b, a` swaps `a` and `b` (both stay 3).\nLine 6: `a = 3 + 3*2 = 9` while `b=3`.'
    },
    {
      id: 'var_05',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'String Length & Index Bounds',
      type: 'mcq',
      difficulty: 'easy',
      description: 'What is the output of `print(s[-1], len(s))` for `s = "Python3"`?',
      codeSnippet: `s = "Python3"
print(s[-1], len(s))`,
      options: [
        { id: 'A', text: '3 7', isCodeFont: true },
        { id: 'B', text: 'P 7', isCodeFont: true },
        { id: 'C', text: '3 6', isCodeFont: true },
        { id: 'D', text: 'IndexError: string index out of range', isCodeFont: false },
        { id: 'E', text: 'None of the above', isCodeFont: false }
      ],
      correctOptionId: 'A',
      explanation: '`s[-1]` accesses the last character of `"Python3"`, which is `"3"`. `len("Python3")` counts 7 characters. So the output is `3 7`.'
    },
    {
      id: 'var_06',
      topicId: '01_variables_io',
      topicTitle: 'Variables, Types & I/O',
      scope: 'midterm',
      title: 'String Formatting Completion',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] so that `greeting` becomes `"Hello Shin, score: 95.0"`.',
      codeSnippet: `name = "Shin"
score = 95.0
greeting = f"Hello ___1___, score: {score}"`,
      blanks: [
        { id: '1', label: 'Blank [1] (f-string variable interpolation)', placeholder: 'e.g. {name}' }
      ],
      answers: {
        '1': '{name}'
      },
      explanation: 'Inside f-strings, variable interpolation uses curly braces `{variable_name}` to inject values into the formatted string.'
    }
  ]
};
