import { z } from 'zod';

export const selectedContactSchema = z.object({
  phone: z.string().max(60).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
  address: z.string().max(400).nullable().optional(),
  selected: z.boolean(),
});

export const selectedServiceSchema = z.object({
  name: z
    .string()
    .min(2, 'Nazwa usługi musi mieć minimum 2 znaki')
    .max(120, 'Nazwa usługi jest zbyt długa'),
  description: z
    .string()
    .max(600, 'Opis usługi jest zbyt długi')
    .nullable()
    .optional(),
  price: z.string().max(100, 'Cena jest zbyt długa').nullable().optional(),
  selected: z.boolean(),
});

export const selectedFaqSchema = z.object({
  question: z
    .string()
    .min(5, 'Pytanie musi mieć minimum 5 znaków')
    .max(400, 'Pytanie jest zbyt długie'),
  answer: z
    .string()
    .min(5, 'Odpowiedź musi mieć minimum 5 znaków')
    .max(1500, 'Odpowiedź jest zbyt długa'),
  selected: z.boolean(),
});

export const selectedHoursSchema = z
  .object({
    raw: z.string().max(600).nullable().optional(),
    selected: z.boolean(),
  })
  .nullable()
  .optional();

export const selectedAboutSchema = z
  .object({ text: z.string().max(2000), selected: z.boolean() })
  .nullable()
  .optional();

export const confirmImportSchema = z.object({
  contact: selectedContactSchema.nullable().optional(),
  services: z.array(selectedServiceSchema).max(20).default([]),
  faq: z.array(selectedFaqSchema).max(15).default([]),
  hours: selectedHoursSchema,
  about: selectedAboutSchema,
});

export type ConfirmImportDto = z.infer<typeof confirmImportSchema>;
