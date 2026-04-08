'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Always show success to avoid email enumeration
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Reset hasła</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Wyślemy link do resetowania hasła
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <p className="text-slate-700 font-medium">
                Sprawdź swoją skrzynkę
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Jeśli konto z tym adresem istnieje, wysłaliśmy link do resetowania hasła.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                ← Wróć do logowania
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="twoj@email.pl"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
              >
                {loading ? 'Wysyłanie...' : 'Wyślij link do resetu'}
              </button>

              <Link
                href="/login"
                className="block text-center text-sm text-slate-500 hover:text-slate-700"
              >
                ← Wróć do logowania
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
