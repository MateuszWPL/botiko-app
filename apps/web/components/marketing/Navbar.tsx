'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/* ── Icons ─────────────────────────────────────────────────── */
const IcoScissors = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IcoStethoscope = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const IcoUtensils = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </svg>
);
const IcoWrench = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IcoStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcoBlog = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const IcoChevron = ({ open }: { open: boolean }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ── Data ───────────────────────────────────────────────────── */
type DropItem = { label: string; href: string; desc: string; color: string; icon: React.ReactNode };

const INDUSTRIES: DropItem[] = [
  { label: 'Salon beauty',  href: '/dla/salon-beauty', desc: 'Manicure, rzęsy, brwi, kosmetologia', color: '#EC4899', icon: <IcoScissors /> },
  { label: 'Gabinet / SPA', href: '/dla/gabinet',       desc: 'Fizjoterapia, masaże, stomatologia',  color: '#06B6D4', icon: <IcoStethoscope /> },
  { label: 'Restauracja',   href: '/dla/restauracja',   desc: 'Menu, alergie, pytania gości',         color: '#F97316', icon: <IcoUtensils /> },
  { label: 'Warsztat',      href: '/dla/warsztat',      desc: 'Wyceny, terminy, obsługa klientów',   color: '#64748B', icon: <IcoWrench /> },
  { label: 'Inna branża',   href: '/dla/inna',          desc: 'Konfigurowalny szablon 15 min',       color: '#8B5CF6', icon: <IcoStar /> },
];

const BLOG_ITEM: DropItem = {
  label: 'Blog', href: '/blog', desc: 'Poradniki i artykuły dla firm usługowych', color: '#6366F1', icon: <IcoBlog />,
};

const NAV_LINKS = [
  { label: 'Jak działa', href: '#jak-dziala' },
  { label: 'Cennik',     href: '#cennik' },
  { label: 'FAQ',        href: '#faq' },
  { label: 'Kontakt',    href: '/kontakt' },
];

/* ── Dropdown (desktop) ─────────────────────────────────────── */
function BranzeDropdown({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger */}
      <button
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
          scrolled ? 'text-slate-600 hover:text-brand' : 'text-white/90 hover:text-white'
        }`}
      >
        Branże
        <IcoChevron open={open} />
      </button>

      {/* Panel */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: '50%',
          transform: `translateX(-50%) translateY(${open ? '0' : '-8px'})`,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          width: 560,
          zIndex: 100,
        }}
      >

<div className="rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden flex">
          {/* ── Lewa: lista branż ── */}
          <div className="flex-1 p-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pt-2 pb-1.5">Dla branży</p>
            {INDUSTRIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${item.color}18`, color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800 leading-snug">{item.label}</span>
                  <span className="block text-xs text-slate-400 leading-snug truncate">{item.desc}</span>
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="ml-auto shrink-0 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* Blog */}
            <div className="border-t border-slate-100 mt-1 pt-1">
              <Link
                href={BLOG_ITEM.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors group"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: '#EEF2FF', color: '#6366F1' }}
                >
                  {BLOG_ITEM.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800 leading-snug">{BLOG_ITEM.label}</span>
                  <span className="block text-xs text-slate-400 leading-snug">{BLOG_ITEM.desc}</span>
                </span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand text-white shrink-0">
                  Nowe
                </span>
              </Link>
            </div>
          </div>

          {/* ── Prawa: featured panel ── */}
          <div
            className="w-48 shrink-0 flex flex-col justify-between p-5 rounded-r-2xl"
            style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)' }}
          >
            {/* ROI */}
            <div>
              <div className="flex gap-0.5 mb-3">
                {[0,1,2,3,4].map((i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-white font-bold text-sm leading-snug mb-1">
                Bot zarabia na siebie już po jednej klientce
              </p>
              <p className="text-indigo-200 text-xs leading-relaxed">
                1 wizyta = 150–300 zł.<br />Bot = 149 zł/mies.
              </p>
            </div>

            {/* Social proof */}
            <div className="my-4 border-t border-white/10 pt-4">
              <p className="text-indigo-300 text-[11px] leading-relaxed italic">
                &ldquo;W pierwszy weekend bot umówił 3 klientki, gdy spałam.&rdquo;
              </p>
              <p className="text-indigo-400 text-[10px] mt-1.5 font-medium">— Monika, salon beauty</p>
            </div>

            {/* CTA */}
            <Link
              href="/rejestracja"
              className="block text-center text-xs font-bold px-3 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              Zacznij za darmo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile accordion ───────────────────────────────────────── */
function MobileBranzeAccordion({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer text-lg"
      >
        Branże
        <IcoChevron open={open} />
      </button>

      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div className="pl-4 pb-2 flex flex-col gap-1">
          {INDUSTRIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${item.color}18`, color: item.color }}
              >
                {item.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-700">{item.label}</span>
                <span className="block text-xs text-slate-400">{item.desc}</span>
              </span>
            </Link>
          ))}
          <Link
            href="/blog"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors mt-1 border-t border-slate-100 pt-3"
          >
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-brand-soft text-brand">
              <IcoBlog />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-700">Blog</span>
              <span className="block text-xs text-slate-400">Poradniki dla firm usługowych</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function Navbar({ forceScrolled = false }: { forceScrolled?: boolean } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(forceScrolled);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (forceScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pageshow', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pageshow', onScroll);
    };
  }, [forceScrolled]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function toAppHref(href: string): string {
    if (href.startsWith('#')) return `/${href}`;
    return href;
  }

  function onHashClick(e: React.MouseEvent, hashHref: string) {
    if (pathname !== '/') return;
    e.preventDefault();
    const el = document.querySelector(hashHref);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    router.replace(`/${hashHref}`);
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer">
            <Image src="/BotikoLogo.png" alt="Botiko" width={32} height={32} className="rounded-lg" />
            <span className={scrolled ? 'text-text' : 'text-white drop-shadow'}>
              Botiko<span className={scrolled ? 'text-brand' : 'text-white/80'}>.pl</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6">
            {/* Dropdown */}
            <li>
              <BranzeDropdown scrolled={scrolled} />
            </li>
            {/* Regular links */}
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={toAppHref(link.href)}
                  onClick={link.href.startsWith('#') ? (e) => onHashClick(e, link.href) : undefined}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    scrolled ? 'text-slate-600 hover:text-brand' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                scrolled
                  ? 'text-slate-600 hover:text-brand hover:bg-slate-100'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Logowanie
            </Link>
            <Link
              href="/rejestracja"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand text-white text-sm font-semibold shadow-md hover:bg-brand-dark transition-colors cursor-pointer"
            >
              Zacznij za darmo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Otwórz menu"
            className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-50 md:hidden transition-all duration-350"
        style={{
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      />

      {/* Mobile panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-80 bg-white flex flex-col md:hidden shadow-2xl"
        style={{
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 font-bold text-xl">
            <span className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white text-sm font-bold">B</span>
            <span className="text-text">Botiko<span className="text-brand">.pl</span></span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Zamknij menu"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
          {/* Dropdown accordion */}
          <MobileBranzeAccordion onClose={() => setMenuOpen(false)} />

          {/* Regular links */}
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={toAppHref(link.href)}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer text-lg"
              style={{ transitionDelay: menuOpen ? `${(i + 1) * 50}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Panel CTAs */}
        <div className="px-6 pb-10 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-center py-3 rounded-xl text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Logowanie
          </Link>
          <Link
            href="/rejestracja"
            onClick={() => setMenuOpen(false)}
            className="text-center py-3.5 rounded-xl bg-brand text-white font-bold shadow-md hover:bg-brand-dark transition-colors"
          >
            Zacznij za darmo — 14 dni
          </Link>
        </div>
      </div>
    </>
  );
}
