import { z } from 'zod';

export const createLeadSchema = z.object({
  botId: z.string().cuid('botId must be a valid CUID'),
  sessionId: z.string().max(128).optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .trim(),
  message: z.string().max(1000, 'Message is too long').trim().optional(),
  consentGiven: z.literal(true, {
    error: 'RODO consent is required',
  }),
});

export type CreateLeadDto = z.infer<typeof createLeadSchema>;
