import Link from 'next/link';

const LINKS = {
  Produkt: [
    { label: 'Jak działa', href: '#jak-dziala' },
    { label: 'Branże', href: '#branze' },
    { label: 'Cennik', href: '#cennik' },
    { label: 'Demo', href: '#demo' },
  ],
  Firma: [
    { label: 'O nas', href: '/o-nas' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  Prawo: [
    { label: 'Polityka prywatności', href: '/prywatnosc' },
    { label: 'Regulamin', href: '/regulamin' },
    { label: 'RODO / DPA', href: 'mailto:rodo@botiko.pl' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">
                B
              </span>
              <span className="text-white font-bold text-lg">
                Botiko<span className="text-indigo-400">.pl</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Bot obsługi klienta dla polskich firm usługowych. Odpowiada za Ciebie 24/7 — bez programowania, bez umowy.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/botiko"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/botiko.pl"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/botiko"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Botiko.pl — Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Wszystkie systemy działają</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
