'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../../../components/onboarding/OnboardingShell';
import {
  loadOnboarding,
  saveOnboarding,
  clearOnboarding,
} from '../../../lib/onboarding-store';
import { createClient } from '../../../lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'http://localhost:5173';

interface SetupState {
  status: 'idle' | 'creating' | 'done' | 'error';
  botId?: string;
  error?: string;
}

export default function Step5Page() {
  const router = useRouter();
  const [setup, setSetup] = useState<SetupState>({ status: 'idle' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = loadOnboarding();
    if (data.botId) {
      setSetup({ status: 'done', botId: data.botId });
    }
  }, []);

  const createBot = async () => {
    setSetup({ status: 'creating' });
    const data = loadOnboarding();

    try {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;

      if (!token) {
        router.push('/login?redirect=/onboarding/step-5');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // 1. Create bot
      const botRes = await fetch(`${API_URL}/api/v1/bot`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: data.botName,
          welcomeMsg: data.welcomeMsg,
          primaryColor: data.primaryColor,
          allowedDomains: [],
        }),
      });

      if (!botRes.ok) {
        const errBody = await botRes.json().catch(() => ({})) as { message?: string; details?: unknown };
        const detail = typeof errBody.details === 'object' && errBody.details !== null
          ? JSON.stringify(errBody.details)
          : errBody.message ?? `HTTP ${botRes.status}`;
        throw new Error(`Failed to create bot: ${detail}`);
      }
      const bot = (await botRes.json()) as { id: string };

      // 2. Build knowledge base from onboarding data
      const knowledgeChunks = buildKnowledgeChunks(data);
      for (const chunk of knowledgeChunks) {
        const chunkRes = await fetch(`${API_URL}/api/v1/knowledge/${bot.id}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(chunk),
        });
        if (!chunkRes.ok) {
          throw new Error(
            `Failed to upload knowledge chunk (HTTP ${chunkRes.status})`,
          );
        }
      }

      saveOnboarding({ botId: bot.id });
      setSetup({ status: 'done', botId: bot.id });
    } catch (err) {
      setSetup({
        status: 'error',
        error: err instanceof Error ? err.message : 'Nieznany błąd',
      });
    }
  };

  const embedCode = setup.botId
    ? `<script src="${WIDGET_URL}/embed.js" data-bot-id="${setup.botId}" async></script>`
    : '';

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToDashboard = () => {
    clearOnboarding();
    router.push('/dashboard/overview');
  };

  return (
    <OnboardingShell
      step={5}
      totalSteps={5}
      title="Asystentka gotowa! 🎉"
      subtitle="Zainstaluj ją na swojej stronie w 2 minuty"
    >
      {setup.status === 'idle' && (
        <div className="text-center py-8">
          <p className="text-slate-600 mb-6">
            Kliknij aby uruchomić asystentkę i wygenerować kod instalacyjny
          </p>
          <button
            onClick={() => void createBot()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Utwórz asystentkę →
          </button>
        </div>
      )}

      {setup.status === 'creating' && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Konfiguruję asystentkę i uczę jej Twojej oferty...</p>
        </div>
      )}

      {setup.status === 'error' && (
        <div className="text-center py-6">
          <p className="text-red-600 mb-4">{setup.error}</p>
          <button
            onClick={() => void createBot()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {setup.status === 'done' && setup.botId && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-emerald-800">Asystentka jest aktywna</p>
              <p className="text-sm text-emerald-600">ID: {setup.botId}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Kod do wklejenia na stronie (przed <code className="bg-slate-100 px-1 rounded">{`</body>`}</code>):
            </p>
            <div className="bg-slate-900 rounded-xl p-4 relative">
              <code className="text-emerald-400 text-xs break-all">{embedCode}</code>
              <button
                onClick={() => void copyEmbed()}
                className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded"
              >
                {copied ? '✓ Skopiowano' : 'Kopiuj'}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Instalacja na WordPress
            </p>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
              <li>Zaloguj się do panelu WordPress</li>
              <li>Wygląd → Edytor motywu → <code className="bg-slate-200 px-1 rounded">footer.php</code></li>
              <li>Wklej kod przed <code className="bg-slate-200 px-1 rounded">{`</body>`}</code></li>
              <li>Zapisz i odśwież stronę</li>
            </ol>
          </div>

          <button
            onClick={goToDashboard}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Przejdź do panelu →
          </button>
        </div>
      )}
    </OnboardingShell>
  );
}

function buildKnowledgeChunks(data: ReturnType<typeof loadOnboarding>) {
  const chunks: { content: string; category: string }[] = [];

  if (data.companyName || data.address || data.phone || data.hours) {
    const info = [
      data.companyName && `Firma: ${data.companyName}`,
      data.address && `Adres: ${data.address}`,
      data.phone && `Telefon: ${data.phone}`,
      data.hours && `Godziny otwarcia: ${data.hours}`,
    ]
      .filter(Boolean)
      .join('\n');
    chunks.push({ content: info, category: 'company_info' });
  }

  if (data.services) {
    const parts = data.services.split('\n\n').filter((p) => p.trim());
    for (const part of parts) {
      if (part.trim()) {
        chunks.push({ content: part.trim(), category: 'services' });
      }
    }
  }

  return chunks;
}
