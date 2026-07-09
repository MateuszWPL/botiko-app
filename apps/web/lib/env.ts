/**
 * Client-side env validation for apps/web.
 * Only NEXT_PUBLIC_* variables, these are safe to expose in the browser.
 * Must use literal property access (not bracket notation) so Next.js can
 * statically inline the values at build time.
 */

function require(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to apps/web/.env.local and fill in the values.`,
    );
  }
  return value;
}

export const webEnv = {
  SUPABASE_URL: require(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: require(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  WIDGET_URL: process.env.NEXT_PUBLIC_WIDGET_URL ?? 'http://localhost:5173',
} as const;
