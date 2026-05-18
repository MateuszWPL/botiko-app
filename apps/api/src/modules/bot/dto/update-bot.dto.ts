import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  start: z.number().int().min(0).max(23),
  end: z.number().int().min(0).max(24), // 24 = "open all day" flag
});

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
      .max(5, 'Maximum 5 domains allowed per bot')
      .optional(),
    isActive: z.boolean().optional(),
    offlineMessage: z.string().max(300).nullable().optional(),
    businessHoursStart: z.number().int().min(0).max(23).nullable().optional(),
    businessHoursEnd: z.number().int().min(0).max(23).nullable().optional(),
    businessDays: z.array(z.number().int().min(0).max(6)).optional(),
    businessSchedule: z
      .array(dayScheduleSchema)
      .length(7)
      .optional()
      .nullable(),
    personality: z.string().max(1000).trim().optional().nullable(),
    companyName: z.string().max(100).trim().optional().nullable(),
    companyPhone: z.string().max(30).trim().optional().nullable(),
    companyAddress: z.string().max(200).trim().optional().nullable(),
    suggestedQuestions: z
      .array(z.string().min(1).max(100).trim())
      .max(5, 'Maximum 5 suggested questions')
      .optional(),
    leadFormAfterMessages: z.number().int().min(1).max(20).optional(),
    avatarEmoji: z.string().max(2048).optional(),
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
