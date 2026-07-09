'use client';

import { useEffect } from 'react';

const DEMO_BOT_ID = process.env.NEXT_PUBLIC_DEMO_BOT_ID;
const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

export default function DemoWidget() {
  useEffect(() => {
    if (!DEMO_BOT_ID) return;

    // Guard 1: embed.ts ustawi ten atrybut gdy widget zostanie załadowany.
    // Jeśli już istnieje, widget działa, nie ładuj kolejnego skryptu.
    if (document.documentElement.hasAttribute('data-botiko-init')) return;

    // Guard 2: skrypt już jest w DOM (np. Next.js re-render, hot reload)
    const existing = document.querySelector('script[data-botiko-demo]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = `${WIDGET_URL}/embed.js`;
    script.dataset.botId = DEMO_BOT_ID;
    script.dataset.botikoDemo = 'true';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return () => {
      script.remove();
      // NOTE: celowo NIE usuwamy #botiko-host ani data-botiko-init podczas cleanup!
      // embed.ts używa ich jako guard przed double-init.
      // React Strict Mode uruchamia effecty dwa razy, gdybyśmy usunęli guard,
      // drugi init() stworzył by drugi widget.
    };
  }, []);

  return null;
}
