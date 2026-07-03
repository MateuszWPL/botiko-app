'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '../../lib/website-import';
import type { ExtractedPayload, ConfirmPayload } from '../../lib/website-import';
import { WebsiteImportPreview } from './WebsiteImportPreview';

type State = 'idle' | 'classifying' | 'preview' | 'saving' | 'done' | 'error';

const MIN_CHARS = 30;

const ERROR_MESSAGES: Record<string, string> = {
  LLM_INVALID_JSON: 'Nie udało się rozpoznać treści — spróbuj wkleić ją inaczej lub dodaj ręcznie.',
  INVALID_SCHEMA: 'Nie udało się poukładać danych — spróbuj ponownie lub dodaj ręcznie.',
};

/** True when the classifier found nothing worth saving. */
function isEmptyPayload(p: ExtractedPayload): boolean {
  const hasContact =
    !!p.contact &&
    (!!p.contact.phone || !!p.contact.email || !!p.contact.address);
  return (
    !hasContact &&
    p.services.length === 0 &&
    p.faq.length === 0 &&
    !p.hours?.raw &&
    !p.about
  );
}

interface Props {
  botId: string;
  onComplete?: (chunksCreated: number) => void;
}

export function PasteAnythingPanel({ botId, onComplete }: Props) {
  const [state, setState] = useState<State>('idle');
  const [text, setText] = useState('');
  const [payload, setPayload] = useState<ExtractedPayload | null>(null);
  const [error, setError] = useState('');

  const tooShort = text.trim().length < MIN_CHARS;

  const classify = async () => {
    if (tooShort) return;
    setState('classifying');
    setError('');
    try {
      const { payload } = await api.classifyText(botId, text.trim());
      setPayload(payload);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
    }
  };

  const handleConfirm = async (confirmed: ConfirmPayload) => {
    setState('saving');
    try {
      const { chunksCreated } = await api.saveClassified(botId, confirmed);
      toast.success(`Dodano ${chunksCreated} elementów wiedzy`);
      setState('done');
      onComplete?.(chunksCreated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
      setState('preview');
    }
  };

  const reset = () => {
    setState('idle');
    setText('');
    setPayload(null);
    setError('');
  };

  if (state === 'classifying') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-slate-100 rounded-xl">
        <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
        <span className="text-sm text-slate-600">Analizuję treść i układam wpisy…</span>
      </div>
    );
  }

  if ((state === 'preview' || state === 'saving') && payload) {
    if (isEmptyPayload(payload)) {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-semibold text-amber-800 mb-1">
            Nie znaleźliśmy danych do dodania
          </p>
          <p className="text-xs text-amber-700 mb-3">
            Spróbuj wkleić więcej szczegółów (cennik, godziny, opis usług) albo dodaj wpisy ręcznie poniżej.
          </p>
          <button
            onClick={reset}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
          >
            Wklej ponownie
          </button>
        </div>
      );
    }
    return (
      <div className="max-h-[60vh] overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50">
        <WebsiteImportPreview
          payload={payload}
          onConfirm={handleConfirm}
          onCancel={reset}
          loading={state === 'saving'}
        />
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-emerald-700 mb-2">Gotowe!</p>
        <p className="text-xs text-emerald-600 mb-3">
          Wpisy zostały dodane do bazy wiedzy. Sprawdź listę i usuń ewentualne duplikaty.
        </p>
        <button
          onClick={reset}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
        >
          Wklej kolejne
        </button>
      </div>
    );
  }

  if (state === 'error') {
    const first = error.split('\n')[0].split('|')[0].trim();
    const code = Object.keys(ERROR_MESSAGES).find((c) => first.includes(c));
    const displayMsg = code ? ERROR_MESSAGES[code] : first || 'Coś poszło nie tak.';
    return (
      <div className="space-y-3">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Nie udało się przeanalizować</p>
            <p className="text-xs text-red-600 mt-1">{displayMsg}</p>
          </div>
        </div>
        <button
          onClick={() => setState('idle')}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // idle
  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Wklej cokolwiek o swojej firmie — cennik, ofertę, najczęstsze pytania, godziny, adres. AI samo poukłada to na wpisy, a Ty tylko zatwierdzisz."
        rows={6}
        maxLength={90_000}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-y"
      />
      <button
        onClick={classify}
        disabled={tooShort}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        Przeanalizuj i dodaj
      </button>
    </div>
  );
}
