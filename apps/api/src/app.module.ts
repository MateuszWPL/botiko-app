import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './modules/health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BotModule } from './modules/bot/bot.module';
import { ChatModule } from './modules/chat/chat.module';
import { LeadModule } from './modules/lead/lead.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { BillingModule } from './modules/billing/billing.module';
import { ContactModule } from './modules/contact/contact.module';
import { ReviewModule } from './modules/review/review.module';
import { EmailModule } from './email/email.module';
import { env } from './config/env';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      // Skip rate limiting in test environment to allow full test suites to run
      // without hitting per-endpoint limits (e.g. auth: 10/min).
      skipIf: () => env.NODE_ENV === 'test',
      throttlers: [
        {
          name: 'default',
          ttl: env.RATE_LIMIT_WINDOW_MS,
          limit: env.RATE_LIMIT_MAX,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    BotModule,
    ChatModule,
    LeadModule,
    KnowledgeModule,
    TenantModule,
    BillingModule,
    ContactModule,
    ReviewModule,
    EmailModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
