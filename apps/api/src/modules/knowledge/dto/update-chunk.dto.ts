import { z } from 'zod';

export const updateChunkSchema = z.object({
  content: z
    .string()
    .min(10, 'Treść musi mieć minimum 10 znaków')
    .max(4000, 'Treść jest zbyt długa (maks. 4000 znaków)')
    .trim(),
  category: z.string().max(50, 'Kategoria jest zbyt długa').trim().optional(),
});

export type UpdateChunkDto = z.infer<typeof updateChunkSchema>;
