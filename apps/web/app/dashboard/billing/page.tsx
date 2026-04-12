import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
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
      <PageHeader title="Płatności" description="Zarządzaj subskrypcją Botiko" />
      <BillingClient status={status} fetchError={fetchError} />
    </div>
  );
}
