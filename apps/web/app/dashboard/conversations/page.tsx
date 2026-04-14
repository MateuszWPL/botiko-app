import Link from 'next/link';
import { ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Conversation {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  firstMessage: string | null;
  createdAt: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'przed chwilą';
  if (mins < 60) return `${mins} min temu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} godz. temu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'wczoraj';
  if (days < 7) return `${days} dni temu`;
  return new Date(dateStr).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

function messageLabel(count: number): string {
  if (count === 1) return '1 wiadomość';
  if (count < 5) return `${count} wiadomości`;
  return `${count} wiadomości`;
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
          {conversations.map((conv, index) => {
            const num = conversations.length - index;
            const preview = conv.firstMessage
              ? conv.firstMessage.length > 80
                ? conv.firstMessage.slice(0, 80) + '…'
                : conv.firstMessage
              : null;

            return (
              <Link
                key={conv.id}
                href={`/dashboard/conversations/${conv.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group"
              >
                {/* Numer rozmowy */}
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-xs font-bold">#{num}</span>
                </div>

                {/* Treść */}
                <div className="flex-1 min-w-0">
                  {preview ? (
                    <>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {preview}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500">
                          {relativeTime(conv.createdAt)}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          {messageLabel(conv.messageCount)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-600 italic">
                        Brak wiadomości tekstowych
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500">
                          {relativeTime(conv.createdAt)}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          {messageLabel(conv.messageCount)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
