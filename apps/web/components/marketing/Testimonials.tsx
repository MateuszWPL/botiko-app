'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.18 }}>
    <path d="M11.3 5c-3.4 1.1-5.8 4.1-5.8 7.6 0 2.4 1.4 4.4 3.5 4.4 1.7 0 3-1.3 3-3s-1.1-2.7-2.7-2.7c-.3 0-.5 0-.8.1.4-2 2.2-3.7 4.3-4.2L11.3 5zm8.6 0c-3.4 1.1-5.8 4.1-5.8 7.6 0 2.4 1.4 4.4 3.5 4.4 1.7 0 3-1.3 3-3s-1.1-2.7-2.7-2.7c-.3 0-.5 0-.8.1.4-2 2.2-3.7 4.3-4.2L19.9 5z" />
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
];

type Testimonial = typeof TESTIMONIALS[0];

function Card({ t, active }: { t: Testimonial; active: boolean }) {
  return (
    <div
      className="h-full flex flex-col rounded-2xl p-6 transition-all duration-500"
      style={
        active
          ? {
              background: 'rgba(255,255,255,0.11)',
              border: '1px solid rgba(255,255,255,0.22)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }
          : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }
      }
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4 text-amber-400">
        {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
      </div>

      {/* Quote */}
      <div className="mb-1 text-indigo-200">
        <QuoteIcon />
      </div>
      <blockquote
        className={`text-sm leading-relaxed flex-1 mb-5 transition-colors duration-500 ${active ? 'text-white' : 'text-indigo-300'}`}
        style={{ fontStyle: 'italic' }}
      >
        {t.quote}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: t.color }}
        >
          {t.name[0]}
        </div>
        <div>
          <p className={`font-semibold text-sm transition-colors duration-500 ${active ? 'text-white' : 'text-indigo-300'}`}>
            {t.name}
          </p>
          <p className="text-indigo-400 text-xs">{t.role}</p>
        </div>
        <span
          className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${t.color}28`, color: t.color, border: `1px solid ${t.color}40` }}
        >
          {t.industry}
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const len = TESTIMONIALS.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setCurrent(((next % len) + len) % len);
  }, [len]);

  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => goTo(current + 1), 5500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, isHovered, goTo]);

  const prev = (current - 1 + len) % len;
  const next = (current + 1) % len;
  // Desktop shows [prev, current, next], mobile shows [current]
  const desktopIndices = [prev, current, next];

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

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Desktop — 3 cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 items-stretch">
            {desktopIndices.map((idx, pos) => {
              const isCenter = pos === 1;
              return (
                <div
                  key={pos}
                  className="transition-all duration-500"
                  style={{
                    opacity: isCenter ? 1 : 0.42,
                    transform: isCenter ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
                    cursor: isCenter ? 'default' : 'pointer',
                  }}
                  onClick={() => !isCenter && goTo(pos === 0 ? current - 1 : current + 1)}
                >
                  <Card t={TESTIMONIALS[idx]} active={isCenter} />
                </div>
              );
            })}
          </div>

          {/* Mobile — single card */}
          <div className="md:hidden max-w-md mx-auto">
            <Card t={TESTIMONIALS[current]} active />
          </div>

          {/* Gradient edge fades (desktop) */}
          <div
            className="hidden md:block absolute left-0 inset-y-0 w-28 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, #1e1b4b 0%, transparent 100%)' }}
          />
          <div
            className="hidden md:block absolute right-0 inset-y-0 w-28 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to left, #4338CA 0%, transparent 100%)' }}
          />
        </div>

        {/* Nav */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => goTo(current - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Poprzedni"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full cursor-pointer transition-all duration-400"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current ? 'white' : 'rgba(255,255,255,0.28)',
                }}
                aria-label={`Opinia ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(current + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Następny"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <ScrollReveal className="mt-16">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
