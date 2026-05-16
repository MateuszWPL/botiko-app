'use client';

import { useState, useRef, useEffect } from 'react';

interface ServiceItem {
  name: string;
  price: string;
  note: string;
}

interface DemoData {
  botName: string;
  primaryColor: string;
  welcomeMsg: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  serviceItems: ServiceItem[];
}

interface DemoMessage {
  role: 'user' | 'bot';
  text: string;
}

interface DemoQuestion {
  q: string;
  a: string;
}

/**
 * Builds demo Q&A purely from the data the user just typed in earlier steps.
 * This is an honest "test drive" — the bot answers with the client's own
 * content, no API call and no invented facts.
 */
function buildQuestions(data: DemoData): DemoQuestion[] {
  const questions: DemoQuestion[] = [];
  const namedServices = data.serviceItems.filter((s) => s.name.trim());

  if (namedServices.length > 0) {
    const list = namedServices
      .map((s) => (s.price.trim() ? `${s.name.trim()} – ${s.price.trim()}` : s.name.trim()))
      .join(', ');
    questions.push({
      q: 'Jakie macie ceny?',
      a: `Chętnie podpowiem! Oferujemy: ${list}. Chcesz dowiedzieć się czegoś więcej?`,
    });
    questions.push({
      q: 'Co oferujecie?',
      a: `W naszej ofercie znajdziesz: ${namedServices.map((s) => s.name.trim()).join(', ')}. W czym mogę pomóc?`,
    });
  }

  const contactLines = [
    data.phone.trim() && `zadzwoń: ${data.phone.trim()}`,
    data.email.trim() && `napisz: ${data.email.trim()}`,
    data.address.trim() && `odwiedź nas: ${data.address.trim()}`,
  ].filter(Boolean) as string[];

  if (contactLines.length > 0) {
    questions.push({
      q: 'Jak mogę się z wami skontaktować?',
      a: `Najłatwiej tak — ${contactLines.join(', ')}. Czekamy na Ciebie!`,
    });
  }

  return questions.slice(0, 3);
}

export function DemoChatPreview({ data }: { data: DemoData }) {
  const questions = buildQuestions(data);
  const botName = data.botName.trim() || 'Twój bot';
  const welcome = data.welcomeMsg.trim() || 'Dzień dobry! W czym mogę pomóc?';

  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const ask = (question: DemoQuestion) => {
    if (typing || asked.includes(question.q)) return;
    setAsked((prev) => [...prev, question.q]);
    setMessages((prev) => [...prev, { role: 'user', text: question.q }]);
    setTyping(true);

    // Brief "typing" pause, then reveal the answer character-by-character to
    // mirror the production widget's real-time typing UX.
    const dotsDelay = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'bot', text: '' }]);
      let i = 0;
      const reveal = () => {
        i = Math.min(i + 2, question.a.length);
        setMessages((prev) => {
          const next = prev.slice();
          const last = next[next.length - 1];
          if (last && last.role === 'bot') {
            next[next.length - 1] = { ...last, text: question.a.slice(0, i) };
          }
          return next;
        });
        if (i < question.a.length) {
          const t = window.setTimeout(reveal, 28);
          timers.current.push(t);
        }
      };
      reveal();
    }, 500);
    timers.current.push(dotsDelay);
  };

  const remaining = questions.filter((q) => !asked.includes(q.q));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-600">Podgląd na żywo</label>
        <span className="text-[11px] text-slate-400">Kliknij pytanie — bot odpowie Twoimi danymi</span>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div
          className="px-4 py-2.5 text-white text-sm font-medium flex items-center gap-2"
          style={{ backgroundColor: data.primaryColor }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          {botName}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="p-4 bg-slate-50 max-h-56 overflow-y-auto space-y-2">
          <div className="inline-block bg-white rounded-xl rounded-bl-sm px-3.5 py-2 text-sm text-slate-800 shadow-sm max-w-[85%]">
            {welcome}
          </div>

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div
                  className="rounded-xl rounded-br-sm px-3.5 py-2 text-sm text-white shadow-sm max-w-[85%]"
                  style={{ backgroundColor: data.primaryColor }}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex">
                <div className="inline-block bg-white rounded-xl rounded-bl-sm px-3.5 py-2 text-sm text-slate-800 shadow-sm max-w-[85%]">
                  {m.text}
                </div>
              </div>
            ),
          )}

          {typing && (
            <div className="flex">
              <div className="bg-white rounded-xl rounded-bl-sm px-3.5 py-2.5 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div className="px-3 py-3 bg-white border-t border-slate-100">
          {questions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center">
              Dodaj usługi lub kontakt w poprzednich krokach, żeby przetestować bota tutaj.
            </p>
          ) : remaining.length === 0 ? (
            <p className="text-xs text-emerald-600 text-center font-medium">
              To Twój bot w akcji — odpowiada na podstawie danych, które wpisałeś.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {remaining.map((q) => (
                <button
                  key={q.q}
                  type="button"
                  onClick={() => ask(q)}
                  disabled={typing}
                  className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {q.q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
