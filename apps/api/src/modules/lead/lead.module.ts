import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';

@Module({
  controllers: [LeadController],
  providers: [LeadService, EncryptionService, DomainWhitelistGuard],
  exports: [LeadService],
})
export class LeadModule {}
