import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AI_SERVICE, type AIService } from '../../ai/ai.service.interface';
import { EmbeddingService } from '../embedding.service';
import { validateAndNormalizeImportUrl } from './url-validator';
import { WebsiteScraperService } from './website-scraper.service';
import { buildExtractionMessages, buildRetryMessages } from './extraction-prompt';
import {
  extractedPayloadSchema,
  parseAndSanitizePayload,
  type ExtractedPayload,
} from './extracted-payload.schema';
import type { ConfirmImportDto } from './dto/confirm-import.dto';
import type { Industry } from '@prisma/client';

export const PLAN_IMPORT_LIMITS: Record<
  Plan,
  { perDay: number; maxPages: number; maxChunks: number }
> = {
  STARTER: { perDay: 1, maxPages: 20, maxChunks: 200 },
  PRO: { perDay: 5, maxPages: 50, maxChunks: 500 },
  PREMIUM: { perDay: 20, maxPages: 100, maxChunks: 2000 },
};

@Injectable()
export class WebsiteImportService {
  private readonly logger = new Logger(WebsiteImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scraper: WebsiteScraperService,
    private readonly embeddingService: EmbeddingService,
    @Inject(AI_SERVICE) private readonly aiService: AIService,
  ) {}

  async createImportJob(
    tenantId: string,
    botId: string,
    sourceUrl: string,
  ): Promise<{ jobId: string }> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      include: { tenant: { select: { websiteUrl: true, plan: true, industry: true } } },
    });

    if (!bot) throw new NotFoundException('Bot not found');

    // Validate URL is within tenant's own domain
    validateAndNormalizeImportUrl(sourceUrl, bot.tenant.websiteUrl);

    // Plan limit: max N imports per day
    await this.checkImportLimit(tenantId, bot.tenant.plan);

    const job = await this.prisma.knowledgeImportJob.create({
      data: {
        tenantId,
        botId,
        sourceUrl,
        status: 'PENDING',
      },
    });

    // Fire-and-forget — response returns immediately with jobId
    setImmediate(() => {
      this.runImportJob(
        job.id,
        botId,
        sourceUrl,
        bot.tenant.websiteUrl,
        bot.tenant.industry,
        bot.tenant.plan,
      ).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`Import job ${job.id} failed unexpectedly: ${msg}`);
      });
    });

    return { jobId: job.id };
  }

  async getJob(tenantId: string, jobId: string) {
    const job = await this.prisma.knowledgeImportJob.findFirst({
      where: { id: jobId, tenantId },
    });
    if (!job) throw new NotFoundException('Import job not found');
    return job;
  }

  async listJobs(tenantId: string, botId: string) {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: { id: true },
    });
    if (!bot) throw new NotFoundException('Bot not found');

    return this.prisma.knowledgeImportJob.findMany({
      where: { botId, tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        status: true,
        sourceUrl: true,
        scrapedPages: true,
        failedPages: true,
        chunksCreated: true,
        errorCode: true,
        errorMessage: true,
        createdAt: true,
        completedAt: true,
      },
    });
  }

  async confirmJob(
    tenantId: string,
    jobId: string,
    dto: ConfirmImportDto,
  ): Promise<{ chunksCreated: number }> {
    const job = await this.prisma.knowledgeImportJob.findFirst({
      where: { id: jobId, tenantId },
      include: { bot: { select: { id: true, tenantId: true } } },
    });

    if (!job) throw new NotFoundException('Import job not found');
    if (job.status !== 'READY_FOR_REVIEW') {
      throw new BadRequestException(
        `Job nie jest gotowy do zatwierdzenia (status: ${job.status})`,
      );
    }

    // Mark as CONFIRMING to prevent duplicate confirms
    await this.prisma.knowledgeImportJob.update({
      where: { id: jobId },
      data: { status: 'CONFIRMING' },
    });

    try {
      const chunksCreated = await this.applyConfirmedChunks(
        job.botId,
        job.sourceUrl,
        dto,
      );

      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: {
          status: 'CONFIRMED',
          chunksCreated,
          completedAt: new Date(),
        },
      });

      this.logger.log(
        `Import job ${jobId} confirmed: ${chunksCreated} chunks created for bot ${job.botId}`,
      );
      return { chunksCreated };
    } catch (err) {
      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorCode: 'CONFIRM_ERROR',
          errorMessage: err instanceof Error ? err.message : String(err),
        },
      });
      throw err;
    }
  }

  async cancelJob(tenantId: string, jobId: string): Promise<void> {
    const job = await this.prisma.knowledgeImportJob.findFirst({
      where: { id: jobId, tenantId },
    });
    if (!job) throw new NotFoundException('Import job not found');

    if (['CONFIRMED', 'CANCELLED'].includes(job.status)) {
      throw new BadRequestException(
        `Nie można anulować jobu o statusie ${job.status}`,
      );
    }

    await this.prisma.knowledgeImportJob.update({
      where: { id: jobId },
      data: { status: 'CANCELLED', completedAt: new Date() },
    });
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private async checkImportLimit(tenantId: string, plan: Plan): Promise<void> {
    const limit = PLAN_IMPORT_LIMITS[plan];
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await this.prisma.knowledgeImportJob.count({
      where: {
        tenantId,
        createdAt: { gte: since },
        status: { notIn: ['FAILED', 'CANCELLED'] },
      },
    });

    if (count >= limit.perDay) {
      throw new HttpException(
        `Osiągnięto limit importów na dziś (max ${limit.perDay} dla planu ${plan}). Spróbuj jutro.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private async runImportJob(
    jobId: string,
    botId: string,
    sourceUrl: string,
    tenantWebsiteUrl: string | null,
    industry: Industry,
    plan: Plan,
  ): Promise<void> {
    try {
      // Update status to SCRAPING
      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: { status: 'SCRAPING' },
      });

      const scraperResult = await this.scraper.scrape(
        sourceUrl,
        tenantWebsiteUrl ?? sourceUrl,
        async (progress) => {
          await this.prisma.knowledgeImportJob.update({
            where: { id: jobId },
            data: {
              scrapedPages: progress.scrapedUrls,
              failedPages: progress.failedUrls,
            },
          });
        },
      );

      if (scraperResult.pages.length === 0) {
        await this.prisma.knowledgeImportJob.update({
          where: { id: jobId },
          data: {
            status: 'FAILED',
            errorCode: 'NO_CONTENT',
            errorMessage:
              'Nie udało się pobrać żadnej treści ze strony. Możliwe, że strona ładuje treść przez JavaScript — dodaj dane ręcznie lub prześlij PDF.',
            scrapedPages: scraperResult.scrapedUrls,
            failedPages: scraperResult.failedUrls,
            completedAt: new Date(),
          },
        });
        return;
      }

      // Update to EXTRACTING
      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: {
          status: 'EXTRACTING',
          scrapedPages: scraperResult.scrapedUrls,
          failedPages: scraperResult.failedUrls,
        },
      });

      // LLM extraction with 1 retry on parse failure
      const { payload, tokenUsage } = await this.extractWithRetry(
        scraperResult.pages,
        industry,
      );

      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: {
          status: 'READY_FOR_REVIEW',
          extractedPayload: payload as unknown as Prisma.JsonObject,
          tokenUsage,
        },
      });

      this.logger.log(
        `Import job ${jobId} ready for review. Pages: ${scraperResult.pages.length}, tokens: ${tokenUsage}`,
      );
    } catch (err) {
      const code =
        err instanceof BadRequestException
          ? ((err.getResponse() as { code?: string })?.code ?? 'IMPORT_ERROR')
          : 'IMPORT_ERROR';
      const message = err instanceof Error ? err.message : String(err);

      await this.prisma.knowledgeImportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorCode: code,
          errorMessage: message,
          completedAt: new Date(),
        },
      });
    }
  }

  private async extractWithRetry(
    pages: import('./content-extractor').ExtractedPage[],
    industry: Industry,
  ): Promise<{ payload: ExtractedPayload; tokenUsage: number }> {
    const messages = buildExtractionMessages(pages, industry);
    const result = await this.aiService.chat(messages, {
      maxTokens: 4000,
      temperature: 0.1,
      responseFormat: { type: 'json_object' },
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(result.content);
    } catch {
      // Retry once with hint
      const retryMessages = buildRetryMessages(messages, result.content);
      const retryResult = await this.aiService.chat(retryMessages, {
        maxTokens: 4000,
        temperature: 0.1,
        responseFormat: { type: 'json_object' },
      });
      try {
        parsed = JSON.parse(retryResult.content);
      } catch {
        throw new BadRequestException({
          code: 'LLM_INVALID_JSON',
          message:
            'Nie udało się rozpoznać struktury strony — spróbuj ponownie lub dodaj dane ręcznie.',
        });
      }
    }

    const zodResult = extractedPayloadSchema.safeParse(parsed);
    if (!zodResult.success) {
      throw new BadRequestException({
        code: 'INVALID_SCHEMA',
        message:
          'Wyekstraktowane dane nie pasują do oczekiwanego formatu — spróbuj ponownie.',
      });
    }

    const payload = parseAndSanitizePayload(zodResult.data);
    return { payload, tokenUsage: result.tokenUsage };
  }

  private async applyConfirmedChunks(
    botId: string,
    sourceUrl: string,
    dto: ConfirmImportDto,
  ): Promise<number> {
    // Delete all previously imported web chunks for this bot (re-import replaces them)
    await this.prisma.$executeRaw`
      DELETE FROM "KnowledgeChunk"
      WHERE "botId" = ${botId}
      AND source LIKE 'web:%'
    `;

    const chunksToCreate = buildChunksFromConfirm(dto, sourceUrl);
    let created = 0;

    for (const { content, category, source } of chunksToCreate) {
      const id = randomUUID();
      await this.prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk" (id, "botId", content, embedding, category, source, "createdAt")
        VALUES (
          ${id},
          ${botId},
          ${content},
          ${Prisma.raw(`array_fill(0::float4, ARRAY[1536])::vector(1536)`)},
          ${category ?? null},
          ${source},
          NOW()
        )
      `;

      try {
        await this.embeddingService.generateAndStore(id, content);
        created++;
      } catch (err) {
        // Rollback this single chunk — don't fail the whole confirm
        await this.prisma.knowledgeChunk
          .delete({ where: { id } })
          .catch(() => {});
        this.logger.warn(
          `Embedding failed for chunk ${id}, rolling back: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    return created;
  }
}

interface ChunkSpec {
  content: string;
  category: string;
  source: string;
}

function buildChunksFromConfirm(
  dto: ConfirmImportDto,
  sourceUrl: string,
): ChunkSpec[] {
  const chunks: ChunkSpec[] = [];
  const source = `web:${sourceUrl}`;

  if (dto.contact?.selected) {
    const parts: string[] = ['Kontakt:'];
    if (dto.contact.phone) parts.push(`Telefon: ${dto.contact.phone}`);
    if (dto.contact.email) parts.push(`Email: ${dto.contact.email}`);
    if (dto.contact.address) parts.push(`Adres: ${dto.contact.address}`);
    if (parts.length > 1) {
      chunks.push({ content: parts.join('\n'), category: 'Kontakt', source });
    }
  }

  for (const service of dto.services.filter((s) => s.selected)) {
    const parts = [`Usługa: ${service.name}`];
    if (service.description) parts.push(`Opis: ${service.description}`);
    if (service.price) parts.push(`Cena: ${service.price}`);
    chunks.push({ content: parts.join('\n'), category: 'Usługi', source });
  }

  for (const faq of dto.faq.filter((f) => f.selected)) {
    chunks.push({
      content: `Pytanie: ${faq.question}\nOdpowiedź: ${faq.answer}`,
      category: 'FAQ',
      source,
    });
  }

  if (dto.hours?.selected && dto.hours.raw) {
    chunks.push({
      content: `Godziny otwarcia: ${dto.hours.raw}`,
      category: 'Godziny',
      source,
    });
  }

  if (dto.about?.selected && dto.about.text) {
    chunks.push({
      content: `O firmie: ${dto.about.text}`,
      category: 'O firmie',
      source,
    });
  }

  const selectedPrices = dto.prices.filter((p) => p.selected);
  if (selectedPrices.length > 0) {
    const lines = selectedPrices.map((p) => `${p.item}: ${p.price}`);
    chunks.push({
      content: `Cennik:\n${lines.join('\n')}`,
      category: 'Cennik',
      source,
    });
  }

  return chunks.filter((c) => c.content.length >= 10);
}
