import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BotModule } from './modules/bot/bot.module';
import { ChatModule } from './modules/chat/chat.module';
import { LeadModule } from './modules/lead/lead.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
          limit: Number(process.env.RATE_LIMIT_MAX ?? 100),
        },
      ],
    }),
    AuthModule,
    BotModule,
    ChatModule,
    LeadModule,
    KnowledgeModule,
    TenantModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
