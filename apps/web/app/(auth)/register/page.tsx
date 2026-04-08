'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INDUSTRIES = [
  { value: 'BEAUTY', label: 'Salon urody / kosmetyka' },
  { value: 'HEALTH', label: 'Gabinet medyczny / SPA' },
  { value: 'FOOD', label: 'Restauracja / catering' },
  { value: 'AUTO', label: 'Motoryzacja / warsztat' },
  { value: 'OTHER', label: 'Inna branża' },
] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    companyName: '',
    industry: 'BEAUTY' as string,
  });
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

      const data = (await res.json()) as { message?: string; statusCode?: number };

      if (!res.ok) {
        setError(
          res.status === 409
            ? 'Konto z tym adresem email już istnieje'
            : 'Rejestracja nie powiodła się. Spróbuj ponownie.',
        );
        return;
      }

      // After successful registration, redirect to login with success message
      router.push('/login?registered=1');
    } catch {
      setError('Błąd połączenia. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Utwórz konto</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Zacznij zbierać leady z Twoich klientów
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nazwa firmy
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                required
                minLength={2}
                placeholder="Salon Piękności Ania"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Branża
              </label>
              <select
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
                placeholder="twoj@email.pl"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hasło
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="min. 8 znaków"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
            >
              {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Masz już konto?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
