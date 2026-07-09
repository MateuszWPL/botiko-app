'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '../../lib/website-import';
import type { ImportJob, ConfirmPayload } from '../../lib/website-import';
import { WebsiteImportPreview } from './WebsiteImportPreview';

type State = 'idle' | 'starting' | 'polling' | 'preview' | 'confirming' | 'done' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  SSRF_BLOCKED: 'URL musi prowadzić do publicznej domeny.',
  ROBOTS_DISALLOWED: 'Strona blokuje skanowanie w robots.txt.',
  NO_CONTENT: 'Twoja strona ładuje treść JavaScript-em, dodaj dane ręcznie lub prześlij PDF.',
  TIMEOUT: 'Strona za wolno odpowiada.',
  NON_HTML_CONTENT: 'URL nie wskazuje na stronę HTML.',
  LLM_INVALID_JSON: 'Nie udało się rozpoznać struktury, spróbuj ponownie lub dodaj dane ręcznie.',
  INVALID_SCHEMA: 'Wyekstraktowane dane nie pasują do oczekiwanego formatu.',
};

function storageKey(botId: string) {
  return `botiko_import_job_${botId}`;
}

interface Props {
  botId: string;
  tenantWebsiteUrl: string | null | undefined;
  onComplete?: (chunksCreated: number) => void;
}

export function WebsiteImportButton({ botId, tenantWebsiteUrl, onComplete }: Props) {
  const [state, setState] = useState<State>('idle');
  const [job, setJob] = useState<ImportJob | null>(null);
  const [error, setError] = useState('');

  const isDisabled = !tenantWebsiteUrl;

  // On mount, reconnect to any in-progress job (survives page refresh)
  useEffect(() => {
    const savedJobId = localStorage.getItem(storageKey(botId));
    if (!savedJobId) return;

    api.getImportJob(botId, savedJobId).then((existing) => {
      if (existing.status === 'READY_FOR_REVIEW') {
        setJob(existing);
        setState('preview');
      } else if (existing.status === 'SCRAPING' || existing.status === 'EXTRACTING' || existing.status === 'PENDING') {
        setJob(existing);
        setState('polling');
      } else {
        // CONFIRMED / FAILED / CANCELLED, no longer relevant
        localStorage.removeItem(storageKey(botId));
      }
    }).catch(() => {
      localStorage.removeItem(storageKey(botId));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  // Polling loop
  useEffect(() => {
    if (state !== 'polling' || !job) return;
    const timer = setInterval(async () => {
      try {
        const updated = await api.getImportJob(botId, job.id);
        setJob(updated);

        if (updated.status === 'READY_FOR_REVIEW') {
          setState('preview');
          clearInterval(timer);
        } else if (updated.status === 'FAILED' || updated.status === 'CANCELLED') {
          setState('error');
          setError(updated.errorMessage || 'Nieznany błąd');
          localStorage.removeItem(storageKey(botId));
          clearInterval(timer);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [state, job, botId]);

  const start = async () => {
    if (!tenantWebsiteUrl) return;
    setState('starting');
    setError('');
    try {
      const { jobId } = await api.startImport(botId, tenantWebsiteUrl);
      localStorage.setItem(storageKey(botId), jobId);
      const newJob = await api.getImportJob(botId, jobId);
      setJob(newJob);
      setState('polling');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setState('error');
    }
  };

  const handleConfirm = async (payload: ConfirmPayload) => {
    if (!job) return;
    setState('confirming');
    try {
      const { chunksCreated } = await api.confirmImport(botId, job.id, payload);
      localStorage.removeItem(storageKey(botId));
      toast.success(`Dodano ${chunksCreated} elementów wiedzy`);
      setState('done');
      onComplete?.(chunksCreated);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
      setState('preview');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(storageKey(botId));
    setState('idle');
    setJob(null);
    setError('');
  };

  const handleReset = () => {
    localStorage.removeItem(storageKey(botId));
    setState('idle');
    setJob(null);
    setError('');
  };

  if (state === 'idle') {
    return (
      <div className="space-y-1.5">
        <button
          onClick={start}
          disabled={isDisabled}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title={isDisabled ? 'Najpierw dodaj URL strony w Ustawieniach > Profil firmy' : ''}
        >
          <Globe className="w-4 h-4" />
          Importuj ze strony
        </button>
        <p className="text-xs text-slate-400 text-center">
          Import skanuje stronę i analizuje ją przez AI, możesz go uruchomić maksymalnie 3 razy na 7 dni.
        </p>
      </div>
    );
  }

  if (state === 'starting' || state === 'polling') {
    const statusLabel =
      job?.status === 'SCRAPING'
        ? `Scanuję stronę... (${job.scrapedPages.length} stron)`
        : job?.status === 'EXTRACTING'
          ? 'Analizuję zawartość...'
          : 'Przygotowuję dane...';

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 py-2.5 px-4 bg-slate-100 rounded-xl">
          <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
          <span className="text-sm text-slate-600">{statusLabel}</span>
        </div>
        <p className="text-xs text-slate-400 text-center">
          Możesz zamknąć tę stronę, skanowanie będzie kontynuowane w tle.
        </p>
      </div>
    );
  }

  if ((state === 'preview' || state === 'confirming') && job?.extractedPayload) {
    return (
      <div className="space-y-3">
        <div className="max-h-[60vh] overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50">
          <WebsiteImportPreview
            payload={job.extractedPayload}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            loading={state === 'confirming'}
          />
        </div>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-emerald-700 mb-2">Gotowe!</p>
        <p className="text-xs text-emerald-600 mb-3">
          Dane ze strony zostały załadowane do bazy wiedzy.
        </p>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
        >
          Importuj ponownie
        </button>
      </div>
    );
  }

  if (state === 'error') {
    const friendlyMsg = error
      .split('\n')[0]
      .split('|')[0]
      .trim();
    const code = Object.keys(ERROR_MESSAGES).find((c) => friendlyMsg.includes(c));
    const displayMsg = code ? ERROR_MESSAGES[code] : friendlyMsg;

    return (
      <div className="space-y-3">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex gap-2 items-start mb-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Import nie powiódł się</p>
              <p className="text-xs text-red-600 mt-1">{displayMsg}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            Anuluj
          </button>
          <button
            onClick={start}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all"
          >
            <Loader2 className="w-3 h-3" />
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return null;
}
