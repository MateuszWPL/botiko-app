import { z } from 'zod';

export const createLeadManualSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  phone: z.string().min(6).max(30).trim(),
  message: z.string().max(500).trim().optional(),
});

export type CreateLeadManualDto = z.infer<typeof createLeadManualSchema>;
