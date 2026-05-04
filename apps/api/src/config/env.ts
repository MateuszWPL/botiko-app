import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // OpenAI (required for AI features — set before using chat)
  OPENAI_API_KEY: z.string().min(1).optional(),

  // Security
  JWT_SECRET: z.string().min(32),
  // Must be exactly 64 hex chars (32 bytes) — generate with:
  // node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ENCRYPTION_KEY: z
    .string()
    .regex(
      /^[0-9a-fA-F]{64}$/,
      'ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
    ),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Email (Resend) — optional, notifications disabled when absent
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().default('powiadomienia@botiko.pl'),

  // Stripe — optional, billing disabled when absent
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_ID: z.string().min(1).optional(),
  // PRO plan price — add when launching PRO tier
  STRIPE_PRO_PRICE_ID: z.string().min(1).optional(),

  // App — required; no localhost defaults so production misconfiguration fails loudly
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  WIDGET_URL: z.string().url(),

  // Cron — secret key for internal scheduled endpoints (trial notifications etc.)
  CRON_SECRET: z.string().min(16).optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:',
      result.error.flatten().fieldErrors,
    );
    process.exit(1);
  }

  // Production hard-requirements.
  // DomainWhitelistGuard relaxes checks when NODE_ENV !== 'production'
  // (allows empty Origin header, allows bots with no allowedDomains).
  // If NODE_ENV is silently defaulted to 'development' on a live deploy,
  // those security checks are effectively disabled. Fail loudly instead.
  if (result.data.NODE_ENV === 'production') {
    const localhostUrls = ['APP_URL', 'API_URL', 'WIDGET_URL'] as const;
    const bad = localhostUrls.filter((key) =>
      /localhost|127\.0\.0\.1/.test(result.data[key]),
    );
    if (bad.length > 0) {
      console.error(
        `❌ Production misconfiguration: ${bad.join(', ')} point to localhost. Set real URLs in your hosting env.`,
      );
      process.exit(1);
    }

    if (!result.data.STRIPE_SECRET_KEY ||
        !result.data.STRIPE_WEBHOOK_SECRET ||
        !result.data.STRIPE_PRICE_ID) {
      console.warn(
        '⚠️  NODE_ENV=production but Stripe env vars are incomplete — billing endpoints will fail.',
      );
    }

    if (process.env.DEV_ALLOW_LOCALHOST === 'true') {
      console.error(
        '❌ DEV_ALLOW_LOCALHOST=true must NOT be set in production — it opens SSRF to cloud metadata endpoints.',
      );
      process.exit(1);
    }
  }

  return result.data;
}

export const env = validateEnv();
