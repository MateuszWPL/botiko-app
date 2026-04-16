'use client';

import { useRef, useState, useEffect } from 'react';
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

const NOTIFICATIONS = [
  {
    icon: '💬',
    accent: '#6366F1',
    bg: '#EEF2FF',
    label: 'Nowa wiadomość',
    body: 'Ile kosztuje manicure hybrydowy?',
    from: 'Karolina M.',
    time: 'przed chwilą',
  },
  {
    icon: '📞',
    accent: '#10B981',
    bg: '#ECFDF5',
    label: 'Bot zebrał lead!',
    body: 'Anna W. zostawiła numer — czeka na kontakt',
    from: 'Anna W.',
    time: '2 min temu',
  },
  {
    icon: '🌙',
    accent: '#8B5CF6',
    bg: '#F5F3FF',
    label: 'Odpowiedź o 23:17',
    body: 'Bot odpisał kiedy Ty spałaś',
    from: 'Monika K.',
    time: '5 min temu',
  },
  {
    icon: '⚡',
    accent: '#F59E0B',
    bg: '#FFFBEB',
    label: 'Błyskawiczna odpowiedź',
    body: 'Klientka spytała o wolne terminy w piątek',
    from: 'Natalia B.',
    time: '8 min temu',
  },
  {
    icon: '✅',
    accent: '#10B981',
    bg: '#ECFDF5',
    label: 'Lead przekonwertowany',
    body: 'Paulina umówiła wizytę przez Booksy',
    from: 'Paulina S.',
    time: '12 min temu',
  },
];

function LiveFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Show 3 notifications: incoming (top, animated), + 2 older below (static, dimmed)
  const items = [0, 1, 2].map((offset) => NOTIFICATIONS[(activeIndex + offset) % NOTIFICATIONS.length]);

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Live pill */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((notif, offset) => (
          <div
            key={`${notif.label}-${offset}`}
            className="flex items-start gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-500"
            style={{
              background: offset === 0 ? notif.bg : '#FAFAFA',
              borderColor: offset === 0 ? notif.accent + '33' : '#F1F5F9',
              opacity: offset === 0 ? (visible ? 1 : 0) : offset === 1 ? 0.65 : 0.35,
              transform: offset === 0 ? (visible ? 'translateY(0)' : 'translateY(-8px)') : 'none',
              boxShadow: offset === 0 ? `0 4px 24px ${notif.accent}18` : 'none',
            }}
          >
            {/* Icon */}
            <div
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: offset === 0 ? notif.accent + '18' : '#F1F5F9' }}
            >
              {notif.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: offset === 0 ? notif.accent : '#94A3B8' }}
                >
                  {notif.label}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 truncate">{notif.body}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{notif.from}</p>
            </div>
          </div>
        ))}
      </div>

      {/* "handled by bot" footer */}
      <p className="text-center text-[11px] text-slate-400 mt-3">
        Obsługiwane automatycznie przez Botiko — bez Twojego udziału
      </p>
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

        {/* Header */}
        <ScrollReveal className="text-center mb-12">
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

        {/* Live feed */}
        <ScrollReveal className="mb-14">
          <LiveFeed />
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
