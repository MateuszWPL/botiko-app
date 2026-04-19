'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

type ConversationStatus = 'Aktywna' | 'Lead' | 'Zakończona';

interface Conversation {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  firstMessage: string | null;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  status: ConversationStatus;
  leadName: string | null;
}

interface ConversationsTableProps {
  conversations: Conversation[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return '0m';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-fuchsia-500',
];

function avatarColor(sessionId: string): string {
  const sum = sessionId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function formatClientName(leadName: string | null): string {
  if (leadName) return leadName;
  return 'Gość';
}

export function ConversationsTable({ conversations }: ConversationsTableProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Brak rozmów spełniających kryteria wyszukiwania</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100/80 bg-slate-50/50">
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Sesja
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Klient
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Pierwsza wiadomość
            </th>
            <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Wiadomości
            </th>
            <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Czas trwania
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Data
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Status
            </th>
            <th className="w-8" />
          </tr>
        </thead>
        <ConversationRows conversations={conversations} />
      </table>
    </div>
  );
}

function ConversationRows({ conversations }: { conversations: Conversation[] }) {
  const router = useRouter();

  return (
    <tbody className="divide-y divide-slate-100/80">
      {conversations.map((conv) => {
        const preview =
          conv.firstMessage && conv.firstMessage.length > 60
            ? conv.firstMessage.slice(0, 60) + '…'
            : conv.firstMessage || '—';
        const clientName = formatClientName(conv.leadName);
        const initials =
          clientName === 'Gość'
            ? 'G'
            : clientName
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')
                .toUpperCase();

        return (
          <tr
            key={conv.id}
            onClick={() => router.push(`/dashboard/conversations/${conv.id}`)}
            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
          >
            {/* Session ID */}
            <td className="px-6 py-4">
              <code className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                {conv.sessionId.slice(0, 8)}
              </code>
            </td>

            {/* Client */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${avatarColor(conv.sessionId)} text-white text-xs font-semibold flex items-center justify-center flex-shrink-0`}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium text-slate-900">{clientName}</span>
              </div>
            </td>

            {/* First message */}
            <td className="px-6 py-4">
              <p className="text-sm text-slate-600 truncate max-w-xs">{preview}</p>
            </td>

            {/* Message count */}
            <td className="px-6 py-4 text-center">
              <span className="text-sm font-medium text-slate-700">{conv.messageCount}</span>
            </td>

            {/* Duration */}
            <td className="px-6 py-4 text-center">
              <span className="text-sm text-slate-600">{formatDuration(conv.durationSeconds)}</span>
            </td>

            {/* Date */}
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-slate-600">{formatDate(conv.createdAt)}</span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <StatusBadge status={conv.status} />
            </td>

            {/* Arrow */}
            <td className="px-4 py-4">
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
