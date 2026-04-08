import { fetchWithAuth } from '../../../lib/api';

interface Lead {
  id: string;
  status: string;
}

interface Conversation {
  id: string;
  messageCount: number;
}

interface Bot {
  id: string;
  name: string;
  isActive: boolean;
}

async function getStats() {
  try {
    const [leads, conversations, bots] = await Promise.all([
      fetchWithAuth<Lead[]>('/api/v1/leads'),
      fetchWithAuth<Conversation[]>('/api/v1/conversations'),
      fetchWithAuth<Bot[]>('/api/v1/bot'),
    ]);
    return { leads, conversations, bots };
  } catch {
    return { leads: [], conversations: [], bots: [] };
  }
}

export default async function OverviewPage() {
  const { leads, conversations, bots } = await getStats();

  const newLeads = leads.filter((l) => l.status === 'NEW').length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
  const activeBots = bots.filter((b) => b.isActive).length;

  const stats = [
    { label: 'Aktywne boty', value: activeBots, icon: '🤖', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Nowe leady', value: newLeads, icon: '👥', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Rozmowy', value: conversations.length, icon: '💬', color: 'bg-sky-50 text-sky-700' },
    { label: 'Wiadomości', value: totalMessages, icon: '📨', color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Przegląd</h1>
      <p className="text-slate-500 text-sm mb-8">Statystyki Twojej asystentki</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {bots.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
          <p className="text-indigo-800 font-medium mb-2">Nie masz jeszcze asystentki</p>
          <a
            href="/onboarding/step-1"
            className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            Utwórz asystentkę →
          </a>
        </div>
      )}
    </div>
  );
}
