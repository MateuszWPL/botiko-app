import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const updateBotSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Bot name must be at least 2 characters')
      .max(50, 'Bot name is too long')
      .trim()
      .optional(),
    welcomeMsg: z
      .string()
      .min(10, 'Welcome message must be at least 10 characters')
      .max(500, 'Welcome message is too long')
      .trim()
      .optional(),
    primaryColor: z
      .string()
      .regex(hexColorRegex, 'Primary color must be a valid hex color')
      .optional(),
    allowedDomains: z
      .array(z.string().url('Each domain must be a valid URL'))
      .max(1, 'Only one domain allowed per bot')
      .optional(),
    isActive: z.boolean().optional(),
    offlineMessage: z.string().max(300).nullable().optional(),
    businessHoursStart: z.number().int().min(0).max(23).nullable().optional(),
    businessHoursEnd: z.number().int().min(0).max(23).nullable().optional(),
    businessDays: z.array(z.number().int().min(0).max(6)).optional(),
  })
  .refine(
    (data) => {
      if (data.businessHoursStart != null && data.businessHoursEnd != null) {
        return data.businessHoursStart < data.businessHoursEnd;
      }
      return true;
    },
    {
      message: 'businessHoursStart must be earlier than businessHoursEnd',
      path: ['businessHoursStart'],
    },
  );

export type UpdateBotDto = z.infer<typeof updateBotSchema>;
