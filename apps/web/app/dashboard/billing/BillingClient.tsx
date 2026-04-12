'use client';

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
  STARTER: '300 rozmów / mies.',
  PRO: '2 000 rozmów / mies.',
  PREMIUM: 'Bez limitu',
};

export default function BillingClient({ status, fetchError }: Props) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setActionError(null);
    startTransition(async () => {
      const result = await createCheckoutAction();
      if (result.error) {
        setActionError(result.error);
      } else if (result.url) {
        window.location.href = result.url;
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
        window.location.href = result.url;
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
          <StatusBadge isActive={status.isActive} hasSubscription={status.hasSubscription} />
        </div>

        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isFullyActive ? 'border-white/20' : 'border-slate-100'}`}>
          <div>
            <p className={`text-xs mb-0.5 ${isFullyActive ? 'text-indigo-200' : 'text-slate-400'}`}>Limit rozmów</p>
            <p className={`text-sm font-semibold ${isFullyActive ? 'text-white' : 'text-slate-700'}`}>{planLimit}</p>
          </div>
          <div>
            <p className={`text-xs mb-0.5 ${isFullyActive ? 'text-indigo-200' : 'text-slate-400'}`}>Status konta</p>
            <p className={`text-sm font-semibold ${isFullyActive ? 'text-white' : 'text-slate-700'}`}>
              {status.isActive ? 'Aktywne' : 'Nieaktywne'}
            </p>
          </div>
        </div>
      </div>

      {/* Trial info + countdown */}
      {!status.hasSubscription && (
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

      {/* Expired warning */}
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Przekierowywanie…' : 'Rozpocznij subskrypcję — 149 zł/mies.'}
          </button>
        ) : (
          <button
            onClick={handlePortal}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Przekierowywanie…' : 'Zarządzaj subskrypcją'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Płatności obsługiwane przez</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600 tracking-tight text-xs">
          <svg viewBox="0 0 60 25" className="h-3.5" aria-label="Stripe" fill="currentColor">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.23c0-1.85-1.07-2.58-2.06-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.44.94V6.27h3.94l.14 1.07c.57-.88 1.68-1.44 3.23-1.44 2.96 0 5.59 2.56 5.59 7.16 0 5.09-2.59 7.24-5.54 7.24zM40 9.95c-.95 0-1.54.34-1.97.81l.03 6.12c.4.44.98.78 1.94.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.07c1.44 0 2.3-.95 2.3-2.15C30.54.8 29.68 0 28.24 0c-1.43 0-2.3.8-2.3 2.13 0 1.18.87 1.94 2.3 1.94zm2.22 15.13h-4.44V6.27h4.44v13.93zM17.81 20.2c-4.75 0-7.23-3.14-7.23-7.28 0-4.53 2.62-7.66 7.5-7.66 1.96 0 3.51.58 4.3 1.02l-1.35 3.3c-.7-.33-1.58-.68-2.84-.68-1.92 0-3.18 1.31-3.18 3.85 0 2.45 1.27 3.87 3.18 3.87 1.26 0 2.19-.28 2.98-.68l1.35 3.3c-.8.44-2.42 1.03-4.71 1.03zm-14.05-.4L0 6.27h4.7l2.45 8.04 2.42-8.04h4.69l-3.82 13.53h-2.68z" />
          </svg>
        </span>
        <span>— Botiko nie przechowuje danych karty.</span>
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
}: {
  isActive: boolean;
  hasSubscription: boolean;
}) {
  if (!hasSubscription) {
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
