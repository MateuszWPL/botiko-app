'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Tag = { name: string; slug: string; count: number };

const INITIAL_VISIBLE = 12;

export default function TagCloud({
  tags,
  activeTag,
}: {
  tags: Tag[];
  activeTag?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!activeTag || tags.length <= INITIAL_VISIBLE) return;
    const idx = tags.findIndex((t) => t.slug === activeTag);
    if (idx >= INITIAL_VISIBLE) setExpanded(true);
  }, [activeTag, tags]);

  if (tags.length === 0) return null;

  const hasMore = tags.length > INITIAL_VISIBLE;
  const visibleTags =
    expanded || !hasMore ? tags : tags.slice(0, INITIAL_VISIBLE);
  const hiddenCount = tags.length - INITIAL_VISIBLE;

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Tagi
      </h3>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/blog/tag/${tag.slug}`}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTag === tag.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
          >
            #{tag.name}
            <span className="ml-1 opacity-60">{tag.count}</span>
          </Link>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-medium text-indigo-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer"
        >
          {expanded
            ? 'Zwiń listę tagów'
            : `Pokaż wszystkie tagi (+${hiddenCount})`}
        </button>
      )}
    </div>
  );
}
