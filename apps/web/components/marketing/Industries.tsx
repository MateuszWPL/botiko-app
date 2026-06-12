'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

// SVG icons per industry
const IconScissors = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconStethoscope = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);
const IconUtensils = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </svg>
);
const IconWrench = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconStar = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const INDUSTRIES = [
  {
    id: 'beauty',
    label: 'Salon beauty',
    href: '/dla/salon-beauty',
    Icon: IconScissors,
    color: '#EC4899',
    bg: '#FDF2F8',
    headline: 'Bot dla salonu urody',
    description: 'Manicure, stylizacja rzęs, brwi — bot odpowiada na pytania o usługi i ceny, zbiera leady nawet o 23:00.',
    features: ['Odpowiada na pytania o cennik i czas zabiegu', 'Zbiera dane klientki (imię, telefon, email)', 'Podpowiada gdzie zapisać się online (link do Booksy / Twojego systemu)', 'Obsługuje pytania o promocje i pakiety', 'Przypomina o godzinach otwarcia salonu'],
    sample: [
      { role: 'user', text: 'Ile kosztuje manicure hybrydowy?' },
      { role: 'bot', text: 'Manicure hybrydowy to 90 zł. Czas ok. 75 min. Chcesz się zapisać? Podaj imię i numer — rano sprawdzimy wolne godziny i oddzwonimy z propozycją.' },
    ],
  },
  {
    id: 'health',
    label: 'Gabinet',
    href: '/dla/gabinet-spa',
    Icon: IconStethoscope,
    color: '#06B6D4',
    bg: '#ECFEFF',
    headline: 'Bot dla gabinetu medycznego',
    description: 'Fizjoterapia, kosmetologia, stomatologia — bot odpowiada na pytania o zabiegi, zbiera dane pacjentów.',
    features: ['Odpowiada na pytania o zabiegi i ceny', 'Wyjaśnia wymagania przed wizytą', 'Zbiera dane pacjenta (imię, telefon, opis problemu)', 'Podsyła link do rejestracji online, jeśli masz', 'Informuje o specjalistach i godzinach pracy'],
    sample: [
      { role: 'user', text: 'Czy przyjmujecie bez skierowania na fizjo?' },
      { role: 'bot', text: 'Tak, bez skierowania. Pierwsza wizyta 60 min / 150 zł. Zostaw imię, telefon i krótki opis problemu — terapeuta oddzwoni po zabiegu z wolnym terminem.' },
    ],
  },
  {
    id: 'food',
    label: 'Restauracja',
    href: '/dla/restauracja',
    Icon: IconUtensils,
    color: '#F97316',
    bg: '#FFF7ED',
    headline: 'Bot dla restauracji',
    description: 'Menu, godziny, pytania o alergie — bot obsługuje gości nawet gdy jesteś w kuchni.',
    features: ['Informuje o menu i specjalnościach dnia', 'Zbiera zapytania o rezerwacje (imię, liczba osób, godzina) do potwierdzenia przez obsługę', 'Odpowiada na pytania o alergie i składniki', 'Informuje o godzinach i lokalizacji', 'Podsyła link do systemu rezerwacji online, jeśli masz'],
    sample: [
      { role: 'user', text: 'Czy przyjmujecie rezerwacje na jutro wieczór dla 6 osób?' },
      { role: 'bot', text: 'Zostaw imię, numer telefonu i preferowaną godzinę — obsługa oddzwoni z potwierdzeniem, jak tylko skończy się szczyt serwisu.' },
    ],
  },
  {
    id: 'auto',
    label: 'Warsztat',
    href: '/dla/warsztat-mechaniczny',
    Icon: IconWrench,
    color: '#64748B',
    bg: '#F8FAFC',
    headline: 'Bot dla warsztatu',
    description: 'Wyceny, usługi, terminy — bot odpowiada i zbiera leady gdy Ty naprawiasz auto.',
    features: ['Odpowiada na pytania o usługi i ceny', 'Zbiera dane pojazdu i właściciela (marka, rocznik, problem)', 'Informuje o przybliżonym czasie naprawy', 'Obsługuje pytania o gwarancje i promocje', 'Zna godziny pracy warsztatu'],
    sample: [
      { role: 'user', text: 'Ile kosztuje wymiana oleju i kiedy możecie przyjąć?' },
      { role: 'bot', text: 'Wymiana oleju: 120–180 zł, czas ~45 min. Pracujemy pn.–pt. 8:00–17:00. Zostaw imię, telefon i markę pojazdu — rano oddzwonimy z wolnym terminem.' },
    ],
  },
  {
    id: 'other',
    label: 'Inna branża',
    href: '/dla/inna',
    Icon: IconStar,
    color: '#6366F1',
    bg: '#EEF2FF',
    headline: 'Bot dla każdej firmy usługowej',
    description: 'Szkoła tańca, studio jogi, fotograf — tworzysz szablon w 15 minut wgrywając własne FAQ.',
    features: ['W pełni konfigurowalny szablon', 'Wgrywasz własne FAQ i cennik', 'Dostosowujesz styl komunikacji', 'Zbiera leady (imię, email, telefon)', 'Wsparcie przy konfiguracji gratis'],
    sample: [
      { role: 'user', text: 'Czy prowadzicie zajęcia dla początkujących?' },
      { role: 'bot', text: 'Tak! Mamy kurs dla zupełnych początkujących 🌟 Zajęcia pn. i śr. o 18:00. Zainteresowany? Wpisz imię i numer — wyślemy szczegóły!' },
    ],
  },
];

export default function Industries() {
  const [active, setActive] = useState(INDUSTRIES[0]);
  const [fading, setFading] = useState(false);

  function selectIndustry(ind: typeof INDUSTRIES[0]) {
    if (ind.id === active.id) return;
    setFading(true);
    setTimeout(() => {
      setActive(ind);
      setFading(false);
    }, 250);
  }

  return (
    <section id="branze" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Branże</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Gotowy szablon dla{' '}
            <span className="gradient-text">Twojej branży</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Wybierz branżę — bot dostaje gotową wiedzę i styl komunikacji.
          </p>
        </ScrollReveal>

        {/* Tab pills */}
        <ScrollReveal className="flex flex-wrap justify-center gap-2 mb-10">
          {INDUSTRIES.map((ind) => {
            const isActive = active.id === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => selectIndustry(ind)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={
                  isActive
                    ? { background: ind.color, color: 'white', boxShadow: `0 4px 14px ${ind.color}45` }
                    : { background: '#F1F5F9', color: '#475569' }
                }
              >
                <span
                  className="w-5 h-5 flex items-center justify-center"
                  style={{ color: isActive ? 'white' : ind.color }}
                >
                  <ind.Icon />
                </span>
                {ind.label}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Content panel with fade transition — inline transition so opacity+color change together */}
        <div
          className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
          style={{
            background: active.bg,
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease, background 0.25s ease',
          }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left — info */}
            <div className="p-8 lg:p-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${active.color}18`, color: active.color, border: `1px solid ${active.color}25` }}
              >
                <active.Icon />
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">{active.headline}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{active.description}</p>

              <ul className="flex flex-col gap-3 mb-8">
                {active.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-slate-700">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ background: active.color }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/rejestracja"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white cursor-pointer"
                  style={{ background: active.color, transition: 'opacity 0.2s ease, background 0.25s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Wypróbuj dla {active.label.toLowerCase()}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer hover:underline"
                  style={{ color: active.color }}
                >
                  Zobacz stronę: bot dla {active.label.toLowerCase()}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right — chat preview */}
            <div className="p-8 lg:p-12 flex items-center">
              <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ background: active.color }}
                  >
                    <active.Icon />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-xs">{active.label}</p>
                    <p className="text-[10px] text-accent flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4">
                  {active.sample.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed"
                        style={
                          msg.role === 'user'
                            ? { background: active.color, color: 'white', borderBottomRightRadius: 4 }
                            : { background: '#F1F5F9', color: '#0F172A', borderBottomLeftRadius: 4 }
                        }
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
