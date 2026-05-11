import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { EmailService } from './email.service';
import { EmailSchedulerService } from './email-scheduler.service';
import { env } from '../config/env';

@Controller('api/v1/email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly scheduler: EmailSchedulerService,
  ) {}

  /**
   * One-click unsubscribe link included in every drip email footer.
   * On success renders a simple HTML confirmation page.
   */
  @Get('unsubscribe')
  async unsubscribe(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!token) throw new BadRequestException('Missing token');

    const parsed = this.emailService.verifyUnsubToken(token);
    if (!parsed) {
      res.status(400).send(unsubPage('Nieprawidłowy link', 'Link wygasł lub jest nieprawidłowy. Wróć do dashboardu, aby zarządzać powiadomieniami.'));
      return;
    }

    await this.emailService.unsubscribe(parsed.userId, parsed.category);
    this.logger.log(`User ${parsed.userId} unsubscribed from ${parsed.category}`);

    res.status(200).send(unsubPage('Wypisano z newslettera', 'Twoje preferencje zostały zapisane. Nie będziesz już otrzymywać tego typu wiadomości.'));
  }

  /**
   * Triggered by external cron scheduler (Railway / Vercel Cron / Upstash).
   * Protected by CRON_SECRET header.
   */
  @Post('cron/drip')
  async runDrip(@Query('secret') secret: string): Promise<{ processed: number; sent: number }> {
    if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
      throw new UnauthorizedException('Invalid cron secret');
    }
    return this.scheduler.runDrip();
  }
}

function unsubPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} — Botiko.pl</title>
  <style>
    body{margin:0;padding:40px 16px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;justify-content:center;}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:40px;max-width:480px;width:100%;text-align:center;}
    h1{margin:0 0 12px;font-size:20px;color:#0f172a;}
    p{margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;}
    a{display:inline-block;background:#6366F1;color:#fff;text-decoration:none;padding:11px 28px;border-radius:8px;font-weight:600;font-size:14px;}
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://botiko.pl/dashboard/overview">Wróć do dashboardu</a>
  </div>
</body>
</html>`;
}
