import { createBrowserClient } from '@supabase/ssr';
import { webEnv } from './env';

export function createClient() {
  return createBrowserClient(webEnv.SUPABASE_URL, webEnv.SUPABASE_ANON_KEY);
}
