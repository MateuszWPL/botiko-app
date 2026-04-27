import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { EmbeddingService } from './embedding.service';
import { AiModule } from '../ai/ai.module';
import { WebsiteImportService } from './website-import/website-import.service';
import { WebsiteScraperService } from './website-import/website-scraper.service';

@Module({
  imports: [AiModule],
  controllers: [KnowledgeController],
  providers: [
    KnowledgeService,
    EmbeddingService,
    WebsiteImportService,
    WebsiteScraperService,
  ],
  exports: [KnowledgeService, EmbeddingService, WebsiteImportService],
})
export class KnowledgeModule {}
