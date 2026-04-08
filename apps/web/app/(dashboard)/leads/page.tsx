import { fetchWithAuth } from '../../../lib/api';
import { LeadsTable } from './LeadsTable';

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leady</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Kontakty zebrane przez asystentkę
          </p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
          {leads.length} kontaktów
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-slate-600 font-medium">Brak leadów</p>
          <p className="text-slate-400 text-sm mt-1">
            Leady pojawią się gdy klienci zostawią kontakt przez asystentkę
          </p>
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
