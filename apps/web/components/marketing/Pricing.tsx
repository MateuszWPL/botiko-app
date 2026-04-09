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
    features: [
      '1 bot / 1 lokalizacja',
      'Do 200 rozmów miesięcznie',
      'Gotowy szablon branżowy',
      'Widget na stronę www',
      'Zbieranie leadów',
      'Wsparcie e-mail',
    ],
    missing: ['Własne szkolenie bota', 'Integracja z Booksy', 'Priorytetowe wsparcie'],
    cta: 'Zacznij za darmo',
    ctaStyle: 'outline',
  },
  {
    name: 'Pro',
    monthly: 149,
    yearly: 119,
    description: 'Najpopularniejszy — dla aktywnych salonów i gabinetów',
    highlight: true,
    badge: '🔥 Najpopularniejszy',
    features: [
      '3 boty / 3 lokalizacje',
      'Nieograniczone rozmowy',
      'Gotowy szablon branżowy',
      'Widget na stronę + FB Messenger',
      'Zbieranie leadów + CRM export',
      'Własna baza wiedzy (FAQ, cennik)',
      'Integracja z Booksy i Calendly',
      'Wsparcie chat (odpowiedź <4h)',
    ],
    missing: [],
    cta: 'Zacznij za darmo',
    ctaStyle: 'solid',
  },
  {
    name: 'Premium',
    monthly: 299,
    yearly: 239,
    description: 'Dla sieci salonów i firm z dużym ruchem',
    highlight: false,
    features: [
      'Nielimitowane boty',
      'Nieograniczone rozmowy',
      'Wszystko z Pro',
      'Biały label (własne logo bota)',
      'Własna domena widgetu',
      'Priorytetowe wsparcie 24/7',
      'Dedykowany onboarding',
      'SLA 99,9% uptime',
    ],
    missing: [],
    cta: 'Porozmawiajmy',
    ctaStyle: 'outline',
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const discount = Math.round((1 - 119 / 149) * 100);

  return (
    <section id="cennik" className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Cennik</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Prosty cennik.{' '}
            <span className="gradient-text">Żadnych niespodzianek.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            14 dni za darmo na każdym planie. Bez karty kredytowej.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-white rounded-full px-5 py-3 shadow-sm border border-slate-100">
            <span className={`text-sm font-medium ${!yearly ? 'text-text' : 'text-slate-400'}`}>Miesięcznie</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ background: yearly ? '#6366F1' : '#CBD5E1' }}
              aria-label="Przełącz rozliczenie"
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ transform: yearly ? 'translateX(26px)' : 'translateX(4px)' }}
              />
            </button>
            <span className={`text-sm font-medium ${yearly ? 'text-text' : 'text-slate-400'}`}>
              Rocznie
              <span className="ml-1.5 inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold">
                -{discount}%
              </span>
            </span>
          </div>
        </ScrollReveal>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={(i + 1) as 1 | 2 | 3} className="h-full">
              <div
                className={`h-full flex flex-col rounded-3xl p-7 border transition-shadow ${
                  plan.highlight
                    ? 'bg-brand shadow-xl shadow-brand/20 border-brand text-white scale-105'
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4 self-start">
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
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>
                    /mies.
                  </span>
                  {yearly && (
                    <p className={`text-xs mt-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>
                      Rozliczane rocznie ({plan.yearly * 12} zł/rok)
                    </p>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-accent'}`}>
                        ✓
                      </span>
                      <span className={plan.highlight ? 'text-indigo-100' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                  {plan.missing.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm opacity-40">
                      <span className="mt-0.5 shrink-0">✗</span>
                      <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Premium' ? 'mailto:hello@botiko.pl' : '/register'}
                  className={`text-center py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 ${
                    plan.highlight
                      ? 'bg-white text-brand hover:bg-brand-soft'
                      : plan.ctaStyle === 'solid'
                      ? 'bg-brand text-white hover:bg-brand-dark'
                      : 'border-2 border-brand text-brand hover:bg-brand-soft'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ROI calculator */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Kalkulator ROI</p>
            <h3 className="text-2xl font-bold text-text mb-3">
              Zwrot z inwestycji w <span className="gradient-text">pierwszy miesiąc</span>
            </h3>
            <div className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-6 mt-6">
              {[
                { label: 'Bot Pro kosztuje', value: '149 zł/mies.' },
                { label: '1 nowa klientka tygodniowo', value: '4 × 150 zł = 600 zł' },
                { label: 'Zwrot z inwestycji', value: '4× w miesiąc', highlight: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-5 rounded-2xl ${item.highlight ? 'bg-accent/10 border border-accent/20' : 'bg-slate-50'}`}
                >
                  <p className={`text-2xl font-extrabold mb-1 ${item.highlight ? 'text-accent' : 'text-text'}`}>
                    {item.value}
                  </p>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-400">
              * Przy średniej wartości wizyty 150 zł i 1 nowej klientce tygodniowo pozyskanej przez bota
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
