import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationService } from '../../common/services/notification.service';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';
import { BotThrottleGuard } from '../../common/guards/bot-throttle.guard';

@Module({
  controllers: [LeadController],
  providers: [
    LeadService,
    EncryptionService,
    NotificationService,
    DomainWhitelistGuard,
    BotThrottleGuard,
  ],
  exports: [LeadService],
})
export class LeadModule {}
