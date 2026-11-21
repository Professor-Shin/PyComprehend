import { Topic } from '../types';

export const loopsTopic: Topic = {
  id: '03_loops',
  title: 'Loops & Iteration',
  scope: 'midterm',
  description: 'Practice range parameters, loop variable mutation, nested loops, break/continue statements, and accumulators.',
  iconName: 'Repeat',
  questions: [
    {
      id: 'loop_01',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Reverse Range Step Filling',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] so that the loop concatenates every second character from the list in reverse order, resulting in output `"4321"`.',
      codeSnippet: `output = ''
text = 'a 1 b 2 c 3 d 4'.split()
# text = ['a', '1', 'b', '2', 'c', '3', 'd', '4']
for x in ___1___:
    output = output + text[x]
print(output)`,
      blanks: [
        { id: '1', label: 'Blank [1] (range expression)', placeholder: 'e.g. range(len(text)-1, -1, -2)', hint: 'Start from last index, go down to 0 step -2' }
      ],
      answers: {
        '1': 'range(len(text)-1, -1, -2)'
      },
      explanation: '`text` has 8 elements at indices 0..7. Index 7 is `"4"`, index 5 is `"3"`, index 3 is `"2"`, index 1 is `"1"`. To iterate indices `7, 5, 3, 1`, we use `range(len(text)-1, -1, -2)`.'
    },
    {
      id: 'loop_02',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Spy on Loop Variables',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Line 4 runs more than once. Give the values of `total` and `i` **the first time line 4 completes**.',
      codeSnippet: `1: total = 0
2: for i in range(1, 6):
3:     if i % 2 == 0:
*4:         total += i * 10
5:     else:
6:         total += i`,
      variablesToTrack: ['total', 'i'],
      targets: [
        { line: 4, vars: ['total', 'i'] }
      ],
      answers: {
        '4-total': '21',
        '4-i': '2'
      },
      explanation: 'Line 2 loops `i` over 1, 2, 3, 4, 5.\nWhen i=1 (odd): total = 0 + 1 = 1.\nWhen i=2 (even): at line 4, total becomes 1 + (2*10) = 21, and i=2.'
    },
    {
      id: 'loop_03',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Break & String Character Index Search',
      type: 'completion',
      difficulty: 'medium',
      description: 'Fill in blank [1] to find the index of the **first** occurrence of character `"a"` in user input text.',
      codeSnippet: `text = input('Enter text: ') # e.g. "Love is all around"
for i in range(len(text)):
    if ___1___:
        print(i)
        break`,
      blanks: [
        { id: '1', label: 'Blank [1] (Condition to match "a")', placeholder: 'e.g. text[i] == "a"' }
      ],
      answers: {
        '1': "text[i] == 'a'"
      },
      // QA-only: the snippet calls input(); 'Love is all around' has its first 'a' at index 8.
      verify: { stdin: ['Love is all around'], expectedStdout: "Enter text: Love is all around\n8\n" },
      explanation: '`text[i]` accesses character at index `i`. Comparing `text[i] == "a"` checks if the character matches `"a"`. `break` stops the loop immediately after the first match.'
    },
    {
      id: 'loop_04',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Nested Loop Accumulator Tracing',
      type: 'tracing',
      difficulty: 'hard',
      description: 'Line 5 runs on every pass of the inner loop. Give the values of `count` and `j` **the last time line 5 runs**.',
      codeSnippet: `1: count = 0
2: for i in range(3):
3:     for j in range(i + 1):
4:         count += 1
*5:         pass`,
      variablesToTrack: ['count', 'j'],
      targets: [
        { line: 5, vars: ['count', 'j'] }
      ],
      answers: {
        '5-count': '6',
        '5-j': '2'
      },
      explanation: '`i=0`: `j` loops in `range(1)` -> `j=0`, `count=1`.\n`i=1`: `j` loops in `range(2)` -> `j=0` (`count=2`), `j=1` (`count=3`).\n`i=2`: `j` loops in `range(3)` -> `j=0` (`count=4`), `j=1` (`count=5`), `j=2` (`count=6`). At final step, `count=6, j=2`.'
    },
    {
      id: 'loop_05',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'While Loop Continue Skip Logic',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What is printed by this `while` loop script?',
      codeSnippet: `x = 0
s = 0
while x < 5:
    x += 1
    if x % 2 == 0:
        continue
    s += x
print(s)`,
      options: [
        { id: 'A', text: '9', isCodeFont: true },
        { id: 'B', text: '15', isCodeFont: true },
        { id: 'C', text: '6', isCodeFont: true },
        { id: 'D', text: 'Infinite Loop', isCodeFont: false },
        { id: 'E', text: '0', isCodeFont: true }
      ],
      correctOptionId: 'A',
      explanation: '`x` iterates 1, 2, 3, 4, 5.\nEven values `x=2, 4` hit `continue` and skip addition.\nOdd values `x=1, 3, 5` accumulate into `s`: `1 + 3 + 5 = 9`.'
    },
    {
      id: 'loop_06',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Sum of Evens Range Completion',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] to sum all even numbers from 2 up to 10 inclusive.',
      codeSnippet: `total = 0
for n in ___1___:
    total += n
print(total)`,
      blanks: [
        { id: '1', label: 'Blank [1] (range expression)', placeholder: 'e.g. range(2, 11, 2)' }
      ],
      answers: {
        '1': 'range(2, 11, 2)'
      },
      explanation: '`range(2, 11, 2)` generates values `2, 4, 6, 8, 10`. Note that the end parameter `11` is exclusive, stopping at 10.'
    },
    {
      id: 'loop_07',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Enumerate with an Index Filter',
      type: 'tracing',
      difficulty: 'medium',
      description: 'Line 5 runs more than once. Give the values **the last time line 5 executes**.',
      codeSnippet: `1: items = ['a', 'b', 'c']
2: out = ''
3: for i, ch in enumerate(items):
4:     if i % 2 == 0:
*5:         out = out + ch
6: print(out)`,
      variablesToTrack: ['i', 'ch', 'out'],
      targets: [
        { line: 5, vars: ['i', 'ch', 'out'] }
      ],
      answers: {
        '5-i': '2',
        '5-ch': "'c'",
        '5-out': "'ac'"
      },
      explanation: "`enumerate` yields `(index, value)` pairs, so `i` counts 0, 1, 2 while `ch` walks `'a'`, `'b'`, `'c'`.\nLine 5 only runs when `i` is even: at `i=0` (`out` becomes `'a'`) and at `i=2` (`out` becomes `'ac'`). `i=1` is skipped.\nThe last run is therefore `i=2`, `ch='c'`, `out='ac'`."
    },
    {
      id: 'loop_08',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Counting Down in a While Loop',
      type: 'mcq',
      difficulty: 'medium',
      description: 'What does this script print?',
      codeSnippet: `n = 4
s = ''
while n > 0:
    s = s + str(n)
    n -= 1
print(s)`,
      options: [
        { id: 'A', text: '4321', isCodeFont: true },
        { id: 'B', text: '1234', isCodeFont: true },
        { id: 'C', text: '43210', isCodeFont: true },
        { id: 'D', text: '10', isCodeFont: true },
        { id: 'E', text: 'Infinite Loop', isCodeFont: false }
      ],
      correctOptionId: 'A',
      explanation: "The loop appends `n` and then decrements it: `'4'`, `'41'`… giving `'4321'`.\nThe condition is `n > 0`, so the loop stops as soon as `n` reaches 0 — `0` is never appended, which rules out C.\nE would be correct only if `n -= 1` were missing; because `n` shrinks every pass, the loop is guaranteed to end."
    },
    {
      id: 'loop_09',
      topicId: '03_loops',
      topicTitle: 'Loops & Iteration',
      scope: 'midterm',
      title: 'Printing a Growing Triangle',
      type: 'completion',
      difficulty: 'easy',
      description: 'Fill in blank [1] so the loop prints a triangle that grows by one `#` per row — three lines reading `#`, `##`, then `###`.',
      codeSnippet: `rows = 3
for i in range(1, rows + 1):
    print(___1___)`,
      blanks: [
        { id: '1', label: 'Blank [1] (expression to print)', placeholder: "e.g. '#' * i", hint: 'Row i should contain exactly i characters' }
      ],
      answers: {
        '1': "'#' * i"
      },
      explanation: "`range(1, rows + 1)` makes `i` take the values 1, 2, 3 — starting at 1 rather than 0, so `i` is directly the number of characters the row needs.\n`'#' * i` repeats the character that many times. Using `range(rows)` instead would give `i` values 0, 1, 2 and print an empty first row."
    }
  ]
};
