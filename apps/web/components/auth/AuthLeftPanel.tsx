import Image from 'next/image';
import Link from 'next/link';

const BENEFITS = [
  'Bot odpowiada za Ciebie 24/7 — nawet o 22:00',
  'Zbiera leady automatycznie — imię + telefon',
  'Wdrożenie w 15 minut, zero programowania',
];

interface Props {
  headline: string;
  sub: string;
  badge?: string;
}

export function AuthLeftPanel({ headline, sub, badge = '14 dni za darmo — bez karty' }: Props) {
  return (
    <div
      className="relative flex flex-col gap-10 px-6 py-10 pb-28 lg:gap-0 lg:justify-between lg:px-12 lg:py-10 lg:pb-10 order-2 lg:order-1 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338CA 100%)',
      }}
    >
      {/* Photo — full area, anchored right, gradient masks from left/top/bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/registerImage.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }}
      >
        {/* Left-to-right fade — full width, opaque on left */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #1e1b4b 0%, #312e81 35%, rgba(49,46,129,0.7) 60%, transparent 100%)',
          }}
        />
        {/* Top fade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #1e1b4b 0%, transparent 25%)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #1e1b4b 0%, transparent 30%)',
          }}
        />
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5">
        <Image src="/botiko-logo-full-white.svg" alt="Botiko.pl" width={130} height={35} />
      </Link>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        {/* Badge */}
        <div
          className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#a5b4fc',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {badge}
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">{headline}</h2>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">{sub}</p>
        </div>

        {/* Benefits */}
        <ul className="flex flex-col gap-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(16,185,129,0.18)',
                  border: '1px solid rgba(16,185,129,0.4)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-indigo-100 text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust bar */}
      <div
        className="relative z-10 flex items-center gap-4 sm:gap-8 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        {[
          { val: '14 dni', label: 'darmowych testów' },
          { val: '24/7', label: 'dostępny bot' },
          { val: '<15 min', label: 'wdrożenie' },
        ].map((s) => (
          <div key={s.label} className="min-w-0">
            <p className="text-white text-xl sm:text-2xl font-extrabold whitespace-nowrap">{s.val}</p>
            <p className="text-indigo-300 text-xs sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
