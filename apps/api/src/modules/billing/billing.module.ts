import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { NotificationService } from '../../common/services/notification.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, NotificationService],
  exports: [BillingService],
})
export class BillingModule {}
