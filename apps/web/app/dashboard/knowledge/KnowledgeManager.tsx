'use client';

import { useState, useRef } from 'react';
import {
  Plus, Trash2, Loader2, BookOpen, Phone, HelpCircle, FileText, FileUp,
  Check, X, Pencil, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase';
import { EmptyStateClient } from '../../../components/ui/EmptyStateClient';

interface Chunk {
  id: string;
  content: string;
  category: string | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ── Helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-purple-100 text-purple-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
];

function categoryStyle(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) & 0xff;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white/70 transition-shadow';

type Tab = 'contact' | 'faq' | 'text' | 'pdf';

// ── Tab: Contact info ──────────────────────────────────────────────────────────

function ContactTab({
  botId,
  onAdd,
}: {
  botId: string;
  onAdd: (chunk: Chunk) => void;
}) {
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    hours: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);
  const getToken = useGetToken();

  const save = async () => {
    const lines = [
      form.phone && `Telefon: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.website && `Strona WWW: ${form.website}`,
      form.address && `Adres: ${form.address}`,
      form.hours && `Godziny otwarcia: ${form.hours}`,
    ].filter(Boolean);

    if (lines.length === 0) {
      toast.error('Uzupełnij przynajmniej jedno pole');
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      const content = lines.join('\n');
      const res = await fetch(`${API_URL}/api/v1/knowledge/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, category: 'kontakt' }),
      });
      if (!res.ok) throw new Error();
      const { id } = (await res.json()) as { id: string };
      onAdd({ id, content, category: 'kontakt', createdAt: new Date().toISOString() });
      setForm({ phone: '', email: '', address: '', hours: '', website: '' });
      toast.success('Dane kontaktowe dodane do bazy wiedzy');
    } catch {
      toast.error('Nie udało się zapisać danych');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Te dane bot będzie podawał klientom gdy zapytają o kontakt, adres lub godziny.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefon</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+48 123 456 789" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="kontakt@firma.pl" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Strona WWW</label>
        <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://twoja-strona.pl" className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adres</label>
        <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="ul. Kwiatowa 5, Białystok" className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Godziny otwarcia</label>
        <input type="text" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} placeholder="Pon–Pt: 9:00–18:00, Sob: 10:00–15:00" className={inputClass} />
      </div>

      <button
        onClick={() => void save()}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {saving ? 'Zapisuję...' : 'Dodaj dane kontaktowe'}
      </button>
    </div>
  );
}

// ── Tab: FAQ ───────────────────────────────────────────────────────────────────

function FaqTab({
  botId,
  onAdd,
}: {
  botId: string;
  onAdd: (chunk: Chunk) => void;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const getToken = useGetToken();

  const save = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error('Uzupełnij pytanie i odpowiedź');
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const content = `Pytanie: ${question.trim()}\nOdpowiedź: ${answer.trim()}`;
      const res = await fetch(`${API_URL}/api/v1/knowledge/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, category: 'faq' }),
      });
      if (!res.ok) throw new Error();
      const { id } = (await res.json()) as { id: string };
      onAdd({ id, content, category: 'faq', createdAt: new Date().toISOString() });
      setQuestion('');
      setAnswer('');
      toast.success('Pytanie i odpowiedź dodane');
    } catch {
      toast.error('Nie udało się zapisać');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Dodawaj często zadawane pytania — bot nauczy się odpowiadać dokładnie tak jak piszesz.
      </p>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pytanie klienta</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ile kosztuje manicure hybrydowy?"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Odpowiedź bota</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Manicure hybrydowy kosztuje 90 zł i trwa około 75 minut. Zapraszamy od poniedziałku do piątku w godzinach 9:00–18:00."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        onClick={() => void save()}
        disabled={saving || !question.trim() || !answer.trim()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {saving ? 'Dodaję...' : 'Dodaj pytanie'}
      </button>
    </div>
  );
}

// ── Tab: Free text ─────────────────────────────────────────────────────────────

function TextTab({
  botId,
  onAdd,
}: {
  botId: string;
  onAdd: (chunk: Chunk) => void;
}) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const getToken = useGetToken();

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/knowledge/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: content.trim(), category: category.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const { id } = (await res.json()) as { id: string };
      onAdd({ id, content: content.trim(), category: category.trim() || null, createdAt: new Date().toISOString() });
      setContent('');
      setCategory('');
      toast.success('Wpis dodany do bazy wiedzy');
    } catch {
      toast.error('Nie udało się dodać wpisu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Wpisz dowolną informację o firmie — usługi, cennik, opis, regulamin, aktualności.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="np. Manicure klasyczny — 60 zł, 45 min. Dostępny codziennie 9-18. Przy pierwszej wizycie 10% rabatu."
        className={`${inputClass} resize-none`}
      />
      <div className="flex gap-3">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategoria (opcjonalnie)"
          className={`flex-1 ${inputClass}`}
        />
        <button
          onClick={() => void save()}
          disabled={saving || !content.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Dodaję...' : 'Dodaj'}
        </button>
      </div>
    </div>
  );
}

// ── Tab: PDF upload ────────────────────────────────────────────────────────────

function PdfTab({
  botId,
  onAdd,
}: {
  botId: string;
  onAdd: (chunks: Chunk[]) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const getToken = useGetToken();

  const upload = async (file: File) => {
    if (!file.name.endsWith('.pdf') || file.type !== 'application/pdf') {
      toast.error('Dozwolone tylko pliki PDF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Plik nie może przekraczać 5 MB');
      return;
    }

    setStatus('uploading');
    setProgress('Wysyłam plik...');
    setErrorMsg('');

    try {
      const token = await getToken();

      // Upload PDF to Next.js API route → it parses and returns chunks
      const form = new FormData();
      form.append('file', file);
      setProgress('Wyciągam tekst z PDF...');

      const parseRes = await fetch('/api/pdf', { method: 'POST', body: form });
      if (!parseRes.ok) {
        const err = (await parseRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? 'Nie udało się przetworzyć PDF');
      }
      const { chunks } = (await parseRes.json()) as { chunks: string[] };

      if (chunks.length === 0) {
        throw new Error('PDF nie zawiera tekstu możliwego do odczytania. Sprawdź czy plik nie jest skanem bez OCR.');
      }

      // Upload each chunk to knowledge API
      const added: Chunk[] = [];
      setProgress(`Uczę bota... 0/${chunks.length}`);

      for (let i = 0; i < chunks.length; i++) {
        const res = await fetch(`${API_URL}/api/v1/knowledge/${botId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: chunks[i], category: `pdf: ${file.name}` }),
        });
        if (res.ok) {
          const { id } = (await res.json()) as { id: string };
          added.push({
            id,
            content: chunks[i],
            category: `pdf: ${file.name}`,
            createdAt: new Date().toISOString(),
          });
        }
        setProgress(`Uczę bota... ${i + 1}/${chunks.length}`);
      }

      onAdd(added);
      setAddedCount(added.length);
      setStatus('done');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Nieznany błąd');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Wgraj PDF z ofertą, cennikiem lub regulaminem — bot automatycznie go przeczyta.
        <span className="block mt-1 text-xs text-slate-400">Max 5 MB · Max 50 stron · Tylko tekst (nie skany)</span>
      </p>

      {status === 'idle' || status === 'error' ? (
        <>
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-8 cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30">
            <FileUp className="w-8 h-8 text-slate-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">Kliknij lub przeciągnij plik PDF</p>
              <p className="text-xs text-slate-400 mt-0.5">Max 5 MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
              }}
            />
          </label>
          {status === 'error' && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}
        </>
      ) : status === 'uploading' ? (
        <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-indigo-200 rounded-2xl p-8 bg-indigo-50/30">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-indigo-700">{progress}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 border-2 border-emerald-200 rounded-2xl p-8 bg-emerald-50/30">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-semibold text-emerald-800">
            Dodano {addedCount} fragmentów z PDF
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs text-emerald-600 underline hover:no-underline"
          >
            Wgraj kolejny plik
          </button>
        </div>
      )}
    </div>
  );
}

// ── Chunk list item with inline edit ──────────────────────────────────────────

function ChunkItem({
  chunk,
  onDelete,
  onUpdate,
}: {
  chunk: Chunk;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chunk.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const getToken = useGetToken();

  const saveEdit = async () => {
    if (!draft.trim() || draft === chunk.content) { setEditing(false); return; }
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/knowledge/${chunk.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: draft.trim(), category: chunk.category }),
      });
      if (!res.ok) throw new Error();
      onUpdate(chunk.id, draft.trim());
      setEditing(false);
      toast.success('Wpis zaktualizowany');
    } catch {
      toast.error('Nie udało się zapisać zmian');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!window.confirm('Usunąć ten wpis z bazy wiedzy?')) return;
    setDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/knowledge/${chunk.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onDelete(chunk.id);
      toast.success('Wpis usunięty');
    } catch {
      toast.error('Nie udało się usunąć wpisu');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {chunk.category && (
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 ${categoryStyle(chunk.category)}`}>
              {chunk.category}
            </span>
          )}

          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(Math.max(draft.split('\n').length + 1, 3), 10)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none bg-white"
              autoFocus
            />
          ) : (
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{chunk.content}</p>
          )}

          <p className="text-xs text-slate-400 mt-2">
            {new Date(chunk.createdAt).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {editing ? (
            <>
              <button
                onClick={() => void saveEdit()}
                disabled={saving}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
                title="Zapisz"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setDraft(chunk.content); setEditing(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
                title="Anuluj"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                title="Edytuj"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => void del()}
                disabled={deleting}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                title="Usuń"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared hook ────────────────────────────────────────────────────────────────

function useGetToken() {
  return async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? '';
  };
}

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'contact', label: 'Kontakt', icon: Phone, description: 'Telefon, email, adres, godziny' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Pytania i odpowiedzi' },
  { id: 'text', label: 'Tekst', icon: FileText, description: 'Dowolna informacja o firmie' },
  { id: 'pdf', label: 'PDF', icon: FileUp, description: 'Wgraj dokument' },
];

// ── Main export ────────────────────────────────────────────────────────────────

export function KnowledgeManager({
  botId,
  initialChunks,
}: {
  botId: string;
  initialChunks: Chunk[];
}) {
  const [chunks, setChunks] = useState(initialChunks);
  const [activeTab, setActiveTab] = useState<Tab>('contact');

  const addOne = (chunk: Chunk) => setChunks((prev) => [chunk, ...prev]);
  const addMany = (newChunks: Chunk[]) => setChunks((prev) => [...newChunks, ...prev]);
  const remove = (id: string) => setChunks((prev) => prev.filter((c) => c.id !== id));
  const update = (id: string, content: string) =>
    setChunks((prev) => prev.map((c) => (c.id === id ? { ...c, content } : c)));

  return (
    <div className="space-y-6">
      {/* Add section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3.5 px-2 text-xs font-semibold transition-all border-b-2 ${
                  active
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'contact' && <ContactTab botId={botId} onAdd={addOne} />}
          {activeTab === 'faq' && <FaqTab botId={botId} onAdd={addOne} />}
          {activeTab === 'text' && <TextTab botId={botId} onAdd={addOne} />}
          {activeTab === 'pdf' && <PdfTab botId={botId} onAdd={addMany} />}
        </div>
      </div>

      {/* Chunks list */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Baza wiedzy ({chunks.length} {chunks.length === 1 ? 'wpis' : chunks.length < 5 ? 'wpisy' : 'wpisów'})
        </h2>

        {chunks.length === 0 ? (
          <EmptyStateClient
            icon={BookOpen}
            title="Baza wiedzy jest pusta"
            description="Bot nie może odpowiadać na pytania bez wiedzy o Twojej firmie. Zacznij od zakładki Kontakt — dodaj telefon, adres i godziny otwarcia."
          />
        ) : (
          <div className="space-y-3">
            {chunks.map((chunk) => (
              <ChunkItem
                key={chunk.id}
                chunk={chunk}
                onDelete={remove}
                onUpdate={update}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
