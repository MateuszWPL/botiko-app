import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

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
      <PageHeader
        title="Rozmowy"
        description="Historia konwersacji z klientami"
        badge={{ label: `${conversations.length} rozmów`, color: 'bg-sky-100 text-sky-700' }}
      />

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Brak rozmów"
          description="Rozmowy pojawią się gdy klienci skontaktują się z botem"
        />
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm divide-y divide-slate-100/80">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversations/${conv.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-sky-200">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Sesja{' '}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
                      {conv.sessionId.slice(0, 16)}…
                    </code>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {conv.messageCount} wiadomości ·{' '}
                    {new Date(conv.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
