'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import {
  Plus, Trash2, Loader2, BookOpen, Phone, HelpCircle, FileText, FileUp,
  Check, X, Pencil, AlertCircle, Search, Mail, MapPin, Clock, Globe,
  Sparkles, Filter, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase';
import { EmptyStateClient } from '../../../components/ui/EmptyStateClient';
import { WebsiteImportButton } from '../../../components/knowledge/WebsiteImportButton';

interface Chunk {
  id: string;
  content: string;
  category: string | null;
  source: string | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ── Category visuals ───────────────────────────────────────────────────────────

type CategoryKind = 'contact' | 'faq' | 'pdf' | 'text';

interface CategoryVisual {
  kind: CategoryKind;
  label: string;
  icon: React.ElementType;
  chipClass: string;
  borderClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

const CATEGORY_VISUALS: Record<CategoryKind, CategoryVisual> = {
  contact: {
    kind: 'contact',
    label: 'Kontakt',
    icon: Phone,
    chipClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderClass: 'border-l-indigo-400',
    iconBgClass: 'bg-indigo-100',
    iconColorClass: 'text-indigo-600',
  },
  faq: {
    kind: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    chipClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderClass: 'border-l-emerald-400',
    iconBgClass: 'bg-emerald-100',
    iconColorClass: 'text-emerald-600',
  },
  pdf: {
    kind: 'pdf',
    label: 'PDF',
    icon: FileText,
    chipClass: 'bg-rose-50 text-rose-700 border-rose-200',
    borderClass: 'border-l-rose-400',
    iconBgClass: 'bg-rose-100',
    iconColorClass: 'text-rose-600',
  },
  text: {
    kind: 'text',
    label: 'Tekst',
    icon: Sparkles,
    chipClass: 'bg-amber-50 text-amber-700 border-amber-200',
    borderClass: 'border-l-amber-400',
    iconBgClass: 'bg-amber-100',
    iconColorClass: 'text-amber-600',
  },
};

function kindFromCategory(category: string | null): CategoryKind {
  if (!category) return 'text';
  const c = category.toLowerCase();
  if (c === 'kontakt' || c === 'contact') return 'contact';
  if (c === 'faq') return 'faq';
  if (c.startsWith('pdf')) return 'pdf';
  return 'text';
}

function categoryLabel(category: string | null): string {
  if (!category) return 'Tekst';
  if (category.toLowerCase().startsWith('pdf:')) {
    return category.slice(4).trim() || 'PDF';
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// ── Content parsers ────────────────────────────────────────────────────────────

interface ContactField {
  icon: React.ElementType;
  label: string;
  value: string;
}

function parseContact(content: string): ContactField[] | null {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  const fields: ContactField[] = [];
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey?.toLowerCase().trim() ?? '';
    const value = rest.join(':').trim();
    if (!value) continue;
    if (key.startsWith('telefon')) fields.push({ icon: Phone, label: 'Telefon', value });
    else if (key === 'email' || key === 'e-mail') fields.push({ icon: Mail, label: 'Email', value });
    else if (key.startsWith('strona') || key.startsWith('www')) fields.push({ icon: Globe, label: 'Strona', value });
    else if (key.startsWith('adres')) fields.push({ icon: MapPin, label: 'Adres', value });
    else if (key.startsWith('godziny')) fields.push({ icon: Clock, label: 'Godziny', value });
  }
  return fields.length > 0 ? fields : null;
}

function parseFaq(content: string): { question: string; answer: string } | null {
  const qMatch = /Pytanie:\s*(.+?)(?:\n|$)/s.exec(content);
  const aMatch = /Odpowiedź:\s*(.+)$/s.exec(content);
  if (!qMatch || !aMatch) return null;
  return { question: qMatch[1]!.trim(), answer: aMatch[1]!.trim() };
}

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white/70 transition-shadow';

type Tab = 'contact' | 'faq' | 'text' | 'pdf' | 'web';

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
      onAdd({ id, content, category: 'kontakt', source: null, createdAt: new Date().toISOString() });
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

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefon</label>
        <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+48 123 456 789" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="kontakt@firma.pl" className={inputClass} />
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
      onAdd({ id, content, category: 'faq', source: null, createdAt: new Date().toISOString() });
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
      onAdd({ id, content: content.trim(), category: category.trim() || null, source: null, createdAt: new Date().toISOString() });
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
            content: chunks[i]!,
            category: `pdf: ${file.name}`,
            source: null,
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

const COLLAPSED_MAX_PX = 180;


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
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const getToken = useGetToken();

  // Measure after render — if content is taller than threshold, show "Rozwiń" button.
  useEffect(() => {
    if (editing || !contentRef.current) return;
    const el = contentRef.current;
    setIsOverflowing(el.scrollHeight > COLLAPSED_MAX_PX + 4);
  }, [editing, chunk.content]);

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

  const kind = kindFromCategory(chunk.category);
  const visual = CATEGORY_VISUALS[kind];
  const Icon = visual.icon;
  const label = categoryLabel(chunk.category);

  const contactFields = kind === 'contact' ? parseContact(chunk.content) : null;
  const faq = kind === 'faq' ? parseFaq(chunk.content) : null;

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/70 border-l-4 ${visual.borderClass} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
      style={{ animation: 'botiko-chunk-in 0.3s ease both' }}
    >
      <div className="flex items-start gap-3">
        {/* Source icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${visual.iconBgClass} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${visual.iconColorClass}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Category chip + date */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${visual.chipClass}`}>
              {label}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(chunk.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Content — parsed or raw */}
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(Math.max(draft.split('\n').length + 1, 3), 10)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none bg-white"
              autoFocus
            />
          ) : (
            <>
              <div
                ref={contentRef}
                className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{ maxHeight: expanded || !isOverflowing ? '9999px' : `${COLLAPSED_MAX_PX}px` }}
              >
                {contactFields ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {contactFields.map((f, i) => {
                      const FIcon = f.icon;
                      return (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <FIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{f.label}</span>
                            <span className="block truncate">{f.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : faq ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{faq.question}</p>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{chunk.content}</p>
                )}

                {/* Gradient fade when collapsed */}
                {isOverflowing && !expanded && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent" />
                )}
              </div>

              {isOverflowing && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
                >
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                  {expanded ? 'Zwiń' : 'Rozwiń'}
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
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
  { id: 'web', label: 'Web', icon: Globe, description: 'Importuj ze strony' },
];

// ── Main export ────────────────────────────────────────────────────────────────

export function KnowledgeManager({
  botId,
  initialChunks,
  tenantWebsiteUrl,
}: {
  botId: string;
  initialChunks: Chunk[];
  tenantWebsiteUrl?: string | null;
}) {
  const [chunks, setChunks] = useState(initialChunks);
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<CategoryKind | 'all'>('all');

  const addOne = (chunk: Chunk) => setChunks((prev) => [chunk, ...prev]);
  const addMany = (newChunks: Chunk[]) => setChunks((prev) => [...newChunks, ...prev]);
  const remove = (id: string) => setChunks((prev) => prev.filter((c) => c.id !== id));
  const update = (id: string, content: string) =>
    setChunks((prev) => prev.map((c) => (c.id === id ? { ...c, content } : c)));

  const counts = useMemo(() => {
    const c: Record<CategoryKind, number> = { contact: 0, faq: 0, pdf: 0, text: 0 };
    for (const chunk of chunks) c[kindFromCategory(chunk.category)]++;
    return c;
  }, [chunks]);

  const filteredChunks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return chunks.filter((c) => {
      if (kindFilter !== 'all' && kindFromCategory(c.category) !== kindFilter) return false;
      if (q && !c.content.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [chunks, search, kindFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] xl:grid-cols-[480px_1fr] gap-6 items-start">
      <style>{`
        @keyframes botiko-chunk-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes botiko-tab-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── LEFT COLUMN: Add section (sticky on desktop) ── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden lg:sticky lg:top-6">
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
        <div
          key={activeTab}
          className="p-6"
          style={{ animation: 'botiko-tab-in 0.22s ease both' }}
        >
          {activeTab === 'contact' && <ContactTab botId={botId} onAdd={addOne} />}
          {activeTab === 'faq' && <FaqTab botId={botId} onAdd={addOne} />}
          {activeTab === 'text' && <TextTab botId={botId} onAdd={addOne} />}
          {activeTab === 'pdf' && <PdfTab botId={botId} onAdd={addMany} />}
          {activeTab === 'web' && (
            <WebTab botId={botId} tenantWebsiteUrl={tenantWebsiteUrl} />
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Search, filters, chunks list ── */}
      <div className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-14rem)] flex flex-col rounded-2xl">
        {/* Toolbar: search + filters (sticky, always visible) */}
        {chunks.length > 0 && (
          <div className="mb-4 space-y-3 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj we wpisach bazy wiedzy..."
                className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl border border-slate-200/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Wyczyść"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <FilterPill
                active={kindFilter === 'all'}
                label="Wszystkie"
                count={chunks.length}
                onClick={() => setKindFilter('all')}
                accentColor="bg-slate-700"
              />
              {(Object.keys(CATEGORY_VISUALS) as CategoryKind[]).map((k) => {
                const v = CATEGORY_VISUALS[k];
                if (counts[k] === 0) return null;
                return (
                  <FilterPill
                    key={k}
                    active={kindFilter === k}
                    label={v.label}
                    count={counts[k]}
                    icon={v.icon}
                    onClick={() => setKindFilter(k)}
                    chipClass={v.chipClass}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div
          className="lg:flex-1 lg:overflow-y-auto lg:pr-1 lg:pb-4"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
        >
          {chunks.length === 0 ? (
            <EmptyStateClient
              icon={BookOpen}
              title="Baza wiedzy jest pusta"
              description="Bot nie może odpowiadać na pytania bez wiedzy o Twojej firmie. Zacznij od zakładki Kontakt — dodaj telefon, adres i godziny otwarcia."
            />
          ) : filteredChunks.length === 0 ? (
            <div className="bg-white/60 rounded-2xl border border-slate-200/60 border-dashed p-10 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">Brak wyników</p>
              <p className="text-xs text-slate-500">
                Spróbuj zmienić filtr lub wyczyść frazę wyszukiwania.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChunks.map((chunk) => (
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
    </div>
  );
}

// ── Filter pill ────────────────────────────────────────────────────────────────

function FilterPill({
  active,
  label,
  count,
  onClick,
  icon: Icon,
  chipClass,
  accentColor,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  icon?: React.ElementType;
  chipClass?: string;
  accentColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active
          ? chipClass
            ? `${chipClass} shadow-sm scale-105`
            : 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
      <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
        active
          ? 'bg-white/80 text-slate-800'
          : accentColor
            ? `${accentColor} text-white`
            : 'bg-slate-100 text-slate-600'
      }`}>
        {count}
      </span>
    </button>
  );
}

// ── Tab: Web import ────────────────────────────────────────────────────────────

function WebTab({
  botId,
  tenantWebsiteUrl,
}: {
  botId: string;
  tenantWebsiteUrl?: string | null;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Automatyczny import danych
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Bot automatycznie pobierze informacje ze Twojej strony: usługi, FAQ, kontakt i cennik.
        </p>
        {!tenantWebsiteUrl && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-4">
            Dodaj URL strony w{' '}
            <a href="/dashboard/settings" className="underline font-semibold">
              Ustawieniach
            </a>{' '}
            aby odblokować import.
          </p>
        )}
        <WebsiteImportButton
          botId={botId}
          tenantWebsiteUrl={tenantWebsiteUrl}
        />
      </div>
    </div>
  );
}
