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
    <span className="inline-flex items-baseline whitespace-nowrap min-h-[1.2em]">
      <span>{words[index].substring(0, subIndex)}</span>
      <span className="animate-pulse inline-block w-[4px] h-[0.8em] bg-indigo-300 ml-1" />
    </span>
  );
}

/* ─── Chat mockup ───────────────────────────────────────────── */

type Phase = 'user-typing' | 'user-sent' | 'bot-typing' | 'bot-sent' | 'lead';

const SCENES = [
  {
    industry: 'Salon beauty',
    color: '#EC4899',
    emoji: '💅',
    userMsg: 'Czy macie wolne w piątek po 17:00?',
    botMsg: 'Jasne! Zostaw numer – recepcja oddzwoni i dobierzemy termin 💅',
    leadName: 'Kasia W.',
    leadTag: 'Wizyta piątek',
  },
  {
    industry: 'Gabinet fizjo',
    color: '#06B6D4',
    emoji: '🏥',
    userMsg: 'Ile kosztuje pierwsza konsultacja?',
    botMsg: 'Konsultacja wstępna to 180 zł / 60 min. Chcesz umówić wizytę?',
    leadName: 'Marek P.',
    leadTag: 'Konsultacja',
  },
  {
    industry: 'Restauracja',
    color: '#F97316',
    emoji: '🍽️',
    userMsg: 'Czy macie opcje wegetariańskie?',
    botMsg: 'Mamy 9 dań wegetariańskich! Rezerwacja stolika na wieczór? 🥗',
    leadName: 'Ania K.',
    leadTag: 'Rezerwacja',
  },
];

const TIMING = {
  userTyping: 900,
  userSent: 1400,
  botTyping: 2000,
  botSent: 3200,
  lead: 4200,
  nextScene: 6800,
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ChatMockup() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('user-typing');

  const scene = SCENES[sceneIdx];

  useEffect(() => {
    setPhase('user-typing');

    const timers = [
      setTimeout(() => setPhase('user-sent'), TIMING.userSent),
      setTimeout(() => setPhase('bot-typing'), TIMING.botTyping),
      setTimeout(() => setPhase('bot-sent'), TIMING.botSent),
      setTimeout(() => setPhase('lead'), TIMING.lead),
      setTimeout(() => {
        setSceneIdx((p) => (p + 1) % SCENES.length);
      }, TIMING.nextScene),
    ];

    return () => timers.forEach(clearTimeout);
  }, [sceneIdx]);

  const showUserMsg = phase === 'user-sent' || phase === 'bot-typing' || phase === 'bot-sent' || phase === 'lead';
  const showBotTyping = phase === 'bot-typing';
  const showBotMsg = phase === 'bot-sent' || phase === 'lead';
  const showLead = phase === 'lead';

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">

      {/* ── Floating badge: czas odpowiedzi ── */}
      <motion.div
        className="absolute -left-8 top-12 z-20"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            transform: 'rotate(-3deg)',
          }}
        >
          <span className="text-base">⚡</span>
          <div>
            <p className="leading-none">Odp. w 1.2s</p>
            <p className="text-white/50 font-normal leading-none mt-0.5">śr. czas</p>
          </div>
        </div>
      </motion.div>

      {/* ── Floating badge: online 24/7 ── */}
      <motion.div
        className="absolute -right-6 top-6 z-20"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl text-xs font-semibold"
          style={{
            background: 'rgba(16,185,129,0.18)',
            border: '1px solid rgba(16,185,129,0.35)',
            backdropFilter: 'blur(12px)',
            color: '#6ee7b7',
            transform: 'rotate(2deg)',
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-accent"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span>Online 24/7</span>
        </div>
      </motion.div>

      {/* ── Floating badge: RODO ── */}
      <motion.div
        className="absolute -right-4 bottom-20 z-20"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5, type: 'spring' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl text-xs font-semibold"
          style={{
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.35)',
            backdropFilter: 'blur(12px)',
            color: '#a5b4fc',
            transform: 'rotate(1.5deg)',
          }}
        >
          <span>🔒</span>
          <span>RODO zgodny</span>
        </div>
      </motion.div>

      {/* ── Lead notification (pojawia się dynamicznie) ── */}
      <AnimatePresence>
        {showLead && (
          <motion.div
            className="absolute -left-6 bottom-16 z-30"
            initial={{ x: -30, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(16,185,129,0.22)',
                border: '1px solid rgba(16,185,129,0.4)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'rgba(16,185,129,0.3)' }}>
                ✅
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Lead zebrany!</p>
                <p className="text-[10px] text-emerald-300 leading-none mt-0.5">
                  {scene.leadName} · {scene.leadTag}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Główne okno chatu ── */}
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.15)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIdx}
              className="flex items-center gap-3 flex-1 min-w-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: scene.color + '33', border: `1px solid ${scene.color}55` }}
              >
                {scene.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{scene.industry}</p>
                <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Botiko · online
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dot indicators */}
          <div className="flex gap-1">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === sceneIdx ? scene.color : 'rgba(255,255,255,0.25)' }}
              />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-2.5 px-4 py-4 min-h-[180px]">
          {/* User message */}
          <AnimatePresence>
            {(phase === 'user-typing' || showUserMsg) && (
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                {phase === 'user-typing' ? (
                  <div
                    className="rounded-2xl rounded-tr-sm"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <TypingDots />
                  </div>
                ) : (
                  <div
                    className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-xs text-white font-medium leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    {scene.userMsg}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bot response */}
          <AnimatePresence>
            {(showBotTyping || showBotMsg) && (
              <motion.div
                className="flex justify-start gap-2"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5"
                  style={{ background: `${scene.color}44` }}
                >
                  🤖
                </div>
                {showBotTyping ? (
                  <div
                    className="rounded-2xl rounded-tl-sm"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
                  >
                    <TypingDots />
                  </div>
                ) : (
                  <div
                    className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs leading-relaxed"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#c7d2fe' }}
                  >
                    {scene.botMsg}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.1)' }}
        >
          <div
            className="flex-1 h-8 rounded-full px-3 flex items-center"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-white/30 text-[11px]">Napisz wiadomość...</span>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.6)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── Extra stats row pod oknem chatu ── */}
      <motion.div
        className="mt-3 flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <div
          className="flex-1 rounded-2xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/80 text-[11px] font-semibold">🔥 149 zł / mies.</p>
          <p className="text-white/40 text-[10px] mt-0.5">oszczędza 2h/dzień</p>
        </div>
        <div
          className="flex-1 rounded-2xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/80 text-[11px] font-semibold">📋 Bez kodowania</p>
          <p className="text-white/40 text-[10px] mt-0.5">gotowy w 15 minut</p>
        </div>
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

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
              <span className="text-[#a5b4fc] block h-[1.2em] mb-1">
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
