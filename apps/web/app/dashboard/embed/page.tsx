export const dynamic = 'force-dynamic';

import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmbedCode, type Bot } from './EmbedCode';

export default async function EmbedPage() {
  let bots: Bot[] = [];
  try {
    bots = await fetchWithAuth<Bot[]>('/api/v1/bot');
  } catch {
    // handled below
  }

  return (
    <div>
      <PageHeader
        title="Instalacja"
        description="Dodaj bota do swojej strony w kilku krokach"
      />
      <EmbedCode bots={bots} />
    </div>
  );
}
