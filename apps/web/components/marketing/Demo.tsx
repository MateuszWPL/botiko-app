'use client';

import { useState, useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

type Message = { role: 'user' | 'bot'; text: string };

const PRESET_QUESTIONS = [
  'Jaki jest cennik manicure?',
  'Czy pracujecie w soboty?',
  'Jak zarezerwować wizytę?',
  'Ile trwa henna brwi?',
];

const BOT_ANSWERS: Record<string, string> = {
  'Jaki jest cennik manicure?':
    'Oczywiście! Oto nasz aktualny cennik:\n\n💅 Manicure klasyczny — 60 zł\n💅 Manicure hybrydowy — 90 zł\n💅 Manicure japoński — 110 zł\n💅 Usunięcie hybrydy — 30 zł\n\nChcesz umówić wizytę? Mam wolne terminy już od jutra!',
  'Czy pracujecie w soboty?':
    'Tak, pracujemy w soboty! 🎉\n\nNasze godziny otwarcia:\n📅 Pon–Pt: 9:00–19:00\n📅 Sobota: 9:00–15:00\n📅 Niedziela: nieczynne\n\nW soboty miejsca rozchodzą się szybko — zarezerwujesz teraz?',
  'Jak zarezerwować wizytę?':
    'Rezerwację możesz zrobić na kilka sposobów:\n\n1️⃣ Przez Booksy — booksy.com/salon\n2️⃣ SMS na: 500 100 200\n3️⃣ Napisz tutaj — przekażę do kalendarza\n\nCo wolisz?',
  'Ile trwa henna brwi?':
    'Zabieg henna brwi trwa ok. 30–45 minut ⏱️\n\n✓ Oczyszczenie i regulacja kształtu\n✓ Aplikacja henny\n✓ Utrwalenie i pielęgnacja\n\nEfekt do 3–4 tygodni. Koszt: 80 zł.\nMam wolny termin jutro o 11:00 — zainteresowana?',
};

const DEFAULT_ANSWER =
  'Dziękuję za pytanie! Chętnie pomogę. Czy chcesz, żebym przekazała Twoje pytanie do właścicielki? Zostaw imię i numer — oddzwonimy do 2 godzin!';

// SVG icons for the benefits list
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconLink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const BENEFITS = [
  { Icon: IconClock, title: 'Odpowiada 24/7', desc: 'Niedziela 23:00, poniedziałek 6:00 — zawsze gotowy. Nawet kiedy śpisz.' },
  { Icon: IconClipboard, title: 'Zbiera dane klientów', desc: 'Imię, telefon, pytanie — wszystko trafia do panelu. Ty dzwonisz do gotowego leada.' },
  { Icon: IconBook, title: 'Uczy się Twojego cennika', desc: 'Wklejasz cennik, godziny, FAQ — bot odpowiada precyzyjnie, nie jak generyczny ChatGPT.' },
  { Icon: IconLink, title: 'Odsyła do rezerwacji', desc: 'Link do Booksy, Calendly lub własnego formularza — integracja w 1 kliknięcie.' },
];

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Cześć! Jestem bot salonu Glamour ✨\n\nW czym mogę Ci dzisiaj pomóc?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0); // Track count to skip initial scroll

  // Auto-scroll to bottom only when new messages are added (not on page load)
  useEffect(() => {
    const current = messages.length + (isTyping ? 1 : 0);
    if (current > messageCount.current) {
      messageCount.current = current;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = BOT_ANSWERS[trimmed] ?? DEFAULT_ANSWER;
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
      setIsTyping(false);
    }, 900);
  }

  return (
    <section id="demo" className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Demo na żywo</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Przetestuj bota{' '}
            <span className="gradient-text">teraz</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            To prawdziwy silnik Botiko — ten sam, który możesz mieć na swojej stronie już dziś.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Chat window */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center">
                  <span className="text-brand text-base font-bold">B</span>
                </div>
                <div>
                  <p className="font-semibold text-text text-sm">Bot salonu Glamour</p>
                  <p className="text-xs text-accent flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
                    Online teraz
                  </p>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-yellow-300" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-3 p-5 h-72 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="rounded-2xl px-4 py-3 max-w-[82%] text-sm leading-relaxed whitespace-pre-line"
                      style={
                        msg.role === 'user'
                          ? { background: '#6366F1', color: 'white', borderBottomRightRadius: 4 }
                          : { background: '#F1F5F9', color: '#0F172A', borderBottomLeftRadius: 4 }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="rounded-2xl px-4 py-3 flex items-center gap-1" style={{ background: '#F1F5F9', borderBottomLeftRadius: 4 }}>
                      <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Preset chips */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand/30 text-brand hover:bg-brand-soft transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Napisz pytanie..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 text-sm text-text placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isTyping || !input.trim()}
                  className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shrink-0 hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Benefits */}
          <ScrollReveal delay={2} className="flex flex-col gap-4 pt-2">
            <h3 className="text-2xl font-bold text-text mb-2">
              Twój bot wie wszystko o Twojej firmie
            </h3>

            {BENEFITS.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand/25 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <Icon />
                </span>
                <div>
                  <p className="font-semibold text-text text-sm">{title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
