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
  email: z.string().email('Nieprawidłowy adres email').toLowerCase(),
  // Reguła hasła musi być identyczna z frontendem (apps/web/lib/password.ts):
  // 12 znaków + cyfra + znak specjalny. Brak wspólnego pakietu — celowa duplikacja.
  password: z
    .string()
    .min(12, 'Hasło musi mieć minimum 12 znaków')
    .max(72, 'Hasło jest zbyt długie')
    .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
      'Hasło musi zawierać co najmniej jeden znak specjalny',
    ),
  websiteUrl: websiteUrlSchema,
  industry: z.enum(['BEAUTY', 'HEALTH', 'FOOD', 'AUTO', 'OTHER']),
});

export type RegisterDto = z.infer<typeof registerSchema>;
