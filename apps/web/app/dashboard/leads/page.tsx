import { Users } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { LeadsTable } from './LeadsTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  createdAt: string;
}

export default async function LeadsPage() {
  let leads: Lead[] = [];
  try {
    leads = await fetchWithAuth<Lead[]>('/api/v1/leads');
  } catch {
    // handled below
  }

  return (
    <div>
      <PageHeader
        title="Leady"
        description="Kontakty zebrane przez bota"
        badge={{ label: `${leads.length} kontaktów` }}
      />

      {leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Brak leadów"
          description="Leady pojawią się gdy klienci zostawią kontakt przez bota"
        />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
