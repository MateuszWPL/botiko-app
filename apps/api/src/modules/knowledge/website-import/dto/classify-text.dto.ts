import { z } from 'zod';

// Raw pasted blob to classify into structured knowledge entries.
// Industry is derived server-side from the tenant, never trusted from the client.
// max matches MAX_AGGREGATE_LENGTH in extraction-prompt.ts so oversized input is
// rejected before spending a token.
export const classifyTextSchema = z.object({
  text: z
    .string()
    .min(30, 'Wklej trochę więcej treści (minimum 30 znaków).')
    .max(90_000, 'Tekst jest zbyt długi. Wklej najważniejsze fragmenty.'),
});

export type ClassifyTextDto = z.infer<typeof classifyTextSchema>;
