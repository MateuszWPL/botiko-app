import { baseLayout, escapeHtml } from './base-layout';

const APP_URL = process.env.APP_URL ?? 'https://botiko.pl';

interface PaymentConfirmedVars {
  firstName: string;
  amount: string;
  paymentMethod: string;
  last4: string;
  nextPaymentDate: string;
}

export function paymentConfirmedEmail(vars: PaymentConfirmedVars): {
  subject: string;
  html: string;
} {
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Cześć ${escapeHtml(vars.firstName)},
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Płatność przyjęta. Plan STARTER aktywny.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Kwota</td>
        <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(vars.amount)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Metoda płatności</td>
        <td style="padding:12px 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(vars.paymentMethod)} *${escapeHtml(vars.last4)}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;">Następna płatność</td>
        <td style="padding:12px 16px;color:#0f172a;">${escapeHtml(vars.nextPaymentDate)}</td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">
      Anulować subskrypcję możesz zawsze w zakładce Billing.
      Pieniądze nie są zwracane za bieżący miesiąc, ale dostęp pozostaje aktywny do końca okresu.
    </p>
    <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">
      Pytania do faktury? Odpisz na tego maila.
    </p>`;

  return {
    subject: 'Płatność przyjęta. Botiko aktywne.',
    html: baseLayout({
      title: 'Płatność przyjęta. Plan STARTER aktywny.',
      headerColor: '#10B981',
      body,
      ctaText: 'Przejdź do dashboardu',
      ctaUrl: `${APP_URL}/dashboard/overview`,
    }),
  };
}

interface RecurringInvoiceVars {
  month: string;
  year: string;
  amount: string;
  paymentMethod: string;
  last4: string;
  periodStart: string;
  periodEnd: string;
  invoiceUrl: string;
}

export function recurringInvoiceEmail(vars: RecurringInvoiceVars): {
  subject: string;
  html: string;
} {
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Faktura VAT za miesiąc ${escapeHtml(vars.month)}/${escapeHtml(vars.year)}.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Kwota</td>
        <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(vars.amount)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Okres</td>
        <td style="padding:12px 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;">od ${escapeHtml(vars.periodStart)} do ${escapeHtml(vars.periodEnd)}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;">Metoda płatności</td>
        <td style="padding:12px 16px;color:#0f172a;">${escapeHtml(vars.paymentMethod)} *${escapeHtml(vars.last4)}</td>
      </tr>
    </table>`;

  return {
    subject: `Faktura VAT Botiko ${escapeHtml(vars.month)}/${escapeHtml(vars.year)}`,
    html: baseLayout({
      title: `Faktura VAT ${escapeHtml(vars.month)}/${escapeHtml(vars.year)}`,
      body,
      ctaText: 'Pobierz fakturę',
      ctaUrl: vars.invoiceUrl,
    }),
  };
}

interface PaymentFailedVars {
  firstName: string;
  paymentMethod: string;
  last4: string;
  retryDate: string;
}

export function paymentFailedEmail(vars: PaymentFailedVars): {
  subject: string;
  html: string;
} {
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Cześć ${escapeHtml(vars.firstName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Nasz system nie mógł pobrać płatności z karty ${escapeHtml(vars.paymentMethod)} *${escapeHtml(vars.last4)}.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">Typowe powody:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>Karta wygasła</li>
      <li>Brak środków</li>
      <li>Bank zablokował płatność (bezpieczeństwo)</li>
    </ul>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Bot dalej działa, mamy kilka dni na ponowną próbę.
      Jeśli nie zaktualizujesz do <strong>${escapeHtml(vars.retryDate)}</strong>, bot zostanie wstrzymany.
    </p>`;

  return {
    subject: 'Problem z płatnością: zaktualizuj kartę',
    html: baseLayout({
      title: 'Problem z płatnością',
      headerColor: '#DC2626',
      body,
      ctaText: 'Zaktualizuj kartę',
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  };
}

interface SubscriptionCancelledVars {
  firstName: string;
  endDate: string;
}

export function subscriptionCancelledEmail(vars: SubscriptionCancelledVars): {
  subject: string;
  html: string;
} {
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Cześć ${escapeHtml(vars.firstName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Anulowałeś subskrypcję Botiko. Bez problemu.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">Co dalej:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>Bot pracuje do <strong>${escapeHtml(vars.endDate)}</strong> (za opłacony okres)</li>
      <li>Po tej dacie widget przestanie odpowiadać</li>
      <li>Leady i dane zostają 30 dni, potem RODO wyczyszczenie</li>
      <li>Możesz reaktywować plan kiedy zechcesz, dane wrócą</li>
    </ul>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Jedna prośba: odpisz na tego maila jednym zdaniem dlaczego odchodzisz.
      To dla nas najważniejszy feedback.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: 'Subskrypcja anulowana: potwierdzenie',
    html: baseLayout({
      title: 'Subskrypcja anulowana',
      headerColor: '#64748B',
      body,
      ctaText: 'Reaktywuj plan',
      ctaUrl: `${APP_URL}/dashboard/billing`,
    }),
  };
}
