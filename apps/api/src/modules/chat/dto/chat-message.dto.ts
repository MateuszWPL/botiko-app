import { z } from 'zod';

export const chatMessageSchema = z.object({
  botId: z.string().min(1, 'botId is required'),
  sessionId: z.string().min(1, 'sessionId is required').max(100),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long (max 1000 characters)')
    .trim(),
});

export type ChatMessageDto = z.infer<typeof chatMessageSchema>;
