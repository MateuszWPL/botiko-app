'use client';

import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const DEMO_BOT_ID = process.env.NEXT_PUBLIC_DEMO_BOT_ID;

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Odpowiada 24/7',
    desc: 'Niedziela 23:00, poniedziałek 6:00 — zawsze gotowy. Nawet kiedy śpisz.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      </svg>
    ),
    title: 'Zbiera leady automatycznie',
    desc: 'Imię, telefon, pytanie — wszystko trafia do panelu. Ty dzwonisz do gotowego leada.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    title: 'Zna Twój cennik na pamięć',
    desc: 'Wklejasz cennik, godziny, FAQ — bot odpowiada precyzyjnie, nie jak generyczny ChatGPT.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Odsyła do rezerwacji',
    desc: 'Link do Booksy, Calendly lub własnego formularza — integracja w 1 kliknięcie.',
  },
];

declare global {
  interface Window {
    BotikoWidget?: { open: () => void; close: () => void; toggle: () => void };
  }
}

export default function Demo() {
  const sectionRef = useRef<HTMLElement>(null);
  const openedRef = useRef(false);

  // Auto-open bot when scrolling into this section (once per page load)
  useEffect(() => {
    if (!DEMO_BOT_ID) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !openedRef.current) {
          openedRef.current = true;
          setTimeout(() => {
            window.BotikoWidget?.open();
          }, 1500);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleOpenBot() {
    window.BotikoWidget?.open();
  }

  return (
    <section ref={sectionRef} id="demo" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Demo na żywo</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Sprawdź jak Botiko{' '}
            <span className="gradient-text">działa w praktyce</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Kliknij ikonkę czatu w prawym dolnym rogu strony i porozmawiaj z prawdziwym botem Botiko — dokładnie takim, który możesz mieć na swojej stronie.
          </p>
          {DEMO_BOT_ID && (
            <button
              onClick={handleOpenBot}
              className="mt-6 inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-brand text-white font-bold text-base shadow-xl hover:bg-brand-dark hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Wypróbuj demo bota
            </button>
          )}
        </ScrollReveal>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-100 hover:border-brand/25 hover:shadow-sm transition-all">
                <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  {f.icon}
                </span>
                <p className="font-semibold text-text text-sm">{f.title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

    </section>
  );
}
