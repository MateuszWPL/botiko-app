import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { AI_SERVICE } from '../../src/modules/ai/ai.service.interface';

/** Fake 1536-dim embedding — passes assertValidEmbedding, pgvector returns no results (similarity < 0.3). */
const MOCK_EMBEDDING = Array<number>(1536).fill(0.01);

export const mockAiService = {
  generateEmbedding: jest
    .fn()
    .mockResolvedValue({ embedding: MOCK_EMBEDDING, tokenUsage: 0 }),
  chat: jest
    .fn()
    .mockResolvedValue({ content: 'Mock AI response', tokenUsage: 10 }),
};

/**
 * Creates a NestJS test application that mirrors main.ts setup.
 * AI_SERVICE is replaced with a jest mock to avoid real OpenAI calls.
 */
export async function createTestApp(): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(AI_SERVICE)
    .useValue(mockAiService)
    .compile();

  const app = module.createNestApplication({ rawBody: true });
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.init();
  return app;
}
