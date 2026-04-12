import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';
import { setupTestUser } from './helpers/e2e-auth.helper';

describe('Knowledge (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let cleanup: () => Promise<void>;
  let botId: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken, cleanup } = await setupTestUser(app));

    const botRes = await request(app.getHttpServer())
      .post('/api/v1/bot')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'KnowledgeBot',
        welcomeMsg: 'Sprawdzam bazę wiedzy!',
        allowedDomains: [],
      })
      .expect(201);

    botId = botRes.body.id as string;
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  // ─── GET /api/v1/knowledge/:botId ────────────────────────────────────────

  describe('GET /api/v1/knowledge/:botId', () => {
    it('401 — no token', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/knowledge/${botId}`)
        .expect(401);
    });

    it('200 — returns empty array for new bot', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });
  });

  // ─── POST /api/v1/knowledge/:botId ───────────────────────────────────────

  let chunkId: string;

  describe('POST /api/v1/knowledge/:botId', () => {
    it('401 — no token', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .send({ content: 'Treść wpisu do bazy wiedzy.' })
        .expect(401);
    });

    it('400 — content too short (< 10 chars)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Za krótki' })
        .expect(400);
    });

    it('400 — content exceeds 4000 chars', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'x'.repeat(4001) })
        .expect(400);
    });

    it('404 — bot from another tenant', () => {
      return request(app.getHttpServer())
        .post('/api/v1/knowledge/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Treść wpisu do nieistniejącego bota.' })
        .expect(404);
    });

    it('201 — adds chunk and returns id', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content:
            'Oferujemy zabiegi pielęgnacyjne dla skóry: peeling, maska, hydratacja.',
          category: 'oferta',
        })
        .expect(201);

      expect(res.body).toMatchObject({ id: expect.any(String) });
      chunkId = res.body.id as string;
    });

    it('201 — adds chunk without category', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Godziny otwarcia: poniedziałek-piątek 9:00-18:00.',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
        });
    });
  });

  // ─── GET after POST: verify chunks appear in listing ─────────────────────

  describe('GET /api/v1/knowledge/:botId (after adding chunks)', () => {
    it('200 — lists added chunks with correct fields', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/knowledge/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(2);

      const chunk = res.body.find((c: { id: string }) => c.id === chunkId);
      if (chunk) {
        expect(chunk).toMatchObject({
          id: chunkId,
          content: expect.any(String),
          category: 'oferta',
          createdAt: expect.any(String),
        });
      }
    });
  });

  // ─── DELETE /api/v1/knowledge/:chunkId ───────────────────────────────────

  describe('DELETE /api/v1/knowledge/:chunkId', () => {
    it('401 — no token', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/knowledge/${chunkId}`)
        .expect(401);
    });

    it('204 — deletes chunk', async () => {
      if (!chunkId) return;

      await request(app.getHttpServer())
        .delete(`/api/v1/knowledge/${chunkId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('404 — deleted chunk no longer exists', async () => {
      if (!chunkId) return;

      await request(app.getHttpServer())
        .delete(`/api/v1/knowledge/${chunkId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
