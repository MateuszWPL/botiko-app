'use client';

import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { Loader2, Zap, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { createCheckoutAction, createPortalAction } from './actions';

interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
  trialEndsAt: string | null;
  trialDaysTotal: number | null;
}

interface Props {
  status: BillingStatus | null;
  fetchError: string | null;
}

// MVP ma jeden plan (STARTER 99 zł/mies). Nieznany plan spada na fallback niżej.
const PLAN_LABELS: Record<string, string> = {
  STARTER: 'Starter',
};

const PLAN_LIMITS: Record<string, string> = {
  STARTER: '1 000 rozmów / mies.',
};

export default function BillingClient({ status, fetchError }: Props) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function safeStripeRedirect(url: string) {
    // Defense-in-depth: only redirect to Stripe domains
    const allowed = ['checkout.stripe.com', 'billing.stripe.com'];
    try {
      const { hostname } = new URL(url);
      if (allowed.includes(hostname)) {
        window.location.href = url;
      } else {
        setActionError('Nieoczekiwany adres przekierowania.');
      }
    } catch {
      setActionError('Nieprawidłowy adres przekierowania.');
    }
  }

  function handleCheckout() {
    setActionError(null);
    startTransition(async () => {
      const result = await createCheckoutAction();
      if (result.error) {
        setActionError(result.error);
      } else if (result.url) {
        safeStripeRedirect(result.url);
      }
    });
  }

  function handlePortal() {
    setActionError(null);
    startTransition(async () => {
      const result = await createPortalAction();
      if (result.error) {
        setActionError(result.error);
      } else if (result.url) {
        safeStripeRedirect(result.url);
      }
    });
  }

  if (fetchError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {fetchError}
      </div>
    );
  }

  if (!status) return null;

  const planLabel = PLAN_LABELS[status.plan] ?? status.plan;
  const planLimit = PLAN_LIMITS[status.plan] ?? '—';

  const isFullyActive = status.isActive && status.hasSubscription;

  // Derived: trial has expired (date passed) and user never subscribed.
  // Frontend computes this so UI is correct even before the daily cron runs.
  const trialExpired =
    !status.hasSubscription &&
    !!status.trialEndsAt &&
    new Date(status.trialEndsAt).getTime() <= Date.now();

  // Effective account state: backend `isActive` may still be true if the
  // trial-expiry cron hasn't fired yet. Treat as inactive in that case.
  const effectivelyActive = status.isActive && !trialExpired;

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div
        className={`rounded-2xl p-6 shadow-sm transition-all ${
          isFullyActive
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-200/50'
            : 'bg-white/80 backdrop-blur-sm border border-slate-200/60'
        }`}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                isFullyActive
                  ? 'bg-white/20 shadow-indigo-900/20'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'
              }`}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${isFullyActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                Aktywny plan
              </p>
              <p className={`text-xl font-bold ${isFullyActive ? 'text-white' : 'text-slate-900'}`}>
                {planLabel}
              </p>
            </div>
          </div>
          <StatusBadge
            isActive={status.isActive}
            hasSubscription={status.hasSubscription}
            trialExpired={trialExpired}
          />
        </div>

        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isFullyActive ? 'border-white/20' : 'border-slate-100'}`}>
          <div>
            <p className={`text-xs mb-0.5 ${isFullyActive ? 'text-indigo-200' : 'text-slate-400'}`}>Limit rozmów</p>
            <p className={`text-sm font-semibold ${isFullyActive ? 'text-white' : 'text-slate-700'}`}>{planLimit}</p>
          </div>
          <div>
            <p className={`text-xs mb-0.5 ${isFullyActive ? 'text-indigo-200' : 'text-slate-400'}`}>Status konta</p>
            <p className={`text-sm font-semibold ${isFullyActive ? 'text-white' : 'text-slate-700'}`}>
              {effectivelyActive ? 'Aktywne' : 'Nieaktywne'}
            </p>
          </div>
        </div>
      </div>

      {/* Trial info + countdown (active trial) */}
      {!status.hasSubscription && !trialExpired && (
        <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-900 mb-0.5">
                {status.trialDaysTotal
                  ? `${status.trialDaysTotal}-dniowy okres próbny`
                  : 'Okres próbny'}
              </p>
              <p className="text-xs text-indigo-700">
                Przetestuj Botiko za darmo. Karta kredytowa wymagana dopiero po zakończeniu trialu.
              </p>
            </div>
          </div>
          {status.trialEndsAt && (
            <TrialCountdown
              trialEndsAt={status.trialEndsAt}
              totalDays={status.trialDaysTotal ?? 14}
            />
          )}
        </div>
      )}

      {/* Trial expired, never subscribed */}
      {!status.hasSubscription && trialExpired && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200/60 bg-red-50 p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-0.5">Trial wygasł</p>
            <p className="text-xs text-red-700">
              Okres próbny się skończył
              {mounted && status.trialEndsAt &&
                ` ${new Date(status.trialEndsAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}`}
              . Bot nie odpowiada na wiadomości. Wykup subskrypcję, aby przywrócić działanie.
            </p>
          </div>
        </div>
      )}

      {/* Subscription expired (after paid period ended) */}
      {!status.isActive && status.hasSubscription && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200/60 bg-red-50 p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-0.5">Subskrypcja wygasła</p>
            <p className="text-xs text-red-700">
              Bot nie odpowiada na wiadomości. Odnów subskrypcję, aby przywrócić działanie.
            </p>
          </div>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {actionError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!status.hasSubscription ? (
          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0 cursor-pointer"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Przekierowywanie...' : 'Rozpocznij subskrypcję, 99 zł/mies.'}
          </button>
        ) : (
          <button
            onClick={handlePortal}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0 cursor-pointer"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Przekierowywanie...' : 'Zarządzaj subskrypcją'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="whitespace-nowrap">Płatności obsługiwane przez</span>
        <Image
          src="/stripe-ar21.svg"
          alt="Stripe"
          width={60}
          height={25}
          className="h-5 w-auto"
        />
        <span className="basis-full sm:basis-auto">Botiko nie przechowuje danych karty.</span>
      </div>

      <BillingFaq />
    </div>
  );
}

const BILLING_FAQ: { q: string; a: string }[] = [
  {
    q: 'Ile kosztuje Botiko i kiedy pobierana jest opłata?',
    a: 'Jeden plan, 99 zł miesięcznie. Pierwsza opłata pobierana jest z Twojej karty dopiero po zakończeniu 14-dniowego okresu próbnego, a potem automatycznie co miesiąc. Żadnych ukrytych kosztów ani rocznych umów.',
  },
  {
    q: 'Jak działa 14-dniowy okres próbny?',
    a: 'Przez 14 dni masz pełny dostęp do Botiko za darmo. Karta jest wymagana dopiero przy rozpoczęciu subskrypcji. Jeśli nie wykupisz planu, po zakończeniu trialu bot po prostu przestaje odpowiadać, nic nie zostaje pobrane.',
  },
  {
    q: 'Jak anulować subskrypcję?',
    a: 'W dowolnym momencie kliknij „Zarządzaj subskrypcją", przejdziesz do bezpiecznego panelu Stripe, gdzie jednym kliknięciem anulujesz plan. Bot działa do końca opłaconego okresu, bez żadnych zobowiązań na przyszłość.',
  },
  {
    q: 'Czy dostanę fakturę?',
    a: 'Tak. Faktury generowane są automatycznie przez Stripe i dostępne w panelu „Zarządzaj subskrypcją". Tam też ustawisz dane do faktury (nazwa firmy, NIP, adres).',
  },
  {
    q: 'Jak zmienić kartę płatniczą?',
    a: 'Wejdź w „Zarządzaj subskrypcją" → sekcja metod płatności w panelu Stripe. Możesz tam dodać nową kartę lub zmienić domyślną.',
  },
  {
    q: 'Czy płatność jest bezpieczna?',
    a: 'Tak. Wszystkie płatności obsługuje Stripe, światowy standard płatności online (certyfikat PCI DSS). Botiko nigdy nie widzi ani nie przechowuje danych Twojej karty.',
  },
  {
    q: 'Co się stanie, gdy subskrypcja wygaśnie?',
    a: 'Bot przestaje odpowiadać na wiadomości, ale Twoje konto, konfiguracja i baza wiedzy zostają nienaruszone. Po opłaceniu subskrypcji bot wraca do działania od razu.',
  },
];

function BillingFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-2">Najczęstsze pytania o płatności</h2>
      <div className="divide-y divide-slate-100">
        {BILLING_FAQ.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {item.q}
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <p className="pb-3 text-sm leading-relaxed text-slate-500">{item.a}</p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Masz inne pytanie o płatności? Napisz na{' '}
        <a href="mailto:kontakt@botiko.pl" className="text-indigo-600 hover:underline">
          kontakt@botiko.pl
        </a>
        .
      </p>
    </div>
  );
}

function TrialCountdown({
  trialEndsAt,
  totalDays,
}: {
  trialEndsAt: string;
  totalDays: number;
}) {
  const end = new Date(trialEndsAt);
  const msLeft = end.getTime() - Date.now();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  const elapsed = totalDays - daysLeft;
  const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
  const barColor =
    daysLeft <= 2 ? 'bg-red-400' : daysLeft <= 5 ? 'bg-amber-400' : 'bg-indigo-400';

  const [formattedEnd, setFormattedEnd] = useState('');
  useEffect(() => {
    setFormattedEnd(new Date(trialEndsAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }));
  }, [trialEndsAt]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-indigo-700">Postęp trialu</span>
        <span className={`text-xs font-bold ${daysLeft <= 2 ? 'text-red-600' : 'text-indigo-700'}`}>
          {daysLeft === 0 ? 'Ostatni dzień!' : `${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'} pozostało`}
        </span>
      </div>
      <div className="h-2 bg-indigo-200/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {formattedEnd && (
        <p className="text-xs text-indigo-600/70 mt-1">
          Trial kończy się {formattedEnd}
        </p>
      )}
    </div>
  );
}

function StatusBadge({
  isActive,
  hasSubscription,
  trialExpired,
}: {
  isActive: boolean;
  hasSubscription: boolean;
  trialExpired: boolean;
}) {
  if (!hasSubscription) {
    if (trialExpired) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
          Trial wygasł
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
        Trial
      </span>
    );
  }
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Aktywna
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
      Wygasła
    </span>
  );
}
