import type { Server } from 'http';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp, mockAiService } from './helpers/create-test-app';
import { setupTestUser } from './helpers/e2e-auth.helper';

interface BotCreatedResponse {
  id: string;
}

interface ChatResponse {
  message: string;
  sessionId: string;
  showLeadForm?: boolean;
}

describe('Chat (e2e)', () => {
  let app: INestApplication<Server>;
  let accessToken: string;
  let cleanup: () => Promise<void>;
  let botId: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken, cleanup } = await setupTestUser(app));

    // Create bot + activate tenant so chat endpoint can process messages
    const botRes = await request(app.getHttpServer())
      .post('/api/v1/bot')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'ChatTestBot',
        welcomeMsg: 'Witaj! Jak mogę Ci dzisiaj pomóc?',
        allowedDomains: [],
      })
      .expect(201);

    botId = (botRes.body as BotCreatedResponse).id;

    // Activate tenant — chat checks tenant.isActive (default: false)
    const prisma = app.get(PrismaService);
    const user = await prisma.user.findFirst({
      where: { email: { contains: 'e2e-' } },
      select: { tenantId: true },
      orderBy: { createdAt: 'desc' },
    });
    if (user) {
      await prisma.tenant.update({
        where: { id: user.tenantId },
        data: { isActive: true },
      });
    }
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  beforeEach(() => {
    mockAiService.generateEmbedding.mockClear();
    mockAiService.chat.mockClear();
  });

  // ─── POST /api/v1/chat ───────────────────────────────────────────────────

  describe('POST /api/v1/chat', () => {
    // DomainWhitelistGuard runs before ZodValidationPipe in NestJS middleware order.
    // Missing/invalid botId → guard throws 403 before validation can run.
    it('403 — missing botId (guard runs first)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({ sessionId: 'sess_001', message: 'Hej' })
        .expect(403);
    });

    it('403 — unknown botId blocked by domain guard', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({
          botId: '00000000-0000-0000-0000-000000000000',
          sessionId: 'sess_001',
          message: 'Hej',
        })
        .expect(403);
    });

    // Validation errors require a real bot (guard must pass first)
    it('400 — missing sessionId (guard passes, validation fails)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({ botId, message: 'Hej' })
        .expect(400);
    });

    it('400 — empty message', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({ botId, sessionId: 'sess_001', message: '' })
        .expect(400);
    });

    it('400 — sessionId with invalid characters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({
          botId,
          sessionId: 'invalid session!',
          message: 'Hej',
        })
        .expect(400);
    });

    it('200 — escalation keyword triggers lead form (no AI call)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({
          botId,
          sessionId: 'sess_escalation_001',
          message: 'Chcę rozmawiać z człowiekiem',
        })
        .expect(200);

      const body = res.body as ChatResponse;
      expect(body.message).toBeDefined();
      expect(body.sessionId).toBe('sess_escalation_001');
      expect(body.showLeadForm).toBe(true);

      // No AI call should be made for escalation
      expect(mockAiService.chat).not.toHaveBeenCalled();
    });

    it('200 — no knowledge chunks returns fallback response', async () => {
      // AI mock returns a fake embedding; pgvector returns no matching chunks (empty bot)
      const res = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({
          botId,
          sessionId: 'sess_fallback_001',
          message: 'Jakie macie ceny strzyżenia?',
        })
        .expect(200);

      const body = res.body as ChatResponse;
      expect(body.message).toBeDefined();
      expect(body.sessionId).toBe('sess_fallback_001');
      expect(body.showLeadForm).toBe(true);

      // Embedding was called to search for context, but no chat call (fallback path)
      expect(mockAiService.generateEmbedding).toHaveBeenCalledTimes(1);
      expect(mockAiService.chat).not.toHaveBeenCalled();
    });

    it('200 — with knowledge chunk uses AI and returns response', async () => {
      // Add a knowledge chunk so there is context for the AI to use
      await request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content:
            'Strzyżenie damskie kosztuje 80 zł, strzyżenie męskie 50 zł.',
        })
        .expect(201);

      mockAiService.chat.mockResolvedValueOnce({
        content: 'Strzyżenie damskie kosztuje 80 zł.',
        tokenUsage: 15,
      });

      const res = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({
          botId,
          sessionId: 'sess_ai_001',
          message: 'Ile kosztuje strzyżenie?',
        })
        .expect(200);

      const body = res.body as ChatResponse;
      expect(body.message).toBeDefined();
      expect(typeof body.message).toBe('string');
      expect(body.sessionId).toBe('sess_ai_001');
    });
  });
});
