import type { Server } from 'http';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';
import { setupTestUser } from './helpers/e2e-auth.helper';

describe('Auth (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── POST /api/v1/auth/register ──────────────────────────────────────────

  describe('POST /api/v1/auth/register', () => {
    it('201 — valid payload creates account', async () => {
      const { cleanup } = await setupTestUser(app);
      await cleanup();
    });

    it('400 — invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'TestPass123!',
          websiteUrl: 'https://testco.pl',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — password too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'Short1!',
          websiteUrl: 'https://testco.pl',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — password without uppercase letter', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'alllowercase123!',
          websiteUrl: 'https://testco.pl',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — password without digit', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'NoDigitsHere!!',
          websiteUrl: 'https://testco.pl',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — invalid website URL', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'TestPass123!',
          websiteUrl: 'not a url',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — website URL without TLD', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'TestPass123!',
          websiteUrl: 'localhost',
          industry: 'OTHER',
        })
        .expect(400);
    });

    it('400 — invalid industry enum', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'valid@test.pl',
          password: 'TestPass123!',
          websiteUrl: 'https://testco.pl',
          industry: 'INVALID_INDUSTRY',
        })
        .expect(400);
    });

    it('400 — missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({})
        .expect(400);
    });

    it('409 — duplicate email returns conflict', async () => {
      const { email, cleanup } = await setupTestUser(app);

      try {
        await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email,
            password: 'TestPass123!',
            companyName: 'Duplicate Co',
            industry: 'BEAUTY',
          })
          .expect(409);
      } finally {
        await cleanup();
      }
    });
  });

  // ─── POST /api/v1/auth/login ─────────────────────────────────────────────

  describe('POST /api/v1/auth/login', () => {
    it('400 — missing email and password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);
    });

    it('400 — invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'bad-email', password: 'TestPass123!' })
        .expect(400);
    });

    it('401 — wrong password returns unauthorized', async () => {
      const { email, cleanup } = await setupTestUser(app);

      try {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email, password: 'WrongPass999!' })
          .expect(401);
      } finally {
        await cleanup();
      }
    });

    it('200 — correct credentials return tokens', async () => {
      const { accessToken, cleanup } = await setupTestUser(app);

      try {
        expect(accessToken).toBeDefined();
        expect(typeof accessToken).toBe('string');
        expect(accessToken.length).toBeGreaterThan(10);
      } finally {
        await cleanup();
      }
    });
  });

  // ─── POST /api/v1/auth/logout ────────────────────────────────────────────

  describe('POST /api/v1/auth/logout', () => {
    it('401 — no token returns unauthorized', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);
    });

    it('204 — valid token logs out', async () => {
      const { accessToken, cleanup } = await setupTestUser(app);

      try {
        await request(app.getHttpServer())
          .post('/api/v1/auth/logout')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);
      } finally {
        await cleanup();
      }
    });
  });
});
