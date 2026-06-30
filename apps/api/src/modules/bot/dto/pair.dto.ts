import { z } from 'zod';

/**
 * Body for the public POST /api/v1/bot/pair endpoint, called by the official
 * WordPress plugin to redeem a one-click pairing token.
 */
export const redeemPairingSchema = z.object({
  // `botiko_pair_<hex>` — letters, digits, underscores only.
  token: z
    .string()
    .min(12)
    .max(128)
    .regex(/^[A-Za-z0-9_]+$/, 'Nieprawidłowy kod połączenia'),
  // The pairing site's origin (scheme://host[:port]).
  domain: z.string().url().max(255),
});

export type RedeemPairingDto = z.infer<typeof redeemPairingSchema>;
