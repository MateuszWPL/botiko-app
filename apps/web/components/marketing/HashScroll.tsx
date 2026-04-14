'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (!el) return;

  // Offset for fixed navbar (h-16) + a bit of breathing room.
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;
    // Let layout paint first so sections exist.
    const id = window.setTimeout(scrollToHash, 0);
    const onHashChange = () => scrollToHash();
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}

