import ScrollReveal from './ScrollReveal';

const MoonMissed = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path d="M17 8h.01M19 12h.01" />
  </svg>
);

const PhoneOff = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.97.4 2 .63 3.04.72a2 2 0 0 1 1.83 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.26 9.5" />
    <path d="M2 2l20 20" />
  </svg>
);

const TrophyOff = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PAINS = [
  {
    Icon: MoonMissed,
    title: 'Tracisz klientów o 22:00',
    description:
      'Wiadomość na Messengerze o 22:14 — bez odpowiedzi do rana. Klient zapisuje się do konkurencji, która odpowiedziała w 30 sekund.',
    stat: '67%',
    statLabel: 'klientów rezygnuje po braku odpowiedzi w ciągu godziny',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FCE7F3',
  },
  {
    Icon: PhoneOff,
    title: 'Odbierasz zamiast pracować',
    description:
      'Telefon podczas zabiegu, podczas spotkania, w niedzielę. Pytania o cennik i terminy, które bot może obsługiwać zamiast Ciebie.',
    stat: '3h',
    statLabel: 'dziennie traci właściciel na powtarzające się pytania klientów',
    color: '#06B6D4',
    bg: '#ECFEFF',
    border: '#CFFAFE',
  },
  {
    Icon: TrophyOff,
    title: 'Konkurencja jest online 24/7',
    description:
      'Sąsiedni salon, warsztat czy restauracja ma bota na stronie. Klient pisze o 23:00 — ta firma dostaje rezerwację, Ty nie.',
    stat: '1 klient',
    statLabel: '= 150–300 zł. Bot kosztuje 149 zł/mies.',
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
