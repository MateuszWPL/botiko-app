import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { AiModule } from '../ai/ai.module';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';
import { BotThrottleGuard } from '../../common/guards/bot-throttle.guard';

@Module({
  imports: [KnowledgeModule, AiModule],
  controllers: [ChatController, ConversationController],
  providers: [
    ChatService,
    ConversationService,
    DomainWhitelistGuard,
    BotThrottleGuard,
  ],
  exports: [ChatService],
})
export class ChatModule {}
