import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const createBotSchema = z.object({
  name: z
    .string()
    .min(2, 'Nazwa bota musi mieć minimum 2 znaki')
    .max(50, 'Nazwa bota jest zbyt długa')
    .trim(),
  welcomeMsg: z
    .string()
    .min(2, 'Wiadomość powitalna musi mieć minimum 2 znaki')
    .max(500, 'Wiadomość powitalna jest zbyt długa')
    .trim(),
  primaryColor: z
    .string()
    .regex(hexColorRegex, 'Kolor musi być poprawnym kodem hex (np. #6366F1)')
    .default('#6366F1'),
  allowedDomains: z
    .array(z.string().url('Każda domena musi być poprawnym adresem URL'))
    .max(5, 'Bot może mieć maksymalnie 5 dozwolonych domen')
    .default([]),
  companyName: z.string().max(200).trim().nullable().optional(),
  companyPhone: z.string().max(50).trim().nullable().optional(),
  companyAddress: z.string().max(500).trim().nullable().optional(),
});

export type CreateBotDto = z.infer<typeof createBotSchema>;
