export const dynamic = 'force-dynamic';

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
  source: string | null;
  createdAt: string;
}

interface Tenant {
  websiteUrl: string | null;
}

export default async function KnowledgePage() {
  const [botsResult, tenantResult] = await Promise.allSettled([
    fetchWithAuth<Bot[]>('/api/v1/bot'),
    fetchWithAuth<Tenant>('/api/v1/tenant/me'),
  ]);

  const bots = botsResult.status === 'fulfilled' ? botsResult.value : [];
  const tenant = tenantResult.status === 'fulfilled' ? tenantResult.value : null;

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
          action={{ label: 'Utwórz bota', openWizard: true }}
        />
      ) : (
        <KnowledgeManager
          botId={firstBot.id}
          initialChunks={chunks}
          tenantWebsiteUrl={tenant?.websiteUrl}
        />
      )}
    </div>
  );
}
