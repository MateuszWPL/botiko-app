'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/blog';

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    // Ustal "aktywny" nagłówek jako ostatni nagłówek nad górnym offsetem.
    const topOffsetPx = 120;
    const ids = items.map((i) => i.id);

    let raf = 0;
    const computeActive = () => {
      raf = 0;
      let best: string | null = null;
      let bestTop = -Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= topOffsetPx && top > bestTop) {
          bestTop = top;
          best = id;
        }
      }

      // Jeśli jesteśmy wysoko (przed pierwszym nagłówkiem), aktywuj pierwszy.
      setActiveId(best ?? ids[0] ?? '');
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('hashchange', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('hashchange', onScrollOrResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items]);

  const hasLevel3 = items.some((i) => i.level === 3);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Spis treści"
      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Spis treści
      </p>
      <ol className={hasLevel3 ? 'space-y-1.5' : 'space-y-1'}>
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
