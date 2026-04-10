'use client';

import { useState, useTransition } from 'react';
import { createCheckoutAction, createPortalAction } from './actions';

interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {fetchError}
      </div>
    );
  }

  if (!status) return null;

  const planLabel = PLAN_LABELS[status.plan] ?? status.plan;
  const planLimit = PLAN_LIMITS[status.plan] ?? '—';

  return (
    <div className="space-y-6">
      {/* Status card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Aktywny plan
            </p>
            <p className="text-2xl font-bold text-slate-900">{planLabel}</p>
          </div>
          <StatusBadge isActive={status.isActive} hasSubscription={status.hasSubscription} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Limit rozmów</p>
            <p className="text-sm font-medium text-slate-700">{planLimit}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Status konta</p>
            <p className="text-sm font-medium text-slate-700">
              {status.isActive ? 'Aktywne' : 'Nieaktywne'}
            </p>
          </div>
        </div>
      </div>

      {/* Trial info */}
      {!status.hasSubscription && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-medium text-indigo-900 mb-1">14-dniowy okres próbny</p>
          <p className="text-xs text-indigo-700">
            Przetestuj Botiko za darmo. Karta kredytowa wymagana dopiero po zakończeniu trialu.
          </p>
        </div>
      )}

      {/* Expired warning */}
      {!status.isActive && status.hasSubscription && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900 mb-1">Subskrypcja wygasła</p>
          <p className="text-xs text-red-700">
            Bot nie odpowiada na wiadomości. Odnów subskrypcję, aby przywrócić działanie.
          </p>
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!status.hasSubscription ? (
          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isPending ? 'Przekierowywanie…' : 'Rozpocznij subskrypcję'}
          </button>
        ) : (
          <button
            onClick={handlePortal}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isPending ? 'Przekierowywanie…' : 'Zarządzaj subskrypcją'}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Płatności obsługiwane przez{' '}
        <span className="font-medium text-slate-500">Stripe</span>. Botiko nie przechowuje danych
        karty.
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
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        Trial
      </span>
    );
  }
  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
        Aktywna
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      Wygasła
    </span>
  );
}
