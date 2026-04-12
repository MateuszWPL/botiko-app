import { z } from 'zod';

export const updateChunkSchema = z.object({
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(4000, 'Content is too long (max 4000 characters)')
    .trim(),
  category: z.string().max(50, 'Category is too long').trim().optional(),
});

export type UpdateChunkDto = z.infer<typeof updateChunkSchema>;
