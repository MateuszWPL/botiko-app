import Link from 'next/link';

const TRUST_STATS = [
  { value: '200+', label: 'firm korzysta' },
  { value: '24/7', label: 'dostępna asystentka' },
  { value: '< 3s', label: 'czas odpowiedzi' },
  { value: '4.9★', label: 'średnia ocena' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338CA 65%, #6366F1 100%)',
        }}
      />
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15 -z-10"
        style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div
              className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#a5b4fc',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Asystentka AI dla polskich firm usługowych
            </div>

            <h1
              className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Klientki piszą
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
                o 22:00.
              </span>
              <br />
              <span style={{ color: '#a5b4fc' }}>Asystentka odpowiada</span>
              <br />
              <span className="text-white">za Ciebie.</span>
            </h1>

            <p
              className="animate-fade-in-up text-lg text-indigo-200 leading-relaxed mb-8 max-w-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Gotowy bot dla salonu, gabinetu i restauracji — odpowiada na pytania,
              zbiera dane klientów i odsyła do rezerwacji.{' '}
              <strong className="text-white">Bez programowania. Bez umowy na rok.</strong>
            </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-3 mb-10"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/register"
                className="animate-pulse-ring inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Zacznij za darmo — 14 dni
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white transition-all hover:bg-white/10"
                style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
                </svg>
                Zobacz demo
              </a>
            </div>

            <p
              className="animate-fade-in-up text-sm text-indigo-300"
              style={{ animationDelay: '0.35s' }}
            >
              Karta kredytowa niewymagana · Konfiguracja w 15 minut · Cancel kiedy chcesz
            </p>
          </div>

          {/* Right — chat mockup */}
          <div
            className="animate-fade-in-up flex justify-center lg:justify-end"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="animate-float relative w-full max-w-sm">
              {/* Phone frame */}
              <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center">
                      <span className="text-brand text-xs font-bold">B</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Salon Glamour</p>
                      <p className="text-green-400 text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                        Online 24/7
                      </p>
                    </div>
                  </div>
                  <span className="text-indigo-300 text-[10px]">22:14</span>
                </div>

                {/* Chat messages */}
                <div className="px-4 py-4 flex flex-col gap-3 min-h-64">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[75%]" style={{ background: '#6366F1' }}>
                      <p className="text-white text-sm">Hej, czy jest wolny termin na manicure hybrydowy w piątek?</p>
                      <p className="text-indigo-200 text-[10px] mt-1 text-right">22:14 ✓✓</p>
                    </div>
                  </div>

                  {/* Bot typing */}
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-white text-sm">
                        Cześć! Tak, w piątek mamy wolne godziny 🎉
                        <br />
                        <br />
                        <strong>Dostępne terminy:</strong>
                        <br />
                        📅 Piątek 10:00 — Karolina
                        <br />
                        📅 Piątek 14:30 — Marta
                        <br />
                        <br />
                        Który preferujesz? Mogę od razu zarezerwować 😊
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1">22:14</p>
                    </div>
                  </div>

                  {/* User reply */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[75%]" style={{ background: '#6366F1' }}>
                      <p className="text-white text-sm">14:30 poproszę!</p>
                      <p className="text-indigo-200 text-[10px] mt-1 text-right">22:15 ✓✓</p>
                    </div>
                  </div>

                  {/* Bot typing indicator */}
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <span className="typing-dot text-indigo-300 text-lg">●</span>
                      <span className="typing-dot text-indigo-300 text-lg">●</span>
                      <span className="typing-dot text-indigo-300 text-lg">●</span>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 rounded-full px-4 py-2 text-indigo-400 text-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    Napisz wiadomość...
                  </div>
                  <button className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Floating badge — lead captured */}
              <div
                className="absolute -right-4 top-16 glass rounded-2xl px-3 py-2 shadow-xl"
                style={{ animation: 'fadeInUp 0.6s 0.8s both' }}
              >
                <p className="text-xs font-semibold text-slate-700">✅ Lead zapisany</p>
                <p className="text-[11px] text-slate-500">Klientka: Anna K. · Piątek 14:30</p>
              </div>

              {/* Floating badge — time */}
              <div
                className="absolute -left-4 bottom-20 glass rounded-2xl px-3 py-2 shadow-xl"
                style={{ animation: 'fadeInUp 0.6s 1s both' }}
              >
                <p className="text-xs font-semibold text-slate-700">⚡ Odpowiedź w 1.2s</p>
                <p className="text-[11px] text-slate-500">Ty spałaś spokojnie</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="animate-fade-in-up mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            animationDelay: '0.5s',
          }}
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
          <path d="M0 80 C360 0 1080 0 1440 80 L1440 80 L0 80Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
}
