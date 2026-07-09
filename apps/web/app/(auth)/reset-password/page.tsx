'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';
import { AuthLeftPanel } from '../../../components/auth/AuthLeftPanel';
import { PasswordRequirements } from '../../../components/auth/PasswordRequirements';
import { isPasswordValid } from '../../../lib/password';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid(password)) {
      setError('Hasło nie spełnia wymagań bezpieczeństwa');
      return;
    }
    if (password !== confirm) {
      setError('Hasła nie są takie same');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError('Nie udało się zmienić hasła. Link mógł wygasnąć, wyślij nowy.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard/overview'), 2500);
  };

  return (
    <main className="min-h-screen flex flex-col lg:grid lg:grid-cols-[45%_55%]">
      <div className="flex items-center justify-center bg-white order-1 lg:order-2">
        <div className="flex flex-col justify-center w-full max-w-sm mx-auto px-6 lg:px-0 py-12 lg:py-0 min-h-screen lg:min-h-0">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src="/botiko-logo-full.svg" alt="Botiko.pl" width={120} height={32} />
          </Link>

          {success ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Hasło zmienione</h1>
              <p className="text-slate-500 text-sm">Za chwilę przeniesiemy Cię do dashboardu.</p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Nowe hasło</h1>
                <p className="text-slate-500 text-sm mt-1">Ustaw nowe hasło do swojego konta</p>
              </div>

              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nowe hasło</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="min. 12 znaków"
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
                  <PasswordRequirements password={password} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Powtórz hasło</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
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
                  {loading ? 'Zapisuję...' : 'Ustaw nowe hasło'}
                </button>

                <Link
                  href="/forgot-password"
                  className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Wyślij nowy link reset
                </Link>
              </form>
            </>
          )}
        </div>
      </div>

      <AuthLeftPanel
        headline="Bezpieczeństwo przede wszystkim"
        sub="Ustaw silne hasło. Twój panel i dane klientów będą bezpieczne."
        badge="14 dni za darmo, bez karty"
      />
    </main>
  );
}
