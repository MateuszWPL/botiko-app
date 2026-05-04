'use client';

import { useState, type ReactNode } from 'react';
import { cn } from './cn';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  withSchema?: boolean;
  defaultOpenFirst?: boolean;
  className?: string;
}

export function FAQ({
  items,
  withSchema = true,
  defaultOpenFirst = false,
  className,
}: FAQProps): JSX.Element {
  return (
    <>
      {withSchema ? <FAQSchema items={items} /> : null}
      <div className={cn('my-8 space-y-3', className)}>
        {items.map((item, idx) => (
          <FAQItemAccordion
            key={idx}
            item={item}
            defaultOpen={defaultOpenFirst && idx === 0}
          />
        ))}
      </div>
    </>
  );
}

function FAQItemAccordion({
  item,
  defaultOpen,
}: {
  item: FAQItem;
  defaultOpen: boolean;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-white transition-colors duration-200',
        isOpen
          ? 'border-brand/30 shadow-sm shadow-brand/10'
          : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50/50 sm:px-6 sm:py-5"
      >
        <span className="flex-1 leading-snug">{item.q}</span>
        <span
          aria-hidden
          className={cn(
            'mt-1 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-200',
            isOpen ? 'rotate-45 bg-brand text-white' : 'bg-slate-100 text-slate-600'
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 py-4 text-base leading-relaxed text-slate-700 sm:px-6 sm:py-5">
            {renderAnswer(item.a)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSchema({ items }: { items: FAQItem[] }): JSX.Element {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function renderAnswer(text: string): ReactNode {
  return text.split(/\n\n+/).map((para, idx) => (
    <p key={idx} className={idx > 0 ? 'mt-3' : undefined}>
      {renderInline(para)}
    </p>
  ));
}

function renderInline(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a key={`link-${key++}`} href={match[2]} className="text-brand underline-offset-2 hover:underline">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}
