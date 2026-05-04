import Link from 'next/link';
import { cn } from './cn';

interface CTABlockProps {
  title: string;
  description?: string;
  cta: string;
  href: string;
  variant?: 'solid' | 'soft';
  className?: string;
}

export function CTABlock({
  title,
  description,
  cta,
  href,
  variant = 'solid',
  className,
}: CTABlockProps): JSX.Element {
  const isExternal = href.startsWith('http');

  if (variant === 'soft') {
    return (
      <div
        className={cn(
          'my-10 overflow-hidden rounded-2xl border border-brand/15 bg-brand-soft px-6 py-8 sm:px-10 sm:py-10',
          className
        )}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold leading-tight text-brand-dark sm:text-3xl">
              {title}
            </h3>
            {description ? (
              <p className="text-base text-slate-700">{description}</p>
            ) : null}
          </div>
          <CTAButton href={href} isExternal={isExternal} variant="solid">
            {cta}
          </CTAButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-brand/90 px-6 py-10 text-white shadow-xl shadow-brand/20 sm:px-10 sm:py-12',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h3>
          {description ? (
            <p className="text-base text-white/85">{description}</p>
          ) : null}
        </div>
        <CTAButton href={href} isExternal={isExternal} variant="white">
          {cta}
        </CTAButton>
      </div>
    </div>
  );
}

interface CTAButtonProps {
  href: string;
  isExternal: boolean;
  variant: 'solid' | 'white';
  children: string;
}

function CTAButton({ href, isExternal, variant, children }: CTAButtonProps): JSX.Element {
  const styles = cn(
    'group inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]',
    variant === 'solid'
      ? 'bg-brand text-white shadow-brand/25 hover:bg-brand-dark'
      : 'bg-white text-brand-dark shadow-black/10'
  );

  const arrow = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );

  if (isExternal) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
      {arrow}
    </Link>
  );
}
