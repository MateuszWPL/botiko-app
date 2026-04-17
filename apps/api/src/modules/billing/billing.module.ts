import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { NotificationService } from '../../common/services/notification.service';
import { OwnerGuard } from '../../common/guards/owner.guard';

@Module({
  controllers: [BillingController],
  providers: [BillingService, NotificationService, OwnerGuard],
  exports: [BillingService],
})
export class BillingModule {}
