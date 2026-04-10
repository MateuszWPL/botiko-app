import { fetchWithAuth } from '../../../lib/api';
import BillingClient from './BillingClient';

interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
}

export default async function BillingPage() {
  let status: BillingStatus | null = null;
  let fetchError: string | null = null;

  try {
    status = await fetchWithAuth<BillingStatus>('/api/v1/billing/status');
  } catch {
    fetchError = 'Nie udało się pobrać statusu płatności.';
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Płatności</h1>
      <p className="text-slate-500 mb-8 text-sm">Zarządzaj subskrypcją Botiko</p>
      <BillingClient status={status} fetchError={fetchError} />
    </div>
  );
}
