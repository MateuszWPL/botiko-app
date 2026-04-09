import ScrollReveal from './ScrollReveal';

const PAINS = [
  {
    emoji: '😰',
    title: 'Tracisz klientki o 22:00',
    description:
      'Wiadomość na Messengerze o 22:14 — bez odpowiedzi do rana. Klientka zapisuje się do konkurencji, która odpowiedziała w 30 sekund.',
    stat: '67%',
    statLabel: 'klientów rezygnuje po braku odpowiedzi w ciągu godziny',
    color: 'beauty',
  },
  {
    emoji: '📵',
    title: 'Odbierasz zamiast pracować',
    description:
      'Telefon podczas zabiegu, podczas spotkania, w niedzielę. Pytania o cennik i terminy, które bot może odpowiadać zamiast Ciebie.',
    stat: '3h',
    statLabel: 'dziennie traci właścicielka na powtarzające się pytania klientów',
    color: 'health',
  },
  {
    emoji: '😤',
    title: 'Konkurencja jest online 24/7',
    description:
      'Sąsiedni salon ma bota na stronie. Klientka wysyła zapytanie o 23:00 — ta dostaje odpowiedź, Ty nie. 1 klientka = 150–300 zł.',
    stat: '1 klientka',
    statLabel: '= 150–300 zł. Bot kosztuje 149 zł/mies.',
    color: 'food',
  },
];

const COLOR_MAP: Record<string, string> = {
  beauty: '#EC4899',
  health: '#06B6D4',
  food:   '#F97316',
};

export default function Problem() {
  return (
    <section className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Znasz ten ból?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight">
            Prowadzisz świetny salon.
            <br />
            <span className="gradient-text">Ale tracisz klientki, kiedy nie patrzysz.</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PAINS.map((pain, i) => (
            <ScrollReveal key={pain.title} delay={(i + 1) as 1 | 2 | 3} className="h-full">
              <div className="h-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shrink-0"
                  style={{ background: `${COLOR_MAP[pain.color]}18` }}
                >
                  {pain.emoji}
                </div>

                <h3 className="text-xl font-bold text-text mb-3">{pain.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{pain.description}</p>

                <div
                  className="rounded-2xl p-4"
                  style={{ background: `${COLOR_MAP[pain.color]}10`, border: `1px solid ${COLOR_MAP[pain.color]}25` }}
                >
                  <p className="text-2xl font-extrabold" style={{ color: COLOR_MAP[pain.color] }}>
                    {pain.stat}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{pain.statLabel}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
