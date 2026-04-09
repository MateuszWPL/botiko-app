'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const INDUSTRIES = [
  {
    id: 'beauty',
    label: 'Salon beauty',
    emoji: '💅',
    color: '#EC4899',
    bg: '#FDF2F8',
    headline: 'Asystentka dla salonu urody',
    description:
      'Manicure, pedicure, stylizacja rzęs, brwi — bot zna Twój cennik i zapisuje klientki nawet o 23:00.',
    features: [
      'Odpowiada na pytania o cennik usług',
      'Informuje o dostępnych terminach',
      'Zbiera rezerwacje i dane klientek',
      'Odsyła do Booksy / Vagaro',
      'Wysyła przypomnienia o wizycie',
    ],
    sample: [
      { role: 'user', text: 'Ile kosztuje manicure hybrydowy?' },
      { role: 'bot', text: 'Manicure hybrydowy u nas kosztuje 90 zł 💅 Czas trwania ok. 75 minut. Wolny termin już jutro o 14:00 — zarezerwować?' },
    ],
  },
  {
    id: 'health',
    label: 'Gabinet',
    emoji: '🏥',
    color: '#06B6D4',
    bg: '#ECFEFF',
    headline: 'Asystentka dla gabinetu medycznego',
    description:
      'Fizjoterapia, kosmetologia, stomatologia — bot informuje o usługach i zbiera dane do rejestracji.',
    features: [
      'Odpowiada na pytania o zabiegi i ceny',
      'Informuje o wymaganiach przed wizytą',
      'Zbiera dane do rejestracji',
      'Odsyła do systemu rejestracji online',
      'Odpowiada na pytania o specjalistów',
    ],
    sample: [
      { role: 'user', text: 'Czy przyjmujecie bez skierowania na fizjo?' },
      { role: 'bot', text: 'Tak, do fizjoterapeuty nie potrzebujesz skierowania ✅ Pierwsza wizyta trwa 60 min i kosztuje 150 zł. Mamy wolny termin w środę o 10:00. Chcesz się zapisać?' },
    ],
  },
  {
    id: 'food',
    label: 'Restauracja',
    emoji: '🍽️',
    color: '#F97316',
    bg: '#FFF7ED',
    headline: 'Asystentka dla restauracji',
    description:
      'Godziny otwarcia, menu, rezerwacje stołów — bot obsługuje klientów nawet gdy lokal jest pełny.',
    features: [
      'Informuje o menu i specjalnościach dnia',
      'Przyjmuje rezerwacje stolików',
      'Odpowiada na pytania o alergie',
      'Informuje o godzinach i lokalizacji',
      'Obsługuje pytania o catering i eventy',
    ],
    sample: [
      { role: 'user', text: 'Czy przyjmujecie rezerwacje na jutro wieczór dla 6 osób?' },
      { role: 'bot', text: 'Oczywiście! 🍽️ Mamy wolny stolik jutro o 19:00 i 20:30. Jaka godzina odpowiada? Podaj imię i numer telefonu — potwierdzimy SMS-em.' },
    ],
  },
  {
    id: 'auto',
    label: 'Warsztat',
    emoji: '🔧',
    color: '#64748B',
    bg: '#F8FAFC',
    headline: 'Asystentka dla warsztatu',
    description:
      'Wyceny, terminy, pytania o usługi — bot odpowiada zamiast Ciebie, gdy masz ręce w silniku.',
    features: [
      'Odpowiada na pytania o usługi i ceny',
      'Zapisuje na diagnostykę i naprawę',
      'Informuje o czasie oczekiwania',
      'Zbiera dane pojazdu od klienta',
      'Wysyła potwierdzenie przyjęcia auta',
    ],
    sample: [
      { role: 'user', text: 'Ile kosztuje wymiana oleju i kiedy możecie przyjąć?' },
      { role: 'bot', text: 'Wymiana oleju to koszt 120–180 zł zależnie od rodzaju oleju 🔧 Czas: ok. 45 minut. Mamy wolny slot jutro o 9:00 i pojutrze o 13:00. Kiedy wpadacie?' },
    ],
  },
  {
    id: 'other',
    label: 'Inna branża',
    emoji: '✨',
    color: '#6366F1',
    bg: '#EEF2FF',
    headline: 'Asystentka dla każdej firmy usługowej',
    description:
      'Szkoła tańca, studio jogi, fotograf, tłumacz — stworzysz własny szablon dopasowany do Twojej działalności.',
    features: [
      'W pełni konfigurowalny szablon',
      'Wgrywasz własne FAQ i cennik',
      'Dostosowujesz styl komunikacji',
      'Integrujesz z dowolnym linkiem rezerwacji',
      'Wsparcie przy konfiguracji gratis',
    ],
    sample: [
      { role: 'user', text: 'Czy prowadzicie zajęcia dla początkujących?' },
      { role: 'bot', text: 'Tak! Mamy specjalny kurs dla zupełnych początkujących 🌟 Zajęcia w poniedziałki i środy o 18:00. Pierwszy próbny wejście za darmo. Chcesz zapisać się na próbne zajęcia?' },
    ],
  },
];

export default function Industries() {
  const [active, setActive] = useState(INDUSTRIES[0]);

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
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActive(ind)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={
                active.id === ind.id
                  ? { background: active.color, color: 'white', boxShadow: `0 4px 14px ${active.color}40` }
                  : { background: '#F1F5F9', color: '#475569' }
              }
            >
              <span>{ind.emoji}</span>
              {ind.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Content panel */}
        <div
          className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
          style={{ background: active.bg }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left — info */}
            <div className="p-8 lg:p-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{ background: `${active.color}18` }}
              >
                {active.emoji}
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">{active.headline}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{active.description}</p>

              <ul className="flex flex-col gap-3 mb-8">
                {active.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-slate-700">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                      style={{ background: active.color }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{ background: active.color }}
              >
                Wypróbuj dla {active.label.toLowerCase()}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Right — chat preview */}
            <div className="p-8 lg:p-12 flex items-center">
              <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: active.color }}
                  >
                    {active.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-text text-xs">{active.label}</p>
                    <p className="text-[10px] text-accent flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                      Online
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-3 p-4">
                  {active.sample.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
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
