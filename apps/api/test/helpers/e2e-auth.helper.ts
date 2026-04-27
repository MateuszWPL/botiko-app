import type { Server } from 'http';
import { INestApplication } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';

export interface TestAuthResult {
  accessToken: string;
  email: string;
  cleanup: () => Promise<void>;
}

interface LoginResponse {
  accessToken: string;
}

/**
 * Registers a unique test user via the real API, logs them in, and returns
 * an access token + a cleanup function that removes all created DB/Supabase records.
 *
 * auth.service auto-confirms emails for every registration (email_confirm: true),
 * so no Supabase admin step is needed here.
 */
export async function setupTestUser(
  app: INestApplication<Server>,
): Promise<TestAuthResult> {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.botiko.pl`;
  const password = 'TestPass123!';

  await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({
      email,
      password,
      websiteUrl: 'https://e2e-test.botiko.pl',
      industry: 'OTHER',
    })
    .expect(201);

  const loginRes = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  const { accessToken } = loginRes.body as LoginResponse;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const prisma = app.get(PrismaService);

  const cleanup = async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { tenantId: true },
      });

      if (user) {
        const { tenantId } = user;

        const bots = await prisma.bot.findMany({
          where: { tenantId },
          select: { id: true },
        });
        const botIds = bots.map((b) => b.id);

        if (botIds.length > 0) {
          await prisma.knowledgeChunk.deleteMany({
            where: { botId: { in: botIds } },
          });

          const conversations = await prisma.conversation.findMany({
            where: { botId: { in: botIds } },
            select: { id: true },
          });
          if (conversations.length > 0) {
            await prisma.message.deleteMany({
              where: {
                conversationId: { in: conversations.map((c) => c.id) },
              },
            });
          }
          await prisma.conversation.deleteMany({
            where: { botId: { in: botIds } },
          });
        }

        await prisma.lead.deleteMany({ where: { tenantId } });
        await prisma.bot.deleteMany({ where: { tenantId } });
        await prisma.user.deleteMany({ where: { tenantId } });
        await prisma.tenant.delete({ where: { id: tenantId } });
      }
    } catch {
      // Non-fatal: test DB cleanup is best-effort
    }

    try {
      const { data: userList, error: listError } =
        await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (!listError) {
        const supabaseUser = userList.users.find((u) => u.email === email);
        if (supabaseUser) {
          await supabase.auth.admin.deleteUser(supabaseUser.id);
        }
      }
    } catch {
      // Non-fatal
    }
  };

  return { accessToken, email, cleanup };
}
