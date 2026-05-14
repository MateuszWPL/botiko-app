export interface EmbeddingResult {
  embedding: number[];
  tokenUsage: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  content: string;
  tokenUsage: number;
}

export interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  responseFormat?: { type: 'json_object' };
  model?: string;
}

export interface AIService {
  generateEmbedding(text: string): Promise<EmbeddingResult>;
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResult>;
}

export const AI_SERVICE = Symbol('AIService');
