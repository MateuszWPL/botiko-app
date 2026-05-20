import { z } from 'zod';
import { phoneSchema } from './create-lead.dto';

export const createLeadManualSchema = z.object({
  name: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(100, 'Imię jest zbyt długie')
    .trim(),
  phone: phoneSchema,
  message: z.string().max(500, 'Wiadomość jest zbyt długa').trim().optional(),
});

export type CreateLeadManualDto = z.infer<typeof createLeadManualSchema>;
