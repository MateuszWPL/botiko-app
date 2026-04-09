import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AI_SERVICE, type AIService } from '../ai/ai.service.interface';

export interface RelevantChunk {
  content: string;
  category: string | null;
  similarity: number;
}

const EMBEDDING_DIMENSIONS = 1536;

/**
 * Validates that the embedding is a fixed-length array of finite numbers
 * before it is interpolated into a raw SQL vector literal.
 * This prevents injection — a poisoned embedding value can't escape the float array format.
 */
function assertValidEmbedding(embedding: number[]): void {
  if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new InternalServerErrorException(
      `Invalid embedding: expected ${EMBEDDING_DIMENSIONS}-dim array, got ${
        Array.isArray(embedding) ? embedding.length : typeof embedding
      }`,
    );
  }
  for (const val of embedding) {
    if (typeof val !== 'number' || !isFinite(val)) {
      throw new InternalServerErrorException(
        'Invalid embedding: all values must be finite numbers',
      );
    }
  }
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_SERVICE) private readonly aiService: AIService,
  ) {}

  async generateAndStore(chunkId: string, content: string): Promise<number> {
    const { embedding, tokenUsage } =
      await this.aiService.generateEmbedding(content);

    assertValidEmbedding(embedding);
    const vectorLiteral = `[${embedding.join(',')}]`;

    await this.prisma.$executeRaw`
      UPDATE "KnowledgeChunk"
      SET embedding = ${Prisma.raw(`'${vectorLiteral}'::vector(1536)`)}
      WHERE id = ${chunkId}
    `;

    return tokenUsage;
  }

  async findRelevantChunks(
    botId: string,
    queryText: string,
    topK = 5,
  ): Promise<RelevantChunk[]> {
    const { embedding } = await this.aiService.generateEmbedding(queryText);

    assertValidEmbedding(embedding);
    const vectorLiteral = `[${embedding.join(',')}]`;

    const rows = await this.prisma.$queryRaw<RelevantChunk[]>`
      SELECT
        content,
        category,
        1 - (embedding <=> ${Prisma.raw(`'${vectorLiteral}'::vector(1536)`)}) AS similarity
      FROM "KnowledgeChunk"
      WHERE "botId" = ${botId}
        AND embedding != ${Prisma.raw(`array_fill(0::float4, ARRAY[1536])::vector(1536)`)}
      ORDER BY embedding <=> ${Prisma.raw(`'${vectorLiteral}'::vector(1536)`)}
      LIMIT ${Prisma.raw(String(topK))}
    `;

    return rows;
  }
}
