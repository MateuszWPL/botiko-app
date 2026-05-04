import type { ReactNode } from 'react';
import { cn } from './cn';

type CellValue = string | ReactNode;

interface ComparisonTableProps {
  title?: string;
  headers: string[];
  rows: CellValue[][];
  highlightColumn?: number;
  className?: string;
}

export function ComparisonTable({
  title,
  headers,
  rows,
  highlightColumn,
  className,
}: ComparisonTableProps): JSX.Element {
  return (
    <div className={cn('my-8', className)}>
      {title ? (
        <h3 className="mb-4 text-xl font-bold text-slate-900">{title}</h3>
      ) : null}

      {/* Desktop: tabela */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              {headers.map((header, idx) => (
                <th
                  key={`h-${idx}`}
                  scope="col"
                  className={cn(
                    'border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900',
                    idx === highlightColumn && 'bg-brand-soft text-brand-dark'
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={`r-${rowIdx}`}
                className={cn(
                  'border-b border-slate-100 last:border-b-0',
                  rowIdx % 2 === 1 && 'bg-slate-50/50'
                )}
              >
                {row.map((cell, colIdx) => (
                  <td
                    key={`c-${rowIdx}-${colIdx}`}
                    className={cn(
                      'px-4 py-3 align-top',
                      colIdx === 0 && 'font-medium text-slate-900',
                      colIdx > 0 && 'text-slate-700',
                      colIdx === highlightColumn && 'bg-brand-soft/40'
                    )}
                  >
                    <CellRenderer value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: karty per wiersz */}
      <div className="space-y-4 md:hidden">
        {rows.map((row, rowIdx) => {
          const featureName = row[0];
          const values = row.slice(1);
          const valueHeaders = headers.slice(1);

          return (
            <div
              key={`m-${rowIdx}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                <CellRenderer value={featureName} />
              </div>
              <dl className="divide-y divide-slate-100">
                {values.map((value, valIdx) => {
                  const columnIdx = valIdx + 1;
                  const isHighlighted = columnIdx === highlightColumn;
                  return (
                    <div
                      key={`mv-${rowIdx}-${valIdx}`}
                      className={cn(
                        'flex items-start justify-between gap-4 px-4 py-3 text-sm',
                        isHighlighted && 'bg-brand-soft/40'
                      )}
                    >
                      <dt
                        className={cn(
                          'font-medium',
                          isHighlighted ? 'text-brand-dark' : 'text-slate-600'
                        )}
                      >
                        {valueHeaders[valIdx]}
                      </dt>
                      <dd className="text-right text-slate-700">
                        <CellRenderer value={value} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CellRenderer({ value }: { value: CellValue }): ReactNode {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();

  if (trimmed === '✅') {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="font-medium">Tak</span>
      </span>
    );
  }

  if (trimmed === '❌') {
    return (
      <span className="inline-flex items-center gap-1.5 text-rose-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span className="font-medium">Nie</span>
      </span>
    );
  }

  if (trimmed.startsWith('✅')) {
    const rest = trimmed.slice(1).trim();
    return (
      <span className="inline-flex items-start gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{rest}</span>
      </span>
    );
  }

  if (trimmed.startsWith('❌')) {
    const rest = trimmed.slice(1).trim();
    return (
      <span className="inline-flex items-start gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span>{rest}</span>
      </span>
    );
  }

  return <span>{value}</span>;
}
