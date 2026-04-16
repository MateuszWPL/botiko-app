'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function TypewriterText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 25 : 60);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return (
    <>
      <span>{words[index].substring(0, subIndex)}</span>
      <span className="animate-pulse inline-block w-[3px] h-[0.75em] bg-indigo-300 ml-0.5 align-middle" />
    </>
  );
}

/* ─── Chat mockup ───────────────────────────────────────────── */

type Phase = 'welcome' | 'suggestions' | 'user-sent' | 'bot-typing' | 'bot-replied' | 'lead';

const BRAND = '#6366F1';

const SCENES = [
  {
    botWelcome: 'Hej! Masz pytania? 💅',
    suggestions: ['Jakie usługi oferujecie?', 'Jakie są godziny otwarcia?', 'Jak się skontaktować?'],
    userMsg: 'Jakie usługi oferujecie?',
    botReply: 'Oferujemy manicure, pedicure, przedłużanie paznokci i stylizacje 💅 Chcesz umówić wizytę?',
    leadName: 'Kasia W.',
    leadTag: 'Wizyta · beauty',
  },
  {
    botWelcome: 'Dzień dobry! W czym mogę pomóc? 🏥',
    suggestions: ['Cennik konsultacji', 'Jak się zapisać?', 'Godziny otwarcia'],
    userMsg: 'Cennik konsultacji',
    botReply: 'Konsultacja wstępna to 180 zł / 60 min. Zostaw numer — oddzwonimy i umówimy termin 📞',
    leadName: 'Marek P.',
    leadTag: 'Wizyta · fizjo',
  },
  {
    botWelcome: 'Witamy! Czym mogę służyć? 🍽️',
    suggestions: ['Menu dnia', 'Rezerwacja stolika', 'Godziny otwarcia'],
    userMsg: 'Rezerwacja stolika',
    botReply: 'Chętnie zarezerwujemy stolik! Na ile osób i o której godzinie? 😊',
    leadName: 'Ania K.',
    leadTag: 'Rezerwacja · restauracja',
  },
];

// ms od startu sceny
const T = { suggestions: 700, userSent: 1800, botTyping: 2200, botReplied: 3600, lead: 4400, next: 7000 };

function BotTypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '10px 14px' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94a3b8' }}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ChatMockup() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('welcome');

  useEffect(() => {
    setPhase('welcome');
    const timers = [
      setTimeout(() => setPhase('suggestions'), T.suggestions),
      setTimeout(() => setPhase('user-sent'), T.userSent),
      setTimeout(() => setPhase('bot-typing'), T.botTyping),
      setTimeout(() => setPhase('bot-replied'), T.botReplied),
      setTimeout(() => setPhase('lead'), T.lead),
      setTimeout(() => setSceneIdx((p) => (p + 1) % SCENES.length), T.next),
    ];
    return () => timers.forEach(clearTimeout);
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];
  const showSuggestions = phase === 'suggestions';
  const showUserMsg = phase === 'user-sent' || phase === 'bot-typing' || phase === 'bot-replied' || phase === 'lead';
  const showBotTyping = phase === 'bot-typing';
  const showBotReply = phase === 'bot-replied' || phase === 'lead';
  const showLead = phase === 'lead';

  return (
    <div className="w-full flex flex-col gap-3">

      {/* ── Rząd 1: Chat window + boczne badge ── */}
      <div className="flex items-start gap-3">

        {/* Chat window — identyczny styl jak widget */}
        <motion.div
          className="flex-1 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
          style={{ backgroundColor: '#fff', minHeight: 320 }}
        >
          {/* Header */}
          <div style={{ backgroundColor: BRAND, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>B</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2 }}>Botiko</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <motion.span
                  style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', flexShrink: 0, display: 'inline-block' }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>Online · odpowiada błyskawicznie</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: '14px 12px 8px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 220 }}>

            {/* Welcome message from bot */}
            <motion.div
              style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: '50%', backgroundColor: BRAND,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>B</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={sceneIdx}
                  style={{
                    maxWidth: '78%', padding: '9px 13px',
                    borderRadius: '4px 14px 14px 14px',
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a', fontSize: 13, lineHeight: 1.5,
                  }}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {scene.botWelcome}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Suggested questions — po prawej, jak w widgecie */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {scene.suggestions.map((s, i) => (
                    <motion.div
                      key={s}
                      style={{
                        padding: '7px 13px', borderRadius: 20,
                        border: `1.5px solid ${BRAND}`,
                        color: BRAND, fontSize: 12, lineHeight: 1.3,
                        backgroundColor: 'transparent',
                      }}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.3 }}
                    >
                      {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* User message */}
            <AnimatePresence>
              {showUserMsg && (
                <motion.div
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <div style={{
                    maxWidth: '78%', padding: '9px 13px',
                    borderRadius: '14px 14px 4px 14px',
                    backgroundColor: BRAND, color: '#fff',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    {scene.userMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bot typing / reply */}
            <AnimatePresence>
              {(showBotTyping || showBotReply) && (
                <motion.div
                  style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', backgroundColor: BRAND,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>B</div>
                  {showBotTyping ? (
                    <div style={{ borderRadius: '4px 14px 14px 14px', backgroundColor: '#f1f5f9' }}>
                      <BotTypingDots />
                    </div>
                  ) : (
                    <motion.div
                      style={{
                        maxWidth: '78%', padding: '9px 13px',
                        borderRadius: '4px 14px 14px 14px',
                        backgroundColor: '#f1f5f9', color: '#0f172a',
                        fontSize: 13, lineHeight: 1.5,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {scene.botReply}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div style={{
            borderTop: '1px solid #e2e8f0', padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#fff',
          }}>
            <div style={{
              flex: 1, height: 36, borderRadius: 18,
              border: '1px solid #e2e8f0', backgroundColor: '#f8fafc',
              display: 'flex', alignItems: 'center', padding: '0 12px',
            }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Napisz wiadomość...</span>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', backgroundColor: BRAND,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
              </svg>
            </div>
          </div>

        </motion.div>

        {/* Boczna kolumna: 2 stacked badges */}
        <motion.div
          className="flex flex-col gap-2.5 pt-4"
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
        >
          {/* ⚡ Czas odpowiedzi */}
          <div
            className="rounded-2xl px-3 py-2.5 shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)', transform: 'rotate(-2deg)',
            }}
          >
            <p className="text-white text-[11px] font-bold leading-none whitespace-nowrap">⚡ 1.2s</p>
            <p className="text-white/50 text-[10px] leading-none mt-1 whitespace-nowrap">śr. odpowiedź</p>
          </div>

          {/* 🟢 Online */}
          <div
            className="rounded-2xl px-3 py-2.5 shadow-lg"
            style={{
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              backdropFilter: 'blur(12px)', transform: 'rotate(2.5deg)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <p className="text-emerald-300 text-[11px] font-bold leading-none whitespace-nowrap">Online 24/7</p>
            </div>
            <p className="text-white/40 text-[10px] leading-none mt-1 whitespace-nowrap">nigdy nie śpi</p>
          </div>

          {/* 🔒 RODO */}
          <div
            className="rounded-2xl px-3 py-2.5 shadow-lg"
            style={{
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              backdropFilter: 'blur(12px)', transform: 'rotate(-1.5deg)',
            }}
          >
            <p className="text-indigo-300 text-[11px] font-bold leading-none whitespace-nowrap">🔒 RODO</p>
            <p className="text-white/40 text-[10px] leading-none mt-1 whitespace-nowrap">zgodność PL</p>
          </div>
        </motion.div>
      </div>

      {/* ── Rząd 2: dolne badges + dynamiczny lead ── */}
      <motion.div
        className="flex gap-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {/* 149 zł */}
        <div
          className="flex-1 rounded-2xl px-3.5 py-2.5 shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="text-white text-[11px] font-bold leading-none">🔥 149 zł / mies.</p>
          <p className="text-white/45 text-[10px] leading-none mt-1">oszczędza 2h dziennie</p>
        </div>

        {/* Bez kodowania */}
        <div
          className="flex-1 rounded-2xl px-3.5 py-2.5 shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="text-white text-[11px] font-bold leading-none">📋 Bez kodowania</p>
          <p className="text-white/45 text-[10px] leading-none mt-1">gotowy w 15 minut</p>
        </div>

        {/* Dynamiczny lead badge */}
        <AnimatePresence>
          {showLead && (
            <motion.div
              className="flex-1 rounded-2xl px-3.5 py-2.5 shadow-xl"
              style={{
                background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="text-emerald-300 text-[11px] font-bold leading-none">✅ Lead zebrany!</p>
              <p className="text-white/60 text-[10px] leading-none mt-1">{scene.leadName}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Trust stats ────────────────────────────────────────────── */

const TRUST_STATS = [
  { value: '14 dni', label: 'darmowych testów' },
  { value: '24/7', label: 'dostępny bot' },
  { value: '< 2s', label: 'czas odpowiedzi' },
  { value: '15 min', label: 'wdrożenie bota' },
];

export default function Hero() {

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338CA 65%, #6366F1 100%)' }}
      />
      <motion.div 
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} 
        animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15 -z-10"
        style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }} 
        animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-12 lg:gap-10 items-center">

          {/* Left — copy */}
          <div>
            <div
              className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#a5b4fc' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Bot obsługi klienta 24/7
            </div>

            <h1
              className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Klienci piszą
              <br />
              <span className="text-white/40">o 22:00.</span>
              <br />
              <span className="text-[#a5b4fc] block h-[1.2em] mb-1 overflow-hidden">
                <TypewriterText words={[
                  'Botiko odpowiada',
                  'Botiko łapie leady',
                  'Botiko doradza'
                ]} />
              </span>
              <span className="text-white">za Ciebie.</span>
            </h1>

            <p
              className="animate-fade-in-up text-lg text-indigo-200 leading-relaxed mb-8 max-w-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Gotowy bot dla każdej firmy usługowej — odpowiada na pytania klientów,
              zbiera leady i odsyła do rezerwacji.{' '}
              <strong className="text-white">Bez programowania. Bez umowy.</strong>
            </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:shadow-2xl hover:bg-brand-soft transition-all cursor-pointer w-full sm:w-auto"
              >
                Zacznij za darmo — 14 dni
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white hover:bg-white/10 transition-colors cursor-pointer w-full sm:w-auto"
                style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                </svg>
                Zobacz demo
              </a>
            </div>

            <p className="animate-fade-in-up text-sm text-indigo-300" style={{ animationDelay: '0.35s' }}>
              Karta kredytowa niewymagana · Konfiguracja w 15 minut · Cancel kiedy chcesz
            </p>
          </div>

          {/* Right — animated chat mockup */}
          <div
            className="animate-fade-in-up flex flex-col justify-center items-center lg:items-start"
            style={{ animationDelay: '0.2s' }}
          >
            <ChatMockup />
          </div>
        </div>

        {/* Trust bar */}
        <motion.div
          className="mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, staggerChildren: 0.1 }}
        >
          {TRUST_STATS.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5, type: 'spring' }}
            >
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-indigo-300 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80 C360 0 1080 0 1440 80 L1440 80 L0 80Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
