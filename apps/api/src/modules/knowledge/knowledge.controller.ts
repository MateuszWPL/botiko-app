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
import { Throttle } from '@nestjs/throttler';
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
import { WebsiteImportService } from './website-import/website-import.service';
import {
  startImportSchema,
  type StartImportDto,
} from './website-import/dto/start-import.dto';
import {
  confirmImportSchema,
  type ConfirmImportDto,
} from './website-import/dto/confirm-import.dto';
import {
  classifyTextSchema,
  type ClassifyTextDto,
} from './website-import/dto/classify-text.dto';
import {
  classifySaveSchema,
  type ClassifySaveDto,
} from './website-import/dto/classify-save.dto';
import type { ExtractedPayload } from './website-import/extracted-payload.schema';

// Write operations trigger OpenAI embedding calls — throttle to prevent
// accidental or intentional API cost spikes (30 req/min per IP).
@Throttle({ default: { limit: 30, ttl: 60000 } })
@Controller('api/v1/knowledge')
@UseGuards(AuthGuard, TenantGuard)
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
    private readonly websiteImportService: WebsiteImportService,
  ) {}

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

  // ─── Paste-anything classify endpoints ──────────────────────────────────

  @Post(':botId/classify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(classifyTextSchema))
  classifyText(
    @Param('botId') botId: string,
    @Body() dto: ClassifyTextDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ payload: ExtractedPayload; tokenUsage: number }> {
    return this.websiteImportService.classifyText(tenantId, botId, dto.text);
  }

  @Post(':botId/classify/save')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(classifySaveSchema))
  saveClassified(
    @Param('botId') botId: string,
    @Body() dto: ClassifySaveDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ chunksCreated: number }> {
    return this.websiteImportService.saveClassifiedChunks(tenantId, botId, dto);
  }

  // ─── Website Import endpoints ───────────────────────────────────────────

  @Post(':botId/import-website')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(startImportSchema))
  startImport(
    @Param('botId') botId: string,
    @Body() dto: StartImportDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ jobId: string }> {
    return this.websiteImportService.createImportJob(
      tenantId,
      botId,
      dto.sourceUrl,
    );
  }

  @Get(':botId/import-jobs')
  listImportJobs(
    @Param('botId') botId: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.websiteImportService.listJobs(tenantId, botId);
  }

  @Get(':botId/import-jobs/:jobId')
  getImportJob(
    @Param('jobId') jobId: string,
    @CurrentTenant() tenantId: string,
  ) {
    return this.websiteImportService.getJob(tenantId, jobId);
  }

  @Post(':botId/import-jobs/:jobId/confirm')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(confirmImportSchema))
  confirmImport(
    @Param('jobId') jobId: string,
    @Body() dto: ConfirmImportDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ chunksCreated: number }> {
    return this.websiteImportService.confirmJob(tenantId, jobId, dto);
  }

  @Delete(':botId/import-jobs/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelImport(
    @Param('jobId') jobId: string,
    @CurrentTenant() tenantId: string,
  ): Promise<void> {
    return this.websiteImportService.cancelJob(tenantId, jobId);
  }
}
