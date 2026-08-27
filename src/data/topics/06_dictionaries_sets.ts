import { Topic } from '../types';

export const dictionariesSetsTopic: Topic = {
  id: '06_dictionaries_sets',
  title: 'Dictionaries, Sets & Tuples',
  scope: 'final',
  description: 'Understand dictionary key-value updates, immutability of dictionary keys, tuple unpacking, and dictionary comprehensions.',
  iconName: 'Database',
  questions: [
    {
      id: 'dict_01',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Dictionary `.update()` Behavior',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What is the content of `d1` after `d1.update(d2)` is executed?',
      codeSnippet: `d1 = {}
d1['one'] = 1
d1['two'] = 2
d2 = {'one': 'I', 'three': 'III', 'four': 'IV'}
d1.update(d2)
print(d1)`,
      options: [
        { id: 'A', text: "{'one': 1, 'two': 2, 'three': 'III', 'four': 'IV'}", isCodeFont: true },
        { id: 'B', text: "{'one': 1, 'one': 'I', 'two': 2, 'three': 'III', 'four': 'IV'}", isCodeFont: true },
        { id: 'C', text: "{'one': 'I', 'two': 2, 'three': 'III', 'four': 'IV'}", isCodeFont: true },
        { id: 'D', text: "{'one': 'I', 'two': 2}", isCodeFont: true },
        { id: 'E', text: 'TypeError: duplicate key error', isCodeFont: false }
      ],
      correctOptionId: 'C',
      explanation: "dict.update(other) overwrites values for matching keys and adds new key-value pairs from other. Key 'one' is overwritten from 1 to 'I', while 'three' and 'four' are added."
    },
    {
      id: 'dict_02',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Unhashable Key Error in Dictionaries',
      type: 'mcq',
      difficulty: 'hard',
      description: 'Which option causes a `TypeError: unhashable type` when attempting to set a dictionary key?',
      codeSnippet: `D = {}
# Attempting to assign keys...`,
      options: [
        { id: 'A', text: 'D[1] = 7.5', isCodeFont: true },
        { id: 'B', text: 'D[7.5] = (1, 2, 3)', isCodeFont: true },
        { id: 'C', text: 'D[(3, 5)] = 7', isCodeFont: true },
        { id: 'D', text: 'D[[3, 5]] = 7', isCodeFont: true },
        { id: 'E', text: 'None of the above cause an Error', isCodeFont: false }
      ],
      correctOptionId: 'D',
      explanation: 'Dictionary keys in Python must be immutable (hashable). Int, Float, and Tuple `(3, 5)` are immutable and valid keys. However, List `[3, 5]` is mutable, causing `TypeError: unhashable type: "list"`.'
    },
    {
      id: 'dict_03',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Dictionary Comprehension Extraction',
      type: 'completion',
      difficulty: 'medium',
      description: 'Complete the dict comprehension in blank [1] to extract course code as key and course name (first element of value tuple) as value:\nDesired result: `{"2301170": "Comp prog", "2301172": "Comp prog lab", "2301260": "Prog tech"}`',
      codeSnippet: `info = {
    '2301170': ('Comp prog', 3),
    '2301172': ('Comp prog lab', 1),
    '2301260': ('Prog tech', 4)
}
result = ___1___`,
      blanks: [
        { id: '1', label: 'Blank [1] (Dict comprehension)', placeholder: 'Type the full dict comprehension', hint: 'Use {k: ... for k, v in info.items()} — how do you get the course name from tuple v?' }
      ],
      answers: {
        '1': '{k:v[0] for k,v in info.items()}'
      },
      explanation: 'Iterating `info.items()` yields `(k, v)` where `k` is the course code and `v` is a tuple like `("Comp prog", 3)`. Accessing `v[0]` extracts the course name string.'
    },
    {
      id: 'dict_04',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Dictionary Value Accumulator Loop',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Trace variable `total` at line 5.',
      codeSnippet: `1: sports = {'Football': 11, 'Basketball': 5, 'Tennis': 2}
2: total = 0
3: for s, count in sports.items():
4:     total += count
*5: print(total)`,
      variablesToTrack: ['total'],
      targets: [
        { line: 5, vars: ['total'] }
      ],
      answers: {
        '5-total': '18'
      },
      explanation: '`sports.items()` iterates key-value pairs `("Football", 11)`, `("Basketball", 5)`, `("Tennis", 2)`. `total = 11 + 5 + 2 = 18`.'
    },
    {
      id: 'dict_05',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Tuple Single-Element Syntax',
      type: 'mcq',
      difficulty: 'easy',
      description: 'Which option is **NOT** a tuple in Python?',
      codeSnippet: '// Evaluating tuple literal definitions:',
      options: [
        { id: 'A', text: '(3, 4)', isCodeFont: true },
        { id: 'B', text: '3, 4', isCodeFont: true },
        { id: 'C', text: '(3,)', isCodeFont: true },
        { id: 'D', text: '(3)', isCodeFont: true },
        { id: 'E', text: 'All options are valid tuples', isCodeFont: false }
      ],
      correctOptionId: 'D',
      explanation: 'In Python, a single value inside parentheses `(3)` is just an integer in parentheses. To make a single-element tuple, a trailing comma is required `(3,)`. So option D is an integer, not a tuple.'
    },
    {
      id: 'dict_06',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Safe Dictionary Access Completion',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blanks [1] and [2]:\n- Blank [1]: safely get key `"grade"` from `student` dict, returning `"N/A"` if missing\n- Blank [2]: write the condition to check if key `"score"` exists in `student`',
      codeSnippet: `student = {'name': 'Shin', 'score': 88}
grade = student.___1___('grade', 'N/A')
if ___2___:
    print("Score:", student['score'])`,
      blanks: [
        { id: '1', label: 'Blank [1] (Safe dict access method)', placeholder: 'Type the method name', hint: 'Which dict method retrieves a value safely with a default if key is missing?' },
        { id: '2', label: 'Blank [2] (Key existence check)', placeholder: 'Type the condition here', hint: 'How do you check whether a key exists inside a dictionary?' }
      ],
      answers: {
        '1': 'get',
        '2': '"score" in student'
      },
      explanation: '`dict.get(key, default)` returns the value for `key` if it exists, otherwise returns `default` (no KeyError). The `in` operator checks for key membership: `"score" in student` returns `True` if `"score"` is a key in the dictionary.'
    }
  ]
};
