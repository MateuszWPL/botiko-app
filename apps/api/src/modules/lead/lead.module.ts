import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationService } from '../../common/services/notification.service';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';

@Module({
  controllers: [LeadController],
  providers: [
    LeadService,
    EncryptionService,
    NotificationService,
    DomainWhitelistGuard,
  ],
  exports: [LeadService],
})
export class LeadModule {}
