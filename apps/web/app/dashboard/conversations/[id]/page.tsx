import Link from 'next/link';
import { ArrowLeft, Bot, User } from 'lucide-react';
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
      <div className="text-center py-16">
        <p className="text-slate-500 mb-3">Nie znaleziono rozmowy</p>
        <Link
          href="/dashboard/conversations"
          className="inline-flex items-center gap-1.5 text-indigo-600 text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do listy
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/conversations"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Rozmowy
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-600 font-medium font-mono">
          {conversation.sessionId.slice(0, 20)}…
        </span>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 max-w-2xl shadow-sm">
        <div className="space-y-4">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  msg.role === 'USER'
                    ? 'bg-indigo-100'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}
              >
                {msg.role === 'USER' ? (
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div
                className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === 'USER'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    msg.role === 'USER' ? 'text-indigo-200 text-right' : 'text-slate-400'
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
