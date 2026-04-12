import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmbedCode } from './EmbedCode';

interface Bot {
  id: string;
  name: string;
}

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
