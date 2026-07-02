/** Pure utility functions extracted from ChatWindow and embed — fully testable. */

export interface SessionData {
  sessionId: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  userMessageCount: number;
  leadSubmitted: boolean;
}

/**
 * Picks a readable foreground (near-black or white) for text/icons sitting on
 * top of the given hex background. YIQ luminance — cheap, no deps. Falls back
 * to white for malformed input (keeps prior behaviour on odd values).
 */
export function onPrimary(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length < 6) return '#fff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '#fff';
  // YIQ ≥ 140 → light background → use dark text; else white.
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#0f172a' : '#fff';
}

/** Returns true when the current pathname is a CMS admin panel that should suppress the widget. */
export function isAdminPath(pathname: string): boolean {
  return ['/wp-admin', '/wp-login.php', '/administrator'].some((p) =>
    pathname.startsWith(p),
  );
}

/** Returns true when the salon is physically closed — bot still works, used only for the info banner. */
export function isSalonClosed(
  start: number | null,
  end: number | null,
  days: number[],
): boolean {
  if (start === null || end === null || days.length === 0) return false;
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (!days.includes(day)) return true;
  if (end >= 24) return false;
  return hour < start || hour >= end;
}

/** Lenient phone check — 9-15 digits covers PL local (9) and international. */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

/** Pretty-prints common Polish formats; leaves anything else as typed. */
export function formatPhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!trimmed.startsWith('+') && digits.length === 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  if (digits.length === 11 && digits.startsWith('48')) {
    return `+48 ${digits.slice(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`;
  }
  return trimmed;
}

/**
 * Maps HTTP status + optional error code to a user-visible message.
 * For 403 plan-limit errors, calls showLeadFormCallback before returning.
 */
export function errorMessageForStatus(
  status: number,
  code: string | undefined,
  showLeadFormCallback: () => void,
): string {
  if (status === 400) {
    return 'Nie mogę przetworzyć tej wiadomości. Spróbuj sformułować pytanie inaczej.';
  }
  if (status === 403) {
    if (code === 'DOMAIN_NOT_ALLOWED' || code === 'SERVICE_INACTIVE') {
      return 'Bot jest chwilowo niedostępny.';
    }
    showLeadFormCallback();
    return 'Dziękuję za rozmowę! Zostaw swój numer — odezwiemy się i odpowiemy na wszystkie pytania.';
  }
  if (status === 429) {
    return 'Zbyt wiele wiadomości z rzędu. Odczekaj chwilę i spróbuj ponownie.';
  }
  return 'Mamy chwilową przerwę techniczną. Spróbuj za moment — zwykle trwa to kilka sekund.';
}

export const ABORT_ERROR_MSG =
  'Odpowiedź trwa za długo. Spróbuj ponownie lub napisz krótsze pytanie.';

/** Parses an SSE buffer into events; returns leftover (incomplete frame). */
export interface StreamEvent {
  type: 'delta' | 'done';
  text?: string;
  showLeadForm?: boolean;
}

export function parseSseFrames(buffer: string): {
  events: StreamEvent[];
  rest: string;
} {
  const events: StreamEvent[] = [];
  let rest = buffer;
  let idx: number;
  while ((idx = rest.indexOf('\n\n')) !== -1) {
    const frame = rest.slice(0, idx);
    rest = rest.slice(idx + 2);
    for (const line of frame.split('\n')) {
      if (line.startsWith('data:')) {
        try {
          events.push(JSON.parse(line.slice(5).trim()) as StreamEvent);
        } catch {
          // skip malformed
        }
      }
    }
  }
  return { events, rest };
}

export function generateSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadSession(botId: string, welcomeMessage: string): SessionData {
  try {
    const raw = sessionStorage.getItem(`botiko_${botId}`);
    if (raw) {
      const data = JSON.parse(raw) as Partial<SessionData>;
      if (data.sessionId && Array.isArray(data.messages) && data.messages.length > 0) {
        return {
          sessionId: data.sessionId,
          messages: data.messages,
          userMessageCount: data.userMessageCount ?? 0,
          leadSubmitted: data.leadSubmitted ?? false,
        };
      }
    }
  } catch {
    // ignore — use defaults
  }
  return {
    sessionId: generateSessionId(),
    messages: [{ role: 'assistant', content: welcomeMessage }],
    userMessageCount: 0,
    leadSubmitted: false,
  };
}

export function saveSession(botId: string, data: SessionData): void {
  try {
    sessionStorage.setItem(`botiko_${botId}`, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private mode, quota exceeded) — ignore
  }
}
