import React from 'react';
import { Lightbulb } from 'lucide-react';
import { renderFormattedText } from '../../utils/syntaxHighlighter';

/** Shared by all three readers — the explanation looked identical in each. */
export const ExplanationPanel: React.FC<{ text: string; title?: string }> = ({
  text,
  title = 'Explanation',
}) => (
  <section className="rounded-2xl border border-accent-line bg-accent-tint p-5 space-y-2">
    <h3 className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
      <Lightbulb className="w-4 h-4" aria-hidden="true" />
      {title}
    </h3>
    <p className="text-xs md:text-sm text-muted whitespace-pre-line leading-relaxed">
      {renderFormattedText(text)}
    </p>
  </section>
);
