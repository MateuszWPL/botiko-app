import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatService, type ChatResponse } from './chat.service';
import { chatMessageSchema, type ChatMessageDto } from './dto/chat-message.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';

// Public endpoint — widget calls this
// 20 req/min per IP to prevent abuse while allowing active conversations
@Throttle({ default: { limit: 20, ttl: 60000 } })
@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(DomainWhitelistGuard)
  @UsePipes(new ZodValidationPipe(chatMessageSchema))
  sendMessage(@Body() dto: ChatMessageDto): Promise<ChatResponse> {
    return this.chatService.sendMessage({
      botId: dto.botId,
      sessionId: dto.sessionId,
      message: dto.message,
    });
  }
}
