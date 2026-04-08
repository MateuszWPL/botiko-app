import { beautyTemplate } from './beauty';
import { healthTemplate } from './health';
import { foodTemplate } from './food';
import { autoTemplate } from './auto';

export type Industry = 'BEAUTY' | 'HEALTH' | 'FOOD' | 'AUTO' | 'OTHER';

export interface BrandTemplate {
  systemPrompt: string;
  welcomeMessage: string;
  suggestedResponses: string[];
  faqTemplates: Array<{ question: string; answer: string }>;
  industry: Industry;
  primaryColor: string;
}

export const brandTemplates: Record<
  Exclude<Industry, 'OTHER'>,
  BrandTemplate
> = {
  BEAUTY: beautyTemplate,
  HEALTH: healthTemplate,
  FOOD: foodTemplate,
  AUTO: autoTemplate,
};

const otherTemplate: BrandTemplate = {
  systemPrompt: `Jesteś wirtualnym asystentem firmy usługowej. Odpowiadasz na pytania klientów w pomocny i profesjonalny sposób.
Zbierasz dane kontaktowe i informujesz, że pracownik oddzwoni.`,
  welcomeMessage:
    'Dzień dobry! Jestem wirtualnym asystentem. W czym mogę pomóc?',
  suggestedResponses: [
    'Jakie usługi oferujecie?',
    'Jakie są godziny otwarcia?',
    'Jak się skontaktować?',
  ],
  faqTemplates: [],
  industry: 'OTHER',
  primaryColor: '#6366F1',
};

export function getBrandTemplate(industry: Industry): BrandTemplate {
  if (industry === 'OTHER') return otherTemplate;
  return brandTemplates[industry];
}

export { beautyTemplate, healthTemplate, foodTemplate, autoTemplate };
