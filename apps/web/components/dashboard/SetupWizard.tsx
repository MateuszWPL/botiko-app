'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, Check, Bot, Copy, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '../../lib/supabase';
import { WELCOME_STORAGE_KEY } from './WelcomeTrialModal';
import { WebsiteImportButton } from '../knowledge/WebsiteImportButton';
import { DemoChatPreview } from './DemoChatPreview';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://cdn.botiko.pl';
const STORAGE_KEY = 'botiko_wizard_v2';
const DONE_KEY = 'botiko_setup_done';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ServiceItem {
  name: string;
  price: string;
  note: string;
}

interface WizardData {
  companyName: string;
  websiteUrl: string;
  phone: string;
  email: string;
  address: string;
  serviceItems: ServiceItem[];
  additionalInfo: string;
  botName: string;
  primaryColor: string;
  welcomeMsg: string;
}

const DEFAULTS: WizardData = {
  companyName: '',
  websiteUrl: '',
  phone: '',
  email: '',
  address: '',
  serviceItems: [],
  additionalInfo: '',
  botName: '',
  primaryColor: '#6366F1',
  welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
};

function loadWizard(): WizardData {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const saved = JSON.parse(raw) as Partial<WizardData> & { services?: string };
    // migrate old "services" textarea field → additionalInfo
    if (saved.services && !saved.additionalInfo) {
      saved.additionalInfo = saved.services;
    }
    return { ...DEFAULTS, ...saved };
  } catch {
    return DEFAULTS;
  }
}

function saveWizard(data: Partial<WizardData>): void {
  if (typeof window === 'undefined') return;
  const current = loadWizard();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
}

function isSetupDone(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(DONE_KEY) === 'true';
}

function markSetupDone(): void {
  if (typeof window !== 'undefined') localStorage.setItem(DONE_KEY, 'true');
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const COLORS = [
  { value: '#6366F1', label: 'Indygo' },
  { value: '#EC4899', label: 'Różowy' },
  { value: '#10B981', label: 'Zielony' },
  { value: '#F59E0B', label: 'Złoty' },
  { value: '#06B6D4', label: 'Błękitny' },
  { value: '#8B5CF6', label: 'Fioletowy' },
  { value: '#F97316', label: 'Pomarańczowy' },
  { value: '#64748B', label: 'Szary' },
];

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white/70 transition-shadow';

function buildKnowledgeChunks(data: WizardData): { content: string; category: string }[] {
  const chunks: { content: string; category: string }[] = [];

  // Chunk kontaktowy
  const contactLines = [
    data.companyName && `Nazwa firmy: ${data.companyName}`,
    data.phone && `Telefon: ${data.phone}`,
    data.email && `Email: ${data.email}`,
    data.address && `Adres: ${data.address}`,
  ].filter(Boolean);

  if (contactLines.length > 0) {
    chunks.push({ content: contactLines.join('\n'), category: 'kontakt' });
  }

  // Każda usługa jako osobny chunk
  for (const item of data.serviceItems) {
    if (!item.name.trim()) continue;
    const parts = [item.name.trim()];
    if (item.price.trim()) parts.push(item.price.trim());
    if (item.note.trim()) parts.push(item.note.trim());
    chunks.push({ content: parts.join(' — '), category: 'usługi' });
  }

  // Dodatkowe informacje (podzielone po pustej linii)
  if (data.additionalInfo.trim()) {
    const parts = data.additionalInfo.split(/\n\n+/).filter((p) => p.trim().length >= 10);
    for (const part of parts) {
      chunks.push({ content: part.trim(), category: 'usługi' });
    }
  }

  return chunks;
}

// ── Step 1: Dane firmy ─────────────────────────────────────────────────────────

function StepContact({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Te dane bot będzie podawał klientom. Możesz uzupełnić później w Ustawieniach.
      </p>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Nazwa firmy <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Salon Piękności Ania"
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefon</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+48 123 456 789"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="kontakt@salon.pl"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adres</label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="ul. Kwiatowa 5, Białystok"
          className={inputClass}
        />
      </div>

      <p className="text-xs text-slate-400 pt-1">
        Godziny otwarcia ustawisz w sekcji Ustawienia → dzień po dniu z godzinami od–do.
      </p>
    </div>
  );
}

// ── Step 2: Oferta ─────────────────────────────────────────────────────────────

function StepServices({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  const items = data.serviceItems;

  const addItem = () =>
    onChange({ serviceItems: [...items, { name: '', price: '', note: '' }] });

  const removeItem = (idx: number) =>
    onChange({ serviceItems: items.filter((_, i) => i !== idx) });

  const updateItem = (idx: number, patch: Partial<ServiceItem>) =>
    onChange({ serviceItems: items.map((item, i) => (i === idx ? { ...item, ...patch } : item)) });

  return (
    <div className="space-y-5">
      {/* Lista usług */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-600">Usługi i ceny</label>
          <span className="text-xs text-slate-400">Każda usługa = osobny wpis w bazie bota</span>
        </div>

        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-xs text-slate-400 py-2 text-center border border-dashed border-slate-200 rounded-xl">
              Nie dodano jeszcze żadnych usług — kliknij &quot;Dodaj usługę&quot; poniżej
            </p>
          )}

          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-start bg-slate-50 rounded-xl p-3 border border-slate-200"
            >
              <div className="flex-1 space-y-2 min-w-0">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  placeholder="Nazwa usługi (np. Manicure hybrydowy)"
                  className={inputClass}
                  autoFocus={idx === items.length - 1 && item.name === ''}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(idx, { price: e.target.value })}
                    placeholder="Cena (np. 80 zł)"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => updateItem(idx, { note: e.target.value })}
                    placeholder="Czas / opis (opcjonalnie)"
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0 cursor-pointer"
                title="Usuń"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-500 hover:text-indigo-700 text-sm font-medium rounded-xl transition-all hover:bg-indigo-50/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Dodaj usługę
        </button>
      </div>

      {/* Dodatkowe informacje */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Dodatkowe informacje
          <span className="ml-1 font-normal text-slate-400">(promocje, regulamin, inne — opcjonalne)</span>
        </label>
        <textarea
          value={data.additionalInfo}
          onChange={(e) => onChange({ additionalInfo: e.target.value })}
          rows={3}
          placeholder="np. Przy pierwszej wizycie 10% rabatu. Rezerwacje przez Booksy lub telefon."
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
}

// ── Step 3: Wygląd bota ────────────────────────────────────────────────────────

function StepAppearance({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Imię bota <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.botName}
          onChange={(e) => onChange({ botName: e.target.value })}
          maxLength={30}
          placeholder="Ania, Tomek, Pomocnik..."
          className={inputClass}
          autoFocus
        />
        <p className="text-xs text-slate-400 mt-1">Pod tą nazwą wyświetli się Twój bot na stronie</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">Kolor główny</label>
        <div className="flex gap-2.5 flex-wrap items-center">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ primaryColor: c.value })}
              title={c.label}
              className={`w-8 h-8 rounded-full border-[3px] transition-all cursor-pointer ${
                data.primaryColor === c.value
                  ? 'border-slate-700 scale-110 shadow-md'
                  : 'border-white shadow hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <input
            type="color"
            value={data.primaryColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            title="Własny kolor"
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-slate-200 p-0"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Wiadomość powitalna</label>
        <input
          type="text"
          value={data.welcomeMsg}
          onChange={(e) => onChange({ welcomeMsg: e.target.value })}
          maxLength={200}
          className={inputClass}
        />
      </div>

      {/* Interaktywny podgląd na żywo */}
      <DemoChatPreview
        data={{
          botName: data.botName,
          primaryColor: data.primaryColor,
          welcomeMsg: data.welcomeMsg,
          companyName: data.companyName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          serviceItems: data.serviceItems,
        }}
      />
    </div>
  );
}

// ── Step 4: Aktywacja ──────────────────────────────────────────────────────────

function StepActivate({ data, onCreated }: { data: WizardData; onCreated: (botId: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'creating' | 'done' | 'error'>('idle');
  const [botId, setBotId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const chunks = buildKnowledgeChunks(data);

  const create = async () => {
    setStatus('creating');
    setError('');
    setProgress(null);

    try {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('Brak sesji — zaloguj się ponownie');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Krok 1: utwórz bota
      setProgress({ current: 0, total: chunks.length });
      const botRes = await fetch(`${API_URL}/api/v1/bot`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: data.botName,
          welcomeMsg: data.welcomeMsg,
          primaryColor: data.primaryColor,
          allowedDomains: data.websiteUrl ? [data.websiteUrl] : [],
          companyName: data.companyName || null,
          companyPhone: data.phone || null,
          companyAddress: data.address || null,
        }),
      });

      if (!botRes.ok) {
        const err = (await botRes.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? `HTTP ${botRes.status}`);
      }

      const bot = (await botRes.json()) as { id: string };

      // Krok 2: dodaj wiedzę
      for (let i = 0; i < chunks.length; i++) {
        await fetch(`${API_URL}/api/v1/knowledge/${bot.id}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(chunks[i]),
        });
        setProgress({ current: i + 1, total: chunks.length });
      }

      setBotId(bot.id);
      setStatus('done');
      markSetupDone();
      onCreated(bot.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nieznany błąd');
      setStatus('error');
      setProgress(null);
    }
  };

  const embedCode = botId
    ? `<script src="${WIDGET_URL}/embed.js" data-bot-id="${botId}" async></script>`
    : '';

  const copy = async () => {
    if (!embedCode) return;
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'idle') {
    return (
      <div className="space-y-5">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">Gotowy do uruchomienia!</p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Bot zostanie stworzony z danymi które podałeś. Kod instalacyjny wyświetli się od razu.
          </p>
        </div>

        {/* Podsumowanie */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Nazwa firmy</span>
            <span className="font-medium text-slate-800 truncate ml-4">{data.companyName || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Imię bota</span>
            <span className="font-medium text-slate-800">{data.botName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Wpisów wiedzy</span>
            <span className="font-medium text-slate-800">{chunks.length} {chunks.length === 1 ? 'wpis' : chunks.length < 5 ? 'wpisy' : 'wpisów'}</span>
          </div>
        </div>

        <button
          onClick={() => void create()}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200 cursor-pointer"
        >
          Utwórz bota →
        </button>
      </div>
    );
  }

  if (status === 'creating') {
    const pct = progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;
    const label = !progress || progress.current === 0
      ? 'Tworzę bota...'
      : progress.current === progress.total
      ? 'Finalizuję...'
      : `Dodaję wiedzę (${progress.current}/${progress.total})`;

    return (
      <div className="py-10 text-center space-y-5">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
        <div>
          <p className="text-slate-700 font-medium">{label}</p>
          <p className="text-xs text-slate-400 mt-1">Może potrwać kilka sekund</p>
        </div>
        {progress && progress.total > 0 && (
          <div className="mx-auto max-w-xs">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        <button
          onClick={() => void create()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // done
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Bot jest aktywny!</p>
          <p className="text-xs text-emerald-600 mt-0.5">Wklej kod na stronie, żeby się pojawił</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">
          Kod instalacyjny — wklej przed <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code>
        </p>
        <div className="bg-slate-900 rounded-xl p-4 relative">
          <code className="text-emerald-400 text-xs break-all leading-relaxed pr-32 block">{embedCode}</code>
          <button
            onClick={() => void copy()}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Skopiowano!' : 'Kopiuj'}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-700 mb-2">Instalacja na WordPress</p>
        <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
          <li>W panelu WordPress: Wtyczki → Dodaj nową → wyszukaj „Botiko”</li>
          <li>Zainstaluj i aktywuj oficjalną wtyczkę Botiko</li>
          <li>Połącz stronę kodem z zakładki „Instalacja” w panelu Botiko</li>
        </ol>
        <p className="text-xs text-slate-400 mt-2">
          Wolisz bez wtyczki? Wklej powyższy kod przed{' '}
          <code className="bg-slate-200 px-1 rounded">&lt;/body&gt;</code> (np. przez wtyczkę WPCode).
        </p>
      </div>

      {data.websiteUrl && botId && (
        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">Importuj wiedzę ze strony WWW</p>
            <p className="text-xs text-slate-500">
              Automatycznie pobierz usługi, FAQ i cennik z{' '}
              <span className="font-medium text-slate-700">{data.websiteUrl}</span>.
            </p>
          </div>
          <WebsiteImportButton
            botId={botId}
            tenantWebsiteUrl={data.websiteUrl}
            onComplete={() => {}}
          />
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        Dodaj domenę w <strong>Ustawienia → Domena strony</strong>, aby zabezpieczyć bota.
      </p>
    </div>
  );
}

// ── Steps config ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Dane firmy', description: 'Kontakt do firmy' },
  { label: 'Oferta', description: 'Usługi i cennik' },
  { label: 'Wygląd', description: 'Imię bota, kolor, powitanie' },
  { label: 'Gotowe', description: 'Utwórz bota i pobierz kod' },
];

// ── Main export ────────────────────────────────────────────────────────────────

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupWizard({ isOpen, onClose }: SetupWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(DEFAULTS);
  const [botCreated, setBotCreated] = useState(false);

  useEffect(() => {
    setData(loadWizard());
  }, []);

  // Pull websiteUrl + tenant name from registration so user doesn't retype
  // them. Only fills blank fields — keeps whatever the user has already edited.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: session } = await supabase.auth.getSession();
        const token = session.session?.access_token;
        if (!token) return;

        const res = await fetch(`${API_URL}/api/v1/tenant/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const tenant = (await res.json()) as {
          name: string;
          websiteUrl: string | null;
        };
        if (cancelled) return;

        setData((prev) => {
          const patch: Partial<WizardData> = {};
          if (!prev.websiteUrl && tenant.websiteUrl) {
            patch.websiteUrl = tenant.websiteUrl;
          }
          if (!prev.companyName && tenant.name) {
            patch.companyName = tenant.name;
          }
          if (Object.keys(patch).length === 0) return prev;
          saveWizard(patch);
          return { ...prev, ...patch };
        });
      } catch {
        // Non-fatal — wizard still works, user just types the domain manually
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const update = useCallback((patch: Partial<WizardData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveWizard(patch);
      return next;
    });
  }, []);

  const canProceed =
    step === 0 ? data.companyName.trim().length >= 2 :
    step === 2 ? data.botName.trim().length >= 1 :
    true;

  const next = () => { if (step < STEPS.length - 1) setStep((s) => s + 1); };
  const back = () => { if (step > 0) setStep((s) => s - 1); };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={!botCreated ? onClose : undefined}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Konfiguracja bota</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Krok {step + 1} z {STEPS.length} — {STEPS[step].description}
            </p>
          </div>
          {!botCreated && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 px-6 py-3 border-b border-slate-100 flex-shrink-0">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i < step ? 'bg-indigo-500' : i === step ? 'bg-indigo-300' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="px-6 pt-5 pb-2 flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-800">{STEPS[step].label}</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {step === 0 && <StepContact data={data} onChange={update} />}
          {step === 1 && <StepServices data={data} onChange={update} />}
          {step === 2 && <StepAppearance data={data} onChange={update} />}
          {step === 3 && (
            <StepActivate
              data={data}
              onCreated={(id) => {
                setBotCreated(true);
                void id;
              }}
            />
          )}
        </div>

        {/* Footer nav */}
        {step < 3 && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
            {step > 0 && (
              <button
                onClick={back}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Wstecz
              </button>
            )}
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {step === 2 ? 'Dalej — utwórz bota' : 'Dalej'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && botCreated && (
          <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
            <button
              onClick={() => {
                onClose();
                router.refresh();
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              Przejdź do panelu →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Auto-open wrapper ──────────────────────────────────────────────────────────

export function SetupWizardProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | null = null;

    async function checkAndMaybeOpen() {
      if (isSetupDone()) return;
      // Welcome modal hasn't been shown yet — it will trigger the wizard itself
      if (!localStorage.getItem(WELCOME_STORAGE_KEY)) return;

      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('No session token');

        const res = await fetch(`${API_URL}/api/v1/bot`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const bots = (await res.json()) as { id: string }[];
          if (bots.length > 0) {
            markSetupDone();
            window.dispatchEvent(new Event('botiko:setup-done'));
            return;
          }
        }
      } catch {
        // API unreachable — fall through to show wizard
      }

      if (!cancelled) {
        timeoutId = window.setTimeout(() => setOpen(true), 600);
      }
    }

    void checkAndMaybeOpen();
    return () => {
      cancelled = true;
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('botiko:open-wizard', handler);
    return () => window.removeEventListener('botiko:open-wizard', handler);
  }, []);

  return <SetupWizard isOpen={open} onClose={() => setOpen(false)} />;
}
