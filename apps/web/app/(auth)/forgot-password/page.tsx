'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase';
import { AuthLeftPanel } from '../../../components/auth/AuthLeftPanel';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    // Always show success to avoid email enumeration
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col lg:grid lg:grid-cols-[45%_55%]">
      <div className="flex items-center justify-center bg-white order-1 lg:order-2">
        <div className="flex flex-col justify-center w-full max-w-sm mx-auto px-6 lg:px-0 py-12 lg:py-0 min-h-screen lg:min-h-0">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src="/BotikoLogo.png" alt="Botiko" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg text-slate-900">Botiko<span className="text-brand">.pl</span></span>
          </Link>

          {sent ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Sprawdź skrzynkę</h1>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Jeśli konto z tym adresem istnieje, wysłaliśmy link do zresetowania hasła.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand-dark font-semibold transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Wróć do logowania
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Reset hasła</h1>
                <p className="text-slate-500 text-sm mt-1">Wyślemy Ci link do ustawienia nowego hasła</p>
              </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark disabled:opacity-60 transition-colors mt-2"
                >
                  {loading ? 'Wysyłanie...' : 'Wyślij link do resetu'}
                </button>
              </form>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors mt-6"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Wróć do logowania
              </Link>
            </>
          )}
        </div>
      </div>

      <AuthLeftPanel
        headline="Zdarza się"
        sub="Wyślemy Ci link — nowe hasło ustawisz w kilka sekund."
        badge="14 dni za darmo — bez karty"
      />
    </main>
  );
}
