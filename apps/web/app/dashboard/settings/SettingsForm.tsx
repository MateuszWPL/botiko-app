'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Loader2,
  Save,
  Palette,
  Globe,
  User,
  Plus,
  X,
  Bot,
  MessageCircle,
  Star,
  Zap,
  Heart,
  Smile,
  Sparkles,
  Shield,
  Upload,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase';
import type { BotData, DaySchedule } from './page';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const INDUSTRY_LABELS: Record<string, string> = {
  BEAUTY: 'Salon beauty',
  HEALTH: 'Zdrowie / gabinet',
  FOOD: 'Gastronomia',
  AUTO: 'Motoryzacja',
  OTHER: 'Inne',
};

const ACCENT_COLORS = [
  '#6366F1',
  '#EC4899',
  '#06B6D4',
  '#F97316',
  '#10B981',
  '#8B5CF6',
  '#1E293B',
  '#F59E0B',
];

type AvatarPreset = { id: string; Icon: React.FC<{ className?: string }> };
const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'bot', Icon: Bot },
  { id: 'message-circle', Icon: MessageCircle },
  { id: 'star', Icon: Star },
  { id: 'zap', Icon: Zap },
  { id: 'heart', Icon: Heart },
  { id: 'smile', Icon: Smile },
  { id: 'sparkles', Icon: Sparkles },
  { id: 'shield', Icon: Shield },
];

function AvatarIcon({
  value,
  className = 'w-5 h-5',
}: {
  value: string;
  className?: string;
}) {
  if (value.startsWith('http')) {
    return (
      <img
        src={value}
        alt="avatar"
        className="w-full h-full rounded-full object-cover"
      />
    );
  }
  const preset = AVATAR_PRESETS.find((p) => p.id === value) ?? AVATAR_PRESETS[0]!;
  return <preset.Icon className={className} />;
}

const DAY_NAMES = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { enabled: true, start: 9, end: 18 },
  { enabled: true, start: 9, end: 18 },
  { enabled: true, start: 9, end: 18 },
  { enabled: true, start: 9, end: 18 },
  { enabled: true, start: 9, end: 18 },
  { enabled: true, start: 9, end: 14 },
  { enabled: false, start: 9, end: 18 },
];

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer flex-shrink-0 ${
        checked ? 'bg-indigo-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-indigo-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function TimeInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <input
      type="text"
      value={`${pad(value)}:00`}
      disabled={disabled}
      onChange={(e) => {
        const h = parseInt(e.target.value.split(':')[0] ?? '0', 10);
        if (!isNaN(h) && h >= 0 && h <= 23) onChange(h);
      }}
      className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-40 disabled:bg-slate-50"
    />
  );
}

// --- Live Preview ---
function WidgetPreview({
  name,
  color,
  welcomeMsg,
  suggestedQuestions,
  avatarEmoji,
}: {
  name: string;
  color: string;
  welcomeMsg: string;
  suggestedQuestions: string[];
  avatarEmoji: string;
}) {
  return (
    <div className="w-72 rounded-2xl border border-slate-200 overflow-hidden shadow-lg text-sm font-sans">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: color }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          <AvatarIcon value={avatarEmoji || 'bot'} className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{name || 'Bot'}</p>
          <p className="text-white/70 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online · odpowiada 24/7
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="bg-slate-50 px-4 py-4 min-h-[160px]">
        {/* Bot message bubble */}
        <div className="flex gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ backgroundColor: color + '20', color }}
          >
            <AvatarIcon value={avatarEmoji || 'bot'} className="w-4 h-4" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-700 max-w-[80%] shadow-sm">
            {welcomeMsg || 'Cześć! W czym mogę pomóc?'}
          </div>
        </div>

        {/* Suggested questions */}
        {suggestedQuestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 ml-9">
            {suggestedQuestions.slice(0, 3).map((q) => (
              <button
                key={q}
                className="px-2.5 py-1 rounded-full border text-xs font-medium"
                style={{ borderColor: color, color }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-slate-100 px-3 py-2.5 flex items-center gap-2">
        <span className="flex-1 text-xs text-slate-400">Napisz wiadomość...</span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </div>
      </div>

      <div className="bg-white text-center pb-2 text-[10px] text-slate-300">
        Zasilane przez <span className="font-medium">Botiko.pl</span>
      </div>
    </div>
  );
}

// --- Tab components ---

function TabProfil({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const updateSchedule = (dayIdx: number, patch: Partial<DaySchedule>) => {
    setForm((f) => ({
      ...f,
      schedule: f.schedule.map((d, i) => (i === dayIdx ? { ...d, ...patch } : d)),
    }));
  };

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <SectionCard title="Tożsamość bota" subtitle="Imię i osobowość jakie bot prezentuje klientom.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Imię bota</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Branża</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                {INDUSTRY_LABELS[form.industry ?? ''] ?? form.industry ?? '—'}
              </span>
              <span className="text-xs text-slate-400">Kontakt z supportem aby zmienić</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Osobowość / ton wypowiedzi</label>
          <textarea
            value={form.personality ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, personality: e.target.value }))}
            rows={4}
            maxLength={1000}
            placeholder="Przyjazna, ciepła, mówi po imieniu. Używa emoji umiarkowanie. Zawsze pyta o szczegóły przed rezerwacją. Nigdy nie obiecuje konkretnego terminu bez potwierdzenia."
            className={inputClass + ' resize-none'}
          />
          <p className="text-xs text-amber-600 mt-1">
            💡 Wskazówka: im konkretniej opiszesz styl, tym bot brzmi bardziej &quot;Twoje&quot;.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Dane firmy" subtitle='Bot używa tych danych aby odpowiadać na pytania "gdzie?", "kiedy?", "jak dojadę?".'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nazwa firmy</label>
            <input
              type="text"
              value={form.companyName ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefon</label>
            <input
              type="tel"
              value={form.companyPhone ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, companyPhone: e.target.value }))}
              placeholder="+48 600 123 456"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adres</label>
          <input
            type="text"
            value={form.companyAddress ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, companyAddress: e.target.value }))}
            placeholder="ul. Floriańska 12, 31-019 Kraków"
            className={inputClass}
          />
        </div>
      </SectionCard>

      <SectionCard title="Godziny otwarcia" subtitle="Informacyjne — bot odpowiada 24/7, ale informuje klientów o godzinach.">
        <div className="space-y-2">
          {form.schedule.map((day, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Toggle
                checked={day.enabled}
                onChange={() => updateSchedule(idx, { enabled: !day.enabled })}
              />
              <span className="w-28 text-sm text-slate-700 font-medium">{DAY_NAMES[idx]}</span>
              <TimeInput
                value={day.start}
                onChange={(v) => updateSchedule(idx, { start: v })}
                disabled={!day.enabled}
              />
              <span className="text-slate-400 text-sm">—</span>
              <TimeInput
                value={day.end}
                onChange={(v) => updateSchedule(idx, { end: v })}
                disabled={!day.enabled}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_PRESET) {
    throw new Error('Cloudinary nie jest skonfigurowany');
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: fd },
  );
  if (!res.ok) throw new Error('Upload failed');
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

function TabWyglad({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [questionInput, setQuestionInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Plik za duży — maks. 2 MB');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, avatarEmoji: url }));
    } catch {
      toast.error('Nie udało się wgrać zdjęcia');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addQuestion = () => {
    const q = questionInput.trim();
    if (!q || form.suggestedQuestions.length >= 5) return;
    setForm((f) => ({ ...f, suggestedQuestions: [...f.suggestedQuestions, q] }));
    setQuestionInput('');
  };

  const removeQuestion = (i: number) => {
    setForm((f) => ({ ...f, suggestedQuestions: f.suggestedQuestions.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="flex gap-6">
      {/* Left column — settings */}
      <div className="flex-1 space-y-4 min-w-0">
        <SectionCard title="Kolor akcentu">
          <div className="flex items-center gap-2 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, primaryColor: c }))}
                className={`w-9 h-9 rounded-lg cursor-pointer transition-all ${
                  form.primaryColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="flex items-center gap-2 ml-2">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
              />
              <span className="text-xs font-mono text-slate-500">{form.primaryColor}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Awatar bota" subtitle="Wybierz gotowy lub wgraj własny.">
          <div className="flex items-center gap-2 flex-wrap">
            {AVATAR_PRESETS.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setForm((f) => ({ ...f, avatarEmoji: id }))}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  form.avatarEmoji === id
                    ? 'ring-2 ring-offset-1 ring-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}

            {/* Custom upload preview */}
            {form.avatarEmoji.startsWith('http') && (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-offset-1 ring-indigo-500">
                <img src={form.avatarEmoji} alt="avatar" className="w-full h-full object-cover" />
                <button
                  onClick={() => setForm((f) => ({ ...f, avatarEmoji: 'bot' }))}
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleUpload(e)}
            />
          </div>
          {!CLOUDINARY_CLOUD && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Ustaw <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> i <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> aby włączyć upload.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Wiadomość powitalna" subtitle="Pierwsza wiadomość którą zobaczy klient.">
          <textarea
            value={form.welcomeMsg}
            onChange={(e) => setForm((f) => ({ ...f, welcomeMsg: e.target.value }))}
            rows={3}
            maxLength={500}
            className={inputClass + ' resize-none'}
          />
        </SectionCard>

        <SectionCard
          title="Sugerowane pytania"
          subtitle="Pokazywane pod wiadomością powitalną. Max 5."
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{form.suggestedQuestions.length}/5</span>
          </div>
          {form.suggestedQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.suggestedQuestions.map((q, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: form.primaryColor + '18',
                    color: form.primaryColor,
                    border: `1px solid ${form.primaryColor}40`,
                  }}
                >
                  {q}
                  <button onClick={() => removeQuestion(i)} className="hover:opacity-70 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {form.suggestedQuestions.length < 5 && (
            <div className="flex gap-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                placeholder="Dodaj pytanie..."
                maxLength={100}
                className={inputClass}
              />
              <button
                onClick={addQuestion}
                disabled={!questionInput.trim()}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer disabled:cursor-default flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Dodaj
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Formularz kontaktowy" subtitle="Pokaż lead form po N wiadomościach od klienta.">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Po</span>
              <input
                type="number"
                min={1}
                max={20}
                value={form.leadFormAfterMessages}
                onChange={(e) =>
                  setForm((f) => ({ ...f, leadFormAfterMessages: Math.max(1, Math.min(20, Number(e.target.value))) }))
                }
                className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <span className="text-sm text-slate-600">wiadomościach od klienta</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Right column — live preview */}
      <div className="hidden xl:flex flex-col items-center gap-3 pt-1 flex-shrink-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Podgląd na żywo</p>
        <WidgetPreview
          name={form.name}
          color={form.primaryColor}
          welcomeMsg={form.welcomeMsg}
          suggestedQuestions={form.suggestedQuestions}
          avatarEmoji={form.avatarEmoji}
        />
      </div>
    </div>
  );
}

function TabDomeny({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const [domainInput, setDomainInput] = useState('');
  const [domainError, setDomainError] = useState('');

  const addDomain = () => {
    const raw = domainInput.trim().toLowerCase();
    if (!raw) return;

    let url = raw;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      setDomainError('Nieprawidłowy adres domeny');
      return;
    }

    if (form.allowedDomains.includes(url)) {
      setDomainError('Ta domena jest już dodana');
      return;
    }

    if (form.allowedDomains.length >= 5) {
      setDomainError('Maksymalnie 5 domen');
      return;
    }

    setDomainError('');
    setForm((f) => ({ ...f, allowedDomains: [...f.allowedDomains, url] }));
    setDomainInput('');
  };

  const removeDomain = (i: number) => {
    setForm((f) => ({ ...f, allowedDomains: f.allowedDomains.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <SectionCard title="Dozwolone domeny" subtitle="Widget działa tylko na tych domenach — zabezpieczenie przed kradzieżą bota przez konkurencję.">
        {form.allowedDomains.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {form.allowedDomains.map((d, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700 font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {d.replace(/^https?:\/\//, '')}
                <button onClick={() => removeDomain(i)} className="hover:text-red-500 cursor-pointer ml-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => { setDomainInput(e.target.value); setDomainError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && addDomain()}
            placeholder="np. twojastrona.pl"
            className={inputClass + (domainError ? ' border-red-300 focus:border-red-400 focus:ring-red-500/30' : '')}
          />
          <button
            onClick={addDomain}
            disabled={!domainInput.trim() || form.allowedDomains.length >= 5}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer disabled:cursor-default whitespace-nowrap"
          >
            Dodaj domenę
          </button>
        </div>
        {domainError && <p className="text-xs text-red-500 -mt-1">{domainError}</p>}

        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <TriangleAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <strong>Pamiętaj o obu wariantach</strong> — jeśli dodasz <code>salonkasi.pl</code>, dodaj też <code>www.salonkasi.pl</code>.
          </p>
        </div>

        {form.allowedDomains.length === 0 && (
          <p className="text-xs text-slate-400 italic">
            Brak domen — widget działa na każdej stronie (tryb testowy). Dodaj domenę przed publikacją.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

// --- Main form state + component ---

interface FormState {
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
  offlineMessage: string;
  schedule: DaySchedule[];
  personality: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  suggestedQuestions: string[];
  leadFormAfterMessages: number;
  avatarEmoji: string;
  industry: string;
}

function initSchedule(bot: BotData): DaySchedule[] {
  if (bot.businessSchedule && bot.businessSchedule.length === 7) {
    return bot.businessSchedule;
  }
  // Migrate legacy fields to per-day schedule
  const schedule = DEFAULT_SCHEDULE.map((d) => ({ ...d }));
  if (bot.businessDays && bot.businessHoursStart != null && bot.businessHoursEnd != null) {
    schedule.forEach((d, i) => {
      d.enabled = bot.businessDays.includes(i);
      d.start = bot.businessHoursStart ?? 9;
      d.end = bot.businessHoursEnd ?? 18;
    });
  }
  return schedule;
}

const TABS = [
  { id: 'profil', label: 'Profil bota', icon: User },
  { id: 'wyglad', label: 'Wygląd widgetu', icon: Palette },
  { id: 'domeny', label: 'Domeny', icon: Globe },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function SettingsForm({ bot }: { bot: BotData }) {
  const initial = useMemo<FormState>(
    () => ({
      name: bot.name,
      welcomeMsg: bot.welcomeMsg,
      primaryColor: bot.primaryColor,
      allowedDomains: bot.allowedDomains,
      isActive: bot.isActive,
      offlineMessage: bot.offlineMessage ?? '',
      schedule: initSchedule(bot),
      personality: bot.personality ?? '',
      companyName: bot.companyName ?? '',
      companyPhone: bot.companyPhone ?? '',
      companyAddress: bot.companyAddress ?? '',
      suggestedQuestions: bot.suggestedQuestions ?? [],
      leadFormAfterMessages: bot.leadFormAfterMessages ?? 3,
      avatarEmoji: bot.avatarEmoji ?? '',
      industry: bot.industry ?? '',
    }),
    [bot],
  );

  const [form, setForm] = useState<FormState>(initial);
  const [activeTab, setActiveTab] = useState<TabId>('profil');
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(`${API_URL}/api/v1/bot/${bot.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({
          name: form.name,
          welcomeMsg: form.welcomeMsg,
          primaryColor: form.primaryColor,
          allowedDomains: form.allowedDomains,
          isActive: form.isActive,
          offlineMessage: form.offlineMessage.trim() || null,
          businessSchedule: form.schedule,
          personality: form.personality.trim() || null,
          companyName: form.companyName.trim() || null,
          companyPhone: form.companyPhone.trim() || null,
          companyAddress: form.companyAddress.trim() || null,
          suggestedQuestions: form.suggestedQuestions,
          leadFormAfterMessages: form.leadFormAfterMessages,
          avatarEmoji: form.avatarEmoji,
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      toast.success('Zmiany zapisane');
    } catch {
      toast.error('Nie udało się zapisać zmian');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setForm(initial);

  return (
    <div className="max-w-5xl">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
              activeTab === id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'profil' && <TabProfil form={form} setForm={setForm} />}
        {activeTab === 'wyglad' && <TabWyglad form={form} setForm={setForm} />}
        {activeTab === 'domeny' && <TabDomeny form={form} setForm={setForm} />}
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleCancel}
          disabled={!isDirty || saving}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-default"
        >
          Anuluj
        </button>
        <button
          onClick={() => void handleSave()}
          disabled={!isDirty || saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 cursor-pointer disabled:cursor-default"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Zapisywanie…' : 'Zapisz zmiany'}
        </button>
      </div>
    </div>
  );
}
