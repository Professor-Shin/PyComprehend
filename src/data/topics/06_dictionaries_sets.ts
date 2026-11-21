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
        { id: '1', label: 'Blank [1] (Dict comprehension)', placeholder: 'e.g. {k: v[0] for k, v in info.items()}' }
      ],
      answers: {
        '1': '{k: v[0] for k, v in info.items()}'
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
      codeSnippet: '# Evaluating tuple literal definitions:',
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
      title: 'Deleting Dictionary Key Completion',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] to delete key `2301170` from dictionary `regist`.',
      codeSnippet: `regist = {2301170: 3, 2301172: 1, 2301117: 4}
___1___ regist[2301170]`,
      blanks: [
        { id: '1', label: 'Blank [1] (Deletion keyword)', placeholder: 'e.g. del' }
      ],
      answers: {
        '1': 'del'
      },
      explanation: 'The `del` statement in Python deletes references, list elements, or dictionary key-value pairs (e.g. `del regist[2301170]`).'
    },
    {
      id: 'dict_07',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'get() with a Default versus Square Brackets',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What does this script print?',
      codeSnippet: `stock = {'pen': 3}
print(stock.get('pen', 0) + stock.get('book', 0))`,
      options: [
        { id: 'A', text: '3', isCodeFont: true },
        { id: 'B', text: '0', isCodeFont: true },
        { id: 'C', text: "KeyError: 'book'", isCodeFont: false },
        { id: 'D', text: 'TypeError: unsupported operand type(s) for +', isCodeFont: false },
        { id: 'E', text: 'None', isCodeFont: true }
      ],
      correctOptionId: 'A',
      explanation: "`.get(key, default)` returns the default instead of raising when the key is absent. `'pen'` is present so the first call gives `3`; `'book'` is missing so the second gives the supplied default `0`. The sum is `3`.\nWriting `stock['book']` instead would raise `KeyError` (answer C), and `.get('book')` **without** a default would return `None`, making the addition fail with a `TypeError` (answer D)."
    },
    {
      id: 'dict_08',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Set Union, Intersection & Difference',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Give the values of `u`, `i` and `d` **after line 5 has executed**. Write sets the way Python displays them, e.g. `{1, 2}`.',
      codeSnippet: `1: a = {1, 2, 3}
2: b = {3, 4}
3: u = a | b
4: i = a & b
*5: d = a - b`,
      variablesToTrack: ['u', 'i', 'd'],
      targets: [
        { line: 5, vars: ['u', 'i', 'd'] }
      ],
      answers: {
        '5-u': '{1, 2, 3, 4}',
        '5-i': '{3}',
        '5-d': '{1, 2}'
      },
      explanation: '`|` is **union** — every element in either set, with duplicates collapsed, so the shared `3` appears once.\n`&` is **intersection** — only elements in both, which is just `{3}`.\n`-` is **difference** — elements of `a` that are not in `b`, so `3` is removed and `{1, 2}` remains. Note that `b - a` would instead give `{4}`; difference is not symmetric.'
    },
    {
      id: 'dict_09',
      topicId: '06_dictionaries_sets',
      topicTitle: 'Dictionaries, Sets & Tuples',
      scope: 'final',
      title: 'Counting Characters with a Dictionary',
      type: 'completion',
      difficulty: 'medium',
      description: "Fill in blank [1] so the program counts each character and prints `{'b': 1, 'a': 3, 'n': 2}`.",
      codeSnippet: `text = 'banana'
counts = {}
for ch in text:
    counts[ch] = ___1___
print(counts)`,
      blanks: [
        { id: '1', label: 'Blank [1] (expression)', placeholder: 'e.g. counts.get(ch, 0) + 1', hint: 'The first time a character appears it has no entry yet' }
      ],
      answers: {
        '1': 'counts.get(ch, 0) + 1'
      },
      explanation: "`counts` starts empty, so the first time a character is seen there is no entry to read. `counts[ch] + 1` would raise `KeyError` on that first occurrence.\n`counts.get(ch, 0)` returns the running count if present and `0` if not, so `+ 1` works on both the first and later occurrences.\nThe printed order is insertion order — `b`, `a`, `n` — because Python 3.7+ dictionaries preserve it."
    }
  ]
};
