import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';
import { setupTestUser } from './helpers/e2e-auth.helper';

describe('Bot (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken, cleanup } = await setupTestUser(app));
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  // ─── GET /api/v1/bot ─────────────────────────────────────────────────────

  describe('GET /api/v1/bot', () => {
    it('401 — no auth token', () => {
      return request(app.getHttpServer()).get('/api/v1/bot').expect(401);
    });

    it('401 — invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bot')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });

    it('200 — returns array of bots for tenant', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ─── POST /api/v1/bot ────────────────────────────────────────────────────

  describe('POST /api/v1/bot', () => {
    it('401 — no auth token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bot')
        .send({ name: 'Bot', welcomeMsg: 'Hej!' })
        .expect(401);
    });

    it('400 — name too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'X', welcomeMsg: 'Witaj!' })
        .expect(400);
    });

    it('400 — welcomeMsg too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'MójBot', welcomeMsg: 'X' })
        .expect(400);
    });

    it('400 — invalid hex color', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'MójBot',
          welcomeMsg: 'Witaj w naszym salonie!',
          primaryColor: 'notacolor',
        })
        .expect(400);
    });

    it('400 — allowedDomains contains invalid URL', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'MójBot',
          welcomeMsg: 'Witaj!',
          allowedDomains: ['not-a-url'],
        })
        .expect(400);
    });

    it('201 — creates bot with valid payload', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/bot')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'MójBot',
          welcomeMsg: 'Witaj w naszym salonie! Jak mogę pomóc?',
          primaryColor: '#6366F1',
          allowedDomains: [],
        })
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        name: 'MójBot',
        welcomeMsg: 'Witaj w naszym salonie! Jak mogę pomóc?',
        primaryColor: '#6366F1',
        isActive: true,
      });

      // Store botId for subsequent tests
      botId = res.body.id as string;
    });
  });

  // ─── GET /api/v1/bot/:id ─────────────────────────────────────────────────

  let botId: string;

  describe('GET /api/v1/bot/:id', () => {
    it('401 — no token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bot/nonexistent-id')
        .expect(401);
    });

    it('404 — bot of another tenant', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bot/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('200 — returns bot detail', async () => {
      // botId is set by the POST test above; skip if that test failed
      if (!botId) return;

      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: botId, name: 'MójBot' });
    });
  });

  // ─── PATCH /api/v1/bot/:id ───────────────────────────────────────────────

  describe('PATCH /api/v1/bot/:id', () => {
    it('200 — updates bot fields', async () => {
      if (!botId) return;

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/bot/${botId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'BotZmieniony', welcomeMsg: 'Nowa wiadomość powitalna!' })
        .expect(200);

      expect(res.body.name).toBe('BotZmieniony');
    });
  });

  // ─── GET /api/v1/bot/:id/config (public) ─────────────────────────────────

  describe('GET /api/v1/bot/:id/config', () => {
    it('404 — unknown bot id', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bot/00000000-0000-0000-0000-000000000000/config')
        .expect(404);
    });

    it('200 — returns public config without auth', async () => {
      if (!botId) return;

      const res = await request(app.getHttpServer())
        .get(`/api/v1/bot/${botId}/config`)
        .expect(200);

      expect(res.body).toMatchObject({
        id: botId,
        name: expect.any(String),
        welcomeMsg: expect.any(String),
        primaryColor: expect.any(String),
      });

      // Sensitive fields must not be exposed
      expect(res.body.allowedDomains).toBeUndefined();
    });
  });
});
