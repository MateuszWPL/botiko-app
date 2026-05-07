import Image from 'next/image';
import Link from 'next/link';

const LINKS = {
  Produkt: [
    { label: 'Jak działa', href: '/#jak-dziala' },
    { label: 'Branże', href: '/#branze' },
    { label: 'Cennik', href: '/#cennik' },
    { label: 'Demo', href: '/#demo' },
    { label: 'WordPress', href: '/#faq' },
  ],
  Firma: [
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
              <Image
                src="/BotikoLogo.png"
                alt="Botiko.pl — bot obsługi klienta 24/7"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-lg">
                Botiko<span className="text-indigo-400">.pl</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Bot obsługi klienta dla polskich firm usługowych. Odpowiada za Ciebie 24/7 — bez programowania, bez umowy.
            </p>
            <div className="text-xs leading-relaxed space-y-1">
              <p className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Białystok, Polska
              </p>
              <p className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:kontakt@botiko.pl" className="hover:text-white transition-colors">
                  kontakt@botiko.pl
                </a>
              </p>
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
            © {new Date().getFullYear()} Botiko.pl — Projekt z Białegostoku. Działamy w całej Polsce.
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
