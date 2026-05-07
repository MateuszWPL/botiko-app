import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { env } from '../../../config/env';
import type {
  AIService,
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingResult,
} from '../ai.service.interface';

@Injectable()
export class OpenAIProvider implements AIService {
  private readonly logger = new Logger(OpenAIProvider.name);
  private readonly client: OpenAI;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      this.logger.warn(
        'OPENAI_API_KEY is not set — AI features will not work. Set it in apps/api/.env',
      );
    }
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY ?? 'not-set' });
  }

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.trim(),
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error('OpenAI returned no embedding');
    }

    return {
      embedding,
      tokenUsage: response.usage.total_tokens,
    };
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {},
  ): Promise<ChatResult> {
    const { maxTokens = 600, temperature = 0.3, responseFormat } = options;
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature,
      ...(responseFormat && { response_format: responseFormat }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned no content');
    }

    return {
      content,
      tokenUsage: response.usage?.total_tokens ?? 0,
    };
  }
}
