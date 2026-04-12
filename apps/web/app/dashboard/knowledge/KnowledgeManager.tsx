'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Chunk {
  id: string;
  content: string;
  category: string | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function KnowledgeManager({
  botId,
  initialChunks,
}: {
  botId: string;
  initialChunks: Chunk[];
}) {
  const [chunks, setChunks] = useState(initialChunks);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const getToken = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? '';
  };

  const addChunk = async () => {
    if (!newContent.trim() || adding) return;
    setAdding(true);

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/knowledge/${botId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent.trim(),
          category: newCategory.trim() || undefined,
        }),
      });

      if (res.ok) {
        const { id } = (await res.json()) as { id: string };
        setChunks((prev) => [
          {
            id,
            content: newContent.trim(),
            category: newCategory.trim() || null,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setNewContent('');
        setNewCategory('');
        toast.success('Wpis dodany do bazy wiedzy');
      } else {
        toast.error('Nie udało się dodać wpisu');
      }
    } catch {
      toast.error('Błąd połączenia');
    } finally {
      setAdding(false);
    }
  };

  const deleteChunk = async (chunkId: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten wpis z bazy wiedzy?')) return;
    setDeleting(chunkId);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/knowledge/${chunkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setChunks((prev) => prev.filter((c) => c.id !== chunkId));
        toast.success('Wpis usunięty');
      } else {
        toast.error('Nie udało się usunąć wpisu');
      }
    } catch {
      toast.error('Błąd połączenia');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add chunk form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Dodaj informację</h2>
        <div className="space-y-3">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            placeholder="np. Manicure klasyczny — 60 zł, czas 45 minut. Dostępny codziennie 9-18."
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 resize-none transition-shadow bg-white/60"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Kategoria (opcjonalnie)"
              className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60"
            />
            <button
              onClick={() => void addChunk()}
              disabled={adding || !newContent.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {adding ? 'Dodaję...' : 'Dodaj'}
            </button>
          </div>
        </div>
      </div>

      {/* Chunks list */}
      {chunks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Baza wiedzy jest pusta"
          description="Dodaj informacje o swoich usługach, cenach i godzinach otwarcia"
        />
      ) : (
        <div className="space-y-3">
          {chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                {chunk.category && (
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                    {chunk.category}
                  </span>
                )}
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {chunk.content}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(chunk.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <button
                onClick={() => void deleteChunk(chunk.id)}
                disabled={deleting === chunk.id}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 self-start"
                title="Usuń"
              >
                {deleting === chunk.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
