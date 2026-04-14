import { z } from 'zod';

export const createContactSchema = z.object({
  topic: z.enum(['DEMO', 'WDROZENIE', 'CENNIK', 'WSPOLPRACA', 'INNE']),
  message: z.string().trim().min(10).max(4000),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional(),
  website: z.string().trim().url().max(2048).optional(),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
