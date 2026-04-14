'use client';

import { useEffect } from 'react';

const DEMO_BOT_ID = process.env.NEXT_PUBLIC_DEMO_BOT_ID;
const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

export default function DemoWidget() {
  useEffect(() => {
    if (!DEMO_BOT_ID) return;

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
      // Also remove the widget host so a remount (React Strict Mode) gets a clean slate
      document.getElementById('botiko-host')?.remove();
    };
  }, []);

  return null;
}
