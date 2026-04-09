'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase';

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
    const { data: { session } } = await supabase.auth.getSession();
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
      }
    } finally {
      setAdding(false);
    }
  };

  const deleteChunk = async (chunkId: string) => {
    setDeleting(chunkId);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/v1/knowledge/${chunkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setChunks((prev) => prev.filter((c) => c.id !== chunkId));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add chunk form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Dodaj informację
        </h2>
        <div className="space-y-3">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            placeholder="np. Manicure klasyczny — 60 zł, czas 45 minut. Dostępny codziennie 9-18."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Kategoria (opcjonalnie)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => void addChunk()}
              disabled={adding || !newContent.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {adding ? 'Dodaję...' : '+ Dodaj'}
            </button>
          </div>
        </div>
      </div>

      {/* Chunks list */}
      <div className="space-y-2">
        {chunks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-400 text-sm">Brak wpisów w bazie wiedzy</p>
          </div>
        ) : (
          chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4"
            >
              <div className="flex-1">
                {chunk.category && (
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full mb-2">
                    {chunk.category}
                  </span>
                )}
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{chunk.content}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(chunk.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <button
                onClick={() => void deleteChunk(chunk.id)}
                disabled={deleting === chunk.id}
                className="text-slate-400 hover:text-red-500 transition-colors text-sm px-2 self-start"
                title="Usuń"
              >
                {deleting === chunk.id ? '...' : '✕'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
