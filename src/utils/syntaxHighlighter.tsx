import React from 'react';

/**
 * Tokenizes and renders Python code with syntax highlighting colors.
 */
export const renderHighlightedCode = (line: string | number): React.ReactNode => {
  if (line === null || line === undefined) return <span>&nbsp;</span>;
  const strLine = String(line);
  if (strLine === '') return <span>&nbsp;</span>;

  const TOKEN_REGEX =
    /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(___\w+___)|(\b(?:def|return|if|elif|else|for|in|while|break|continue|import|from|class|and|or|not|is|lambda|pass|del|yield|try|except|finally|raise|with|as|global|nonlocal|assert)\b)|(\b(?:True|False|None)\b)|(\b(?:print|input|len|range|int|str|float|bool|list|dict|set|tuple|sum|max|min|sorted|enumerate|zip|type|abs|all|any|round|open|append|pop|extend|insert|remove|split|join|upper|lower|strip|replace|find|count|keys|values|items|get|update|add|clear|self)\b)|(\b\d+(?:\.\d+)?\b)|(\s+|[^\s\w#"'`]+|\w+)/g;

  const elements: React.ReactNode[] = [];
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(strLine)) !== null) {
    const [
      fullMatch,
      comment,
      str,
      blank,
      keyword,
      constant,
      builtin,
      number,
      other,
    ] = match;

    const key = `tok-${match.index}-${fullMatch}`;

    if (comment) {
      elements.push(
        <span key={key} className="text-slate-500 italic font-normal">
          {comment}
        </span>
      );
    } else if (str) {
      elements.push(
        <span key={key} className="text-emerald-400 font-mono">
          {str}
        </span>
      );
    } else if (blank) {
      elements.push(
        <span
          key={key}
          className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 inline-block text-xs"
        >
          {blank}
        </span>
      );
    } else if (keyword) {
      elements.push(
        <span key={key} className="text-indigo-400 font-semibold">
          {keyword}
        </span>
      );
    } else if (constant) {
      elements.push(
        <span key={key} className="text-amber-400 font-medium">
          {constant}
        </span>
      );
    } else if (builtin) {
      elements.push(
        <span key={key} className="text-sky-400 font-mono">
          {builtin}
        </span>
      );
    } else if (number) {
      elements.push(
        <span key={key} className="text-amber-300 font-mono">
          {number}
        </span>
      );
    } else {
      elements.push(
        <span key={key} className="text-slate-200">
          {other || fullMatch}
        </span>
      );
    }

    if (TOKEN_REGEX.lastIndex === match.index) {
      TOKEN_REGEX.lastIndex++;
    }
  }

  return elements.length > 0 ? <>{elements}</> : strLine;
};

/**
 * Parses markdown-style formatted text (backticks for inline code, **bold**)
 * and renders inline Python code with syntax highlighting.
 */
export const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by inline code blocks `...` and bold text **...**
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-lg bg-slate-900/90 border border-slate-700/60 font-mono text-[11px] sm:text-xs text-slate-200 inline-block shadow-sm"
        >
          {renderHighlightedCode(codeContent)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-100">
          {boldContent}
        </strong>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};
