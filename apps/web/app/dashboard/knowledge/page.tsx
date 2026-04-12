import { BookOpen } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { KnowledgeManager } from './KnowledgeManager';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Bot {
  id: string;
  name: string;
}

interface Chunk {
  id: string;
  content: string;
  category: string | null;
  createdAt: string;
}

export default async function KnowledgePage() {
  let bots: Bot[] = [];
  try {
    bots = await fetchWithAuth<Bot[]>('/api/v1/bot');
  } catch {
    // handled below
  }

  const firstBot = bots[0];
  let chunks: Chunk[] = [];
  if (firstBot) {
    try {
      chunks = await fetchWithAuth<Chunk[]>(`/api/v1/knowledge/${firstBot.id}`);
    } catch {
      // handled below
    }
  }

  return (
    <div>
      <PageHeader
        title="Baza wiedzy"
        description="Informacje z których korzysta bot"
        badge={firstBot ? { label: `${chunks.length} wpisów` } : undefined}
      />

      {!firstBot ? (
        <EmptyState
          icon={BookOpen}
          title="Najpierw utwórz bota"
          description="Baza wiedzy jest powiązana z konkretnym botem"
          action={{ label: 'Utwórz bota', href: '/onboarding/step-1' }}
        />
      ) : (
        <KnowledgeManager botId={firstBot.id} initialChunks={chunks} />
      )}
    </div>
  );
}
