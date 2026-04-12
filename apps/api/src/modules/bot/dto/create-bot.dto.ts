import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const createBotSchema = z.object({
  name: z
    .string()
    .min(2, 'Bot name must be at least 2 characters')
    .max(50, 'Bot name is too long')
    .trim(),
  welcomeMsg: z
    .string()
    .min(2, 'Welcome message must be at least 2 characters')
    .max(500, 'Welcome message is too long')
    .trim(),
  primaryColor: z
    .string()
    .regex(
      hexColorRegex,
      'Primary color must be a valid hex color (e.g. #6366F1)',
    )
    .default('#6366F1'),
  allowedDomains: z
    .array(z.string().url('Each domain must be a valid URL'))
    .max(10, 'Maximum 10 allowed domains')
    .default([]),
});

export type CreateBotDto = z.infer<typeof createBotSchema>;
