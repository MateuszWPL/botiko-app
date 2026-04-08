import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name is too long')
    .trim(),
  industry: z.enum(['BEAUTY', 'HEALTH', 'FOOD', 'AUTO', 'OTHER']),
});

export type RegisterDto = z.infer<typeof registerSchema>;
