import Image from 'next/image';
import Link from 'next/link';

const BENEFITS = [
  'Bot odpowiada za Ciebie 24/7 — nawet o 22:00',
  'Zbiera leady automatycznie — imię + telefon',
  'Wdrożenie w 15 minut, zero programowania',
];

const CHAT_MESSAGES = [
  { role: 'bot' as const, text: 'Cześć! W czym mogę pomóc? 😊' },
  { role: 'user' as const, text: 'Chciałabym umówić wizytę na piątek' },
  { role: 'bot' as const, text: 'Oczywiście! Podaj numer — oddzwonimy 📞' },
];

function BotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
      <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
    </svg>
  );
}

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[272px]">
      {/* Notification badge */}
      <div
        className="absolute -top-2.5 -right-2 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg"
        style={{ background: '#10B981' }}
      >
        Nowy lead! 🎉
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Chat header */}
        <div
          className="flex items-center gap-2.5 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(99,102,241,0.5)' }}
          >
            <BotIcon />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Asystentka Botiko</p>
            <p className="flex items-center gap-1 text-[10px]" style={{ color: '#10B981' }}>
              <span
                className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                style={{ background: '#10B981' }}
              />
              Online teraz
            </p>
          </div>
          {/* Dots */}
          <div className="ml-auto flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="p-3.5 space-y-3">
          {CHAT_MESSAGES.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
              {msg.role === 'bot' && (
                <div
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-[10px]"
                  style={{ background: 'rgba(99,102,241,0.35)' }}
                >
                  ✦
                </div>
              )}
              <div
                className="rounded-2xl px-3 py-2 text-[11px] leading-relaxed max-w-[78%]"
                style={
                  msg.role === 'bot'
                    ? {
                        background: 'rgba(255,255,255,0.11)',
                        color: 'white',
                        borderTopLeftRadius: 4,
                      }
                    : {
                        background: 'rgba(99,102,241,0.55)',
                        color: 'white',
                        borderTopRightRadius: 4,
                      }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Lead capture input */}
          <div className="flex items-center gap-2 ml-7">
            <div
              className="flex-1 rounded-xl px-3 py-1.5 text-[10px]"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#a5b4fc',
              }}
            >
              📱 Twój numer telefonu...
            </div>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.4)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  headline: string;
  sub: string;
  badge?: string;
}

export function AuthLeftPanel({ headline, sub, badge = '14 dni za darmo — bez karty' }: Props) {
  return (
    <div
      className="relative flex flex-col justify-between px-6 py-8 lg:px-12 lg:py-10 order-2 lg:order-1 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 80%, #6366F1 100%)',
      }}
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(129,140,248,0.25) 0%, transparent 70%)',
          transform: 'translate(35%, -35%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          transform: 'translate(-35%, 35%)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          transform: 'translateX(40%)',
        }}
      />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5">
        <Image src="/BotikoLogo.png" alt="Botiko" width={36} height={36} className="rounded-xl" />
        <span className="text-white font-bold text-xl">
          Botiko<span className="text-indigo-300">.pl</span>
        </span>
      </Link>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-6 my-6">
        {/* Badge */}
        <div
          className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#a5b4fc',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {badge}
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">{headline}</h2>
          <p className="text-indigo-200 text-base leading-relaxed">{sub}</p>
        </div>

        {/* Chat illustration */}
        <ChatMockup />

        {/* Benefits */}
        <ul className="flex flex-col gap-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.35)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-indigo-100 text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust bar */}
      <div
        className="relative z-10 flex items-center gap-8 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        {[
          { val: '14 dni', label: 'darmowych testów' },
          { val: '24/7', label: 'dostępny bot' },
          { val: '<15 min', label: 'wdrożenie' },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-white text-lg font-extrabold">{s.val}</p>
            <p className="text-indigo-300 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
