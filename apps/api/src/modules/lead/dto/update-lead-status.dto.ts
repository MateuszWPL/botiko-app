import { z } from 'zod';

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'LOST']),
});

export type UpdateLeadStatusDto = z.infer<typeof updateLeadStatusSchema>;
