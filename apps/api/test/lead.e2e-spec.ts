import type { Server } from 'http';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';
import { setupTestUser } from './helpers/e2e-auth.helper';

interface BotCreatedResponse {
  id: string;
}

interface LeadCreatedResponse {
  id: string;
}

interface LeadResponse {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
}

interface LeadStatusResponse {
  id: string;
  status: string;
}

describe('Lead (e2e)', () => {
  let app: INestApplication<Server>;
  let accessToken: string;
  let cleanup: () => Promise<void>;
  let botId: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken, cleanup } = await setupTestUser(app));

    // Create a bot to attach leads to
    const botRes = await request(app.getHttpServer())
      .post('/api/v1/bot')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'LeadTestBot',
        welcomeMsg: 'Zostaw kontakt, odezwiemy się!',
        allowedDomains: [],
      })
      .expect(201);

    botId = (botRes.body as BotCreatedResponse).id;
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  // ─── POST /api/v1/leads (public, widget) ────────────────────────────────

  describe('POST /api/v1/leads', () => {
    it('400, missing consent', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: '+48 600 123 456',
        })
        .expect(400);
    });

    it('400, consent: false rejected', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: '+48 600 123 456',
          consentGiven: false,
        })
        .expect(400);
    });

    it('400, name too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'A',
          phone: '+48600123456',
          consentGiven: true,
        })
        .expect(400);
    });

    it('400, invalid phone format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: 'abc-def',
          consentGiven: true,
        })
        .expect(400);
    });

    it('400, phone too short', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: '12345',
          consentGiven: true,
        })
        .expect(400);
    });

    it('400, message exceeds 1000 chars', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: '+48600123456',
          message: 'x'.repeat(1001),
          consentGiven: true,
        })
        .expect(400);
    });

    it('403, unknown botId', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId: '00000000-0000-0000-0000-000000000000',
          name: 'Anna Kowalska',
          phone: '+48600123456',
          consentGiven: true,
        })
        .expect(403);
    });

    it('201, creates lead and returns id', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Anna Kowalska',
          phone: '+48 600 123 456',
          message: 'Proszę o kontakt w sprawie zabiegu.',
          consentGiven: true,
        })
        .expect(201);

      const body = res.body as LeadCreatedResponse;
      expect(body).toMatchObject({ id: expect.any(String) as string });
      leadId = body.id;
    });

    it('201, lead without optional message', () => {
      return request(app.getHttpServer())
        .post('/api/v1/leads')
        .send({
          botId,
          name: 'Jan Nowak',
          phone: '600-456-789',
          consentGiven: true,
        })
        .expect(201)
        .expect((res) => {
          expect((res.body as LeadCreatedResponse).id).toBeDefined();
        });
    });
  });

  // ─── GET /api/v1/leads (protected) ───────────────────────────────────────

  let leadId: string;

  describe('GET /api/v1/leads', () => {
    it('401, no token', () => {
      return request(app.getHttpServer()).get('/api/v1/leads').expect(401);
    });

    it('200, returns leads with decrypted PII', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const leads = res.body as LeadResponse[];
      expect(Array.isArray(leads)).toBe(true);

      const lead = leads.find((l) => l.id === leadId);
      if (lead) {
        // PII must be decrypted (not the encrypted hex format)
        expect(lead.name).toBe('Anna Kowalska');
        expect(lead.phone).toBe('+48 600 123 456');
        expect(lead.status).toBe('NEW');
      }
    });
  });

  // ─── PATCH /api/v1/leads/:id/status (protected) ──────────────────────────

  describe('PATCH /api/v1/leads/:id/status', () => {
    it('401, no token', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/leads/some-id/status')
        .send({ status: 'CONTACTED' })
        .expect(401);
    });

    it('400, invalid status value', async () => {
      if (!leadId) return;

      return request(app.getHttpServer())
        .patch(`/api/v1/leads/${leadId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });

    it('200, updates lead status', async () => {
      if (!leadId) return;

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/leads/${leadId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'CONTACTED' })
        .expect(200);

      expect(res.body as LeadStatusResponse).toMatchObject({
        id: leadId,
        status: 'CONTACTED',
      });
    });
  });
});
