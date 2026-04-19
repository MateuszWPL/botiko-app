'use client';

import { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const FEATURES = [
  { text: '1 bot AI odpowiadający 24/7 na Twojej stronie', strong: true },
  { text: 'Do 1 000 rozmów z klientami miesięcznie', strong: false },
  { text: 'Gotowy szablon branżowy — beauty, health, food, auto', strong: false },
  { text: 'Własna baza wiedzy: cennik, FAQ, godziny pracy', strong: false },
  { text: 'Automatyczne zbieranie leadów (imię + telefon)', strong: true },
  { text: 'Email powiadomienie o każdym nowym leadzie', strong: false },
  { text: 'Dashboard z historią rozmów i leadów', strong: false },
  { text: 'Kolorowy widget dopasowany do Twojej marki', strong: false },
  { text: 'Wsparcie e-mail — odpowiadamy w 24h', strong: false },
];

// Presets auto-cycle co 4s żeby zademonstrować różne scenariusze
const PRESETS = [
  { clients: 4, avg: 150 },
  { clients: 10, avg: 220 },
  { clients: 6, avg: 350 },
  { clients: 15, avg: 180 },
  { clients: 8, avg: 290 },
];

const LERP = 0.09;
const CYCLE_MS = 4000;
const PAUSE_MS = 10_000;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Pricing() {
  const planCost = 99;

  // targetRef — gdzie chcemy dojść (zmienia auto-cycle lub user)
  const targetRef = useRef({ clients: PRESETS[0].clients, avg: PRESETS[0].avg });

  // anim — płynne float wartości interpolowane do target
  const [anim, setAnim] = useState({ clients: PRESETS[0].clients, avg: PRESETS[0].avg });

  const pauseUntilRef = useRef(0);
  const presetIdxRef = useRef(0);

  // RAF lerp loop — działa przez cały czas, zatrzymuje się gdy prev === target
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setAnim(prev => {
        const tc = targetRef.current.clients;
        const ta = targetRef.current.avg;
        const cd = tc - prev.clients;
        const ad = ta - prev.avg;
        if (Math.abs(cd) < 0.05 && Math.abs(ad) < 0.5) {
          // Zwróć ten sam obiekt → React pomija re-render
          if (prev.clients === tc && prev.avg === ta) return prev;
          return { clients: tc, avg: ta };
        }
        return { clients: prev.clients + cd * LERP, avg: prev.avg + ad * LERP };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-cycle między presetami
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      presetIdxRef.current = (presetIdxRef.current + 1) % PRESETS.length;
      targetRef.current = PRESETS[presetIdxRef.current];
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const pauseAutoPlay = () => {
    pauseUntilRef.current = Date.now() + PAUSE_MS;
  };

  const handleClientsChange = (v: number) => {
    targetRef.current = { ...targetRef.current, clients: v };
    setAnim(prev => ({ ...prev, clients: v })); // snap — brak opóźnienia przy dragowaniu
    pauseAutoPlay();
  };

  const handleAvgChange = (v: number) => {
    targetRef.current = { ...targetRef.current, avg: v };
    setAnim(prev => ({ ...prev, avg: v }));
    pauseAutoPlay();
  };

  const displayClients = Math.round(anim.clients);
  const displayAvg = Math.round(anim.avg);
  const monthlyRevenue = displayClients * displayAvg;
  const netProfit = monthlyRevenue - planCost;
  const roiX = (monthlyRevenue / planCost).toFixed(1);

  return (
    <section id="cennik" className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Cennik</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            99 zł miesięcznie.{' '}
            <span className="gradient-text">Wszystko w środku.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Jeden plan bez ukrytych kosztów. 14 dni za darmo — bez karty kredytowej.
          </p>
        </ScrollReveal>

        {/* Two-column layout */}
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* LEFT — Plan card */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand/25 h-full"
              style={{ background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)' }}
            >
              <div className="text-center pt-8 pb-2 px-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  14 dni za darmo · bez karty kredytowej
                </span>

                <h3 className="text-6xl font-extrabold text-white mb-1">99 zł</h3>
                <p className="text-indigo-200 text-sm mb-1">miesięcznie · bez umowy · cancel kiedy chcesz</p>

                <div className="mt-3 mb-2 inline-block bg-white/15 rounded-xl px-4 py-2">
                  <p className="text-white text-sm font-semibold">= 3,30 zł dziennie</p>
                  <p className="text-indigo-200 text-xs">1 klientka w miesiącu zwraca cały koszt</p>
                </div>
              </div>

              <div className="px-8 pt-6 pb-8">
                <ul className="flex flex-col gap-3 mb-8">
                  {FEATURES.map((feat) => (
                    <li key={feat.text} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center text-indigo-200">
                        <CheckIcon />
                      </span>
                      <span className={feat.strong ? 'text-white font-semibold' : 'text-indigo-100'}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/rejestracja"
                  className="block text-center py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:bg-brand-soft hover:-translate-y-0.5 transition-all"
                >
                  Sprawdź Botiko przez 14 dni — bez karty
                </Link>
                <p className="text-center text-indigo-300 text-xs mt-3">
                  Konfiguracja w 15 minut · Bez umowy · Anulujesz kiedy chcesz
                </p>

                {/* Trust bar */}
                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-center gap-5 text-xs text-indigo-300 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    AES-256
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Serwery w UE · RODO
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Bez karty
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — ROI Calculator */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-brand uppercase tracking-widest">Kalkulator ROI</p>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    live
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text">Czy 99 zł się zwróci?</h3>
                <p className="text-slate-500 text-sm mt-1">Przeciągnij suwaki i sprawdź swój zwrot z inwestycji</p>
              </div>

              <div className="flex flex-col gap-7 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text">
                      Nowi klienci przez bota / miesiąc
                    </label>
                    <span className="text-lg font-extrabold text-brand tabular-nums w-8 text-right">
                      {displayClients}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={displayClients}
                    onChange={(e) => handleClientsChange(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand h-2 rounded-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 klient</span><span>20 klientów</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text">
                      Średnia wartość wizyty / zamówienia
                    </label>
                    <span className="text-lg font-extrabold text-brand tabular-nums w-16 text-right">
                      {displayAvg} zł
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    value={displayAvg}
                    onChange={(e) => handleAvgChange(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand h-2 rounded-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>50 zł</span><span>500 zł</span>
                  </div>
                </div>
              </div>

              {/* Results grid */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="col-span-2 rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)' }}>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Zwrot z inwestycji</p>
                  <p className="text-5xl font-extrabold text-white tabular-nums">{roiX}×</p>
                  <p className="text-indigo-200 text-xs mt-1">w pierwszym miesiącu</p>
                </div>

                <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600 whitespace-nowrap tabular-nums">
                    {monthlyRevenue} zł
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Przychód / mies.</p>
                </div>

                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100 text-center">
                  <p className="text-2xl font-extrabold text-slate-700 whitespace-nowrap tabular-nums">{planCost} zł</p>
                  <p className="text-xs text-slate-500 mt-1">Koszt Botiko / mies.</p>
                </div>

                <div
                  className="col-span-2 rounded-2xl p-4 border text-center transition-colors duration-300"
                  style={{
                    backgroundColor: netProfit >= 0 ? '#f0fdf4' : '#fef2f2',
                    borderColor: netProfit >= 0 ? '#bbf7d0' : '#fecaca',
                  }}
                >
                  <p className={`text-3xl font-extrabold tabular-nums ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {netProfit >= 0 ? '+' : ''}{netProfit} zł
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Zysk netto / miesiąc</p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                * Szacunki orientacyjne. Rzeczywiste wyniki zależą od branży i jakości ruchu.
              </p>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
