/**
 * Normalizes Python string or literal inputs for exact evaluation.
 * Strips outer whitespace and normalizes single quotes to double quotes
 * so that both 'abc' and "abc" represent the Python string "abc",
 * while strictly preserving quotes (strings vs integers) and case sensitivity.
 */
export function normalizeUserAnswer(rawVal: string | number): string {
  if (rawVal === undefined || rawVal === null) return '';
  const str = rawVal.toString().trim();
  
  // Normalize single quotes to double quotes for Python string literals
  return str.replace(/'/g, '"');
}

export function isAnswerCorrect(
  userAns: string | number | undefined,
  expectedAns: string | number
): boolean {
  if (userAns === undefined || userAns === null) return false;
  const userStr = userAns.toString().trim();
  if (userStr === '') return false;
  
  const normUser = normalizeUserAnswer(userAns);
  const normExp = normalizeUserAnswer(expectedAns);
  
  // Strict 100% exact match (case-sensitive and quote-sensitive)
  return normUser === normExp;
}
