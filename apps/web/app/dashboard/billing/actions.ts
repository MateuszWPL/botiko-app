'use server';

import { createServerSupabaseClient } from '../../../lib/supabase-server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getAuthToken(): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function createCheckoutAction(): Promise<{ url?: string; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { error: 'Nie jesteś zalogowany' };

  try {
    const res = await fetch(`${API_URL}/api/v1/billing/checkout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!res.ok) return { error: 'Nie udało się otworzyć strony płatności' };
    const data = (await res.json()) as { url?: string };
    return { url: data.url };
  } catch {
    return { error: 'Błąd połączenia z serwerem' };
  }
}

export async function createPortalAction(): Promise<{ url?: string; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { error: 'Nie jesteś zalogowany' };

  try {
    const res = await fetch(`${API_URL}/api/v1/billing/portal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!res.ok) return { error: 'Nie udało się otworzyć portalu płatności' };
    const data = (await res.json()) as { url?: string };
    return { url: data.url };
  } catch {
    return { error: 'Błąd połączenia z serwerem' };
  }
}
