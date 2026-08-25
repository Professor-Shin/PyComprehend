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
        '1': 'range(len(text)-1,-1,-2)'
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
      description: 'Trace variables `total` and `i` at line 4 during iteration.',
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
      description: 'Trace variables `count` and `j` at line 5.',
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
        '1': 'range(2,11,2)'
      },
      explanation: '`range(2, 11, 2)` generates values `2, 4, 6, 8, 10`. Note that the end parameter `11` is exclusive, stopping at 10.'
    }
  ]
};
