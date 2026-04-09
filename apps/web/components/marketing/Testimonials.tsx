'use client';

import { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-20">
    <path d="M11.3 5c-3.4 1.1-5.8 4.1-5.8 7.6 0 2.4 1.4 4.4 3.5 4.4 1.7 0 3-1.3 3-3s-1.1-2.7-2.7-2.7c-.3 0-.5 0-.8.1.4-2 2.2-3.7 4.3-4.2L11.3 5zm8.6 0c-3.4 1.1-5.8 4.1-5.8 7.6 0 2.4 1.4 4.4 3.5 4.4 1.7 0 3-1.3 3-3s-1.1-2.7-2.7-2.7c-.3 0-.5 0-.8.1.4-2 2.2-3.7 4.3-4.2L19.9 5z" />
  </svg>
);

const TESTIMONIALS = [
  {
    quote: 'Pierwszego dnia bot zebrał 3 zapytania o wizyty — wszystkie po 20:00. Nie odbierałam telefonu, a miałam pełny grafik na tydzień. Zwrot z inwestycji w 3 dni.',
    name: 'Katarzyna M.',
    role: 'Właścicielka Salon K., Wrocław',
    industry: 'Salon beauty',
    color: '#EC4899',
    stars: 5,
  },
  {
    quote: 'Miałam obawy że bot "nie zrozumie" pytań o zabiegi. Myliłam się — odpowiada lepiej niż ja, bo zna cennik na pamięć i nigdy nie jest zmęczona. Polecam każdemu gabinetowi.',
    name: 'Agnieszka T.',
    role: 'Fizjoterapeutka, Kraków',
    industry: 'Gabinet',
    color: '#06B6D4',
    stars: 5,
  },
  {
    quote: 'Najlepsza decyzja tego roku. Bot obsługuje pytania o menu, rezerwacje i alergie 24/7. Kelnerzy skupiają się na gościach, a nie na odpowiadaniu na Messengera.',
    name: 'Marek B.',
    role: 'Restauracja Smak, Poznań',
    industry: 'Restauracja',
    color: '#F97316',
    stars: 5,
  },
  {
    quote: 'Klienci zostawiają dane o 23:00, a ja rano mam gotową listę do oddzwonienia. Warsztaty samochodowe też potrzebują tego rozwiązania — szkoda że nie wiedziałem wcześniej.',
    name: 'Piotr W.',
    role: 'AutoSerwis Wierzbicki, Gdańsk',
    industry: 'Warsztat',
    color: '#64748B',
    stars: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => setCurrent((i + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, isHovered]);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-3">Opinie klientów</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Co mówią firmy,{' '}
            <span style={{ color: '#a5b4fc' }}>które już korzystają</span>
          </h2>
        </ScrollReveal>

        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main card */}
          <div
            className="relative rounded-3xl p-8 sm:p-12 text-center transition-all duration-500"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
          >
            {/* Quote mark */}
            <div className="flex justify-center mb-4 text-indigo-300">
              <QuoteIcon />
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6 text-amber-400">
              {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
            </div>

            {/* Quote text */}
            <blockquote
              className="text-lg sm:text-xl text-white leading-relaxed mb-8 font-medium min-h-24 transition-all duration-300"
              style={{ fontStyle: 'italic' }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: t.color }}
              >
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-indigo-300 text-sm">{t.role}</p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white mt-1"
                style={{ background: `${t.color}30`, border: `1px solid ${t.color}50` }}
              >
                {t.industry}
              </span>
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Poprzedni"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            aria-label="Następny"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300 rounded-full cursor-pointer"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                }}
                aria-label={`Opinia ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
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
