import { z } from 'zod';

const selectedContactSchema = z.object({
  phone: z.string().max(60).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
  address: z.string().max(400).nullable().optional(),
  selected: z.boolean(),
});

const selectedServiceSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(600).nullable().optional(),
  price: z.string().max(100).nullable().optional(),
  selected: z.boolean(),
});

const selectedFaqSchema = z.object({
  question: z.string().min(5).max(400),
  answer: z.string().min(5).max(1500),
  selected: z.boolean(),
});

const selectedPriceSchema = z.object({
  item: z.string().min(2).max(150),
  price: z.string().min(1).max(100),
  selected: z.boolean(),
});

export const confirmImportSchema = z.object({
  contact: selectedContactSchema.nullable().optional(),
  services: z.array(selectedServiceSchema).max(20).default([]),
  faq: z.array(selectedFaqSchema).max(15).default([]),
  hours: z
    .object({
      raw: z.string().max(600).nullable().optional(),
      selected: z.boolean(),
    })
    .nullable()
    .optional(),
  about: z
    .object({ text: z.string().max(2000), selected: z.boolean() })
    .nullable()
    .optional(),
  prices: z.array(selectedPriceSchema).max(30).default([]),
});

export type ConfirmImportDto = z.infer<typeof confirmImportSchema>;
