export interface BaseLayoutOptions {
  title: string;
  headerColor?: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  showUnsubscribe?: boolean;
  unsubscribeUrl?: string;
}

const APP_URL = process.env.APP_URL ?? 'https://botiko.pl';

export function baseLayout(opts: BaseLayoutOptions): string {
  const headerColor = opts.headerColor ?? '#6366F1';
  const footer = `
    <td style="padding:20px 28px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="margin:0 0 10px;">
        <img src="${APP_URL}/botiko-mail-logo.png" alt="Botiko.pl" width="100" height="27" style="display:inline-block;">
      </p>
      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
        Bot obsługi klienta 24/7<br>
        <a href="${APP_URL}/regulamin" style="color:#94a3b8;">Regulamin</a> ·
        <a href="${APP_URL}/prywatnosc" style="color:#94a3b8;">Polityka prywatności</a>
        ${
          opts.showUnsubscribe && opts.unsubscribeUrl
            ? ` · <a href="${opts.unsubscribeUrl}" style="color:#94a3b8;">Wypisz się z newslettera</a>`
            : ''
        }
      </p>
    </td>`;

  const cta =
    opts.ctaText && opts.ctaUrl
      ? `<div style="text-align:center;margin:24px 0;">
        <a href="${opts.ctaUrl}"
          style="display:inline-block;background:${headerColor};color:#fff;text-decoration:none;
                 padding:13px 32px;border-radius:8px;font-weight:600;font-size:15px;">
          ${opts.ctaText}
        </a>
      </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:${headerColor};border-radius:10px 10px 0 0;padding:24px 28px;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:0.07em;text-transform:uppercase;">Botiko.pl</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">${opts.title}</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px;">
            ${opts.body}
            ${cta}
          </td>
        </tr>
        <tr>${footer}</tr>
        <tr>
          <td style="border-radius:0 0 10px 10px;background:#fff;border:1px solid #e2e8f0;border-top:none;height:4px;"></td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
