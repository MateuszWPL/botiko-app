'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Bot, Copy, Loader2 } from 'lucide-react';
import { createClient } from '../../lib/supabase';
import { INDUSTRY_SERVICE_TEMPLATES, type Industry } from '../../lib/industry-templates';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://cdn.botiko.pl';
const STORAGE_KEY = 'botiko_wizard_v2';
const DONE_KEY = 'botiko_setup_done';

// ── Local state ────────────────────────────────────────────────────────────────

interface WizardData {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  services: string;
  botName: string;
  primaryColor: string;
  welcomeMsg: string;
  industry: string;
}

const DEFAULTS: WizardData = {
  companyName: '',
  phone: '',
  email: '',
  address: '',
  hours: '',
  services: '',
  botName: 'Asystentka',
  primaryColor: '#6366F1',
  welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
  industry: 'BEAUTY',
};

function loadWizard(): WizardData {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<WizardData>) };
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

// ── Sub-components ─────────────────────────────────────────────────────────────

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

// Step 1 — Company contact info
function StepContact({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Te dane bot będzie podawał klientom. Uzupełnij tyle, ile chcesz — możesz uzupełnić później.
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

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Godziny otwarcia</label>
        <input
          type="text"
          value={data.hours}
          onChange={(e) => onChange({ hours: e.target.value })}
          placeholder="Pon–Pt: 9:00–18:00, Sob: 10:00–15:00"
          className={inputClass}
        />
      </div>
    </div>
  );
}

// Step 2 — Services
function StepServices({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  const templates =
    INDUSTRY_SERVICE_TEMPLATES[(data.industry as Industry) ?? 'OTHER'] ??
    INDUSTRY_SERVICE_TEMPLATES.OTHER;

  const append = (content: string) => {
    onChange({
      services: data.services.trim() ? `${data.services}\n\n${content}` : content,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Opisz swoje usługi i ceny. Im więcej szczegółów, tym trafniejsze odpowiedzi bota.
      </p>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Szablony — kliknij aby dodać
        </p>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => append(tpl.content)}
              className="px-3 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full transition-colors"
            >
              + {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={data.services}
        onChange={(e) => onChange({ services: e.target.value })}
        rows={9}
        placeholder={`Przykład:\n\nManicure klasyczny — 60 zł, 45 min\nManicure hybrydowy — 90 zł, 75 min\n\nPromocje:\n- Środa dla studentek: -20%`}
        className={`${inputClass} resize-none`}
      />
    </div>
  );
}

// Step 3 — Bot appearance
function StepAppearance({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Imię bota</label>
        <input
          type="text"
          value={data.botName}
          onChange={(e) => onChange({ botName: e.target.value })}
          maxLength={30}
          placeholder="Asystentka, Ania, Pomocnik..."
          className={inputClass}
        />
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
              className={`w-8 h-8 rounded-full border-[3px] transition-all ${
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

      {/* Live preview */}
      <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
        <div
          className="px-4 py-2.5 text-white text-sm font-medium flex items-center gap-2"
          style={{ backgroundColor: data.primaryColor }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          {data.botName || 'Asystentka'}
        </div>
        <div className="p-4 bg-slate-50">
          <div className="inline-block bg-white rounded-xl rounded-bl-sm px-4 py-2 text-sm text-slate-800 shadow-sm max-w-xs">
            {data.welcomeMsg || '...'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4 — Activate (create bot + show embed code)
function StepActivate({
  data,
  onCreated,
}: {
  data: WizardData;
  onCreated: (botId: string) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'creating' | 'done' | 'error'>('idle');
  const [botId, setBotId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const create = async () => {
    setStatus('creating');
    setError('');

    try {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('Brak sesji — zaloguj się ponownie');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Create bot
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
        const err = (await botRes.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? `HTTP ${botRes.status}`);
      }

      const bot = (await botRes.json()) as { id: string };

      // Build and upload knowledge chunks
      const chunks = buildKnowledgeChunks(data);
      for (const chunk of chunks) {
        await fetch(`${API_URL}/api/v1/knowledge/${bot.id}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(chunk),
        });
      }

      setBotId(bot.id);
      setStatus('done');
      markSetupDone();
      onCreated(bot.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nieznany błąd');
      setStatus('error');
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
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-700 font-semibold mb-2">Gotowy do uruchomienia!</p>
        <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
          Kliknij aby utworzyć bota i wygenerować kod instalacyjny dla Twojej strony.
        </p>
        <button
          onClick={() => void create()}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
        >
          Utwórz bota →
        </button>
      </div>
    );
  }

  if (status === 'creating') {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Uczę bota Twojej oferty...</p>
        <p className="text-xs text-slate-400 mt-1">Może potrwać kilka sekund</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4 text-sm">{error}</p>
        <button
          onClick={() => void create()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium"
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
          <p className="text-xs text-emerald-600 font-mono">{botId}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">
          Wklej ten kod na swojej stronie (przed <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code>):
        </p>
        <div className="bg-slate-900 rounded-xl p-4 relative">
          <code className="text-emerald-400 text-xs break-all leading-relaxed">{embedCode}</code>
          <button
            onClick={() => void copy()}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Skopiowano!' : 'Kopiuj'}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-700 mb-2">Instalacja WordPress</p>
        <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
          <li>Zaloguj się do panelu WordPress</li>
          <li>Wygląd → Edytor motywu → <code className="bg-slate-200 px-1 rounded">footer.php</code></li>
          <li>Wklej kod przed <code className="bg-slate-200 px-1 rounded">&lt;/body&gt;</code></li>
          <li>Zapisz i odśwież stronę</li>
        </ol>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Dodaj domenę w <strong>Ustawienia → Domena strony</strong>, aby zabezpieczyć bota.
      </p>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildKnowledgeChunks(
  data: WizardData,
): { content: string; category: string }[] {
  const chunks: { content: string; category: string }[] = [];

  // Contact info chunk
  const contactLines = [
    data.companyName && `Nazwa firmy: ${data.companyName}`,
    data.phone && `Telefon: ${data.phone}`,
    data.email && `Email: ${data.email}`,
    data.address && `Adres: ${data.address}`,
    data.hours && `Godziny otwarcia: ${data.hours}`,
  ].filter(Boolean);

  if (contactLines.length > 0) {
    chunks.push({ content: contactLines.join('\n'), category: 'kontakt' });
  }

  // Services — split by double newline into separate chunks
  if (data.services.trim()) {
    const parts = data.services.split(/\n\n+/).filter((p) => p.trim().length >= 10);
    for (const part of parts) {
      chunks.push({ content: part.trim(), category: 'usługi' });
    }
  }

  return chunks;
}

// ── Steps config ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Dane firmy', description: 'Kontakt i godziny otwarcia' },
  { label: 'Oferta', description: 'Usługi i cennik' },
  { label: 'Wygląd bota', description: 'Imię, kolor, powitanie' },
  { label: 'Aktywacja', description: 'Utwórz bota i zainstaluj' },
];

// ── Main export ────────────────────────────────────────────────────────────────

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupWizard({ isOpen, onClose }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(DEFAULTS);
  const [botCreated, setBotCreated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadWizard());
  }, []);

  const update = useCallback((patch: Partial<WizardData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveWizard(patch);
      return next;
    });
  }, []);

  const canProceed =
    step === 0 ? data.companyName.trim().length >= 2 : true;

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Konfiguracja bota</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Krok {step + 1} z {STEPS.length} — {STEPS[step].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1.5 px-6 py-3 border-b border-slate-100">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < step
                  ? 'bg-indigo-500'
                  : i === step
                  ? 'bg-indigo-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="px-6 pt-5 pb-2">
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
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
            {step > 0 && (
              <button
                onClick={back}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Wstecz
              </button>
            )}
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
            >
              Dalej
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && botCreated && (
          <div className="px-6 py-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all"
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
    // Auto-open for new users who haven't completed setup
    if (!isSetupDone()) {
      // Small delay so the dashboard renders first
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for manual trigger from sidebar
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('botiko:open-wizard', handler);
    return () => window.removeEventListener('botiko:open-wizard', handler);
  }, []);

  return (
    <SetupWizard
      isOpen={open}
      onClose={() => setOpen(false)}
    />
  );
}
