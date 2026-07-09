import { z } from 'zod';

/**
 * Body for the public POST /api/v1/bot/pair endpoint, called by the official
 * WordPress plugin to redeem a one-click pairing token.
 */
export const redeemPairingSchema = z.object({
  // `botiko_pair_<hex>`: letters, digits, underscores only.
  token: z
    .string()
    .min(12)
    .max(128)
    .regex(/^[A-Za-z0-9_]+$/, 'Nieprawidłowy kod połączenia'),
  // The pairing site's origin (scheme://host[:port]). Must be a real http(s)
  // URL with a non-empty host: rejects `mailto:`, `data:`, `https://` etc.
  // so a degenerate entry can't waste one of the 5 allowed-domain slots.
  domain: z
    .string()
    .max(255)
    .url()
    .refine(
      (u) => {
        try {
          const parsed = new URL(u);
          return (
            (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
            parsed.hostname.length > 0
          );
        } catch {
          return false;
        }
      },
      { message: 'Nieprawidłowy adres strony' },
    ),
});

export type RedeemPairingDto = z.infer<typeof redeemPairingSchema>;
