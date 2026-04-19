import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function CtaBanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div
            className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338CA 50%, #6366F1 100%)',
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }}
            />

            <div className="relative">
              <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-4">
                Zacznij dzisiaj
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Zacznij odpowiadać klientom —
                <br />
                <span style={{ color: '#a5b4fc' }}>nawet kiedy śpisz.</span>
              </h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                Zacznij zbierać leady, gdy inni śpią.
                14 dni za darmo, bez karty kredytowej, bez umowy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-brand font-bold text-base shadow-xl hover:shadow-2xl hover:bg-brand-soft transition-all cursor-pointer"
                >
                  Testuj bota 14 dni za darmo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a
                  href="mailto:kontakt@botiko.pl"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-white transition-all hover:bg-white/10"
                  style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
                >
                  Mam pytanie — napisz do nas
                </a>
              </div>

              <p className="mt-6 text-indigo-300 text-sm">
                ✓ Bez karty kredytowej &nbsp;·&nbsp; ✓ Konfiguracja w 15 min &nbsp;·&nbsp; ✓ Cancel w każdej chwili
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
