import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewService } from './review.service';
import {
  createReviewSchema,
  type CreateReviewDto,
} from './dto/create-review.dto';

@Controller('api/v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, TenantGuard)
  @UsePipes(new ZodValidationPipe(createReviewSchema))
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<void> {
    await this.reviewService.create(tenantId, user.email, dto);
  }
}
