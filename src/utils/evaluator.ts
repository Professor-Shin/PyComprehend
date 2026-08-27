/**
 * Normalizes Python literal inputs for fair evaluation.
 * Strips outer whitespace and normalizes single quotes to double quotes.
 * Does NOT strip quotes to avoid false-positives (e.g. 2020 != "2020").
 */
export function normalizeUserAnswer(rawVal: string | number): string {
  if (rawVal === undefined || rawVal === null) return '';
  const str = rawVal.toString().trim();
  // Normalize single quotes → double quotes for Python string comparison
  return str.replace(/'/g, '"');
}

/**
 * Checks whether expected answer is a quoted string literal.
 */
function isQuotedString(val: string): boolean {
  return (val.startsWith('"') && val.endsWith('"')) && val.length >= 2;
}

export function isAnswerCorrect(
  userAns: string | number | undefined,
  expectedAns: string | number
): boolean {
  if (userAns === undefined || userAns === '') return false;

  const normUser = normalizeUserAnswer(userAns);
  const normExp = normalizeUserAnswer(expectedAns);

  // Case-insensitive exact match (handles True/False, None, etc.)
  if (normUser.toLowerCase() === normExp.toLowerCase()) return true;

  // If the expected answer is a quoted string, the user MUST include quotes.
  // Do NOT strip quotes — 2020 should NOT match "2020".
  if (isQuotedString(normExp)) {
    // Both must be quoted strings; already compared above, so return false here.
    return false;
  }

  // For non-string expected values (numbers, booleans, expressions),
  // allow whitespace-stripped comparison only.
  const strippedUser = normUser.replace(/\s/g, '');
  const strippedExp = normExp.replace(/\s/g, '');
  return strippedUser.toLowerCase() === strippedExp.toLowerCase();
}