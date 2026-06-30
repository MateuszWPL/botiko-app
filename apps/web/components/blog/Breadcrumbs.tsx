import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({
  items,
  variant = 'light',
}: {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
}) {
  // Pure UI — the BreadcrumbList JSON-LD is emitted by the page itself (via
  // `breadcrumbListSchema()` in a <JsonLd> block) so we don't double-declare it.
  return (
    <nav aria-label="Breadcrumb">
        <ol
          className={`flex flex-wrap items-center gap-1.5 text-sm ${
            variant === 'dark' ? 'text-white/70' : 'text-slate-500'
          }`}
        >
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
              {item.href && i < items.length - 1 ? (
                <Link
                  href={item.href}
                  className={
                    variant === 'dark'
                      ? 'hover:text-white transition-colors'
                      : 'hover:text-indigo-600 transition-colors'
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    i === items.length - 1
                      ? variant === 'dark'
                        ? 'text-white font-medium'
                        : 'text-slate-700 font-medium'
                      : ''
                  }
                  aria-current={i === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
  );
}
