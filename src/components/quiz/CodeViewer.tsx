import React, { useState } from 'react';
import { Copy, Check, Play, Loader2, TerminalSquare, X } from 'lucide-react';
import { renderHighlightedCode } from '../../utils/syntaxHighlighter';
import { runPython, stripLineNumbers, hasBlanks, getStatus } from '../../utils/pythonRuntime';

interface CodeViewerProps {
  code: string;
  highlightedLines?: number[];
  title?: string;
  /** Values fed to input() when the student runs the snippet. */
  stdin?: string[];
  /** Hidden setup the snippet assumes (e.g. a `score` it never defines). */
  prelude?: string;
}

type RunState =
  | { phase: 'idle' }
  | { phase: 'running' }
  | { phase: 'done'; stdout: string; error: string | null };

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  highlightedLines = [],
  title = 'python_exercise.py',
  stdin,
  prelude,
}) => {
  const [copied, setCopied] = useState(false);
  const [run, setRun] = useState<RunState>({ phase: 'idle' });

  const lines = code.split('\n');
  const plain = stripLineNumbers(code);
  // A snippet with ___1___ markers is not valid Python until the blanks are filled.
  const runnable = !hasBlanks(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setRun({ phase: 'running' });
    const source = prelude ? `${prelude}\n${plain}` : plain;
    const { stdout, error } = await runPython(source, { stdin });
    setRun({ phase: 'done', stdout, error });
  };

  const firstRun = getStatus() !== 'ready';

  return (
    <div className="rounded-2xl border border-subtle bg-code overflow-hidden">
      <div className="px-4 py-2.5 bg-sunken border-b border-subtle flex items-center justify-between gap-3">
        <span className="text-xs font-mono text-muted truncate">{title}</span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-medium text-muted hover:text-primary px-2 py-1 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
            <span className={copied ? 'text-ok' : ''}>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {runnable && (
            <button
              onClick={handleRun}
              disabled={run.phase === 'running'}
              title={firstRun ? 'Downloads Python the first time (~10MB)' : 'Run this code'}
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded border border-subtle text-muted hover:text-primary hover:border-strong disabled:opacity-60 transition-colors"
            >
              {run.phase === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>
                {run.phase === 'running' ? (firstRun ? 'Loading Python…' : 'Running…') : 'Run'}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((lineText, idx) => {
              let lineNum = idx + 1;
              let isStarred = false;
              let codeContent = lineText;

              const lineMatch = lineText.match(/^(\*?)(\d+): ?(.*)$/);
              if (lineMatch) {
                isStarred = lineMatch[1] === '*';
                lineNum = parseInt(lineMatch[2], 10);
                codeContent = lineMatch[3];
              }

              const isHighlighted = isStarred || highlightedLines.includes(lineNum);

              return (
                <tr key={idx} className={isHighlighted ? 'bg-accent-tint' : undefined}>
                  <td
                    className={`pr-3 py-0.5 text-right select-none w-10 text-xs border-r ${
                      isHighlighted ? 'border-accent text-accent' : 'border-subtle text-faint'
                    }`}
                  >
                    {isStarred ? <span className="text-fill mr-0.5">*</span> : null}
                    {lineNum}
                  </td>
                  <td className="pl-4 py-0.5 whitespace-pre">{renderHighlightedCode(codeContent)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {run.phase === 'done' && (
        <div className="border-t border-subtle">
          <div className="px-4 py-2 flex items-center justify-between bg-sunken">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted uppercase tracking-wider">
              <TerminalSquare className="w-3.5 h-3.5" />
              Output
            </span>
            <button
              onClick={() => setRun({ phase: 'idle' })}
              aria-label="Close output"
              className="text-faint hover:text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <pre
            className={`px-4 py-3 text-xs font-mono whitespace-pre-wrap break-words overflow-x-auto ${
              run.error ? 'text-err' : 'text-primary'
            }`}
          >
            {run.stdout}
            {run.error ? (run.stdout ? '\n' : '') + run.error : ''}
            {!run.stdout && !run.error ? (
              <span className="text-faint italic">
                Ran without errors. This snippet prints nothing — check the variables in the question.
              </span>
            ) : null}
          </pre>
        </div>
      )}
    </div>
  );
};
