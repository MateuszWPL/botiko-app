import ScrollReveal from './ScrollReveal';

// Dzwonek powiadomień, "Tracisz klientów o 22:00" (cisza, brak odpowiedzi)
const BellMissed = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Telefon dzwoniący z łukami, "Odbierasz zamiast pracować"
const PhoneRinging = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" />
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3 7.18a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.91 12a16 16 0 0 0 6.06 6.06l.22-.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Zegar, "Konkurencja jest online 24/7" (user: zegarek jest ok)
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PAINS = [
  {
    Icon: BellMissed,
    title: 'Tracisz klientów o 22:00',
    description:
      'Klient pisze przez Twoją stronę o 22:14, bez odpowiedzi do rana. Wybiera konkurencję, która odpowiedziała w 30 sekund.',
    stat: 'Minuty',
    statLabel: 'tyle wystarczy, żeby klient poszedł do konkurencji',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FCE7F3',
  },
  {
    Icon: PhoneRinging,
    title: 'Odbierasz zamiast pracować',
    description:
      'Telefon podczas zabiegu, podczas spotkania, w niedzielę. Pytania o cennik i terminy, które bot może obsługiwać zamiast Ciebie.',
    stat: 'Godziny',
    statLabel: 'tyle potrafią kosztować powtarzalne pytania w skali tygodnia',
    color: '#06B6D4',
    bg: '#ECFEFF',
    border: '#CFFAFE',
  },
  {
    Icon: ClockIcon,
    title: 'Konkurencja jest online 24/7',
    description:
      'Sąsiedni salon, warsztat czy restauracja ma bota na stronie. Klient pisze o 23:00, ta firma dostaje rezerwację, Ty nie.',
    stat: '1 klient',
    statLabel: '= 150-300 zł. Bot kosztuje 99 zł/mies.',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FED7AA',
  },
];

export default function Problem() {
  return (
    <section className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Znasz ten ból?</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight">
            Prowadzisz świetną firmę.
            <br />
            <span className="gradient-text">Ale tracisz klientów, kiedy nie patrzysz.</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PAINS.map(({ Icon, title, description, stat, statLabel, color, bg, border }, i) => (
            <ScrollReveal key={title} delay={(i + 1) as 1 | 2 | 3} className="h-full">
              <div className="h-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all flex flex-col">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shrink-0"
                  style={{ background: bg, color, border: `1px solid ${border}` }}
                >
                  <Icon />
                </div>

                <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{description}</p>

                <div
                  className="rounded-2xl p-4"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <p className="text-2xl font-extrabold" style={{ color }}>
                    {stat}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{statLabel}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
