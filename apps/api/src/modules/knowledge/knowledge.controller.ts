import {
  Controller,
  Get,
  Post,
  Patch,
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
import { updateChunkSchema, type UpdateChunkDto } from './dto/update-chunk.dto';
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

  @Patch(':chunkId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(updateChunkSchema))
  updateChunk(
    @Param('chunkId') chunkId: string,
    @Body() dto: UpdateChunkDto,
    @CurrentTenant() tenantId: string,
  ): Promise<void> {
    return this.knowledgeService.updateChunk(
      tenantId,
      chunkId,
      dto.content,
      dto.category,
    );
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
