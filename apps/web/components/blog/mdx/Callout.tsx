import type { ReactNode } from 'react';
import { cn } from './cn';

type CalloutVariant = 'info' | 'warning' | 'success' | 'tip' | 'danger';

interface CalloutProps {
  type?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<
  CalloutVariant,
  {
    container: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    icon: ReactNode;
    defaultTitle: string;
  }
> = {
  info: {
    container: 'border-brand/20 bg-brand-soft',
    iconBg: 'bg-brand/10',
    iconColor: 'text-brand',
    titleColor: 'text-brand-dark',
    defaultTitle: 'Warto wiedzieć',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900',
    defaultTitle: 'Uwaga',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-900',
    defaultTitle: 'Dobrze wiedzieć',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  tip: {
    container: 'border-violet-200 bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    titleColor: 'text-violet-900',
    defaultTitle: 'Wskazówka',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Z" />
      </svg>
    ),
  },
  danger: {
    container: 'border-rose-200 bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    titleColor: 'text-rose-900',
    defaultTitle: 'Ważne',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

export function Callout({
  type = 'info',
  title,
  children,
  className,
}: CalloutProps): JSX.Element {
  const variant = variantStyles[type];
  const displayTitle = title ?? variant.defaultTitle;

  return (
    <aside
      role="note"
      aria-label={displayTitle}
      className={cn(
        'my-6 flex gap-4 rounded-2xl border p-5 sm:p-6',
        variant.container,
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          variant.iconBg,
          variant.iconColor
        )}
      >
        {variant.icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className={cn('font-semibold leading-tight', variant.titleColor)}>
          {displayTitle}
        </p>
        <div className="text-sm text-slate-700 leading-relaxed [&>p]:m-0 [&>p+p]:mt-2">
          {children}
        </div>
      </div>
    </aside>
  );
}
