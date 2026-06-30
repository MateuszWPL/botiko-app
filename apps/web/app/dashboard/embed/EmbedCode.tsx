'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Code2,
  CheckCircle2,
  ChevronDown,
  Terminal,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';
import { EmptyStateClient } from '../../../components/ui/EmptyStateClient';

export interface Bot {
  id: string;
  name: string;
  allowedDomains: string[];
}

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ── FAQ animated answer ────────────────────────────────────────────────────

function FaqAnswer({ open, text }: { open: boolean; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setHeight(open ? ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div
      style={{
        maxHeight: height,
        overflow: 'hidden',
        transition: 'max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={ref} className="px-5 pb-4 pt-0 text-sm text-slate-600 leading-relaxed">
        {text}
      </div>
    </div>
  );
}

// ── Inline code block with copy ────────────────────────────────────────────

function CodeBlock({ code, language = 'html' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-950 mt-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <span className="text-xs text-slate-500 font-mono">{language}</span>
        <button
          onClick={() => void copy()}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Skopiowano
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Kopiuj
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap break-all">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Platform definitions ───────────────────────────────────────────────────

type PlatformId =
  | 'wordpress'
  | 'html';

interface Step {
  title: string;
  body: string;
  code?: { snippet: string; lang?: string };
  note?: string;
}

interface PlatformDef {
  id: PlatformId;
  name: string;
  abbr: string;
  color: string;
  steps: (embedCode: string) => Step[];
  warning?: string;
}

const PLATFORMS: PlatformDef[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    abbr: 'WP',
    color: '#21759B',
    steps: (code) => [
      {
        title: 'Zainstaluj wtyczkę WPCode',
        body: 'W panelu WordPress przejdź do Wtyczki → Dodaj nową, wyszukaj "WPCode" i zainstaluj. Jest bezpłatna, ma ponad 2 mln aktywnych instalacji i nie wymaga edycji kodu.',
      },
      {
        title: 'Utwórz nowy snippet',
        body: 'Przejdź do WPCode → Add Snippet → kliknij "Add Your Custom Code (New Snippet)". Jako typ wybierz HTML Snippet.',
      },
      {
        title: 'Wklej kod widgetu',
        body: 'W polu edytora wklej poniższy kod. W sekcji "Insertion" ustaw lokalizację na Site Wide Footer, następnie aktywuj snippet i zapisz.',
        code: { snippet: code, lang: 'html' },
        note: 'Bot automatycznie nie wyświetla się w panelu admina WordPress (/wp-admin) — wykrywanie działa po naszej stronie i nie wymaga dodatkowej konfiguracji.',
      },
      {
        title: 'Odśwież stronę i sprawdź',
        body: 'Otwórz swoją stronę internetową w nowej zakładce (nie w panelu WP). W prawym dolnym rogu powinien pojawić się przycisk czatu.',
      },
    ],
  },
  {
    id: 'html',
    name: 'Inna strona',
    abbr: '</>',
    color: '#64748B',
    steps: (code) => [
      {
        title: 'Otwórz szablon HTML strony',
        body: 'Znajdź główny plik HTML lub szablon używany na wszystkich podstronach (np. layout.html, base.html, _layout.html w zależności od frameworka lub CMS).',
      },
      {
        title: 'Wklej kod przed </body>',
        body: 'Znajdź tag zamykający </body> i wklej kod bezpośrednio przed nim. Zapisz plik i wgraj na serwer lub przeprowadź nowy deployment.',
        code: { snippet: code, lang: 'html' },
        note: 'Atrybut "async" zapewnia że widget ładuje się asynchronicznie i nie blokuje renderowania strony. Nie usuwaj go.',
      },
    ],
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Bot nie pojawia się na stronie — co sprawdzić?',
    a: 'Sprawdź kolejno: (1) Upewnij się że skrypt jest wklejony przed </body>, a nie w <head>. (2) Otwórz konsolę przeglądarki (F12 → Console) i sprawdź czy jest błąd "[Botiko] Missing data-bot-id". (3) Upewnij się że strona jest opublikowana — widget nie działa w trybach podglądu edytora. (4) Sprawdź czy bot jest aktywny w ustawieniach Dashboardu.',
  },
  {
    q: 'Bot pojawia się w panelu WordPress Admin — jak to wyłączyć?',
    a: 'Nie musisz nic robić. Widget automatycznie wykrywa panel administracyjny (/wp-admin, /wp-login.php) i nie inicjalizuje się. Jeśli jednak nadal widzisz widget w adminie, odśwież pamięć podręczną wtyczki do cache\'owania (np. W3 Total Cache, WP Rocket).',
  },
  {
    q: 'Bot wyświetla komunikat o błędzie zamiast odpowiadać.',
    a: 'Najczęstsza przyczyna to domena nie dodana do whitelisty. Przejdź do Dashboard → Ustawienia → Dozwolone domeny i dodaj adres swojej strony (np. twojasalon.pl). Bot blokuje żądania z niezarejestrowanych domen dla bezpieczeństwa.',
  },
  {
    q: 'Chcę żeby bot pojawiał się tylko na wybranych podstronach.',
    a: 'Możesz to osiągnąć przez warunkowe ładowanie skryptu — wklej kod tylko do szablonów wybranych podstron. Na WordPress wystarczy skonfigurować reguły widoczności w WPCode (opcja "Location" → wybierz konkretne strony lub typy wpisów).',
  },
  {
    q: 'Jak otworzyć bota po kliknięciu własnego przycisku CTA?',
    a: 'Widget udostępnia globalne API JavaScript. Po załadowaniu strony możesz wywołać BotikoWidget.open() aby otworzyć czat, BotikoWidget.close() aby zamknąć, lub BotikoWidget.toggle() aby przełączyć. Podepnij to pod zdarzenie click dowolnego elementu na stronie.',
  },
  {
    q: 'Bot działa wolno lub nie odpowiada przez dłuższy czas.',
    a: 'Pierwsze zapytanie może trwać 2-4 sekundy (model AI przetwarza kontekst). Jeśli oczekiwanie przekracza 30 sekund, bot wyświetli komunikat o timeout. Sprawdź czy Twój plan Botiko jest aktywny w zakładce Billing — wygasły plan blokuje odpowiedzi.',
  },
];

// ── Widget health check ────────────────────────────────────────────────────

type CheckStatus = 'idle' | 'checking' | 'detected' | 'not_detected' | 'error';

interface DomainCheck {
  domain: string;
  status: CheckStatus;
}

async function checkDomain(domain: string, botId: string): Promise<CheckStatus> {
  try {
    const res = await fetch(
      `/api/widget-check?url=${encodeURIComponent(domain)}&botId=${encodeURIComponent(botId)}`,
    );
    const data = (await res.json()) as { detected: boolean; error?: string };
    if (data.error === 'fetch_failed') return 'error';
    return data.detected ? 'detected' : 'not_detected';
  } catch {
    return 'error';
  }
}

function DomainRow({ check, onRecheck }: { check: DomainCheck; onRecheck: () => void }) {
  const icon = {
    idle:          <span className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0" />,
    checking:      <Loader2 className="w-4 h-4 text-slate-400 animate-spin flex-shrink-0" />,
    detected:      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    not_detected:  <AlertTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    error:         <AlertTriangleIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />,
  }[check.status];

  const label = {
    idle:         <span className="text-slate-400 text-xs">Nie sprawdzono</span>,
    checking:     <span className="text-slate-500 text-xs">Sprawdzanie…</span>,
    detected:     (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Widget wykryty
      </span>
    ),
    not_detected: (
      <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-xs">
        <AlertTriangleIcon className="w-3.5 h-3.5" />
        Nie znaleziono
      </span>
    ),
    error:        (
      <span className="inline-flex items-center gap-1 text-rose-500 font-medium text-xs">
        <AlertTriangleIcon className="w-3.5 h-3.5" />
        Błąd połączenia
      </span>
    ),
  }[check.status];

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      {icon}
      <span className="text-sm text-slate-700 font-mono flex-1 truncate">{check.domain}</span>
      <span className="text-xs">{label}</span>
      {check.status !== 'checking' && (
        <button
          onClick={onRecheck}
          className="text-xs text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-indigo-50"
        >
          Odśwież
        </button>
      )}
    </div>
  );
}

function WidgetDetector({ botId, domains }: { botId: string; domains: string[] }) {
  const [checks, setChecks] = useState<DomainCheck[]>(() =>
    domains.map((d) => ({ domain: d, status: 'idle' as CheckStatus })),
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runCheck = async (domain: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.domain === domain ? { ...c, status: 'checking' } : c)),
    );
    const status = await checkDomain(domain, botId);
    setChecks((prev) =>
      prev.map((c) => (c.domain === domain ? { ...c, status } : c)),
    );
    setLastChecked(new Date());
  };

  const runAll = () => {
    domains.forEach((d) => void runCheck(d));
  };

  // Auto-run on mount if domains available
  useEffect(() => {
    if (domains.length > 0) runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  const allDetected  = checks.length > 0 && checks.every((c) => c.status === 'detected');
  const anyChecking  = checks.some((c) => c.status === 'checking');

  if (domains.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <AlertTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Brak zdefiniowanych domen</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Dodaj dozwolone domeny w{' '}
            <a href="/dashboard/settings" className="underline font-medium hover:text-amber-900">
              Ustawieniach → Domeny
            </a>{' '}
            aby włączyć automatyczną weryfikację widgetu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm ${
        allDetected ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${allDetected ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <RadarIcon className={`w-3.5 h-3.5 ${allDetected ? 'text-emerald-600' : 'text-slate-500'}`} />
          </div>
          <span className="text-sm font-semibold text-slate-800">Weryfikacja instalacji</span>
        </div>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-xs text-slate-400 hidden sm:block">
              sprawdzono {lastChecked.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={runAll}
            disabled={anyChecking}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-700 disabled:opacity-50 cursor-pointer hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            {anyChecking ? 'Sprawdzam…' : 'Odśwież status'}
          </button>
        </div>
      </div>

      {/* Domain list */}
      <div className="px-5">
        {checks.map((check) => (
          <DomainRow
            key={check.domain}
            check={check}
            onRecheck={() => void runCheck(check.domain)}
          />
        ))}
      </div>

      {/* Footer hint */}
      {!allDetected && !anyChecking && checks.some((c) => c.status === 'not_detected') && (
        <div className="px-5 pb-4 pt-1">
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 leading-relaxed">
            Widget nie został znaleziony. Upewnij się że kod jest wklejony przed{' '}
            <code className="font-mono font-semibold">&lt;/body&gt;</code> i strona jest opublikowana.
            Nowe wdrożenia mogą być widoczne z opóźnieniem do kilku minut.
          </p>
        </div>
      )}
    </div>
  );
}

// Simple inline SVG icons to avoid extra imports
function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}
function RadarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

// ── Official WordPress plugin: one-click pairing code ──────────────────────

function PluginPairing({ botId }: { botId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (expiresAt === null) return;
    const tick = () =>
      setRemaining(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const generate = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(`${API_URL}/api/v1/bot/${botId}/pairing-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
      });
      if (!res.ok) throw new Error('failed');
      const data = (await res.json()) as { token: string; expiresAt: string };
      setCode(data.token);
      setExpiresAt(new Date(data.expiresAt).getTime());
      setCopied(false);
    } catch {
      toast.error('Nie udało się wygenerować kodu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Kod skopiowany do schowka');
    setTimeout(() => setCopied(false), 2500);
  };

  const expired = expiresAt !== null && remaining <= 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">
          Zalecane
        </span>
        <h3 className="text-sm font-bold text-slate-800">
          Oficjalna wtyczka Botiko — połącz jednym kodem
        </h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        Zainstaluj wtyczkę „Botiko” z katalogu WordPress, wygeneruj poniżej kod i
        wklej go w&nbsp;<span className="whitespace-nowrap">Ustawienia → Botiko</span>.
        Kod pobierze Twojego bota i automatycznie autoryzuje domenę tej strony.
      </p>

      {!code || expired ? (
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {expired ? 'Wygeneruj nowy kod' : 'Generuj kod połączenia'}
        </button>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            <code className="flex-1 select-all rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-800 break-all">
              {code}
            </code>
            <button
              type="button"
              onClick={copy}
              aria-label="Kopiuj kod"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Kod jednorazowy, ważny jeszcze {mm}:{ss}. Wklej go w panelu WordPress.
          </p>
        </div>
      )}
    </div>
  );
}

export function EmbedCode({ bots }: { bots: Bot[] }) {
  const [selectedBot, setSelectedBot] = useState(bots[0]?.id ?? '');
  const [mainCopied, setMainCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformId>('wordpress');
  const [platformKey, setPlatformKey] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const copyMain = async () => {
    await navigator.clipboard.writeText(embedCode);
    setMainCopied(true);
    toast.success('Kod skopiowany do schowka');
    setTimeout(() => setMainCopied(false), 2500);
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === activePlatform) ?? PLATFORMS[0]!;
  const steps = currentPlatform.steps(embedCode);

  const currentBot = bots.find((b) => b.id === selectedBot);

  return (
    <div className="space-y-6 max-w-6xl">
      <style>{`
        @keyframes botiko-tab-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── SEKCJA 0: Weryfikacja instalacji ── */}
      <WidgetDetector
        botId={selectedBot}
        domains={currentBot?.allowedDomains ?? []}
      />

      {/* Bot selector — tylko gdy > 1 */}
      {bots.length > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-xs text-amber-700 font-medium flex-shrink-0">Bot:</span>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="flex-1 text-sm text-slate-700 bg-transparent focus:outline-none font-medium"
          >
            {bots.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── SEKCJA 1: Twój kod ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Twój kod instalacyjny</span>
          </div>
          <span className="hidden sm:block text-xs text-slate-400">
            wklej przed{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{`</body>`}</code>
          </span>
        </div>
        <div className="bg-slate-950 px-5 py-4 relative">
          <code className="text-emerald-400 text-xs sm:text-sm leading-relaxed break-all pr-36 block font-mono">
            {embedCode}
          </code>
          <button
            onClick={() => void copyMain()}
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              mainCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {mainCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
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

      {/* ── SEKCJA 2: Instrukcja według platformy ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-800">Instrukcja instalacji</span>
            <span className="text-xs text-slate-400 ml-1">— natywnie na WordPress lub kod na dowolnej stronie</span>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="border-b border-slate-100 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max px-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePlatform(p.id); setPlatformKey((k) => k + 1); }}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activePlatform === p.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded text-white font-bold flex-shrink-0 leading-none"
                  style={{
                    backgroundColor: p.color,
                    fontSize: p.abbr.length > 2 ? '9px' : '11px',
                  }}
                >
                  {p.abbr}
                </span>
                <span className="hidden sm:inline">{p.name}</span>
                <span className="sm:hidden">{p.abbr === '</>' ? 'HTML' : p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div
          key={platformKey}
          className="p-5 sm:p-6"
          style={{ animation: 'botiko-tab-in 0.22s ease both' }}
        >
          {activePlatform === 'wordpress' && selectedBot && (
            <PluginPairing botId={selectedBot} />
          )}

          {currentPlatform.warning && (
            <div className="mb-5 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-amber-800">{currentPlatform.warning}</p>
            </div>
          )}

          <ol className="space-y-6">
            {steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 mb-1">{step.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
                  {step.code && (
                    <CodeBlock code={step.code.snippet} language={step.code.lang} />
                  )}
                  {step.note && (
                    <div className="mt-3 flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
                      <svg
                        className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-blue-800 leading-relaxed">{step.note}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── SEKCJA 3: Weryfikacja ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Jak sprawdzić czy działa?</span>
        </div>
        <ol className="space-y-3">
          {[
            'Otwórz swoją stronę w nowej zakładce — nie w trybie podglądu edytora.',
            'W prawym dolnym rogu ekranu powinien pojawić się przycisk czatu.',
            'Kliknij przycisk i wyślij testową wiadomość (np. "Cześć").',
            'Bot powinien odpowiedzieć w ciągu kilku sekund.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── SEKCJA 4: JavaScript API ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">JavaScript API</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
            zaawansowane
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-2 mb-0 leading-relaxed">
          Możesz sterować widgetem programowo — przydatne gdy chcesz otworzyć czat po kliknięciu
          własnego przycisku CTA.
        </p>
        <CodeBlock
          code={`// Otwórz czat
BotikoWidget.open();

// Zamknij czat
BotikoWidget.close();

// Przełącz (otwiera jeśli zamknięty, zamyka jeśli otwarty)
BotikoWidget.toggle();

// Przykład: otwórz po kliknięciu własnego przycisku
document.getElementById('moj-przycisk-cta').addEventListener('click', function () {
  BotikoWidget.open();
});`}
          language="javascript"
        />
      </div>

      {/* ── SEKCJA 5: FAQ ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Najczęstsze pytania</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {FAQ.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/80 transition-colors"
              >
                <span className="text-sm font-medium text-slate-800 leading-snug">{item.q}</span>
                <ChevronDown
                className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-300"
                style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
              </button>
              <FaqAnswer open={openFaq === i} text={item.a} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
