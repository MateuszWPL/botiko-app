import { z } from 'zod';

export const createContactSchema = z.object({
  topic: z.enum(['DEMO', 'WDROZENIE', 'CENNIK', 'WSPOLPRACA', 'INNE']),
  message: z
    .string()
    .trim()
    .min(10, 'Wiadomość musi mieć minimum 10 znaków')
    .max(4000, 'Wiadomość jest zbyt długa (maks. 4000 znaków)'),
  name: z
    .string()
    .trim()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(80, 'Imię jest zbyt długie'),
  email: z
    .string()
    .trim()
    .email('Nieprawidłowy adres email')
    .max(254, 'Adres email jest zbyt długi'),
  company: z.string().trim().max(120, 'Nazwa firmy jest zbyt długa').optional(),
  website: z
    .string()
    .trim()
    .url('Podaj prawidłowy adres strony WWW')
    .max(2048, 'Adres strony jest zbyt długi')
    .optional(),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
