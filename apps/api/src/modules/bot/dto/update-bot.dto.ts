import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  start: z.number().int().min(0).max(23),
  end: z.number().int().min(0).max(24), // 24 = "open all day" flag
});

// http(s)-only URL (or empty string to clear). Rejects javascript:/data: schemes
// that Zod's .url() would otherwise accept — defence-in-depth for anywhere these
// links get rendered as an <a href> (widget map/reservation cards).
const httpUrl = (max: number, msg: string) =>
  z
    .string()
    .trim()
    .max(max)
    .url(msg)
    .refine(
      (v) => /^https?:\/\//i.test(v),
      'Link musi zaczynać się od http:// lub https://',
    )
    .or(z.literal(''))
    .nullable()
    .optional();

export const updateBotSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nazwa bota musi mieć minimum 2 znaki')
      .max(50, 'Nazwa bota jest zbyt długa')
      .trim()
      .optional(),
    // Limity spójne z create-bot.dto.ts — edycja nie może odrzucać
    // danych, które przeszły przy tworzeniu bota.
    welcomeMsg: z
      .string()
      .min(2, 'Wiadomość powitalna musi mieć minimum 2 znaki')
      .max(500, 'Wiadomość powitalna jest zbyt długa')
      .trim()
      .optional(),
    primaryColor: z
      .string()
      .regex(hexColorRegex, 'Kolor musi być poprawnym kodem hex')
      .optional(),
    allowedDomains: z
      .array(z.string().url('Każda domena musi być poprawnym adresem URL'))
      .max(5, 'Bot może mieć maksymalnie 5 dozwolonych domen')
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
    companyName: z.string().max(200).trim().optional().nullable(),
    companyPhone: z.string().max(50).trim().optional().nullable(),
    companyAddress: z.string().max(500).trim().optional().nullable(),
    companyEmail: z
      .string()
      .trim()
      .max(200)
      .email('Podaj poprawny adres e-mail')
      .or(z.literal(''))
      .nullable()
      .optional(),
    nip: z.string().max(20).trim().optional().nullable(),
    owner: z.string().max(200).trim().optional().nullable(),
    websiteUrl: httpUrl(500, 'Podaj poprawny link (z https://)'),
    googleMapsUrl: httpUrl(1000, 'Podaj poprawny link do Google Maps'),
    reservationUrl: httpUrl(500, 'Podaj poprawny link do rezerwacji'),
    suggestedQuestions: z
      .array(z.string().min(1).max(100).trim())
      .max(5, 'Maksymalnie 5 sugerowanych pytań')
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
      message: 'Godzina otwarcia musi być wcześniejsza niż godzina zamknięcia',
      path: ['businessHoursStart'],
    },
  );

export type UpdateBotDto = z.infer<typeof updateBotSchema>;
