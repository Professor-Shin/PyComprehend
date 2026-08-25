import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  highlightedLines?: number[];
  title?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, highlightedLines = [], title = 'python_exercise.py' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Strip asterisk markers if present before copy
    const cleanCode = code.replace(/^\*\s*/gm, '');
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Code Editor Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{title}</span>
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((lineText, idx) => {
              // Parse line format if it contains line number prefix like "1: a = 8" or "*5: a = a * 2"
              let lineNum = idx + 1;
              let isStarred = false;
              let codeContent = lineText;

              const lineMatch = lineText.match(/^(\*?)(\d+):\s*(.*)$/);
              if (lineMatch) {
                isStarred = lineMatch[1] === '*';
                lineNum = parseInt(lineMatch[2], 10);
                codeContent = lineMatch[3];
              }

              const isHighlighted = isStarred || highlightedLines.includes(lineNum);

              return (
                <tr
                  key={idx}
                  className={`transition-colors font-mono ${
                    isHighlighted
                      ? 'bg-indigo-950/40 border-l-2 border-indigo-400 text-indigo-100 font-medium'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  <td className="pr-4 py-0.5 text-right text-slate-600 select-none w-10 text-xs font-mono border-r border-slate-800/40">
                    {isStarred ? <span className="text-amber-400 mr-0.5 font-bold">*</span> : null}
                    {lineNum}
                  </td>
                  <td className="pl-4 py-0.5 whitespace-pre">
                    {codeContent}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
