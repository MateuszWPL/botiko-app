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

export interface AIService {
  generateEmbedding(text: string): Promise<EmbeddingResult>;
  chat(messages: ChatMessage[], maxTokens?: number): Promise<ChatResult>;
}

export const AI_SERVICE = Symbol('AIService');
