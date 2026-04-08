'use client';

import { useState } from 'react';

interface Bot {
  id: string;
  name: string;
}

const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://widget.botiko.pl';

export function EmbedCode({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState(bots[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

  if (bots.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Nie masz jeszcze żadnego bota</p>
        <a
          href="/onboarding/step-1"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          Utwórz asystentkę →
        </a>
      </div>
    );
  }

  const embedCode = `<script src="${WIDGET_URL}/embed.js" data-bot-id="${selectedBot}" async></script>`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {bots.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Wybierz asystentkę
          </label>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {bots.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Kod do wklejenia (przed <code className="bg-slate-100 px-1 rounded">{`</body>`}</code>)
        </p>
        <div className="bg-slate-900 rounded-lg p-4 relative">
          <code className="text-emerald-400 text-xs break-all">{embedCode}</code>
          <button
            onClick={() => void copyCode()}
            className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2.5 py-1 rounded"
          >
            {copied ? '✓ Skopiowano' : 'Kopiuj'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-800 mb-4">Jak zainstalować?</p>
        <div className="space-y-4">
          {[
            { platform: 'WordPress', icon: '🔵', steps: ['Wygląd → Edytor motywu → footer.php', 'Wklej kod przed </body>', 'Zapisz zmiany'] },
            { platform: 'Wix', icon: '⚫', steps: ['Strona → Ustawienia → Zaawansowane', 'Śledzenie i analityka → + Nowe narzędzie', 'Niestandardowy kod → wklej przed </body>'] },
            { platform: 'Squarespace', icon: '⬛', steps: ['Ustawienia → Zaawansowane → Wstrzyknięcie kodu', 'Stopka → wklej kod'] },
          ].map((item) => (
            <div key={item.platform}>
              <p className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <span>{item.icon}</span> {item.platform}
              </p>
              <ol className="text-sm text-slate-500 space-y-0.5 list-decimal list-inside ml-5">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
