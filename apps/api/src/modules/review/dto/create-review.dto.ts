import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int('Ocena musi być liczbą całkowitą')
    .min(1, 'Minimalna ocena to 1')
    .max(5, 'Maksymalna ocena to 5'),
  message: z.string().trim().max(500, 'Wiadomość jest zbyt długa').optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
