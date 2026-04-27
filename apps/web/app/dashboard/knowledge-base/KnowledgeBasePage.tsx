'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, ChevronDown, Globe } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '../../../lib/website-import';
import type { ImportJob } from '../../../lib/website-import';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Props {
  botId?: string;
}

export function KnowledgeBasePage({ botId: initialBotId }: Props) {
  const [botId, setBotId] = useState(initialBotId || '');
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!botId) return;
    loadJobs();
  }, [botId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.listImportJobs(botId);
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      toast.error('Nie udało się załadować historii importów');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Na pewno usunąć ten import?')) return;
    try {
      await api.cancelImport(botId, jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Import usunięty');
    } catch (err) {
      toast.error('Nie udało się usunąć importu');
    }
  };

  const getStatusBadge = (status: api.ImportJobStatus) => {
    const badges: Record<api.ImportJobStatus, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Oczekiwanie' },
      SCRAPING: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Skanowanie' },
      EXTRACTING: { bg: 'bg-purple-100', text: 'text-purple-600', label: 'Analiza' },
      READY_FOR_REVIEW: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Przegląd' },
      CONFIRMING: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Zapisywanie' },
      CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Gotowe' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-600', label: 'Błąd' },
      CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Anulowane' },
    };
    const badge = badges[status];
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (!botId) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
        <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="font-semibold text-slate-700 mb-1">Brak bota</p>
        <p className="text-sm text-slate-500">
          Najpierw utwórz bota w panelu głównym, a następnie wróć tutaj.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Historia importów ze strony</h1>
        <p className="text-sm text-slate-600">
          Przegląd wszystkich importów danych ze Twojej strony WWW.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
          <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Brak importów</p>
          <p className="text-sm text-slate-500">
            Zacznij od zakładki "Web" w sekcji Wiedza — importuj dane ze swojej strony.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Globe className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{job.sourceUrl}</p>
                    <p className="text-xs text-slate-500">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  {getStatusBadge(job.status)}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expanded === job.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expanded === job.id && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stron pobranych:</span>
                    <span className="font-semibold">{job.scrapedPages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Błędów:</span>
                    <span className="font-semibold">{job.failedPages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Elementów wiedzy:</span>
                    <span className="font-semibold">{job.chunksCreated}</span>
                  </div>
                  {job.errorCode && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kod błędu:</span>
                      <span className="font-semibold text-red-600">{job.errorCode}</span>
                    </div>
                  )}
                  {job.errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-xs">
                      {job.errorMessage}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Usuń
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
