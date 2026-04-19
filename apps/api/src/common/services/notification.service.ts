import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { env } from '../../config/env';

export interface NewLeadData {
  leadId: string;
  name: string;
  phone: string;
  botName: string;
  toEmail: string;
}

export interface TrialNotificationData {
  toEmail: string;
  tenantName: string;
  daysLeft: number; // 3, 1, or 0 (expired)
}

export interface ReviewNotificationData {
  rating: number;
  message?: string;
  userName: string;
  userEmail: string;
}

export interface ContactFormData {
  topic: 'DEMO' | 'WDROZENIE' | 'CENNIK' | 'WSPOLPRACA' | 'INNE';
  message: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly resend: Resend | null;

  constructor() {
    this.resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

    if (!this.resend) {
      this.logger.warn('RESEND_API_KEY not set — email notifications disabled');
    }
  }

  async sendNewLeadEmail(data: NewLeadData): Promise<void> {
    if (!this.resend) return;

    const date = new Date().toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const dashboardUrl = env.APP_URL;

    try {
      await this.resend.emails.send({
        from: `Botiko.pl <${env.RESEND_FROM_EMAIL}>`,
        to: data.toEmail,
        subject: `Nowy lead z bota "${data.botName}"`,
        html: buildLeadEmailHtml({ ...data, date, dashboardUrl }),
      });

      this.logger.log(
        `Lead email sent to ${data.toEmail} for lead ${data.leadId}`,
      );
    } catch (err: unknown) {
      // Non-critical — lead is already saved, just log the failure
      this.logger.error(`Failed to send lead email for ${data.leadId}`, err);
    }
  }

  async sendTrialNotificationEmail(data: TrialNotificationData): Promise<void> {
    if (!this.resend) return;

    const dashboardUrl = env.APP_URL;
    const safeName = escapeHtml(data.tenantName);

    const isExpired = data.daysLeft === 0;
    const subject = isExpired
      ? 'Twój trial Botiko.pl wygasł — aktywuj plan'
      : `Zostało Ci ${data.daysLeft} ${data.daysLeft === 1 ? 'dzień' : 'dni'} trialu Botiko.pl`;

    const headerBg = isExpired
      ? '#dc2626'
      : data.daysLeft <= 2
        ? '#d97706'
        : '#6366F1';
    const ctaText = isExpired
      ? 'Aktywuj plan — 99 zł/mies.'
      : 'Aktywuj subskrypcję →';
    const bodyText = isExpired
      ? `Cześć ${safeName},<br><br>Twój 14-dniowy okres próbny Botiko.pl właśnie wygasł.<br><strong>Bot przestał odpowiadać na wiadomości klientów.</strong><br><br>Aktywuj plan Starter za 99 zł/mies. aby przywrócić działanie bota.`
      : `Cześć ${safeName},<br><br>Twój 14-dniowy trial Botiko.pl kończy się za <strong>${data.daysLeft} ${data.daysLeft === 1 ? 'dzień' : 'dni'}</strong>.<br><br>Aktywuj subskrypcję teraz, żeby bot działał nieprzerwanie po zakończeniu trialu.`;

    const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:${headerBg};border-radius:10px 10px 0 0;padding:24px 28px;">
            <p style="margin:0;font-size:13px;color:#ffffff99;letter-spacing:0.05em;text-transform:uppercase;">Botiko.pl</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">${subject}</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px;">
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">${bodyText}</p>
            <div style="text-align:center;margin:0 0 24px;">
              <a href="${dashboardUrl}/dashboard/billing"
                style="display:inline-block;background:${headerBg};color:#fff;text-decoration:none;
                       padding:13px 32px;border-radius:8px;font-weight:600;font-size:15px;">
                ${ctaText}
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;border-top:1px solid #f1f5f9;padding-top:20px;">
              Botiko.pl — bot który odpowiada za Ciebie
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await this.resend.emails.send({
        from: `Botiko.pl <${env.RESEND_FROM_EMAIL}>`,
        to: data.toEmail,
        subject,
        html,
      });
      this.logger.log(
        `Trial notification sent (daysLeft=${data.daysLeft}) to ${data.toEmail}`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `Failed to send trial notification to ${data.toEmail}`,
        err,
      );
    }
  }

  async sendReviewEmail(data: ReviewNotificationData): Promise<void> {
    if (!this.resend) return;

    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
    const safeName = escapeHtml(data.userName);
    const safeEmail = escapeHtml(data.userEmail);
    const safeMessage = data.message ? escapeHtml(data.message) : '';
    const date = new Date().toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:#6366F1;border-radius:10px 10px 0 0;padding:24px 28px;">
            <p style="margin:0;font-size:13px;color:#c7d2fe;letter-spacing:0.05em;text-transform:uppercase;">Botiko.pl</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">Nowa opinia od klienta</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px;">
            <p style="margin:0 0 16px;font-size:28px;letter-spacing:4px;">${stars}</p>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:16px;">
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;width:100px;border-bottom:1px solid #e2e8f0;">Firma</td>
                <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">E-mail</td>
                <td style="padding:12px 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeEmail}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;">Ocena</td>
                <td style="padding:12px 16px;font-weight:700;color:#6366F1;">${data.rating}/5</td>
              </tr>
            </table>
            ${safeMessage ? `<div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;"><p style="margin:0 0 6px;font-size:13px;color:#64748b;">Komentarz</p><p style="margin:0;font-size:14px;color:#0f172a;line-height:1.6;">${safeMessage}</p></div>` : ''}
            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;border-top:1px solid #f1f5f9;padding-top:20px;">${escapeHtml(date)}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.resend.emails.send({
      from: `Botiko.pl <${env.RESEND_FROM_EMAIL}>`,
      to: 'kontakt@botiko.pl',
      subject: `Nowa opinia ${data.rating}/5 — ${data.userName}`,
      html,
    });
  }

  async sendContactEmail(data: ContactFormData): Promise<void> {
    if (!this.resend) return;

    const date = new Date().toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeTopic = escapeHtml(data.topic);
    const safeCompany = escapeHtml(data.company ?? '');
    const safeWebsite = escapeHtml(data.website ?? '');
    const safeMessage = escapeHtml(data.message);
    const safeDate = escapeHtml(date);

    const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:#6366F1;border-radius:10px 10px 0 0;padding:24px 28px;">
            <p style="margin:0;font-size:13px;color:#c7d2fe;letter-spacing:0.05em;text-transform:uppercase;">Botiko.pl</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">
              Nowa wiadomość z formularza kontaktowego
            </h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;">
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;width:110px;border-bottom:1px solid #e2e8f0;">Imię</td>
                <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">E-mail</td>
                <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeEmail}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Temat</td>
                <td style="padding:12px 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeTopic}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Firma</td>
                <td style="padding:12px 16px;color:#475569;border-bottom:1px solid #e2e8f0;">${safeCompany || '—'}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Strona</td>
                <td style="padding:12px 16px;color:#475569;border-bottom:1px solid #e2e8f0;">${safeWebsite || '—'}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#64748b;">Data</td>
                <td style="padding:12px 16px;color:#475569;">${safeDate}</td>
              </tr>
            </table>

            <div style="margin:18px 0 0;padding:14px 16px;background:#0b12241a;border:1px solid #e2e8f0;border-radius:8px;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Wiadomość</p>
              <pre style="margin:0;white-space:pre-wrap;font-family:ui-monospace,Consolas,monospace;font-size:13px;line-height:1.5;color:#0f172a;">${safeMessage}</pre>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await this.resend.emails.send({
        from: `Botiko.pl <${env.RESEND_FROM_EMAIL}>`,
        to: 'kontakt@botiko.pl',
        replyTo: data.email,
        subject: `Botiko — kontakt: ${data.topic}`,
        html,
      });
    } catch (err: unknown) {
      this.logger.error('Failed to send contact email', err);
    }
  }
}

interface EmailVars {
  name: string;
  phone: string;
  botName: string;
  date: string;
  dashboardUrl: string;
}

function buildLeadEmailHtml(vars: EmailVars): string {
  // Phone displayed as plain text — avoid XSS in email clients
  const safeName = escapeHtml(vars.name);
  const safePhone = escapeHtml(vars.phone);
  const safeBotName = escapeHtml(vars.botName);
  const safeDate = escapeHtml(vars.date);

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#6366F1;border-radius:10px 10px 0 0;padding:24px 28px;">
            <p style="margin:0;font-size:13px;color:#c7d2fe;letter-spacing:0.05em;text-transform:uppercase;">Botiko.pl</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">
              Nowy kontakt od klienta!
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px;">

            <p style="margin:0 0 20px;font-size:15px;color:#475569;">
              Bot <strong style="color:#0f172a;">${safeBotName}</strong> zebrał nowy kontakt:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;">
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;width:90px;border-bottom:1px solid #e2e8f0;">Imię</td>
                <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Telefon</td>
                <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;font-size:16px;">${safePhone}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:12px 16px;color:#64748b;">Data</td>
                <td style="padding:12px 16px;color:#475569;">${safeDate}</td>
              </tr>
            </table>

            <div style="margin:28px 0;text-align:center;">
              <a href="${vars.dashboardUrl}/leads"
                style="display:inline-block;background:#6366F1;color:#fff;text-decoration:none;
                       padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                Zobacz w dashboardzie →
              </a>
            </div>

            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;border-top:1px solid #f1f5f9;padding-top:20px;">
              Botiko.pl — bot który odpowiada za Ciebie
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
