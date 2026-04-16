'use client';

import ScrollReveal from './ScrollReveal';

const STORIES = [
  {
    quote:
      'Klientka pisze o 22:15 o manicure. Bot odpowiada od razu, zbiera telefon i rano masz gotowy lead do oddzwonienia.',
    name: 'Beauty',
    role: 'Przykładowy scenariusz',
    industry: 'Salon beauty',
    color: '#EC4899',
  },
  {
    quote:
      'Klient pyta o zabieg i przeciwwskazania. Bot odpowiada z bazy wiedzy i gdy temat jest “medyczny” — od razu prosi o kontakt do konsultacji.',
    name: 'Health',
    role: 'Przykładowy scenariusz',
    industry: 'Gabinet / SPA',
    color: '#06B6D4',
  },
  {
    quote:
      'Gość pyta o menu i alergeny. Bot odpowiada w kilka sekund i odsyła do rezerwacji (Booksy/Calendly) zamiast “oddzwonimy później”.',
    name: 'Food',
    role: 'Przykładowy scenariusz',
    industry: 'Restauracja',
    color: '#F97316',
  },
  {
    quote:
      'Klient opisuje usterkę w ciągu dnia, gdy nie możesz odebrać. Bot zbiera dane (auto/rocznik/opis) i zostawia Ci komplet do wyceny.',
    name: 'Auto',
    role: 'Przykładowy scenariusz',
    industry: 'Motoryzacja',
    color: '#8B5CF6',
  },
];

// Duplicate for seamless infinite loop
const ROW1 = [...STORIES, ...STORIES];
const ROW2 = [
  ...STORIES.slice(2),
  ...STORIES.slice(0, 2),
  ...STORIES.slice(2),
  ...STORIES.slice(0, 2),
];

function StoryCard({ t }: { t: typeof STORIES[0] }) {
  return (
    <div
      className="flex-shrink-0 w-80 flex flex-col rounded-2xl p-6 mx-3"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
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
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-3">
            Przykładowe scenariusze
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Jak Botiko pomaga{' '}
            <span style={{ color: '#a5b4fc' }}>w typowych sytuacjach</span>
          </h2>
          <p className="text-indigo-200 text-sm mt-4 max-w-2xl mx-auto">
            Zamiast udawać „opinie”, pokazujemy typowe scenariusze rozmów, które bot może przejąć w firmach usługowych.
          </p>
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
          {ROW1.map((t, i) => <StoryCard key={i} t={t} />)}
        </div>

        {/* Row 2 — scrolls right */}
        <div
          className="flex marquee-right"
          style={{ animationDuration: '42s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {ROW2.map((t, i) => <StoryCard key={i} t={t} />)}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-6 text-center pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { value: '14 dni', label: 'darmowych testów bez karty' },
            { value: '24/7', label: 'bot odpowiada także po godzinach' },
            { value: '~ 15 min', label: 'konfiguracja bota w wielu przypadkach' },
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
