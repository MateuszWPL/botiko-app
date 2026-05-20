import { z } from 'zod';

export const chatMessageSchema = z.object({
  botId: z.string().cuid('Nieprawidłowy identyfikator bota'),
  // Widget generates: s_{base36_timestamp}_{random} — alphanumeric + underscores only
  sessionId: z
    .string()
    .min(1, 'Identyfikator sesji jest wymagany')
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Identyfikator sesji zawiera nieprawidłowe znaki'),
  message: z
    .string()
    .min(1, 'Wiadomość nie może być pusta')
    .max(1000, 'Wiadomość jest zbyt długa (maks. 1000 znaków)')
    .trim(),
});

export type ChatMessageDto = z.infer<typeof chatMessageSchema>;
