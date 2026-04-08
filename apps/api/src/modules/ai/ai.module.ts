import { Module } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { AI_SERVICE } from './ai.service.interface';

@Module({
  providers: [
    {
      provide: AI_SERVICE,
      useClass: OpenAIProvider,
    },
  ],
  exports: [AI_SERVICE],
})
export class AiModule {}
