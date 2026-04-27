import { z } from 'zod';

export const startImportSchema = z.object({
  sourceUrl: z.string().url('Podaj prawidłowy URL (np. https://twojafirma.pl)'),
});

export type StartImportDto = z.infer<typeof startImportSchema>;
