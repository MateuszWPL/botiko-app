import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';
import type { AddChunkDto } from './dto/add-chunk.dto';

/**
 * Strip HTML tags and normalize whitespace from raw knowledge content.
 * Clients often paste from Word, Google Docs or websites — we want plain text only.
 */
function sanitizeContent(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script blocks first
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // strip style blocks
    .replace(/<[^>]+>/g, ' ')   // strip remaining HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s{2,}/g, ' ')    // collapse whitespace
    .trim();
}

/** Patterns that indicate an attempt to inject instructions via the knowledge base */
const KNOWLEDGE_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /forget\s+(everything|instructions?)/i,
  /you\s+are\s+now/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /system\s*:\s*(?:you|your)/i,
  /new\s+instructions?\s*:/i,
  /nowe\s+instrukcje\s*:/i,
  /zapomnij\s+instrukcje/i,
  /jeste[sś]\s+teraz/i,
];

function detectKnowledgeInjection(content: string): boolean {
  return KNOWLEDGE_INJECTION_PATTERNS.some((p) => p.test(content));
}

export interface KnowledgeChunkResponse {
  id: string;
  content: string;
  category: string | null;
  createdAt: Date;
}

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async addChunk(
    tenantId: string,
    botId: string,
    dto: AddChunkDto,
  ): Promise<{ id: string }> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: { id: true },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    // Sanitize: strip HTML, normalize whitespace (handles Word/Docs pastes)
    const cleanContent = sanitizeContent(dto.content);

    if (cleanContent.length < 10) {
      throw new BadRequestException(
        'Content is too short after sanitization (min 10 characters of plain text)',
      );
    }

    // Block prompt injection via the knowledge base
    if (detectKnowledgeInjection(cleanContent)) {
      throw new BadRequestException(
        'Content contains invalid instructions. Knowledge base must contain only factual information about your business.',
      );
    }

    const id = randomUUID();

    await this.prisma.$executeRaw`
      INSERT INTO "KnowledgeChunk" (id, "botId", content, embedding, category, "createdAt")
      VALUES (
        ${id},
        ${botId},
        ${cleanContent},
        ${Prisma.raw(`array_fill(0::float4, ARRAY[1536])::vector(1536)`)},
        ${dto.category ?? null},
        NOW()
      )
    `;

    await this.embeddingService.generateAndStore(id, cleanContent);

    this.logger.log(`Knowledge chunk added + embedded: ${id} to bot: ${botId}`);
    return { id };
  }

  async listChunks(
    tenantId: string,
    botId: string,
  ): Promise<KnowledgeChunkResponse[]> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: { id: true },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return this.prisma.knowledgeChunk.findMany({
      where: { botId },
      select: {
        id: true,
        content: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateChunk(
    tenantId: string,
    chunkId: string,
    content: string,
    category?: string,
  ): Promise<void> {
    const chunk = await this.prisma.knowledgeChunk.findFirst({
      where: { id: chunkId, bot: { tenantId } },
      select: { id: true },
    });

    if (!chunk) {
      throw new NotFoundException('Knowledge chunk not found');
    }

    const cleanContent = sanitizeContent(content);

    if (cleanContent.length < 10) {
      throw new BadRequestException(
        'Content is too short after sanitization (min 10 characters)',
      );
    }

    if (detectKnowledgeInjection(cleanContent)) {
      throw new BadRequestException(
        'Content contains invalid instructions.',
      );
    }

    await this.prisma.knowledgeChunk.update({
      where: { id: chunkId },
      data: {
        content: cleanContent,
        ...(category !== undefined && { category: category || null }),
      },
    });

    // Re-embed with updated content
    await this.embeddingService.generateAndStore(chunkId, cleanContent);
    this.logger.log(`Knowledge chunk updated + re-embedded: ${chunkId}`);
  }

  async deleteChunk(tenantId: string, chunkId: string): Promise<void> {
    const chunk = await this.prisma.knowledgeChunk.findFirst({
      where: {
        id: chunkId,
        bot: { tenantId },
      },
      select: { id: true },
    });

    if (!chunk) {
      throw new NotFoundException('Knowledge chunk not found');
    }

    await this.prisma.knowledgeChunk.delete({ where: { id: chunkId } });
    this.logger.log(`Knowledge chunk deleted: ${chunkId}`);
  }
}
