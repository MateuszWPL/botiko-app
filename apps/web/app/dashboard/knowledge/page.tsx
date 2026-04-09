import { fetchWithAuth } from '../../../lib/api';
import { KnowledgeManager } from './KnowledgeManager';

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Baza wiedzy</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Informacje z których korzysta asystentka
          </p>
        </div>
      </div>

      {!firstBot ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Najpierw utwórz asystentkę</p>
        </div>
      ) : (
        <KnowledgeManager botId={firstBot.id} initialChunks={chunks} />
      )}
    </div>
  );
}
