'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INDUSTRIES = [
  {
    value: 'BEAUTY',
    label: 'Salon urody',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FCE7F3',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V4a1 1 0 0 0-1-1H6z"/>
        <path d="M8 10v10M16 10v10M8 20h8"/>
        <path d="M12 3v1"/>
      </svg>
    ),
  },
  {
    value: 'HEALTH',
    label: 'Gabinet / SPA',
    color: '#06B6D4',
    bg: '#ECFEFF',
    border: '#CFFAFE',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    value: 'FOOD',
    label: 'Restauracja',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FED7AA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
  {
    value: 'AUTO',
    label: 'Motoryzacja',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    value: 'OTHER',
    label: 'Inna branża',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#EDE9FE',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const BENEFITS = [
  'Bot AI gotowy w 15 minut — zero programowania',
  'Zbiera leady kiedy śpisz — imię + telefon + pytanie',
  '14 dni za darmo, bez karty kredytowej',
];

function AuthLeftPanel() {
  return (
    <div
      className="flex flex-col justify-between px-6 py-8 lg:px-12 lg:py-10 order-2 lg:order-1"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 80%, #6366F1 100%)',
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-base">
          B
        </span>
        <span className="text-white font-bold text-xl">
          Botiko<span className="text-indigo-300">.pl</span>
        </span>
      </Link>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#a5b4fc' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          14 dni za darmo — bez karty
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2">
          Zacznij zbierać leady
        </h2>
        <p className="text-indigo-200 text-base mb-10">
          Dołącz do programu pilotażowego i zacznij zbierać leady po godzinach.
        </p>

        <ul className="flex flex-col gap-4">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-indigo-100 text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-6 pt-8 border-t border-white/10">
        {[
          { val: 'Pilot', label: 'pierwsze wdrożenia' },
          { val: '24/7', label: 'dostępny bot' },
          { val: '< 15 min', label: 'wdrożenie' },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-white text-lg font-extrabold">{s.val}</p>
            <p className="text-indigo-300 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    companyName: '',
    industry: 'BEAUTY',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError(
          res.status === 409
            ? 'Konto z tym adresem email już istnieje'
            : 'Rejestracja nie powiodła się. Spróbuj ponownie.',
        );
        return;
      }

      router.push('/login?registered=1');
    } catch {
      setError('Błąd połączenia. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:grid lg:grid-cols-[45%_55%]">
      <div className="flex items-center justify-center bg-white order-1 lg:order-2">
        <div className="flex flex-col justify-center w-full max-w-sm mx-auto px-6 lg:px-0 py-12 lg:py-0 min-h-0">

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Utwórz konto</h1>
            <p className="text-slate-500 text-sm mt-1">Zacznij za darmo — 14 dni bez karty kredytowej</p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nazwa firmy</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                required
                minLength={2}
                placeholder="Salon Piękności Ania"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branża</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDUSTRIES.map((ind) => {
                  const selected = form.industry === ind.value;
                  return (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, industry: ind.value }))}
                      className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer"
                      style={
                        selected
                          ? { background: ind.bg, borderColor: ind.color, color: ind.color }
                          : { background: '#F8FAFC', borderColor: '#E2E8F0', color: '#475569' }
                      }
                    >
                      <span style={{ color: selected ? ind.color : '#94A3B8' }}>
                        {ind.icon}
                      </span>
                      {ind.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
                placeholder="twoj@email.pl"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hasło</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="min. 12 znaków, wielka litera, cyfra"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Min. 12 znaków, wielka litera i cyfra</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark disabled:opacity-60 transition-colors mt-2"
            >
              {loading ? 'Tworzenie konta...' : 'Utwórz konto — zacznij za darmo'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            Rejestrując się, akceptujesz{' '}
            <Link href="/regulamin" className="text-brand hover:underline">Regulamin</Link>
            {' '}i{' '}
            <Link href="/prywatnosc" className="text-brand hover:underline">Politykę prywatności</Link>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-5">
            Masz już konto?{' '}
            <Link href="/login" className="text-brand hover:text-brand-dark font-semibold transition-colors">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
      <AuthLeftPanel />
    </main>
  );
}
