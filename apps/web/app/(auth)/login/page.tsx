'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

const BENEFITS = [
  'Bot odpowiada za Ciebie 24/7 — nawet o 22:00',
  'Zbiera leady automatycznie — imię + telefon klienta',
  'Wdrożenie w 15 minut — zero programowania',
];

function AuthLeftPanel({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div
      className="flex flex-col justify-between px-6 py-8 lg:px-12 lg:py-10 order-2 lg:order-1"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 80%, #6366F1 100%)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/BotikoLogo.png"
          alt="Botiko"
          width={36}
          height={36}
          className="rounded-xl"
        />
        <span className="text-white font-bold text-xl">
          Botiko<span className="text-indigo-300">.pl</span>
        </span>
      </Link>

      {/* Center content */}
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-2">{headline}</h2>
        <p className="text-indigo-200 text-base mb-10">{sub}</p>

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

      {/* Trust bar */}
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') ?? '/dashboard/overview';
  const redirectTo =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/dashboard/overview';
  const registered = searchParams.get('registered') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Nieprawidłowy email lub hasło');
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-sm mx-auto px-6 lg:px-0 py-12 lg:py-0 min-h-screen lg:min-h-0">
      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
        <Image src="/BotikoLogo.png" alt="Botiko" width={32} height={32} className="rounded-lg" />
        <span className="font-bold text-lg text-slate-900">Botiko<span className="text-brand">.pl</span></span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Zaloguj się</h1>
        <p className="text-slate-500 text-sm mt-1">Wróć do swojego panelu</p>
      </div>

      {registered && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          Konto zostało utworzone. Możesz się teraz zalogować.
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="twoj@email.pl"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Hasło</label>
            <Link href="/forgot-password" className="text-xs text-brand hover:text-brand-dark transition-colors">
              Nie pamiętam hasła
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
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
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Nie masz konta?{' '}
        <Link href="/rejestracja" className="text-brand hover:text-brand-dark font-semibold transition-colors">
          Zarejestruj się za darmo
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col lg:grid lg:grid-cols-[45%_55%]">
      <div className="flex items-center justify-center bg-white order-1 lg:order-2">
        <Suspense fallback={
          <div className="w-full max-w-sm mx-auto px-6 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
      <AuthLeftPanel
        headline="Witaj z powrotem"
        sub="Zaloguj się i sprawdź co dziś przyniósł Twój bot."
      />
    </main>
  );
}
