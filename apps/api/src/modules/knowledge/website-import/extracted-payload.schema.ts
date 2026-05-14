import { z } from 'zod';
import {
  detectKnowledgeInjection,
  sanitizeContent,
} from '../knowledge.service';

export const extractedPayloadSchema = z.object({
  contact: z
    .object({
      phone: z.string().max(60).nullable().optional(),
      email: z.string().max(200).nullable().optional(),
      address: z.string().max(400).nullable().optional(),
    })
    .nullable()
    .optional(),
  services: z
    .array(
      z.object({
        name: z.string().min(2).max(120),
        description: z.string().max(600).nullable().optional(),
        price: z.string().max(100).nullable().optional(),
        sourceUrl: z.string().max(500).nullable().optional(),
      }),
    )
    .max(20)
    .default([]),
  faq: z
    .array(
      z.object({
        question: z.string().min(5).max(400),
        answer: z.string().min(5).max(1500),
        sourceUrl: z.string().max(500).nullable().optional(),
      }),
    )
    .max(15)
    .default([]),
  hours: z
    .object({
      raw: z.string().max(600).nullable().optional(),
    })
    .nullable()
    .optional(),
  about: z.string().max(2000).nullable().optional(),
});

export type ExtractedPayload = z.infer<typeof extractedPayloadSchema>;

function sanitizeString(value: unknown): string | null | undefined {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return null;
  // Strip < > to prevent HTML injection
  const stripped = value.replace(/[<>]/g, ' ');
  return sanitizeContent(stripped) || null;
}

export function parseAndSanitizePayload(raw: unknown): ExtractedPayload {
  const result = extractedPayloadSchema.parse(raw);

  // Sanitize all string fields and check for injection
  const checkField = (
    value: string | null | undefined,
  ): string | null | undefined => {
    const sanitized = sanitizeString(value);
    if (sanitized && detectKnowledgeInjection(sanitized)) return null;
    return sanitized;
  };

  if (result.contact) {
    result.contact.phone = checkField(result.contact.phone) ?? undefined;
    result.contact.email = checkField(result.contact.email) ?? undefined;
    result.contact.address = checkField(result.contact.address) ?? undefined;
  }

  result.services = result.services
    .map((s) => ({
      name: checkField(s.name) ?? s.name,
      description: checkField(s.description) ?? undefined,
      price: checkField(s.price) ?? undefined,
      sourceUrl: sanitizeString(s.sourceUrl) ?? undefined,
    }))
    .filter((s) => s.name.length >= 2);

  result.faq = result.faq
    .map((f) => ({
      question: checkField(f.question) ?? f.question,
      answer: checkField(f.answer) ?? f.answer,
      sourceUrl: sanitizeString(f.sourceUrl) ?? undefined,
    }))
    .filter((f) => f.question.length >= 5 && f.answer.length >= 5);

  if (result.hours) {
    result.hours.raw = checkField(result.hours.raw) ?? undefined;
  }

  result.about = checkField(result.about) ?? undefined;

  return result;
}
