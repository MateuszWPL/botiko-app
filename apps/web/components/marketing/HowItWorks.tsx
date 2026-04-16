'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

/* ─── Step visual mockups ──────────────────────────────────── */

function MockupBranch() {
  const IconScissors = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
  const IconStethoscope = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
  const IconUtensils = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
  const IconWrench = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
  const IconClipboard = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );

  const INDUSTRIES = [
    { label: 'Salon beauty', color: '#EC4899', Icon: IconScissors },
    { label: 'Gabinet / SPA', color: '#06B6D4', Icon: IconStethoscope },
    { label: 'Restauracja', color: '#F97316', Icon: IconUtensils },
    { label: 'Warsztat', color: '#64748B', Icon: IconWrench },
    { label: 'Inna branża', color: '#8B5CF6', Icon: IconClipboard },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Wybierz branżę</p>
      <div className="flex flex-col gap-2">
        {INDUSTRIES.map((ind, i) => (
          <div
            key={ind.label}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium"
            style={
              i === activeIndex
                ? { background: '#EEF2FF', color: '#4338CA', border: '1.5px solid #6366F1' }
                : { background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }
            }
          >
            <span className="w-4 h-4 flex items-center justify-center" aria-hidden>
              <ind.Icon color={i === activeIndex ? ind.color : '#94A3B8'} />
            </span>
            <span>{ind.label}</span>
            {i === activeIndex && (
              <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></motion.svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupKnowledge() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Baza wiedzy</p>
      <div className="flex flex-col gap-2.5">
        {[
          { label: 'Cennik usług', preview: 'Manicure hybrydowy — 90 zł, Pedicure — 80 zł...', color: '#6366F1' },
          { label: 'Godziny otwarcia', preview: 'Pon–Pt 9:00–19:00, Sob 9:00–15:00...', color: '#10B981' },
          { label: 'FAQ', preview: 'Czy przyjmujecie bez rezerwacji? Tak, jeśli...', color: '#F59E0B' },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ background: item.color }}
            />
            <div>
              <p className="text-xs font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed truncate max-w-[180px]">{item.preview}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-brand/40 text-brand text-xs font-medium cursor-pointer hover:bg-brand-soft transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Dodaj kolejny wpis
        </div>
      </div>
    </div>
  );
}

function MockupChat() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center">
          <span className="text-brand text-xs font-bold">B</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Bot Twojej firmy</p>
          <p className="text-[10px] text-accent flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse"/>
            Online 24/7
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-slate-100 text-slate-700 text-xs max-w-[85%] leading-relaxed">
            Dzień dobry! W czym mogę dziś pomóc? 😊
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 bg-brand text-white text-xs max-w-[85%] leading-relaxed">
            Ile kosztuje manicure hybrydowy?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-slate-100 text-slate-700 text-xs max-w-[85%] leading-relaxed">
            Manicure hybrydowy to 90 zł ✨<br/>Podaj swój numer telefonu, a nasza recepcja od razu oddzwoni z terminami!
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-400 flex-1">Napisz wiadomość...</span>
          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Steps data ──────────────────────────────────────────── */

const STEPS = [
  {
    num: '01',
    title: 'Wybierz branżę',
    desc: 'Salon beauty, gabinet, restauracja, warsztat — wybierasz jeden szablon. Bot dostaje gotową wiedzę o Twojej branży od razu.',
    badge: 'Gotowe szablony dla 5 branż',
    Mockup: MockupBranch,
  },
  {
    num: '02',
    title: 'Dodaj wiedzę o firmie',
    desc: 'Wklej cennik, godziny pracy, odpowiedzi na najczęstsze pytania. Bot uczy się w kilka minut — bez programowania.',
    badge: 'Wdrożenie w ~15 minut',
    Mockup: MockupKnowledge,
  },
  {
    num: '03',
    title: 'Bot pracuje za Ciebie',
    desc: 'Jeden fragment kodu HTML na Twojej stronie. Bot odpowiada na pytania i błyskawicznie zbiera numery telefonów od klientów 24/7.',
    badge: 'Leady w panelu od razu',
    Mockup: MockupChat,
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-dziala" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Jak to działa</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Gotowy bot w{' '}
            <span className="gradient-text">3 krokach</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Bez programisty. Bez agencji. Bez umowy na rok.
          </p>
        </ScrollReveal>

        <div className="relative grid lg:grid-cols-3 gap-8">
          {/* SVG Arrow 1: Od kroku 1 do 2 */}
          <div className="hidden lg:block absolute top-[15%] left-[30%] w-[10%] h-16 pointer-events-none z-10">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <motion.path
                d="M 0,25 C 40,-15 60,65 100,25"
                fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="6,6" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
              />
              <motion.circle cx="100" cy="25" r="4" fill="#6366F1"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.8 }}
              />
            </svg>
          </div>

          {/* SVG Arrow 2: Od kroku 2 do 3 */}
          <div className="hidden lg:block absolute top-[20%] left-[64%] w-[10%] h-16 pointer-events-none z-10">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <motion.path
                d="M 0,25 C 40,65 60,-15 100,25"
                fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="6,6" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.8 }}
              />
              <motion.circle cx="100" cy="25" r="4" fill="#6366F1"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 2.2 }}
              />
            </svg>
          </div>

          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} delay={(i + 1) as 1 | 2 | 3}>
              <div className="flex flex-col h-full bg-white relative z-20">
                {/* Visual mockup */}
                <div className="mb-6 rounded-2xl overflow-hidden bg-slate-50 p-5 border border-slate-100 relative group transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
                  <step.Mockup />
                </div>

                {/* Step info */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4338CA)' }}
                  >
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-text">{step.title}</h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{step.desc}</p>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-accent bg-green-50 border border-green-100 self-start">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {step.badge}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center mt-14">
          <Link
            href="/rejestracja"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand text-white font-bold text-base shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 transition-all"
          >
            Zacznij za darmo — 14 dni
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="text-slate-400 text-sm mt-3">Bez karty kredytowej · Cancel kiedy chcesz</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
