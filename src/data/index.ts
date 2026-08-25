import { Topic, Question, ExamScope } from './types';
import { variablesAndIoTopic } from './topics/01_variables_io';
import { conditionalsTopic } from './topics/02_conditionals';
import { loopsTopic } from './topics/03_loops';
import { functionsTopic } from './topics/04_functions';
import { listsStringsTopic } from './topics/05_lists_strings';
import { dictionariesSetsTopic } from './topics/06_dictionaries_sets';
import { recursionOopTopic } from './topics/07_recursion_oop';

export const ALL_TOPICS: Topic[] = [
  variablesAndIoTopic,
  conditionalsTopic,
  loopsTopic,
  functionsTopic,
  listsStringsTopic,
  dictionariesSetsTopic,
  recursionOopTopic,
];

export function getTopicsByScope(scope: 'all' | ExamScope): Topic[] {
  if (scope === 'all') return ALL_TOPICS;
  return ALL_TOPICS.filter((t) => t.scope === scope);
}

export function getAllQuestions(): Question[] {
  return ALL_TOPICS.flatMap((t) => t.questions);
}

export function getQuestionsByScope(scope: 'all' | ExamScope): Question[] {
  const topics = getTopicsByScope(scope);
  return topics.flatMap((t) => t.questions);
}
