import Link from 'next/link';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams ?? {}).filter(([k]) => k !== 'strona')
      )
    );
    if (page > 1) params.set('strona', String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  }

  // Build page range with ellipsis
  const range: (number | '...')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (
      i === currentPage - delta - 1 ||
      i === currentPage + delta + 1
    ) {
      range.push('...');
    }
  }

  return (
    <nav
      aria-label="Paginacja"
      className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 mt-12"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          aria-label="Poprzednia strona"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      )}

      {/* Pages */}
      {range.map((item, i) =>
        item === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={buildUrl(item)}
            aria-label={`Strona ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              item === currentPage
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {item}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          aria-label="Następna strona"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  );
}
