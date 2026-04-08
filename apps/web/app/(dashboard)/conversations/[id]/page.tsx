import Link from 'next/link';
import { fetchWithAuth } from '../../../../lib/api';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ConversationDetail {
  id: string;
  botId: string;
  sessionId: string;
  createdAt: string;
  messages: Message[];
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let conversation: ConversationDetail | null = null;

  try {
    conversation = await fetchWithAuth<ConversationDetail>(`/api/v1/conversations/${id}`);
  } catch {
    // handled below
  }

  if (!conversation) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Nie znaleziono rozmowy</p>
        <Link href="/dashboard/conversations" className="text-indigo-600 text-sm mt-2 inline-block">
          ← Wróć do listy
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/conversations"
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          ← Rozmowy
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600 font-medium">
          {conversation.sessionId.slice(0, 20)}…
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
        <div className="space-y-4">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === 'USER'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === 'USER' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
