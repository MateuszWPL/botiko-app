'use client';

import { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Code2, Users, X } from 'lucide-react';
import { createClient } from '../../lib/supabase';

export const WELCOME_STORAGE_KEY = 'botiko_welcomed_v1';
const NEW_USER_HOURS = 48;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function WelcomeTrialModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (alreadySeen) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const createdAt = data.user?.created_at;
      if (!createdAt) return;
      const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
      if (ageHours < NEW_USER_HOURS) {
        setOpen(true);
      }
    });
  }, []);

  function dismiss() {
    localStorage.setItem(WELCOME_STORAGE_KEY, '1');
    setOpen(false);
    // Only auto-launch the setup wizard for accounts that don't have a bot yet.
    // An account with an existing bot would just hit the "1 bot per account" error.
    void (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const res = await fetch(`${API_URL}/api/v1/bot`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const bots = (await res.json()) as unknown[];
          if (bots.length > 0) return;
        }
      } catch {
        // Non-fatal — if the check fails we simply don't auto-open the wizard
        return;
      }
      window.dispatchEvent(new Event('botiko:open-wizard'));
    })();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 80px rgba(99,102,241,0.18), 0 8px 32px rgba(0,0,0,0.12)' }}
      >
        {/* Header gradient */}
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)' }}
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Witaj w Botiko!</h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            Twoje konto jest gotowe. Masz <strong className="text-indigo-600">14 dni darmowego dostępu</strong> — bez karty, bez umowy.
          </p>
        </div>

        {/* Steps */}
        <div className="px-8 py-6 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">3 kroki do działającego bota</p>

          {[
            { Icon: Users, label: 'Uzupełnij dane firmy', sub: '2 minuty', color: '#6366F1' },
            { Icon: BookOpen, label: 'Dodaj cennik i FAQ do bazy wiedzy', sub: '5 minut', color: '#10B981' },
            { Icon: Code2, label: 'Wklej kod na swoją stronę', sub: '3 minuty', color: '#0EA5E9' },
          ].map(({ Icon, label, sub, color }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}28` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-8 pb-8">
          <button
            onClick={dismiss}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Odbieram 14 dni za darmo
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">Bez karty. Anuluj kiedy chcesz.</p>
        </div>

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-200/60"
          aria-label="Zamknij"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
