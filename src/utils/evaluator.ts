/**
 * Normalizes Python string or literal inputs for fair evaluation.
 * Strips outer whitespace, normalizes single quotes to double quotes,
 * and handles string representations of numbers.
 */
export function normalizeUserAnswer(rawVal: string | number): string {
  if (rawVal === undefined || rawVal === null) return '';
  const str = rawVal.toString().trim();
  
  // Normalize single quotes to double quotes for Python string comparison
  return str.replace(/'/g, '"').toLowerCase();
}

export function isAnswerCorrect(
  userAns: string | number | undefined,
  expectedAns: string | number
): boolean {
  if (userAns === undefined || userAns === '') return false;
  
  const normUser = normalizeUserAnswer(userAns);
  const normExp = normalizeUserAnswer(expectedAns);
  
  // Exact match after quote/whitespace normalization
  if (normUser === normExp) return true;
  
  // Strip quotes altogether if user entered value without quotes when expected string, or vice versa
  const unquotedUser = normUser.replace(/^"+|"+$/g, '');
  const unquotedExp = normExp.replace(/^"+|"+$/g, '');
  
  return unquotedUser === unquotedExp;
}
