export const dynamic = 'force-dynamic';

import { fetchWithAuth } from '../../../lib/api';
import { LeadsTable } from './LeadsTable';
import { PageHeader } from '../../../components/ui/PageHeader';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  sessionId: string | null;
  createdAt: string;
}

export default async function LeadsPage() {
  let leads: Lead[] = [];
  try {
    leads = await fetchWithAuth<Lead[]>('/api/v1/leads');
  } catch {
    // handled by empty state in LeadsTable
  }

  return (
    <div>
      <PageHeader
        title="Kontakty"
        description="Numery telefonu, które klienci zostawili w czacie — oddzwoń, żeby domknąć."
        badge={{ label: `${leads.length} kontaktów` }}
      />
      <LeadsTable leads={leads} />
    </div>
  );
}
