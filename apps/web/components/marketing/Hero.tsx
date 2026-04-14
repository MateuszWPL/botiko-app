'use client';

import Link from 'next/link';

const TRUST_STATS = [
  { value: 'Pilot', label: 'pierwsze wdrożenia' },
  { value: '24/7', label: 'dostępny bot' },
  { value: 'Sekundy', label: 'czas odpowiedzi' },
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
              <span style={{ color: '#a5b4fc' }}>Botiko odpowiada</span>
              <br />
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

          {/* Right — video placeholder */}
          <div className="animate-fade-in-up flex flex-col justify-center lg:justify-end gap-4" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full max-w-lg mx-auto lg:mx-0">
              {/* Video placeholder card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #2d2a6e 50%, #3730a3 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  aspectRatio: '16/9',
                }}
              >
                {/* Decorative grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Soft glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-15"
                  style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }} />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {/* Play button */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="ml-1">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>

                  <div className="text-center px-6">
                    <p className="text-white font-semibold text-sm">Zobacz jak Botiko działa</p>
                    <p className="text-indigo-300 text-xs mt-1">Film wkrótce · ~60 sekund</p>
                  </div>
                </div>

                {/* Bottom bar — fake video controls */}
                <div
                  className="absolute bottom-0 inset-x-0 px-5 py-3 flex items-center gap-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                >
                  <div className="flex-1 h-0.5 rounded-full bg-white/20">
                    <div className="w-0 h-full rounded-full bg-white/50" />
                  </div>
                  <span className="text-white/50 text-[10px] font-mono">0:60</span>
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex gap-3 max-w-lg mx-auto lg:mx-0 w-full">
              <div className="glass rounded-2xl px-4 py-2.5 flex-1 shadow-lg">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Odpowiedź w kilka sekund
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Ty śpisz spokojnie</p>
              </div>
              <div className="glass rounded-2xl px-4 py-2.5 flex-1 shadow-lg">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Lead zapisany
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Demo leada · Piątek 14:30</p>
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
