import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../../common/services/notification.service';
import type { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly notification: NotificationService) {}

  async submit(dto: CreateContactDto): Promise<void> {
    try {
      await this.notification.sendContactEmail(dto);
    } catch (err: unknown) {
      // Non-critical: we don't want to block the UI on email vendor hiccups
      this.logger.error('Failed to send contact email', err);
    }
  }
}
