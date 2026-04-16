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
      className="relative flex flex-col justify-between px-6 py-8 lg:px-12 lg:py-10 order-2 lg:order-1 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338CA 100%)',
      }}
    >
      {/* Photo — right side, peeks from behind the gradient */}
      <div
        className="absolute inset-y-0 right-0 w-3/5 pointer-events-none"
        style={{
          backgroundImage: 'url(/blog/salon-beauty-24-7/hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Left fade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #1e1b4b 0%, #312e81 20%, rgba(67,56,202,0.5) 50%, transparent 100%)',
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
        <Image src="/BotikoLogo.png" alt="Botiko" width={36} height={36} className="rounded-xl" />
        <span className="text-white font-bold text-xl">
          Botiko<span className="text-indigo-300">.pl</span>
        </span>
      </Link>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-6">
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
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">{headline}</h2>
          <p className="text-indigo-200 text-base leading-relaxed">{sub}</p>
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
        className="relative z-10 flex items-center gap-8 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        {[
          { val: '14 dni', label: 'darmowych testów' },
          { val: '24/7', label: 'dostępny bot' },
          { val: '<15 min', label: 'wdrożenie' },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-white text-lg font-extrabold">{s.val}</p>
            <p className="text-indigo-300 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
