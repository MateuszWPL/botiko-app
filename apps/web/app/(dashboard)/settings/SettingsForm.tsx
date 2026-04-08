'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase';

interface Bot {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function SettingsForm({ bot }: { bot: Bot }) {
  const [form, setForm] = useState({
    name: bot.name,
    welcomeMsg: bot.welcomeMsg,
    primaryColor: bot.primaryColor,
    allowedDomains: bot.allowedDomains.join('\n'),
    isActive: bot.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
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
          allowedDomains: form.allowedDomains
            .split('\n')
            .map((d) => d.trim())
            .filter(Boolean),
          isActive: form.isActive,
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Nie udało się zapisać zmian');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nazwa asystentki
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Wiadomość powitalna
        </label>
        <input
          type="text"
          value={form.welcomeMsg}
          onChange={(e) => setForm((f) => ({ ...f, welcomeMsg: e.target.value }))}
          maxLength={200}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Kolor główny
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={form.primaryColor}
            onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
            className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
          />
          <input
            type="text"
            value={form.primaryColor}
            onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
            className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Dozwolone domeny
          <span className="text-slate-400 font-normal ml-1">(jedna per linia, np. https://twoja-strona.pl)</span>
        </label>
        <textarea
          value={form.allowedDomains}
          onChange={(e) => setForm((f) => ({ ...f, allowedDomains: e.target.value }))}
          rows={4}
          placeholder="https://twoja-strona.pl&#10;https://www.twoja-strona.pl"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          Pozostaw puste aby zezwolić na wszystkie domeny (tylko na czas testów)
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
          Asystentka aktywna
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 py-2 rounded-lg">
          ✓ Zmiany zapisane
        </div>
      )}

      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
      >
        {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </button>
    </div>
  );
}
