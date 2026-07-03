import { z } from 'zod';
import {
  selectedContactSchema,
  selectedServiceSchema,
  selectedFaqSchema,
  selectedHoursSchema,
  selectedAboutSchema,
} from './confirm-import.dto';

// Same shape as confirmImportSchema but with the higher caps the classifier can
// produce (services 40 / faq 30, matching extractedPayloadSchema) so nothing the
// user kept in the preview is silently dropped on save.
export const classifySaveSchema = z.object({
  contact: selectedContactSchema.nullable().optional(),
  services: z.array(selectedServiceSchema).max(40).default([]),
  faq: z.array(selectedFaqSchema).max(30).default([]),
  hours: selectedHoursSchema,
  about: selectedAboutSchema,
});

export type ClassifySaveDto = z.infer<typeof classifySaveSchema>;
