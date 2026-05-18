'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Koniec z kopiuj-wklej',
    desc: 'Nie musisz już osobiście odpisywać na te same pytania o ceny czy dojazd kilkanaście razy dziennie.',
  },
];

function LogoReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex justify-center lg:justify-end items-center">
      <style>{`
        @keyframes botiko-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes botiko-glow-pulse {
          0%, 100% { opacity: 0.22; transform: scale(1.7); }
          50% { opacity: 0.38; transform: scale(1.85); }
        }
        @media (prefers-reduced-motion: reduce) {
          .botiko-logo-float { animation: none !important; }
          .botiko-logo-glow { animation: none !important; }
        }
      `}</style>
      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateX(0)' : 'translateX(-45%)',
          transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="botiko-logo-float relative inline-block cursor-default"
          style={{ animation: inView ? 'botiko-float 4s ease-in-out infinite' : 'none' }}
        >
          {/* Outer glow — pulses in sync with float */}
          <div
            className="botiko-logo-glow absolute inset-0 rounded-[2.5rem] blur-3xl"
            style={{
              background: '#6366F1',
              opacity: 0.22,
              transform: 'scale(1.7)',
              animation: inView ? 'botiko-glow-pulse 4s ease-in-out infinite' : 'none',
            }}
          />
          {/* Card — hover scale */}
          <div
            className="relative rounded-[2rem] p-8 transition-transform duration-300 hover:scale-[1.04]"
            style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)' }}
          >
            <Image
              src="/botiko-mark.svg"
              alt="Botiko"
              width={120}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    BotikoWidget?: { open: () => void; close: () => void; toggle: () => void };
  }
}

export default function Demo() {
  const sectionRef = useRef<HTMLElement>(null);

  function handleOpenBot() {
    window.BotikoWidget?.open();
  }

  return (
    <section ref={sectionRef} id="demo" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Left / Right hero row */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">

          {/* Left — text */}
          <ScrollReveal>
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Demo na żywo</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight">
              Sprawdź jak Botiko{' '}
              <span className="gradient-text">działa w praktyce</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-lg">
              Kliknij ikonkę czatu w prawym dolnym rogu strony i porozmawiaj z prawdziwym botem Botiko — dokładnie takim, który możesz mieć na swojej stronie.
            </p>
            {DEMO_BOT_ID && (
              <button
                onClick={handleOpenBot}
                className="mt-8 inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-brand text-white font-bold text-base shadow-xl hover:bg-brand-dark hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Wypróbuj demo bota
              </button>
            )}
          </ScrollReveal>

          {/* Right — logo slides in from center */}
          <LogoReveal />
        </div>

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
