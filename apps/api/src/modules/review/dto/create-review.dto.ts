import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().max(500).optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
