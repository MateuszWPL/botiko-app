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
} from 'lucide-react';
import { toast } from 'sonner';
import { EmptyStateClient } from '../../../components/ui/EmptyStateClient';

interface Bot {
  id: string;
  name: string;
}

const WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://widget.botiko.pl');

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
  | 'webflow'
  | 'shopify'
  | 'squarespace'
  | 'wix'
  | 'gtm'
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
    id: 'webflow',
    name: 'Webflow',
    abbr: 'WF',
    color: '#146EF5',
    steps: (code) => [
      {
        title: 'Otwórz ustawienia projektu',
        body: 'W Webflow Designer kliknij ikonę koła zębatego (Project Settings) w lewym górnym rogu, lub otwórz panel projektów i wybierz Settings przy swoim projekcie.',
      },
      {
        title: 'Przejdź do Custom Code',
        body: 'W ustawieniach projektu wybierz zakładkę "Custom Code". Znajdź sekcję "Footer Code" na dole strony.',
      },
      {
        title: 'Wklej kod i opublikuj',
        body: 'Wklej kod w polu "Footer Code" i kliknij Save. Następnie wróć do projektanta i opublikuj stronę przyciskiem Publish.',
        code: { snippet: code, lang: 'html' },
        note: 'Kod nie jest widoczny w Webflow Editor podczas edycji — to normalne zachowanie. Widget działa wyłącznie na opublikowanej, publicznej stronie.',
      },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    abbr: 'SH',
    color: '#96BF48',
    steps: (code) => [
      {
        title: 'Przejdź do edytora motywu',
        body: 'W panelu Shopify przejdź do Online Store → Themes. Przy aktywnym motywie kliknij przycisk z trzema kropkami (Actions) → Edit Code.',
      },
      {
        title: 'Otwórz plik theme.liquid',
        body: 'W drzewie plików po lewej stronie znajdź sekcję Layout i kliknij plik theme.liquid aby go otworzyć w edytorze.',
      },
      {
        title: 'Wklej kod przed </body>',
        body: 'Użyj Ctrl+F aby znaleźć tag </body>. Wklej kod bezpośrednio przed nim. Kliknij Save w prawym górnym rogu.',
        code: { snippet: code, lang: 'html' },
      },
    ],
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    abbr: 'SS',
    color: '#000000',
    steps: (code) => [
      {
        title: 'Otwórz ustawienia strony',
        body: 'W panelu Squarespace kliknij Settings (Ustawienia) w lewym menu nawigacyjnym.',
      },
      {
        title: 'Przejdź do Code Injection',
        body: 'Przewiń menu ustawień i kliknij Advanced → Code Injection. Jeśli nie widzisz tej opcji, sprawdź czy Twój plan obejmuje tę funkcję.',
        note: 'Code Injection jest dostępne wyłącznie w planach Business i Commerce. Plany Personal i Basic nie obsługują tej funkcji.',
      },
      {
        title: 'Wklej kod w sekcji Footer',
        body: 'W polu "Footer" wklej kod widgetu i kliknij Save w prawym górnym rogu. Zmiany są widoczne natychmiastowo na stronie.',
        code: { snippet: code, lang: 'html' },
      },
    ],
  },
  {
    id: 'wix',
    name: 'Wix',
    abbr: 'WX',
    color: '#FAAD00',
    warning:
      'Wix ogranicza bezpośrednie osadzanie skryptów przez sandbox iframe. Zalecamy instalację przez Google Tag Manager — opis znajdziesz w zakładce obok.',
    steps: (code) => [
      {
        title: 'Zainstaluj Google Tag Manager na Wix',
        body: 'W panelu Wix przejdź do Marketing & SEO → Marketing Integrations i znajdź Google Tag Manager. Wprowadź ID kontenera GTM i zapisz.',
      },
      {
        title: 'Dodaj widget przez GTM',
        body: 'Po podłączeniu GTM do Wix postępuj zgodnie z instrukcją z zakładki "Google Tag Manager". Wklej poniższy kod jako Custom HTML tag z triggerem All Pages.',
        code: { snippet: code, lang: 'html' },
        note: 'Bezpośredni Wix HTML Embed Widget (dodawany jako element na stronie) działa w sandboxowanym iframe i może uniemożliwić prawidłowe załadowanie widgetu Botiko.',
      },
    ],
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    abbr: 'GTM',
    color: '#4285F4',
    steps: (code) => [
      {
        title: 'Utwórz nowy Tag',
        body: 'W kontenerze GTM kliknij Tags → New. Nadaj tagowi nazwę np. "Botiko Widget". Kliknij Tag Configuration i wybierz typ "Custom HTML".',
      },
      {
        title: 'Wklej kod widgetu',
        body: 'W polu HTML wklej poniższy kod.',
        code: { snippet: code, lang: 'html' },
      },
      {
        title: 'Ustaw wyzwalacz',
        body: 'Kliknij w sekcję Triggering (ikona pioruna) i wybierz "All Pages". Jeśli chcesz bot tylko na wybranych stronach — utwórz własny trigger z filtrem na URL.',
      },
      {
        title: 'Zapisz i opublikuj kontener',
        body: 'Kliknij Save, a następnie Submit → Publish w prawym górnym rogu. Wpisz opis wersji np. "Dodano Botiko Widget". Zmiany będą aktywne w ciągu kilku sekund.',
      },
    ],
  },
  {
    id: 'html',
    name: 'Własny HTML',
    abbr: '</>',
    color: '#E34F26',
    steps: (code) => [
      {
        title: 'Otwórz szablon HTML strony',
        body: 'Znajdź główny plik HTML lub szablon używany na wszystkich podstronach (np. layout.html, base.html, _layout.html w zależności od frameworka).',
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
    a: 'Użyj Google Tag Manager z niestandardowym wyzwalaczem. W GTM możesz ustawić trigger z filtrem "Page URL contains /kontakt" lub "Page Path equals /". Bez GTM bot pojawi się na wszystkich stronach gdzie wklejony jest skrypt.',
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

// ── Main component ─────────────────────────────────────────────────────────

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

  return (
    <div className="space-y-6 max-w-4xl">
      <style>{`
        @keyframes botiko-tab-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
            <span className="text-xs text-slate-400 ml-1">— wybierz swoją platformę</span>
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
