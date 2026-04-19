import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../common/services/notification.service';
import type { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async create(
    tenantId: string,
    userEmail: string,
    dto: CreateReviewDto,
  ): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    const userName = tenant?.name ?? '';

    await this.prisma.review.create({
      data: {
        tenantId,
        rating: dto.rating,
        message: dto.message,
        userName,
        userEmail,
      },
    });

    try {
      await this.notification.sendReviewEmail({
        rating: dto.rating,
        message: dto.message,
        userName,
        userEmail,
      });
    } catch (err: unknown) {
      this.logger.error('Failed to send review email notification', err);
    }
  }
}
