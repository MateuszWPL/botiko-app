import { Module } from '@nestjs/common';
import { NotificationService } from '../../common/services/notification.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, NotificationService],
})
export class ReviewModule {}
