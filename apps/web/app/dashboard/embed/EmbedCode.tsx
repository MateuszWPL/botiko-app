'use client';

import { useState } from 'react';
import { Copy, Check, Code2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Bot {
  id: string;
  name: string;
}

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

const INSTALL_STEPS = [
  {
    step: 1,
    title: 'Skopiuj kod',
    desc: 'Kliknij przycisk "Kopiuj" powyżej',
  },
  {
    step: 2,
    title: 'Wklej na stronie',
    desc: 'Wstaw przed znacznikiem </body> w kodzie HTML strony',
  },
  {
    step: 3,
    title: 'Gotowe!',
    desc: 'Widget pojawi się w prawym dolnym rogu Twojej strony',
  },
];

const PLATFORMS = [
  {
    platform: 'WordPress',
    accent: 'bg-blue-600',
    label: 'WP',
    steps: [
      'Wygląd → Edytor motywu → footer.php',
      'Wklej kod przed </body>',
      'Zapisz zmiany',
    ],
  },
  {
    platform: 'Wix',
    accent: 'bg-slate-900',
    label: 'Wix',
    steps: [
      'Strona → Ustawienia → Zaawansowane',
      'Śledzenie i analityka → + Nowe narzędzie',
      'Niestandardowy kod → wklej przed </body>',
    ],
  },
  {
    platform: 'Squarespace',
    accent: 'bg-slate-800',
    label: 'SS',
    steps: ['Ustawienia → Zaawansowane → Wstrzyknięcie kodu', 'Stopka → wklej kod'],
  },
];

export function EmbedCode({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState(bots[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-6 max-w-2xl">
      {bots.length > 1 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wybierz bota</label>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white/60 transition-shadow"
          >
            {bots.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Code block */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-3">
          Kod do wklejenia{' '}
          <span className="font-normal text-slate-500">
            (przed <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{`</body>`}</code>)
          </span>
        </p>
        <div className="bg-slate-900 rounded-xl p-4 relative group">
          <code className="text-emerald-400 text-xs break-all leading-relaxed pr-20">
            {embedCode}
          </code>
          <button
            onClick={() => void copyCode()}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Skopiowano
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Kopiuj
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step wizard */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-5">Jak zainstalować?</p>
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-5 left-5 right-5 h-px bg-slate-200 z-0" style={{ left: 'calc(1.25rem + 20px)', right: 'calc(1.25rem + 20px)' }} />
          {INSTALL_STEPS.map((item, idx) => (
            <div key={item.step} className="flex sm:flex-col items-start sm:items-center sm:flex-1 gap-3 sm:gap-2 relative z-10 pb-4 sm:pb-0 last:pb-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 text-white text-sm font-bold">
                {copied && item.step === 1 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  item.step
                )}
              </div>
              <div className="sm:text-center">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 sm:max-w-[120px]">{item.desc}</p>
              </div>
              {idx < INSTALL_STEPS.length - 1 && (
                <div className="sm:hidden absolute left-5 top-10 bottom-0 w-px bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform guides */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-4">Instrukcja per platforma</p>
        <div className="space-y-5">
          {PLATFORMS.map((item) => (
            <div key={item.platform} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <span className="text-white text-xs font-bold">{item.label}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">{item.platform}</p>
                <ol className="text-xs text-slate-500 space-y-0.5 list-decimal list-inside">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
