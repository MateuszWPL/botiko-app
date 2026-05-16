import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  ChatService,
  type ChatResponse,
  type ChatStreamEvent,
} from './chat.service';
import { chatMessageSchema, type ChatMessageDto } from './dto/chat-message.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';
import { BotThrottleGuard } from '../../common/guards/bot-throttle.guard';

// Public endpoint — widget calls this
// 20 req/min per IP (built-in throttler) + 60 req/min per botId (BotThrottleGuard)
// The second layer prevents multi-IP abuse against a single bot.
@Throttle({ default: { limit: 20, ttl: 60000 } })
@Controller('api/v1/chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(BotThrottleGuard, DomainWhitelistGuard)
  @UsePipes(new ZodValidationPipe(chatMessageSchema))
  sendMessage(@Body() dto: ChatMessageDto): Promise<ChatResponse> {
    return this.chatService.sendMessage({
      botId: dto.botId,
      sessionId: dto.sessionId,
      message: dto.message,
    });
  }

  /**
   * Server-Sent Events streaming variant. Validation runs before the first
   * yield so failures propagate as JSON HTTP errors (the response hasn't been
   * started yet). Once the first chunk is produced we write SSE headers and
   * stream events line by line. On client disconnect we call generator.return()
   * so the service can persist the partial response.
   */
  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BotThrottleGuard, DomainWhitelistGuard)
  @UsePipes(new ZodValidationPipe(chatMessageSchema))
  async sendMessageStream(
    @Body() dto: ChatMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const generator = this.chatService.sendMessageStream({
      botId: dto.botId,
      sessionId: dto.sessionId,
      message: dto.message,
    });

    // Peek first chunk — validation runs here and may throw, in which case
    // Nest's exception filter formats a normal JSON error response.
    const first = await generator.next();

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    // Disable proxy buffering (Nginx / Railway edge) so tokens flush in real time
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const send = (event: ChatStreamEvent) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    let clientGone = false;
    const onClose = () => {
      clientGone = true;
      // Triggers the generator's finally{} → persists partial response
      void generator.return(undefined);
    };
    req.on('close', onClose);

    try {
      if (!first.done) send(first.value);
      for await (const event of generator) {
        if (clientGone) break;
        send(event);
      }
    } catch (err) {
      this.logger.error('Stream failed mid-flight', err);
      // Headers already sent — surface as an SSE error event, then close
      send({ type: 'done' });
      res.write(
        `event: error\ndata: ${JSON.stringify({ code: 'STREAM_ERROR' })}\n\n`,
      );
    } finally {
      req.off('close', onClose);
      if (!clientGone) res.end();
    }
  }
}
