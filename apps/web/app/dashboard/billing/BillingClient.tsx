'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Loader2, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createCheckoutAction, createPortalAction } from './actions';

interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
  trialEndsAt: string | null;
}

interface Props {
  status: BillingStatus | null;
  fetchError: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  PREMIUM: 'Premium',
};

const PLAN_LIMITS: Record<string, string> = {
  STARTER: '1 000 rozmów / mies.',
  PRO: '2 000 rozmów / mies.',
  PREMIUM: 'Bez limitu',
};

export default function BillingClient({ status, fetchError }: Props) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
              <p className="text-sm font-semibold text-indigo-900 mb-0.5">14-dniowy okres próbny</p>
              <p className="text-xs text-indigo-700">
                Przetestuj Botiko za darmo. Karta kredytowa wymagana dopiero po zakończeniu trialu.
              </p>
            </div>
          </div>
          {status.trialEndsAt && <TrialCountdown trialEndsAt={status.trialEndsAt} />}
        </div>
      )}

      {/* Trial expired — never subscribed */}
      {!status.hasSubscription && trialExpired && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200/60 bg-red-50 p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-0.5">Trial wygasł</p>
            <p className="text-xs text-red-700">
              14-dniowy okres próbny się skończył
              {status.trialEndsAt &&
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
            {isPending ? 'Przekierowywanie…' : 'Rozpocznij subskrypcję — 99 zł/mies.'}
          </button>
        ) : (
          <button
            onClick={handlePortal}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0 cursor-pointer"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Przekierowywanie…' : 'Zarządzaj subskrypcją'}
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
        <span className="basis-full sm:basis-auto">— Botiko nie przechowuje danych karty.</span>
      </div>
    </div>
  );
}

function TrialCountdown({ trialEndsAt }: { trialEndsAt: string }) {
  const TOTAL_DAYS = 14;
  const end = new Date(trialEndsAt);
  const now = new Date();
  const msLeft = end.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  const elapsed = TOTAL_DAYS - daysLeft;
  const progress = Math.min(100, Math.max(0, (elapsed / TOTAL_DAYS) * 100));

  const barColor =
    daysLeft <= 2 ? 'bg-red-400' : daysLeft <= 5 ? 'bg-amber-400' : 'bg-indigo-400';

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
      <p className="text-xs text-indigo-600/70 mt-1">
        Trial kończy się {end.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
      </p>
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
