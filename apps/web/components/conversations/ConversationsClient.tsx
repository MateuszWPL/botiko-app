'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBar } from './SearchBar';
import { Filters } from './Filters';
import { ConversationsTable } from './ConversationsTable';

type ConversationStatus = 'Aktywna' | 'Lead' | 'Zakończona';

interface Conversation {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  firstMessage: string | null;
  lastMessage: string | null;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  status: ConversationStatus;
  leadName: string | null;
}

interface ConversationsClientProps {
  initialConversations: Conversation[];
}

export function ConversationsClient({ initialConversations }: ConversationsClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [daysBack, setDaysBack] = useState(7);
  const [status, setStatus] = useState<ConversationStatus | 'Wszystkie'>('Wszystkie');
  const isInitialMount = useRef(true);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status !== 'Wszystkie') params.append('status', status);
      params.append('daysBack', daysBack.toString());

      const res = await fetch(`/api/conversations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {
      // silent fail – keep current data
    } finally {
      setLoading(false);
    }
  }, [search, status, daysBack]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => loadConversations(), 300);
    return () => clearTimeout(timer);
  }, [loadConversations]);

  const handleExport = () => {
    // Polish Excel expects ';' as the field separator; commas land everything
    // in one column. The UTF-8 BOM keeps ł/ą/ę intact when Excel opens the file.
    const csv = [
      ['Sesja', 'Klient', 'Wiadomości', 'Czas (sek)', 'Data', 'Status'],
      ...conversations.map((c) => [
        c.sessionId,
        c.leadName ?? 'Anonimowy',
        String(c.messageCount),
        String(c.durationSeconds),
        new Date(c.createdAt).toLocaleDateString('pl-PL'),
        c.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rozmowy-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar — relative z-10 so dropdowns appear above the table below */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-3 md:p-4 space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <Filters
          daysBack={daysBack}
          onDaysBackChange={setDaysBack}
          status={status}
          onStatusChange={setStatus}
          onExport={handleExport}
          totalCount={conversations.length}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Ładowanie...</div>
      ) : (
        <ConversationsTable conversations={conversations} />
      )}
    </div>
  );
}
