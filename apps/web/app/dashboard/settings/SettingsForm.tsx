'use client';

import { useState, useMemo } from 'react';
import { Loader2, Save, Power, Bot, Palette, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase';

interface Bot {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
}

const DAY_LABELS = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60';

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm">
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  activeColor,
}: {
  checked: boolean;
  onChange: () => void;
  activeColor: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
        checked ? activeColor : 'bg-slate-200'
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

export function SettingsForm({ bot }: { bot: Bot }) {
  const initial = useMemo(() => ({
    name: bot.name,
    welcomeMsg: bot.welcomeMsg,
    primaryColor: bot.primaryColor,
    allowedDomain: bot.allowedDomains[0] ?? '',
    isActive: bot.isActive,
    hoursEnabled: bot.businessHoursStart !== null,
    businessHoursStart: bot.businessHoursStart ?? 9,
    businessHoursEnd: bot.businessHoursEnd ?? 18,
    businessDays: (bot.businessDays ?? []).length > 0 ? bot.businessDays : [1, 2, 3, 4, 5],
    offlineMessage: bot.offlineMessage ?? '',
  }), [bot]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
          allowedDomains: form.allowedDomain.trim() ? [form.allowedDomain.trim()] : [],
          isActive: form.isActive,
          offlineMessage:
            form.hoursEnabled && form.offlineMessage.trim() ? form.offlineMessage.trim() : null,
          businessHoursStart: form.hoursEnabled ? form.businessHoursStart : null,
          businessHoursEnd: form.hoursEnabled ? form.businessHoursEnd : null,
          businessDays: form.hoursEnabled ? form.businessDays : [],
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      toast.success('Zmiany zapisane');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Nie udało się zapisać zmian');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">

      {/* Sticky save bar — collapsed when no unsaved changes */}
      <div className={`sticky top-0 z-10 overflow-hidden transition-all duration-200 ${
        isDirty ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm border border-amber-200 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm shadow-amber-100">
          <p className="text-sm text-amber-700 font-medium">Masz niezapisane zmiany</p>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-indigo-200"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Zapisywanie…' : 'Zapisz zmiany'}
          </button>
        </div>
      </div>

      {/* Potwierdzenie zapisu — collapsed when not saved */}
      <div className={`overflow-hidden transition-all duration-300 ${
        saved ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Zmiany zostały zapisane</p>
        </div>
      </div>

      {/* Grid 2 kolumny na desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Asystentka */}
        <SectionCard>
          <SectionHeader icon={Bot} label="Asystentka" iconBg="bg-indigo-100" iconColor="text-indigo-600" />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nazwa bota</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Wiadomość powitalna</label>
              <input
                type="text"
                value={form.welcomeMsg}
                onChange={(e) => setForm((f) => ({ ...f, welcomeMsg: e.target.value }))}
                maxLength={200}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Pierwsza wiadomość widoczna w widgecie czatu</p>
            </div>
          </div>
        </SectionCard>

        {/* Wygląd */}
        <SectionCard>
          <SectionHeader icon={Palette} label="Wygląd" iconBg="bg-purple-100" iconColor="text-purple-600" />
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Kolor główny</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white flex-shrink-0"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                className="w-28 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60"
              />
              {/* Live preview */}
              <div className="flex items-end gap-2 ml-auto">
                <div
                  className="px-3 py-1.5 rounded-2xl rounded-br-sm text-xs text-white font-medium shadow-sm"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  Dzień dobry!
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Kolor przycisku i wiadomości bota w widgecie</p>
          </div>
        </SectionCard>

        {/* Domena */}
        <SectionCard>
          <SectionHeader icon={Globe} label="Domena strony" iconBg="bg-sky-100" iconColor="text-sky-600" />
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adres URL</label>
            <input
              type="url"
              value={form.allowedDomain}
              onChange={(e) => setForm((f) => ({ ...f, allowedDomain: e.target.value }))}
              placeholder="https://twoja-strona.pl"
              className={inputClass}
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Strona, na której osadzony jest widget. Pozostaw puste na czas testów lokalnych.
            </p>
          </div>
        </SectionCard>

        {/* Aktywność */}
        <SectionCard>
          <SectionHeader
            icon={Power}
            label="Aktywność"
            iconBg={form.isActive ? 'bg-emerald-100' : 'bg-slate-100'}
            iconColor={form.isActive ? 'text-emerald-600' : 'text-slate-400'}
          />
          <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div>
              <p className="text-sm font-semibold text-slate-700">Bot aktywny</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {form.isActive ? 'Odpowiada na wiadomości klientów' : 'Nie przyjmuje nowych rozmów'}
              </p>
            </div>
            <Toggle
              checked={form.isActive}
              onChange={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              activeColor="bg-emerald-500"
            />
          </div>
        </SectionCard>
      </div>

      {/* Godziny pracy — pełna szerokość bo może być duże */}
      <div className="mt-4">
      <SectionCard>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Godziny pracy</h3>
          </div>
          <Toggle
            checked={form.hoursEnabled}
            onChange={() => setForm((f) => ({ ...f, hoursEnabled: !f.hoursEnabled }))}
            activeColor="bg-amber-500"
          />
        </div>

        {!form.hoursEnabled ? (
          <p className="text-sm text-slate-400 italic">
            Baner godzin wyłączony — bot odpowiada 24/7 bez żadnej informacji o godzinach.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Godziny */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600">Godziny</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Od</p>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={form.businessHoursStart}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, businessHoursStart: Number(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
                <span className="text-slate-400 text-sm mt-4">—</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Do</p>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={form.businessHoursEnd}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, businessHoursEnd: Number(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Dni */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Dni robocze</label>
              <div className="flex gap-1.5 flex-wrap">
                {DAY_LABELS.map((label, idx) => {
                  const active = form.businessDays.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          businessDays: active
                            ? f.businessDays.filter((d) => d !== idx)
                            : [...f.businessDays, idx],
                        }))
                      }
                      className={`w-10 h-9 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wiadomość offline */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Wiadomość poza godzinami
              </label>
              <input
                type="text"
                value={form.offlineMessage}
                onChange={(e) => setForm((f) => ({ ...f, offlineMessage: e.target.value }))}
                placeholder="Jesteśmy zamknięci. Napisz a oddzwonimy rano!"
                maxLength={300}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">Żółty baner na górze widgetu czatu</p>
            </div>
          </div>
        )}
      </SectionCard>
      </div>

    </div>
  );
}
