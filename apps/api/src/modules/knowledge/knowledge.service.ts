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

export function sanitizeContent(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script blocks first
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // strip style blocks
    .replace(/<[^>]+>/g, ' ') // strip remaining HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s{2,}/g, ' ') // collapse whitespace
    .trim();
}

export const KNOWLEDGE_INJECTION_PATTERNS: RegExp[] = [
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

export function detectKnowledgeInjection(content: string): boolean {
  return KNOWLEDGE_INJECTION_PATTERNS.some((p) => p.test(content));
}

/** Max characters per stored chunk. A single embedding over a long, mixed blob
 * (cennik + FAQ + opis) has a diffuse vector that loses similarity against a
 * specific question. Splitting keeps each vector focused on one topic. */
export const MAX_CHUNK_LENGTH = 1200;

/**
 * Split raw pasted content into topic-sized chunks before embedding.
 * Splits on blank lines FIRST (before sanitizeContent collapses whitespace, so
 * the author's paragraph structure survives), sanitizes each paragraph, then
 * greedily packs paragraphs up to MAX_CHUNK_LENGTH. A single paragraph longer
 * than the limit is kept whole rather than cut mid-sentence.
 *
 * Content with no blank lines yields a single chunk — identical to the old
 * behaviour, so short focused entries are unaffected.
 */
export function splitContentIntoChunks(raw: string): string[] {
  const paragraphs = raw
    .split(/\n\s*\n/)
    .map((p) => sanitizeContent(p))
    .filter((p) => p.length >= 3);

  const chunks: string[] = [];
  let current = '';
  for (const p of paragraphs) {
    if (current.length === 0) {
      current = p;
    } else if (current.length + 1 + p.length <= MAX_CHUNK_LENGTH) {
      current = `${current}\n${p}`;
    } else {
      chunks.push(current);
      current = p;
    }
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export interface KnowledgeChunkResponse {
  id: string;
  content: string;
  category: string | null;
  source: string | null;
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
    source = 'manual',
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

    // A long, multi-paragraph paste is split into focused chunks so each gets
    // its own tight embedding. Short entries yield exactly one chunk (unchanged).
    const pieces = splitContentIntoChunks(dto.content);
    const finalPieces = pieces.length > 0 ? pieces : [cleanContent];

    const ids: string[] = [];
    try {
      for (const piece of finalPieces) {
        const id = randomUUID();
        await this.prisma.$executeRaw`
          INSERT INTO "KnowledgeChunk" (id, "botId", content, embedding, category, source, "createdAt")
          VALUES (
            ${id},
            ${botId},
            ${piece},
            ${Prisma.raw(`array_fill(0::float4, ARRAY[1536])::vector(1536)`)},
            ${dto.category ?? null},
            ${source},
            NOW()
          )
        `;
        ids.push(id);
        await this.embeddingService.generateAndStore(id, piece);
      }
    } catch (err: unknown) {
      // Embedding (or insert) failed — roll back every chunk created in THIS
      // call so we never leave zero-vector rows. The client gets a 500 + retry.
      if (ids.length > 0) {
        await this.prisma.knowledgeChunk
          .deleteMany({ where: { id: { in: ids } } })
          .catch(() => {});
      }
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Embedding failed while adding chunks to bot ${botId}, rolled back ${ids.length}: ${msg}`,
      );
      throw err;
    }

    this.logger.log(
      `Knowledge added + embedded: ${ids.length} chunk(s) to bot: ${botId}`,
    );
    // Contract stays { id } — return the first chunk's id (the anchor row).
    return { id: ids[0] };
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
        source: true,
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
      throw new BadRequestException('Content contains invalid instructions.');
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
