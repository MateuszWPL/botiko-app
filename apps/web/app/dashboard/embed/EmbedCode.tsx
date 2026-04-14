'use client';

import { useState } from 'react';
import { Copy, Check, Code2, CheckCircle2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Bot {
  id: string;
  name: string;
}

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

// SVG loga platform
function WordPressLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.667 12c0-1.307.28-2.549.778-3.674L7.93 19.243A8.355 8.355 0 013.667 12zm8.333 8.333a8.376 8.376 0 01-2.371-.344l2.518-7.318 2.578 7.063c.017.041.037.079.058.116a8.374 8.374 0 01-2.783.483zm1.152-12.541c.503-.026.956-.079.956-.079.45-.053.397-.715-.053-.689 0 0-1.352.106-2.224.106-.82 0-2.199-.106-2.199-.106-.45-.026-.503.662-.053.689 0 0 .424.053.874.079l1.299 3.559-1.824 5.472-3.034-9.031c.503-.026.956-.079.956-.079.449-.053.396-.715-.054-.689 0 0-1.351.106-2.224.106-.156 0-.34-.004-.535-.011A8.338 8.338 0 0112 3.667c2.18 0 4.171.833 5.666 2.197-.036-.002-.071-.006-.108-.006-1.42 0-2.226 1.234-2.226 2.559 0 1.169.662 2.16 1.378 3.337.531.928 1.143 2.119 1.143 3.842 0 1.193-.459 2.576-.981 4.514l-1.286-4.29z" />
    </svg>
  );
}

function WixLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5l-2-5-2 5H5l3-9h1.5l2 5 2-5H15l3 9h-1.5l-2-5-2 5h-2z" />
    </svg>
  );
}

function SquarespaceLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 11.5h-9v-3h9v3z" />
    </svg>
  );
}

function WebflowLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.82 7.34l-3.12 9.32-2.1-6.44 1.65-2.88H17.82zm-7.68 0L7.02 16.66 4.18 7.34h2.7l1.36 4.84 1.36-4.84h.54zM2 7.34h2l2.5 7.44L8 11.6 9.5 16.66H12l3.2-9.32h-2.1L12 10.52l-1.1-3.18H2zm20 0h-2.1L17 16.66h2.3L22 7.34z" />
    </svg>
  );
}

function GtmLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
    </svg>
  );
}

const PLATFORMS = [
  {
    id: 'wordpress',
    label: 'WordPress',
    bg: 'bg-blue-600',
    Logo: WordPressLogo,
    steps: [
      'Wygląd → Edytor motywu → footer.php',
      'Wklej kod przed </body>',
      'Zapisz zmiany i odśwież stronę',
    ],
  },
  {
    id: 'wix',
    label: 'Wix',
    bg: 'bg-slate-900',
    Logo: WixLogo,
    steps: [
      'Ustawienia → Zaawansowane → Śledzenie',
      'Nowe narzędzie → Niestandardowy kod',
      'Wklej kod, ustaw „Przed </body>"',
    ],
  },
  {
    id: 'squarespace',
    label: 'Squarespace',
    bg: 'bg-slate-800',
    Logo: SquarespaceLogo,
    steps: [
      'Ustawienia → Zaawansowane → Wstrzyknięcie kodu',
      'Wklej kod w sekcji Stopka',
      'Zapisz i opublikuj zmiany',
    ],
  },
  {
    id: 'webflow',
    label: 'Webflow',
    bg: 'bg-indigo-600',
    Logo: WebflowLogo,
    steps: [
      'Project Settings → Custom Code',
      'Wklej kod w „Footer Code"',
      'Publish → zmiany live',
    ],
  },
  {
    id: 'gtm',
    label: 'Google Tag Manager',
    bg: 'bg-sky-500',
    Logo: GtmLogo,
    steps: [
      'Nowy tag → Niestandardowy HTML',
      'Wklej kod, wyzwalacz: All Pages',
      'Opublikuj kontener',
    ],
  },
];

const STEPS = [
  { n: 1, title: 'Skopiuj kod', desc: 'Kliknij przycisk Kopiuj' },
  { n: 2, title: 'Wklej na stronie', desc: 'Przed </body> w HTML' },
  { n: 3, title: 'Gotowe!', desc: 'Bot pojawi się na stronie' },
];

export function EmbedCode({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState(bots[0]?.id ?? '');
  const [copied, setCopied] = useState(false);
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);

  if (bots.length === 0) {
    return (
      <EmptyState
        icon={Code2}
        title="Najpierw utwórz bota"
        description="Kod instalacyjny jest dostępny po utworzeniu bota"
        action={{ label: 'Utwórz bota', href: '/onboarding/step-1' }}
      />
    );
  }

  const embedCode = `<script src="${WIDGET_URL}/embed.js" data-bot-id="${selectedBot}" async></script>`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Kod skopiowany do schowka');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Wybór bota — tylko gdy > 1 */}
      {bots.length > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-xs text-amber-700 font-medium flex-shrink-0">Bot:</span>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="flex-1 text-sm text-slate-700 bg-transparent focus:outline-none font-medium"
          >
            {bots.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* === Blok 1: Kod === */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Kod instalacyjny</span>
          </div>
          <span className="text-xs text-slate-400">wklej przed <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{`</body>`}</code></span>
        </div>
        {/* Code */}
        <div className="bg-slate-950 px-5 py-4 relative group">
          <code className="text-emerald-400 text-xs sm:text-sm leading-relaxed break-all pr-24 block font-mono">
            {embedCode}
          </code>
          <button
            onClick={() => void copyCode()}
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" />Skopiowano</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />Kopiuj</>
            )}
          </button>
        </div>
      </div>

      {/* === Blok 2: Kroki === */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Rocket className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Jak zainstalować?</span>
        </div>

        <div className="relative">
          {/* linia łącząca — tylko desktop */}
          <div className="hidden sm:block absolute top-5 h-px bg-slate-200"
            style={{ left: 'calc(1.25rem + 20px)', right: 'calc(1.25rem + 20px)' }} />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
            {STEPS.map((s, idx) => (
              <div key={s.n} className="flex sm:flex-col items-start sm:items-center sm:flex-1 gap-3 sm:gap-2 relative z-10">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md text-sm font-bold text-white transition-all ${
                  copied && s.n === 1
                    ? 'bg-emerald-500 shadow-emerald-200'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'
                }`}>
                  {copied && s.n === 1 ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                </div>
                <div className="sm:text-center">
                  <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 sm:max-w-[110px]">{s.desc}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="sm:hidden absolute left-5 top-10 bottom-0 w-px bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Blok 3: Platformy === */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-800">Instrukcja per platforma</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {PLATFORMS.map((p) => {
            const isOpen = openPlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenPlatform(isOpen ? null : p.id)}
                className="text-left px-5 py-4 hover:bg-slate-50/60 transition-colors focus:outline-none group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <p.Logo />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{p.label}</p>
                    {isOpen ? (
                      <ol className="mt-2 space-y-1 text-left">
                        {p.steps.map((step, i) => (
                          <li key={i} className="text-xs text-slate-500 flex gap-1.5">
                            <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{p.steps[0]}</p>
                    )}
                  </div>
                  <span className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
