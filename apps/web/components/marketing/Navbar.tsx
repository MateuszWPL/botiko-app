'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Jak działa', href: '#jak-dziala' },
  { label: 'Branże', href: '#branze' },
  { label: 'Cennik', href: '#cennik' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand text-white text-sm font-bold">
              B
            </span>
            <span className={scrolled ? 'text-text' : 'text-white drop-shadow'}>
              Botiko
              <span className={scrolled ? 'text-brand' : 'text-white/80'}>.pl</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    scrolled
                      ? 'text-slate-600 hover:text-brand'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors cursor-pointer ${
                scrolled ? 'text-slate-600 hover:text-brand' : 'text-white/90 hover:text-white'
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

      {/* ── Mobile full-screen side panel ── */}

      {/* Backdrop */}
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

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-80 bg-white flex flex-col md:hidden shadow-2xl"
        style={{
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 font-bold text-xl cursor-pointer"
          >
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
        <nav className="flex-1 flex flex-col px-6 py-8 gap-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer text-lg"
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Panel footer CTAs */}
        <div className="px-6 pb-10 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-center py-3 rounded-xl text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Logowanie
          </Link>
          <Link
            href="/rejestracja"
            onClick={() => setMenuOpen(false)}
            className="text-center py-3.5 rounded-xl bg-brand text-white font-bold shadow-md hover:bg-brand-dark transition-colors cursor-pointer"
          >
            Zacznij za darmo — 14 dni
          </Link>
        </div>
      </div>
    </>
  );
}
