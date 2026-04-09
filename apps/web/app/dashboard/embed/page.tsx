import { fetchWithAuth } from '../../../lib/api';
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
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Instalacja</h1>
      <p className="text-slate-500 text-sm mb-8">
        Dodaj asystentkę do swojej strony w kilku krokach
      </p>
      <EmbedCode bots={bots} />
    </div>
  );
}
