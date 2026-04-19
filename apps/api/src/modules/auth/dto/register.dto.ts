import { z } from 'zod';

// Accepts "example.pl", "www.example.pl", or a full URL. Normalizes to
// `https://<hostname>` so it can be dropped straight into Bot.allowedDomains,
// which DomainWhitelistGuard parses with `new URL(...).hostname`.
const websiteUrlSchema = z
  .string()
  .trim()
  .min(4, 'Podaj adres strony WWW')
  .max(253, 'Adres strony jest zbyt długi')
  .transform((raw, ctx) => {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let url: URL;
    try {
      url = new URL(withProtocol);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Podaj poprawny adres strony (np. salonbeauty.pl)',
      });
      return z.NEVER;
    }
    const host = url.hostname.toLowerCase();
    if (!host.includes('.') || host === 'localhost') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Podaj poprawny adres strony (np. salonbeauty.pl)',
      });
      return z.NEVER;
    }
    return `https://${host}`;
  });

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(72, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  websiteUrl: websiteUrlSchema,
  industry: z.enum(['BEAUTY', 'HEALTH', 'FOOD', 'AUTO', 'OTHER']),
});

export type RegisterDto = z.infer<typeof registerSchema>;
