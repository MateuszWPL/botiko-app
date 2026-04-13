'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

type Category = { name: string; slug: string; count: number };

export default function BlogFilters({
  categories,
  activeCategory,
  activeSort,
}: {
  categories: Category[];
  activeCategory?: string;
  activeSort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('strona'); // reset to page 1 on filter change
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const sortOptions = [
    { value: 'newest', label: 'Najnowsze' },
    { value: 'oldest', label: 'Najstarsze' },
  ];

  return (
    <div
      className={`w-full min-w-0 max-w-full transition-opacity ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* Category tabs — scroll inside padded width only (no -mx-* → no document overflow) */}
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2 scrollbar-none">
        <button
          onClick={() => updateParam('kategoria', null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
          }`}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              updateParam(
                'kategoria',
                activeCategory === cat.slug ? null : cat.slug
              )
            }
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-slate-500 flex-shrink-0">Sortuj:</span>
        <div className="flex gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParam(
                  'sortuj',
                  activeSort === opt.value ? null : opt.value
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (activeSort ?? 'newest') === opt.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
