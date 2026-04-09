'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

type Message = { role: 'user' | 'bot'; text: string };

const PRESET_QUESTIONS = [
  'Jaki jest cennik manicure?',
  'Czy pracujecie w soboty?',
  'Jak mogę zarezerwować wizytę?',
  'Ile trwa zabieg henna brwi?',
];

const BOT_ANSWERS: Record<string, string> = {
  'Jaki jest cennik manicure?':
    'Oczywiście! Oto nasz aktualny cennik:\n\n💅 Manicure klasyczny — 60 zł\n💅 Manicure hybrydowy — 90 zł\n💅 Manicure japoński — 110 zł\n💅 Usunięcie hybrydy — 30 zł\n\nChcesz umówić wizytę? Mam wolne terminy już od jutra! 😊',
  'Czy pracujecie w soboty?':
    'Tak, pracujemy w soboty! 🎉\n\nNasze godziny otwarcia:\n📅 Pon–Pt: 9:00–19:00\n📅 Sobota: 9:00–15:00\n📅 Niedziela: nieczynne\n\nW soboty miejsca rozchodzą się szybko — zarezerwujesz teraz?',
  'Jak mogę zarezerwować wizytę?':
    'Rezerwację możesz zrobić na kilka sposobów:\n\n1️⃣ Przez Booksy — link: booksy.com/salon\n2️⃣ SMS/WhatsApp na numer: 500 100 200\n3️⃣ Napisz tutaj — a przekażę do naszego kalendarza\n\nCo wolisz? 😊',
  'Ile trwa zabieg henna brwi?':
    'Zabieg henna brwi trwa około **30–45 minut** ⏱️\n\nW tym czasie:\n✓ Oczyszczenie i regulacja kształtu\n✓ Aplikacja henny\n✓ Utrwalenie i pielęgnacja\n\nEfekt utrzymuje się do 3–4 tygodni. Koszt: 80 zł.\nMam wolny termin jutro o 11:00 — zainteresowana? 🌟',
};

const DEFAULT_ANSWER =
  'Dziękuję za pytanie! 😊 Chętnie pomogę. Czy chcesz, żebym przekazała Twoje pytanie do właścicielki salonu? Zostaw imię i numer — oddzwonimy do 2 godzin!';

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Cześć! Jestem Ania — asystentka salonu Glamour ✨\n\nW czym mogę Ci dzisiaj pomóc?',
    },
  ]);
  const [input, setInput] = useState('');

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');

    setTimeout(() => {
      const answer = BOT_ANSWERS[trimmed] ?? DEFAULT_ANSWER;
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
    }, 800);
  }

  return (
    <section id="demo" className="py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Demo na żywo</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
            Przetestuj asystentkę{' '}
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
                  <span className="text-brand text-base font-bold">A</span>
                </div>
                <div>
                  <p className="font-semibold text-text text-sm">Ania — Salon Glamour</p>
                  <p className="text-xs text-accent flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    Online teraz
                  </p>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-3 p-5 h-80 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed whitespace-pre-line"
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
              </div>

              {/* Preset chips */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand/30 text-brand hover:bg-brand-soft transition-colors"
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
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 text-sm text-text placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand/30"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shrink-0 hover:bg-brand-dark transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — benefits */}
          <ScrollReveal delay={2} className="flex flex-col gap-5 pt-2">
            <h3 className="text-2xl font-bold text-text">
              Twoja asystentka wie wszystko o Twojej firmie
            </h3>

            {[
              {
                icon: '🕐',
                title: 'Odpowiada 24/7',
                desc: 'Niedziela 23:00, poniedziałek 6:00 — zawsze gotowa. Nawet kiedy śpisz.',
              },
              {
                icon: '📋',
                title: 'Zbiera dane klientów',
                desc: 'Imię, telefon, pytanie — wszystko trafia do panelu. Ty dzwonisz do gotowego leada.',
              },
              {
                icon: '🎓',
                title: 'Uczy się Twojego cennika',
                desc: 'Wklejasz cennik, godziny, FAQ — bot odpowiada precyzyjnie jak Ty, nie jak ChatGPT.',
              },
              {
                icon: '🔗',
                title: 'Odsyła do rezerwacji',
                desc: 'Link do Booksy, Calendly lub własnego formularza — integracja w 1 kliknięcie.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand/20 transition-colors">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-text text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
