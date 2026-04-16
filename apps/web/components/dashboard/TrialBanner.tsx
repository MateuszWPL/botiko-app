import Link from 'next/link';
import { AlertTriangle, XCircle, Zap } from 'lucide-react';
import { fetchWithAuth } from '../../lib/api';

interface BillingStatus {
  isActive: boolean;
  hasSubscription: boolean;
  trialEndsAt: string | null;
}

function getDaysLeft(trialEndsAt: string): number {
  const msLeft = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

export async function TrialBanner() {
  let status: BillingStatus | null = null;
  try {
    status = await fetchWithAuth<BillingStatus>('/api/v1/billing/status');
  } catch {
    return null;
  }

  if (!status) return null;
  // Active paid subscription — no banner
  if (status.hasSubscription && status.isActive) return null;
  // Trial not tracked (edge case)
  if (!status.trialEndsAt && status.hasSubscription) return null;

  const daysLeft = status.trialEndsAt ? getDaysLeft(status.trialEndsAt) : 0;
  const trialStillActive = status.trialEndsAt ? daysLeft > 0 : false;
  const isExpired = !status.isActive && !status.hasSubscription && !trialStillActive;

  // No banner during healthy trial (> 5 days left)
  if (!isExpired && daysLeft > 5) return null;

  // Expired — critical red banner
  if (isExpired) {
    return (
      <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            Trial wygasł — bot nie odpowiada na wiadomości klientów.
          </span>
        </div>
        <Link
          href="/dashboard/billing"
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Aktywuj plan
        </Link>
      </div>
    );
  }

  // Last day — orange urgent
  if (daysLeft <= 1) {
    return (
      <div className="bg-orange-500 text-white px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            {daysLeft === 0 ? 'Ostatni dzień trialu!' : 'Jutro kończy się Twój trial.'}{' '}
            Aktywuj plan żeby bot działał nieprzerwanie.
          </span>
        </div>
        <Link
          href="/dashboard/billing"
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Aktywuj teraz
        </Link>
      </div>
    );
  }

  // 2–5 days — amber warning
  return (
    <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">
          Zostało Ci <strong>{daysLeft} dni</strong> trialu.{' '}
          Po jego zakończeniu bot przestanie odpowiadać.
        </span>
      </div>
      <Link
        href="/dashboard/billing"
        className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-amber-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
      >
        <Zap className="w-3.5 h-3.5" />
        Aktywuj subskrypcję
      </Link>
    </div>
  );
}
