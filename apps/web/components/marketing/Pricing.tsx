'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Starter',
    monthly: 79,
    yearly: 63,
    description: 'Na start — dla małych firm testujących bota',
    highlight: false,
    features: ['1 bot / 1 lokalizacja', 'Do 200 rozmów miesięcznie', 'Gotowy szablon branżowy', 'Widget na stronę www', 'Zbieranie leadów', 'Wsparcie e-mail'],
    missing: ['Własna baza wiedzy', 'Integracja z Booksy', 'Priorytetowe wsparcie'],
    cta: 'Zacznij za darmo',
    href: '/register',
  },
  {
    name: 'Pro',
    monthly: 149,
    yearly: 119,
    description: 'Najpopularniejszy — dla aktywnych salonów i gabinetów',
    highlight: true,
    badge: 'Najpopularniejszy',
    features: ['3 boty / 3 lokalizacje', 'Nieograniczone rozmowy', 'Gotowy szablon branżowy', 'Widget + FB Messenger', 'Leady + CRM export', 'Własna baza wiedzy (FAQ, cennik)', 'Integracja z Booksy i Calendly', 'Chat wsparcie (odpowiedź <4h)'],
    missing: [],
    cta: 'Zacznij za darmo',
    href: '/register',
  },
  {
    name: 'Premium',
    monthly: 299,
    yearly: 239,
    description: 'Dla sieci salonów i firm z dużym ruchem',
    highlight: false,
    features: ['Nielimitowane boty', 'Nieograniczone rozmowy', 'Wszystko z Pro', 'Biały label (własne logo)', 'Własna domena widgetu', 'Priorytetowe wsparcie 24/7', 'Dedykowany onboarding', 'SLA 99,9% uptime'],
    missing: [],
    cta: 'Porozmawiajmy',
    href: 'mailto:hello@botiko.pl',
  },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  // ROI calculator state
  const [clientsPerMonth, setClientsPerMonth] = useState(4);
  const [avgValue, setAvgValue] = useState(150);
  const planCost = 149;
  const monthlyRevenue = clientsPerMonth * avgValue;
  const netProfit = monthlyRevenue - planCost;
  const roiX = (monthlyRevenue / planCost).toFixed(1);

  return (
    <section id="cennik" className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Cennik</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Prosty cennik.{' '}
            <span className="gradient-text">Żadnych niespodzianek.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">14 dni za darmo na każdym planie. Bez karty kredytowej.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-white rounded-full px-5 py-3 shadow-sm border border-slate-100">
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-text' : 'text-slate-400'}`}>
              Miesięcznie
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              style={{ background: yearly ? '#6366F1' : '#CBD5E1' }}
              aria-label="Przełącz rozliczenie"
            >
              <span
                className="block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
                style={{ transform: yearly ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-text' : 'text-slate-400'}`}>
              Rocznie
              <span className="ml-1.5 inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold">
                -20%
              </span>
            </span>
          </div>
        </ScrollReveal>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-14 items-stretch">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={(i + 1) as 1 | 2 | 3} className="h-full">
              <div
                className={`h-full flex flex-col rounded-3xl p-7 border transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-brand shadow-xl shadow-brand/20 border-brand'
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                }`}
              >
                {plan.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4 self-start">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {plan.badge}
                  </span>
                )}

                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-text'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-5 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-text'}`}>
                    {yearly ? plan.yearly : plan.monthly} zł
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>/mies.</span>
                  <div
                    className={`h-5 mt-1 text-xs ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}
                  >
                    {yearly && `Rocznie ${plan.yearly * 12} zł`}
                  </div>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center ${plan.highlight ? 'text-indigo-200' : 'text-accent'}`}>
                        <CheckIcon />
                      </span>
                      <span className={plan.highlight ? 'text-indigo-100' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                  {plan.missing.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm opacity-35">
                      <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
                        <XIcon />
                      </span>
                      <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                    plan.highlight
                      ? 'bg-white text-brand hover:bg-brand-soft'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

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
                {/* Slider 1 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text">
                      Nowi klienci przez bota / miesiąc
                    </label>
                    <span className="text-lg font-extrabold text-brand">{clientsPerMonth}</span>
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

                {/* Slider 2 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text">
                      Średnia wartość wizyty / zamówienia
                    </label>
                    <span className="text-lg font-extrabold text-brand">{avgValue} zł</span>
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
                  <p className="text-2xl font-extrabold text-accent">{monthlyRevenue} zł</p>
                  <p className="text-xs text-slate-500 mt-1">Przychód z bota / mies.</p>
                </div>

                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100 text-center">
                  <p className="text-2xl font-extrabold text-text">{planCost} zł</p>
                  <p className="text-xs text-slate-500 mt-1">Koszt planu Pro / mies.</p>
                </div>

                <div className="col-span-2 rounded-2xl p-4 bg-slate-50 border border-slate-100 text-center">
                  <p className={`text-2xl font-extrabold ${netProfit >= 0 ? 'text-accent' : 'text-red-500'}`}>
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
