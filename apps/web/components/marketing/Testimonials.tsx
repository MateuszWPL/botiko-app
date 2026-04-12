'use client';

import ScrollReveal from './ScrollReveal';

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TESTIMONIALS = [
  {
    quote: 'Pierwszego dnia bot zebrał 3 zapytania — wszystkie po 20:00. Nie odbierałam telefonu, a miałam pełny grafik na tydzień. Zwrot w 3 dni.',
    name: 'Katarzyna M.',
    role: 'Salon K., Wrocław',
    industry: 'Salon beauty',
    color: '#EC4899',
    stars: 5,
  },
  {
    quote: 'Miałam obawy że bot nie zrozumie pytań o zabiegi. Myliłam się — odpowiada lepiej niż ja, bo zna cennik na pamięć i nigdy nie jest zmęczona.',
    name: 'Agnieszka T.',
    role: 'Fizjoterapeutka, Kraków',
    industry: 'Gabinet',
    color: '#06B6D4',
    stars: 5,
  },
  {
    quote: 'Bot obsługuje pytania o menu, rezerwacje i alergie 24/7. Kelnerzy skupiają się na gościach, nie na Messengerze. Polecam każdej restauracji.',
    name: 'Marek B.',
    role: 'Restauracja Smak, Poznań',
    industry: 'Restauracja',
    color: '#F97316',
    stars: 5,
  },
  {
    quote: 'Klienci zostawiają dane o 23:00, a ja rano mam gotową listę do oddzwonienia. Warsztaty też potrzebują tego — szkoda że nie wiedziałem wcześniej.',
    name: 'Piotr W.',
    role: 'AutoSerwis Wierzbicki, Gdańsk',
    industry: 'Warsztat',
    color: '#818CF8',
    stars: 5,
  },
  {
    quote: 'W ciągu miesiąca bot zebrał 47 leadów. Wcześniej gubiłem połowę zapytań bo nie odbierałem po 18:00. Teraz mam spokój i pełny terminarz.',
    name: 'Tomasz K.',
    role: 'Studio Fryzjerskie, Warszawa',
    industry: 'Fryzjer',
    color: '#8B5CF6',
    stars: 5,
  },
  {
    quote: 'Konfiguracja zajęła 20 minut. Bot odpowiada na pytania o zabiegi, ceny i dostępność terminów. Klientki mówią że "obsługa jest ekspresowa".',
    name: 'Monika R.',
    role: 'Gabinet kosmetyczny, Łódź',
    industry: 'Kosmetyka',
    color: '#EC4899',
    stars: 5,
  },
];

// Duplicate for seamless infinite loop
const ROW1 = [...TESTIMONIALS, ...TESTIMONIALS];
const ROW2 = [...TESTIMONIALS.slice(2), ...TESTIMONIALS.slice(0, 2), ...TESTIMONIALS.slice(2), ...TESTIMONIALS.slice(0, 2)];

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div
      className="flex-shrink-0 w-80 flex flex-col rounded-2xl p-6 mx-3"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div className="flex gap-0.5 mb-3 text-amber-400">
        {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
      </div>
      <blockquote className="text-sm leading-relaxed text-indigo-100 flex-1 mb-5" style={{ fontStyle: 'italic' }}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: t.color }}
        >
          {t.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{t.name}</p>
          <p className="text-indigo-400 text-xs truncate">{t.role}</p>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: `${t.color}25`, color: t.color, border: `1px solid ${t.color}40` }}
        >
          {t.industry}
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-3">Opinie klientów</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Co mówią firmy,{' '}
            <span style={{ color: '#a5b4fc' }}>które już korzystają</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Marquee rows — full bleed with gradient fade edges */}
      <div
        className="flex flex-col gap-5 mb-16"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >

        {/* Row 1 — scrolls left */}
        <div
          className="flex marquee-left"
          style={{ animationDuration: '38s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {ROW1.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>

        {/* Row 2 — scrolls right */}
        <div
          className="flex marquee-right"
          style={{ animationDuration: '42s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {ROW2.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-6 text-center pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { value: '12 000+', label: 'rozmów obsłużonych w tym miesiącu' },
            { value: '98%', label: 'klientów poleca Botiko znajomym' },
            { value: '< 15 min', label: 'średni czas wdrożenia bota' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-indigo-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
