import { z } from 'zod';

// Numer telefonu — jedna reguła spójna z create-lead-manual.dto.ts oraz
// z walidacją widgetu (apps/widget): polski numer to co najmniej 9 cyfr.
export const phoneSchema = z
  .string()
  .trim()
  .min(9, 'Numer telefonu jest zbyt krótki')
  .max(20, 'Numer telefonu jest zbyt długi')
  .regex(/^\+?[\d\s\-()]+$/, 'Nieprawidłowy format numeru telefonu')
  .refine(
    (v) => (v.match(/\d/g) ?? []).length >= 9,
    'Numer telefonu musi zawierać co najmniej 9 cyfr',
  );

export const createLeadSchema = z.object({
  botId: z.string().cuid('Nieprawidłowy identyfikator bota'),
  sessionId: z.string().max(128).optional(),
  name: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(100, 'Imię jest zbyt długie')
    .trim(),
  phone: phoneSchema,
  message: z.string().max(1000, 'Wiadomość jest zbyt długa').trim().optional(),
  consentGiven: z.literal(true, {
    error: 'Zgoda RODO jest wymagana',
  }),
});

export type CreateLeadDto = z.infer<typeof createLeadSchema>;
