import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

/* ─── Step visual mockups ──────────────────────────────────── */

function MockupBranch() {
  const INDUSTRIES = [
    { label: 'Salon beauty', color: '#EC4899', icon: '💅' },
    { label: 'Gabinet / SPA', color: '#06B6D4', icon: '🏥' },
    { label: 'Restauracja', color: '#F97316', icon: '🍽️' },
    { label: 'Warsztat', color: '#64748B', icon: '🔧' },
    { label: 'Inna branża', color: '#8B5CF6', icon: '📋' },
  ];
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Wybierz branżę</p>
      <div className="flex flex-col gap-2">
        {INDUSTRIES.map((ind, i) => (
          <div
            key={ind.label}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium"
            style={
              i === 0
                ? { background: '#EEF2FF', color: '#4338CA', border: '1.5px solid #6366F1' }
                : { background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }
            }
          >
            <span>{ind.icon}</span>
            <span>{ind.label}</span>
            {i === 0 && (
              <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupKnowledge() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Baza wiedzy</p>
      <div className="flex flex-col gap-2.5">
        {[
          { label: 'Cennik usług', preview: 'Manicure hybrydowy — 90 zł, Pedicure — 80 zł...', color: '#6366F1' },
          { label: 'Godziny otwarcia', preview: 'Pon–Pt 9:00–19:00, Sob 9:00–15:00...', color: '#10B981' },
          { label: 'FAQ', preview: 'Czy przyjmujecie bez rezerwacji? Tak, jeśli...', color: '#F59E0B' },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ background: item.color }}
            />
            <div>
              <p className="text-xs font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed truncate max-w-[180px]">{item.preview}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-brand/40 text-brand text-xs font-medium cursor-pointer hover:bg-brand-soft transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Dodaj kolejny wpis
        </div>
      </div>
    </div>
  );
}

function MockupChat() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center">
          <span className="text-brand text-xs font-bold">B</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Bot Twojej firmy</p>
          <p className="text-[10px] text-accent flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse"/>
            Online 24/7
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-slate-100 text-slate-700 text-xs max-w-[85%] leading-relaxed">
            Dzień dobry! W czym mogę dziś pomóc? 😊
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 bg-brand text-white text-xs max-w-[85%] leading-relaxed">
            Ile kosztuje manicure hybrydowy?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-slate-100 text-slate-700 text-xs max-w-[85%] leading-relaxed">
            Manicure hybrydowy to 90 zł ✨<br/>Mam wolny termin jutro o 14:30 — zainteresowana?
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-400 flex-1">Napisz wiadomość...</span>
          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Steps data ──────────────────────────────────────────── */

const STEPS = [
  {
    num: '01',
    title: 'Wybierz branżę',
    desc: 'Salon beauty, gabinet, restauracja, warsztat — wybierasz jeden szablon. Bot dostaje gotową wiedzę o Twojej branży od razu.',
    badge: 'Gotowe szablony dla 5 branż',
    Mockup: MockupBranch,
  },
  {
    num: '02',
    title: 'Dodaj wiedzę o firmie',
    desc: 'Wklej cennik, godziny pracy, odpowiedzi na najczęstsze pytania. Bot uczy się w kilka minut — bez programowania.',
    badge: 'Wdrożenie w ~15 minut',
    Mockup: MockupKnowledge,
  },
  {
    num: '03',
    title: 'Bot pracuje za Ciebie',
    desc: 'Jeden fragment kodu HTML na Twojej stronie. Bot odpowiada na pytania, zbiera leady i odsyła do rezerwacji 24/7.',
    badge: 'Leady w panelu od razu',
    Mockup: MockupChat,
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-dziala" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Jak to działa</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Gotowy bot w{' '}
            <span className="gradient-text">3 krokach</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Bez programisty. Bez agencji. Bez umowy na rok.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} delay={(i + 1) as 1 | 2 | 3}>
              <div className="flex flex-col h-full">
                {/* Visual mockup */}
                <div className="mb-6 rounded-2xl overflow-hidden bg-slate-50 p-5 border border-slate-100">
                  <step.Mockup />
                </div>

                {/* Step info */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)' }}
                  >
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-text">{step.title}</h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{step.desc}</p>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-accent bg-green-50 border border-green-100 self-start">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {step.badge}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center mt-14">
          <Link
            href="/rejestracja"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand text-white font-bold text-base shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 transition-all"
          >
            Zacznij za darmo — 14 dni
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="text-slate-400 text-sm mt-3">Bez karty kredytowej · Cancel kiedy chcesz</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
