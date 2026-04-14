'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/blog';

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Spis treści"
      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Spis treści
      </p>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? 'pl-3' : ''}
          >
            <a
              href={`#${item.id}`}
              className={`block text-sm leading-snug transition-colors py-0.5 ${
                activeId === item.id
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
