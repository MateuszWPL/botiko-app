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

interface ConversationSummary {
  id: string;
  sessionId: string;
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let conversation: ConversationDetail | null = null;
  let conversationNumber: number | null = null;

  try {
    [conversation] = await Promise.all([
      fetchWithAuth<ConversationDetail>(`/api/v1/conversations/${id}`),
    ]);

    // Fetch list to determine conversation number (newest = highest number)
    const all = await fetchWithAuth<ConversationSummary[]>('/api/v1/conversations');
    const idx = all.findIndex((c) => c.id === id);
    if (idx !== -1) conversationNumber = all.length - idx;
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

  const label = conversationNumber !== null ? `Rozmowa #${conversationNumber}` : 'Rozmowa';
  const date = new Date(conversation.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/conversations"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Rozmowy
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      </div>

      {/* Header karty */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden max-w-2xl">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xs font-bold">
                {conversationNumber !== null ? `#${conversationNumber}` : '#'}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800">{label}</span>
          </div>
          <span className="text-xs text-slate-400">{date}</span>
        </div>

        {/* Wiadomości */}
        <div className="p-5 space-y-4">
          {conversation.messages.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">Brak wiadomości</p>
          ) : (
            conversation.messages.map((msg) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
