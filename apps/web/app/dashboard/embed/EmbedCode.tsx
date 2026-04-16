'use client';

import { useState } from 'react';
import { Copy, Check, Code2, CheckCircle2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyStateClient } from '../../../components/ui/EmptyStateClient';

interface Bot {
  id: string;
  name: string;
}

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

const STEPS = [
  { n: 1, title: 'Skopiuj kod', desc: 'Kliknij przycisk Kopiuj' },
  { n: 2, title: 'Wklej na stronie', desc: 'Przed </body> w HTML' },
  { n: 3, title: 'Gotowe!', desc: 'Bot pojawi się na stronie' },
];

export function EmbedCode({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState(bots[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

  if (bots.length === 0) {
    return (
      <EmptyStateClient
        icon={Code2}
        title="Najpierw utwórz bota"
        description="Kod instalacyjny jest dostępny po utworzeniu bota"
        action={{ label: 'Utwórz bota', openWizard: true }}
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
          <code className="text-emerald-400 text-xs sm:text-sm leading-relaxed break-all pr-40 block font-mono">
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


    </div>
  );
}
