import { Module } from '@nestjs/common';
import { NotificationService } from '../../common/services/notification.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, NotificationService],
})
export class ContactModule {}
