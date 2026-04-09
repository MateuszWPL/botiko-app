import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    step: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 12h8M12 8v8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Wybierz branżę',
    description:
      'Salon beauty, gabinet medyczny, restauracja, warsztat — wybierasz jeden szablon. Bot dostaje gotową wiedzę o Twojej branży.',
    detail: 'Gotowe szablony dla 5 branż',
  },
  {
    step: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M8 12h8M8 8h8M8 16h5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Dodaj wiedzę o firmie',
    description:
      'Wklej cennik, godziny pracy, odpowiedzi na najczęstsze pytania. Bot uczy się w 5 minut — bez programowania.',
    detail: 'Wdrożenie w ~15 minut',
  },
  {
    step: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Wklej jeden kod',
    description:
      'Jedna linia HTML na Twojej stronie, profilu lub landing page. Widget pojawia się natychmiast — gotowy do rozmów.',
    detail: '1 linia kodu — to wszystko',
  },
  {
    step: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 7.18a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12a16 16 0 006.06 6.06l.22-.22a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    title: 'Asystentka pracuje za Ciebie',
    description:
      'Odpowiada na pytania, zbiera dane klientów, odsyła do rezerwacji. Ty dostajesz powiadomienie — klientka już czeka.',
    detail: 'Leady w panelu od razu',
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-dziala" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Jak to działa</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Gotowa asystentka w{' '}
            <span className="gradient-text">15 minut</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Bez programisty. Bez agencji. Bez umowy na rok.
          </p>
        </ScrollReveal>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)', opacity: 0.2 }}
          />

          {STEPS.map((step, i) => (
            <ScrollReveal key={step.step} delay={(i + 1) as 1 | 2 | 3 | 4} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Circle icon */}
                <div className="relative mb-5 z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-brand-soft text-brand shadow-sm">
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center shadow"
                  >
                    {step.step.replace('0', '')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.description}</p>

                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-accent bg-green-50 border border-green-100">
                  ✓ {step.detail}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
