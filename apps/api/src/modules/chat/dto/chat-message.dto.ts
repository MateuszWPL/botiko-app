import { z } from 'zod';

export const chatMessageSchema = z.object({
  botId: z.string().min(1, 'botId is required'),
  // Widget generates: s_{base36_timestamp}_{random} — alphanumeric + underscores only
  sessionId: z
    .string()
    .min(1, 'sessionId is required')
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/, 'sessionId contains invalid characters'),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long (max 1000 characters)')
    .trim(),
});

export type ChatMessageDto = z.infer<typeof chatMessageSchema>;
