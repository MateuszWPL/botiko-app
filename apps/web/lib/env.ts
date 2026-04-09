/**
 * Client-side env validation for apps/web.
 * Only NEXT_PUBLIC_* variables — these are safe to expose in the browser.
 * Throws at module load time so misconfiguration is caught early.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to apps/web/.env.local and fill in the values.`,
    );
  }
  return value;
}

export const webEnv = {
  SUPABASE_URL: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  WIDGET_URL: process.env.NEXT_PUBLIC_WIDGET_URL ?? 'http://localhost:5173',
} as const;
