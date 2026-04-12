'use client';

import { useState } from 'react';
import { Loader2, Save, Power, Bot, Palette, Globe } from 'lucide-react';
import { toast } from 'sonner';
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

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60';

export function SettingsForm({ bot }: { bot: Bot }) {
  const [form, setForm] = useState({
    name: bot.name,
    welcomeMsg: bot.welcomeMsg,
    primaryColor: bot.primaryColor,
    allowedDomain: bot.allowedDomains[0] ?? '',
    isActive: bot.isActive,
  });
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 max-w-2xl shadow-sm space-y-8">

      {/* Section: Asystentka */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Asystentka</h3>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nazwa bota</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Wiadomość powitalna
            </label>
            <input
              type="text"
              value={form.welcomeMsg}
              onChange={(e) => setForm((f) => ({ ...f, welcomeMsg: e.target.value }))}
              maxLength={200}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Section: Wygląd */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Wygląd</h3>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kolor główny</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white"
            />
            <input
              type="text"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="w-32 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-shadow bg-white/60"
            />
            {/* Live preview */}
            <div className="flex items-end gap-2 ml-2">
              <div className="flex flex-col items-end gap-1">
                <div
                  className="px-3 py-1.5 rounded-2xl rounded-br-sm text-xs text-white font-medium shadow-sm"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  Dzień dobry!
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                style={{ backgroundColor: form.primaryColor }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Kolor przycisku czatu i wiadomości bota w widgecie
          </p>
        </div>
      </div>

      {/* Section: Domena */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Domena strony</h3>
        </div>
        <div>
          <input
            type="url"
            value={form.allowedDomain}
            onChange={(e) => setForm((f) => ({ ...f, allowedDomain: e.target.value }))}
            placeholder="https://twoja-strona.pl"
            className={inputClass}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Adres strony, na której działa bot. www i bez www są traktowane tak samo.
            Pozostaw puste tylko na czas testów lokalnych.
          </p>
        </div>
      </div>

      {/* Section: Aktywność */}
      <div>
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${form.isActive ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Power className={`w-3.5 h-3.5 ${form.isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Aktywność</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <div>
            <p className="text-sm font-semibold text-slate-700">Bot aktywny</p>
            <p className="text-xs text-slate-400">
              {form.isActive ? 'Bot odpowiada na wiadomości' : 'Bot nie odpowiada'}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={form.isActive}
            onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
              form.isActive ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                form.isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 disabled:hover:translate-y-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </button>
    </div>
  );
}
