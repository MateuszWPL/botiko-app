import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  KnowledgeService,
  type KnowledgeChunkResponse,
} from './knowledge.service';
import { addChunkSchema, type AddChunkDto } from './dto/add-chunk.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('api/v1/knowledge')
@UseGuards(AuthGuard, TenantGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get(':botId')
  listChunks(
    @Param('botId') botId: string,
    @CurrentTenant() tenantId: string,
  ): Promise<KnowledgeChunkResponse[]> {
    return this.knowledgeService.listChunks(tenantId, botId);
  }

  @Post(':botId')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(addChunkSchema))
  addChunk(
    @Param('botId') botId: string,
    @Body() dto: AddChunkDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ id: string }> {
    return this.knowledgeService.addChunk(tenantId, botId, dto);
  }

  @Delete(':chunkId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteChunk(
    @Param('chunkId') chunkId: string,
    @CurrentTenant() tenantId: string,
  ): Promise<void> {
    return this.knowledgeService.deleteChunk(tenantId, chunkId);
  }
}
