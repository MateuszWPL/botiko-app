import { z } from 'zod';

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Token odświeżania jest wymagany'),
});

export type RefreshDto = z.infer<typeof refreshSchema>;
