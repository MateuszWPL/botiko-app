import { baseLayout, escapeHtml } from './base-layout';

const APP_URL = process.env.APP_URL ?? 'https://botiko.pl';

interface WelcomeVars {
  firstName: string;
  unsubscribeUrl: string;
}

export function welcomeEmail(vars: WelcomeVars): { subject: string; html: string } {
  const name = escapeHtml(vars.firstName);
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Cześć ${name},
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Dzięki za rejestrację w Botiko. Twoje konto jest gotowe.
      Masz <strong style="color:#6366F1;">14 dni trialu</strong> — bez karty, bez umowy.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">
      Żeby bot zaczął odpowiadać za Ciebie, zrób 3 rzeczy:
    </p>
    <ol style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>Uzupełnij dane firmy <span style="color:#94a3b8;">(2 min)</span></li>
      <li>Dodaj cennik, godziny pracy i FAQ do bazy wiedzy <span style="color:#94a3b8;">(5 min)</span></li>
      <li>Wklej kod na swoją stronę <span style="color:#94a3b8;">(3 min)</span></li>
    </ol>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
      Jak coś nie zadziała — odpisz na tego maila. Czytamy wszystko.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: 'Witaj w Botiko — zacznijmy od 5 minut konfiguracji',
    html: baseLayout({
      title: 'Konto gotowe. Twoj bot czeka na dane.',
      body,
      ctaText: 'Dokoncz konfiguracje',
      ctaUrl: `${APP_URL}/dashboard/overview`,
      showUnsubscribe: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

interface OnboardingReminderVars {
  firstName: string;
  unsubscribeUrl: string;
}

export function onboardingReminderD1Email(vars: OnboardingReminderVars): { subject: string; html: string } {
  const name = escapeHtml(vars.firstName);
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">Cześć ${name},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Widzimy, że konfiguracja bota utknęła. To normalne —
      najczęstszy powód to etap &quot;co wpisać do bazy wiedzy&quot;.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">Krótka rada: zacznij od tego co masz pod ręką.</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>Cennik — skopiuj jak jest, bot sam sobie poradzi</li>
      <li>Godziny pracy — jedna linijka wystarczy</li>
      <li>5–10 najczęstszych pytań które dostajesz telefonicznie</li>
    </ul>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
      Bot nie potrzebuje idealnie ułożonej wiedzy. Potrzebuje Twojej rzeczywistej
      — takiej jaką przekazujesz klientowi gdy dzwoni.
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
      Utknąłeś na konkretnym kroku? Odpisz na tego maila i powiedz na czym — pomogę osobiście.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: 'Twój bot czeka — zostało 10 minut',
    html: baseLayout({
      title: 'Wróć do konfiguracji',
      body,
      ctaText: 'Wróć do konfiguracji',
      ctaUrl: `${APP_URL}/dashboard/overview`,
      showUnsubscribe: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

interface TrialHalfwayVars {
  firstName: string;
  leadsCount: number;
  conversationsCount: number;
  topQuestion: string;
  unsubscribeUrl: string;
}

export function trialHalfwayD7Email(vars: TrialHalfwayVars): { subject: string; html: string } {
  const name = escapeHtml(vars.firstName);
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">Cześć ${name},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Minął tydzień. Zostało 7 dni trialu. Krótkie podsumowanie:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Rozmów</td>
        <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;">${vars.conversationsCount}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Leadów zebranych</td>
        <td style="padding:12px 16px;font-weight:600;color:#10B981;border-bottom:1px solid #e2e8f0;">${vars.leadsCount}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;">Najczęstsze pytanie</td>
        <td style="padding:12px 16px;color:#0f172a;">&quot;${escapeHtml(vars.topQuestion)}&quot;</td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Jeśli bot zebrał choć jednego leada który udało Ci się zamienić w klienta
      — subskrypcja już się zwróciła.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Jeśli liczby Cię nie powalają — napisz dlaczego. Każdy problem rozwiązujemy w 10 minut.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: `${vars.leadsCount > 0 ? `${vars.leadsCount} leadów w tydzień. Warto?` : 'Półmetek trialu — podsumowanie'}`,
    html: baseLayout({
      title: 'Tydzień z Botiko — oto co się wydarzyło',
      body,
      ctaText: 'Zobacz statystyki',
      ctaUrl: `${APP_URL}/dashboard/overview`,
      showUnsubscribe: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

interface TrialConversionVars {
  firstName: string;
  leadsCount: number;
  conversationsCount: number;
  trialEndsAt: string;
  unsubscribeUrl: string;
}

export function trialConversionD12Email(vars: TrialConversionVars): { subject: string; html: string } {
  const name = escapeHtml(vars.firstName);
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">Cześć ${name},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Twój trial kończy się <strong>${escapeHtml(vars.trialEndsAt)}</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">Leadów zebranych</td>
        <td style="padding:12px 16px;font-weight:600;color:#10B981;border-bottom:1px solid #e2e8f0;">${vars.leadsCount}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#64748b;">Rozmów z klientami</td>
        <td style="padding:12px 16px;font-weight:600;color:#0f172a;">${vars.conversationsCount}</td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Żeby bot dalej pracował — aktywuj subskrypcję. <strong style="color:#6366F1;">99 zł miesięcznie.</strong>
      Bez umowy. Anulujesz jednym kliknięciem.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Masz wątpliwości? Odpisz na tego maila. Jeśli coś nie działa jak powinno — naprawimy to zanim zapłacisz.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: `${name}, zostały 2 dni. Zostajesz?`,
    html: baseLayout({
      title: '2 dni do końca trialu — co dalej?',
      headerColor: '#F59E0B',
      body,
      ctaText: 'Aktywuj plan — 99 zł/mies.',
      ctaUrl: `${APP_URL}/dashboard/billing`,
      showUnsubscribe: true,
      unsubscribeUrl: vars.unsubscribeUrl,
    }),
  };
}

interface TrialExpiredVars {
  firstName: string;
  unsubscribeUrl: string;
}

export function trialExpiredD14Email(vars: TrialExpiredVars): { subject: string; html: string } {
  const name = escapeHtml(vars.firstName);
  const body = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">Cześć ${name},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Trial zakończony. Bot przestał odpowiadać na stronie Twojej firmy.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">Twoje dane są bezpieczne:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
      <li>Leady i historia rozmów — zostają 30 dni</li>
      <li>Baza wiedzy — zostaje na koncie</li>
      <li>Po 30 dniach wszystko jest bezpowrotnie usuwane (RODO)</li>
    </ul>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Jeśli nie wracasz — pomóż nam zrozumieć dlaczego. Odpisz jednym zdaniem:
      za drogo / brak ruchu na stronie / bot nie działał jak oczekiwałem / inne.
    </p>
    <p style="margin:0;font-size:14px;color:#475569;">Zespół Botiko</p>`;

  return {
    subject: 'Twój bot właśnie się wyłączył',
    html: baseLayout({
      title: 'Trial zakończony — co teraz z Twoimi danymi',
      headerColor: '#64748B',
      body,
      ctaText: 'Reaktywuj plan',
      ctaUrl: `${APP_URL}/dashboard/billing`,
      showUnsubscribe: false,
    }),
  };
}
