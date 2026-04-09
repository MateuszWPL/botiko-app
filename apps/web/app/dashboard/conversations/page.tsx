import Link from 'next/link';
import { fetchWithAuth } from '../../../lib/api';

interface Conversation {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  createdAt: string;
}

export default async function ConversationsPage() {
  let conversations: Conversation[] = [];
  try {
    conversations = await fetchWithAuth<Conversation[]>('/api/v1/conversations');
  } catch {
    // handled below
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rozmowy</h1>
          <p className="text-slate-500 text-sm mt-0.5">Historia konwersacji z klientami</p>
        </div>
        <span className="bg-sky-100 text-sky-700 text-sm font-medium px-3 py-1 rounded-full">
          {conversations.length} rozmów
        </span>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-slate-600 font-medium">Brak rozmów</p>
          <p className="text-slate-400 text-sm mt-1">
            Rozmowy pojawią się gdy klienci skontaktują się z asystentką
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversations/${conv.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Sesja: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{conv.sessionId.slice(0, 16)}…</code>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bot: {conv.botId.slice(0, 8)}… · {conv.messageCount} wiadomości
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {new Date(conv.createdAt).toLocaleDateString('pl-PL')}
                </p>
                <span className="text-indigo-500 text-xs">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
