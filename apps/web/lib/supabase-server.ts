import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { webEnv } from './env';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    webEnv.SUPABASE_URL,
    webEnv.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
