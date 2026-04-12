'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const FEATURES = [
  '1 bot AI na Twojej stronie www',
  'Nieograniczone rozmowy z klientami',
  'Gotowy szablon branżowy (beauty, health, food, auto)',
  'Własna baza wiedzy — cennik, FAQ, godziny pracy',
  'Automatyczne zbieranie leadów (imię + telefon)',
  'Email powiadomienie o każdym nowym leadzie',
  'Dashboard z historią rozmów i leadów',
  'Kolorowy widget dopasowany do Twojej marki',
  'Wsparcie e-mail',
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Pricing() {
  const [clientsPerMonth, setClientsPerMonth] = useState(4);
  const [avgValue, setAvgValue] = useState(150);
  const planCost = 149;
  const monthlyRevenue = clientsPerMonth * avgValue;
  const netProfit = monthlyRevenue - planCost;
  const roiX = (monthlyRevenue / planCost).toFixed(1);

  return (
    <section id="cennik" className="py-24 bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Cennik</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Prosty cennik.{' '}
            <span className="gradient-text">Żadnych niespodzianek.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Jeden plan. Wszystko w środku. 14 dni za darmo — bez karty kredytowej.
          </p>
        </ScrollReveal>

        {/* Single plan card */}
        <ScrollReveal className="mb-14">
          <div className="max-w-lg mx-auto">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand/25"
              style={{ background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)' }}
            >
              {/* Badge */}
              <div className="text-center pt-8 pb-2 px-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Jeden plan — wszystko w środku
                </span>
                <h3 className="text-5xl font-extrabold text-white mb-1">
                  149 zł
                </h3>
                <p className="text-indigo-200 text-base mb-1">miesięcznie · bez umowy</p>
                <p className="text-white/90 text-sm font-semibold">
                  ✓ 14 dni za darmo, bez karty kredytowej
                </p>
              </div>

              <div className="px-8 pt-6 pb-8">
                <ul className="flex flex-col gap-3 mb-8">
                  {FEATURES.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center text-indigo-200">
                        <CheckIcon />
                      </span>
                      <span className="text-indigo-100">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/rejestracja"
                  className="block text-center py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:bg-brand-soft hover:-translate-y-0.5 transition-all"
                >
                  Zacznij za darmo — 14 dni
                </Link>
                <p className="text-center text-indigo-300 text-xs mt-3">
                  Bez karty · Cancel kiedy chcesz · Konfiguracja w 15 min
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive ROI calculator */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-2">Kalkulator ROI</p>
              <h3 className="text-2xl font-bold text-text">
                Ile zarobisz dzięki botowi?
              </h3>
              <p className="text-slate-500 text-sm mt-1">Przeciągnij suwaki i sprawdź swój zwrot z inwestycji</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Sliders */}
              <div className="flex flex-col gap-7">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text">
                      Nowi klienci przez bota / miesiąc
                    </label>
                    <span className="text-lg font-extrabold text-brand whitespace-nowrap">{clientsPerMonth}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={clientsPerMonth}
                    onChange={(e) => setClientsPerMonth(Number(e.target.value))}
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
                    <span className="text-lg font-extrabold text-brand whitespace-nowrap">{avgValue} zł</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={avgValue}
                    onChange={(e) => setAvgValue(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand h-2 rounded-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>50 zł</span><span>500 zł</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)' }}>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Zwrot z inwestycji</p>
                  <p className="text-4xl font-extrabold text-white">{roiX}×</p>
                  <p className="text-indigo-200 text-xs mt-1">w pierwszym miesiącu</p>
                </div>

                <div className="rounded-2xl p-4 bg-accent/8 border border-accent/15 text-center">
                  <p className="text-2xl font-extrabold text-accent whitespace-nowrap">{monthlyRevenue} zł</p>
                  <p className="text-xs text-slate-500 mt-1">Przychód z bota / mies.</p>
                </div>

                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100 text-center">
                  <p className="text-2xl font-extrabold text-text whitespace-nowrap">{planCost} zł</p>
                  <p className="text-xs text-slate-500 mt-1">Koszt planu / mies.</p>
                </div>

                <div className="col-span-2 rounded-2xl p-4 bg-slate-50 border border-slate-100 text-center">
                  <p className={`text-2xl font-extrabold whitespace-nowrap ${netProfit >= 0 ? 'text-accent' : 'text-red-500'}`}>
                    {netProfit >= 0 ? '+' : ''}{netProfit} zł
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Zysk netto / miesiąc</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              * Szacunki oparte na podanych danych. Rzeczywiste wyniki zależą od branży i jakości ruchu.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
