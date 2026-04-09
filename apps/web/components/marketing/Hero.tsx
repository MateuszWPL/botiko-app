'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type ChatMessage = { role: 'user' | 'bot'; text: string };

const CHAT_SEQUENCE: Array<{
  role: 'user' | 'bot';
  text: string;
  typingMs?: number;
  pauseAfterMs?: number;
}> = [
  { role: 'user', text: 'Hej, czy jest wolny termin na manicure hybrydowy w piątek?', pauseAfterMs: 400 },
  { role: 'bot', text: 'Cześć! Tak, w piątek mamy wolne miejsca 🎉\n\nDostępne terminy:\n📅 Piątek 10:00 — Karolina\n📅 Piątek 14:30 — Marta\n\nKtóry preferujesz?', typingMs: 1400, pauseAfterMs: 900 },
  { role: 'user', text: '14:30 poproszę!', pauseAfterMs: 400 },
  { role: 'bot', text: 'Świetnie! Zarezerwowałam:\n✅ Piątek 14:30 — Marta\n💅 Manicure hybrydowy\n\nPodaj imię i telefon do potwierdzenia?', typingMs: 1200, pauseAfterMs: 900 },
  { role: 'user', text: 'Anna Kowalska, 601 234 567', pauseAfterMs: 400 },
  { role: 'bot', text: 'Gotowe, Anno! Widzę Cię w kalendarzu 👋\nWyślę SMS-przypomnienie dzień wcześniej.\nDo zobaczenia w piątek!', typingMs: 1100, pauseAfterMs: 4500 },
];

const TRUST_STATS = [
  { value: '200+', label: 'firm korzysta' },
  { value: '24/7', label: 'dostępny bot' },
  { value: '< 3s', label: 'czas odpowiedzi' },
  { value: '4.9★', label: 'średnia ocena' },
];

export default function Hero() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadBadge, setShowLeadBadge] = useState(false);
  const [chatOpacity, setChatOpacity] = useState(1);

  // For transform-based scroll (no scrollbar, no manual scroll)
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Recalculate transform offset whenever messages/typing change
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const excess = inner.scrollHeight - outer.clientHeight;
    setScrollOffset(Math.max(0, excess));
  }, [messages, isTyping]);

  // Auto-typing sequence loop
  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function runLoop() {
      while (!cancelled) {
        // Smooth fade-in start
        setChatOpacity(1);
        setScrollOffset(0);
        await sleep(1200);

        for (const item of CHAT_SEQUENCE) {
          if (cancelled) return;

          if (item.role === 'bot') {
            setIsTyping(true);
            await sleep(item.typingMs ?? 1000);
            if (cancelled) return;
            setIsTyping(false);
            setMessages((prev) => [...prev, { role: 'bot', text: item.text }]);
          } else {
            await sleep(700);
            if (cancelled) return;
            setMessages((prev) => [...prev, { role: 'user', text: item.text }]);
          }

          await sleep(item.pauseAfterMs ?? 600);
        }

        // Show lead badge after sequence ends
        setShowLeadBadge(true);
        await sleep(3500);

        // Smooth fade out before restart
        setChatOpacity(0);
        setShowLeadBadge(false);
        await sleep(600);

        // Reset
        setMessages([]);
        setIsTyping(false);
        setScrollOffset(0);
        await sleep(400);
      }
    }

    runLoop();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338CA 65%, #6366F1 100%)' }}
      />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15 -z-10"
        style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }} />
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
              Bot AI dla polskich firm usługowych
            </div>

            <h1
              className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Klienci piszą
              <br />
              <span className="text-white/40">o 22:00.</span>
              <br />
              <span style={{ color: '#a5b4fc' }}>Botiko odpowiada</span>
              <br />
              <span className="text-white">za Ciebie.</span>
            </h1>

            <p
              className="animate-fade-in-up text-lg text-indigo-200 leading-relaxed mb-8 max-w-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Gotowy bot dla salonu, gabinetu, restauracji i warsztatu — odpowiada na pytania,
              zbiera leady i odsyła do rezerwacji.{' '}
              <strong className="text-white">Bez programowania. Bez umowy.</strong>
            </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-3 mb-10"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:shadow-2xl hover:bg-brand-soft transition-all cursor-pointer"
              >
                Zacznij za darmo — 14 dni
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white hover:bg-white/10 transition-colors cursor-pointer"
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

          {/* Right — animated chat film */}
          <div className="animate-fade-in-up flex justify-center lg:justify-end" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full max-w-sm">

              {/* Phone frame — fade controlled by chatOpacity */}
              <div
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{
                  background: '#1e1b4b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  opacity: chatOpacity,
                  transition: 'opacity 0.55s ease',
                }}
              >
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center">
                      <span className="text-brand text-xs font-bold">B</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Salon Glamour · Botiko</p>
                      <p className="text-green-400 text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                        Online 24/7
                      </p>
                    </div>
                  </div>
                  <span className="text-indigo-300 text-[10px]">22:14</span>
                </div>

                {/* Chat viewport — overflow hidden, no scrollbar, no manual scroll */}
                <div
                  ref={outerRef}
                  style={{ height: 300, overflow: 'hidden' }}
                >
                  {/* Inner div moves up via transform — smooth film effect */}
                  <div
                    ref={innerRef}
                    className="flex flex-col gap-3 px-4 py-4"
                    style={{
                      transform: `translateY(-${scrollOffset}px)`,
                      transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className="flex animate-fade-in"
                        style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                      >
                        <div
                          className="rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed whitespace-pre-line"
                          style={
                            msg.role === 'user'
                              ? { background: '#6366F1', color: 'white', borderBottomRightRadius: 4 }
                              : { background: 'rgba(255,255,255,0.1)', color: 'white', borderBottomLeftRadius: 4 }
                          }
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start animate-fade-in">
                        <div
                          className="rounded-2xl px-4 py-3 flex items-center gap-1"
                          style={{ background: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4 }}
                        >
                          <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300 inline-block" />
                          <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300 inline-block" />
                          <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300 inline-block" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input bar */}
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="flex-1 rounded-full px-4 py-2 text-indigo-400 text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    Napisz wiadomość...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating badge — speed (top-left, moved further left to avoid overlap) */}
              <div
                className="absolute glass rounded-2xl px-3 py-2 shadow-xl"
                style={{
                  left: '-48px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animation: 'fadeInUp 0.5s 1.5s both',
                }}
              >
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Odpowiedź w 1.2s
                </p>
                <p className="text-[10px] text-slate-500">Ty śpisz spokojnie</p>
              </div>

              {/* Floating badge — lead (bottom-right, appears after last bot message) */}
              <div
                className="absolute -right-4 bottom-16 glass rounded-2xl px-3 py-2 shadow-xl"
                style={{
                  opacity: showLeadBadge ? 1 : 0,
                  transform: showLeadBadge ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                }}
              >
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Lead zapisany
                </p>
                <p className="text-[10px] text-slate-500">Anna K. · Piątek 14:30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="animate-fade-in-up mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', animationDelay: '0.5s' }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-indigo-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
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
