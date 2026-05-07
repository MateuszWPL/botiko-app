import { MessageSquare } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConversationsClient } from '../../../components/conversations/ConversationsClient';

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

export default async function ConversationsPage() {
  let conversations: Conversation[] = [];
  try {
    conversations = await fetchWithAuth<Conversation[]>('/api/v1/conversations?daysBack=7');
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Brak rozmów"
        description="Rozmowy pojawią się gdy klienci skontaktują się z botem"
      />
    );
  }

  return <ConversationsClient initialConversations={conversations} />;
}
