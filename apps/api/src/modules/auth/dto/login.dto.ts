import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email').toLowerCase(),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export type LoginDto = z.infer<typeof loginSchema>;
