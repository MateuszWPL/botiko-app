import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isAdminPath,
  isSalonClosed,
  isValidPhone,
  formatPhone,
  errorMessageForStatus,
  parseSseFrames,
  loadSession,
  saveSession,
  onPrimary,
  sanitizeHex,
  ABORT_ERROR_MSG,
} from './widget-utils';

// ── onPrimary, kontrastowy kolor tekstu na tle primary ──────────────────────

describe('onPrimary, czytelny kolor na tle primary', () => {
  it.each([
    ['#6366F1', '#fff'], // indygo (domyślny) → biały
    ['#0F172A', '#fff'], // ciemny → biały
    ['#EC4899', '#fff'], // róż beauty → biały
  ])('ciemne/nasycone tło %s → %s', (bg, fg) => {
    expect(onPrimary(bg)).toBe(fg);
  });

  it.each([
    ['#FDE047', '#0f172a'], // żółty → ciemny tekst
    ['#FFFFFF', '#0f172a'], // biały → ciemny tekst
    ['#A7F3D0', '#0f172a'], // jasny mięta → ciemny tekst
  ])('jasne tło %s → %s', (bg, fg) => {
    expect(onPrimary(bg)).toBe(fg);
  });

  it('zwraca biały dla niepoprawnego wejścia (fallback)', () => {
    expect(onPrimary('#xyz')).toBe('#fff');
    expect(onPrimary('')).toBe('#fff');
  });
});

// ── sanitizeHex, walidacja ręcznych kolorów z configu ───────────────────────

describe('sanitizeHex, akceptuje tylko poprawny #rrggbb', () => {
  it.each(['#FFFFFF', '#0f172a', '#6366F1'])('przepuszcza %s', (v) => {
    expect(sanitizeHex(v)).toBe(v);
  });

  it.each([
    ['#fff', null], // skrót 3-znakowy odrzucony
    ['fff000', null], // brak #
    ['#12345g', null], // nie-hex
    ['red', null], // nazwa koloru
    ['', null],
    [null, null],
    [undefined, null],
  ])('odrzuca %s → fallback (null)', (v, expected) => {
    expect(sanitizeHex(v as string | null | undefined)).toBe(expected);
  });
});

// ── isAdminPath ───────────────────────────────────────────────────────────────

describe('isAdminPath, widget nie ładuje się na panelach CMS', () => {
  it.each([
    '/wp-admin',
    '/wp-admin/post.php',
    '/wp-admin/plugins',
    '/wp-login.php',
    '/administrator',
    '/administrator/index.php',
  ])('blokuje ścieżkę "%s"', (path) => {
    expect(isAdminPath(path)).toBe(true);
  });

  it.each(['/', '/sklep', '/o-nas', '/kontakt', '/wp-content/uploads/logo.png'])(
    'przepuszcza ścieżkę "%s"',
    (path) => {
      expect(isAdminPath(path)).toBe(false);
    },
  );
});

// ── errorMessageForStatus. HTTP error handling ───────────────────────────────

describe('errorMessageForStatus, obsługa błędów HTTP', () => {
  it('HTTP 400: zwraca komunikat o złej wiadomości', () => {
    const cb = vi.fn();
    const msg = errorMessageForStatus(400, undefined, cb);
    expect(msg).toContain('Nie mogę przetworzyć tej wiadomości');
    expect(cb).not.toHaveBeenCalled();
  });

  it('HTTP 403 (PLAN_LIMIT / bez kodu): otwiera lead form i zwraca prośbę o kontakt', () => {
    const cb = vi.fn();
    const msg = errorMessageForStatus(403, undefined, cb);
    expect(cb).toHaveBeenCalledOnce();
    expect(msg).toContain('Zostaw swój numer');
  });

  it('HTTP 403 DOMAIN_NOT_ALLOWED: NIE otwiera lead form', () => {
    const cb = vi.fn();
    const msg = errorMessageForStatus(403, 'DOMAIN_NOT_ALLOWED', cb);
    expect(cb).not.toHaveBeenCalled();
    expect(msg).toContain('niedostępny');
  });

  it('HTTP 403 SERVICE_INACTIVE: NIE otwiera lead form', () => {
    const cb = vi.fn();
    const msg = errorMessageForStatus(403, 'SERVICE_INACTIVE', cb);
    expect(cb).not.toHaveBeenCalled();
    expect(msg).toContain('niedostępny');
  });

  it('HTTP 429: zwraca komunikat o zbyt wielu wiadomościach', () => {
    const cb = vi.fn();
    const msg = errorMessageForStatus(429, undefined, cb);
    expect(msg).toContain('Zbyt wiele wiadomości');
    expect(cb).not.toHaveBeenCalled();
  });

  it.each([500, 502, 503, 504])(
    'HTTP %d (5xx): zwraca komunikat o przerwie technicznej',
    (status) => {
      const msg = errorMessageForStatus(status, undefined, vi.fn());
      expect(msg).toContain('przerwę techniczną');
    },
  );
});

// ── ABORT_ERROR_MSG, timeout 30s ────────────────────────────────────────────

describe('ABORT_ERROR_MSG, komunikat po AbortError (timeout 30s)', () => {
  it('zawiera informację o przekroczeniu czasu', () => {
    expect(ABORT_ERROR_MSG).toContain('za długo');
  });
});

// ── sessionStorage per botiko_{botId} ────────────────────────────────────────

describe('saveSession / loadSession, sessionStorage per botiko_{botId}', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('saveSession zapisuje pod kluczem botiko_{botId} w sessionStorage (nie localStorage)', () => {
    saveSession('bot123', {
      sessionId: 's_abc',
      messages: [{ role: 'assistant', content: 'Dzień dobry!' }],
      userMessageCount: 0,
      leadSubmitted: false,
    });

    // Sprawdź że dane wylądowały w sessionStorage pod właściwym kluczem
    expect(sessionStorage.getItem('botiko_bot123')).not.toBeNull();
    // Sprawdź że localStorage pozostaje nienaruszony
    expect(localStorage.getItem('botiko_bot123')).toBeNull();
  });

  it('loadSession przywraca dane po odświeżeniu (sessionStorage przetrwa odświeżenie)', () => {
    const session = {
      sessionId: 's_xyz',
      messages: [
        { role: 'assistant' as const, content: 'Cześć!' },
        { role: 'user' as const, content: 'Hej' },
      ],
      userMessageCount: 1,
      leadSubmitted: false,
    };

    saveSession('botABC', session);
    const loaded = loadSession('botABC', 'welcome');

    expect(loaded.sessionId).toBe('s_xyz');
    expect(loaded.messages).toHaveLength(2);
    expect(loaded.userMessageCount).toBe(1);
  });

  it('loadSession zwraca nową sesję gdy brak danych (np. nowa zakładka)', () => {
    const loaded = loadSession('noExistBot', 'Witaj!');
    expect(loaded.messages).toHaveLength(1);
    expect(loaded.messages[0].content).toBe('Witaj!');
    expect(loaded.userMessageCount).toBe(0);
    expect(loaded.leadSubmitted).toBe(false);
  });

  it('historia NIE trafia do localStorage (znika po zamknięciu zakładki)', () => {
    const getItem = vi.spyOn(localStorage, 'getItem');
    const setItem = vi.spyOn(localStorage, 'setItem');

    saveSession('bot999', {
      sessionId: 's_test',
      messages: [{ role: 'assistant', content: 'Hej' }],
      userMessageCount: 0,
      leadSubmitted: false,
    });

    loadSession('bot999', 'welcome');

    expect(setItem).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
  });
});

// ── parseSseFrames ────────────────────────────────────────────────────────────

describe('parseSseFrames, parsowanie SSE', () => {
  it('parsuje kompletną ramkę delta', () => {
    const buf = 'data: {"type":"delta","text":"cześć"}\n\n';
    const { events, rest } = parseSseFrames(buf);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ type: 'delta', text: 'cześć' });
    expect(rest).toBe('');
  });

  it('parsuje ramkę done z showLeadForm', () => {
    const buf = 'data: {"type":"done","showLeadForm":true}\n\n';
    const { events } = parseSseFrames(buf);
    expect(events[0]).toEqual({ type: 'done', showLeadForm: true });
  });

  it('zwraca resztę jako rest gdy ramka niekompletna', () => {
    const buf = 'data: {"type":"delta","text":"cz';
    const { events, rest } = parseSseFrames(buf);
    expect(events).toHaveLength(0);
    expect(rest).toBe(buf);
  });

  it('parsuje wiele ramek naraz', () => {
    const buf =
      'data: {"type":"delta","text":"A"}\n\ndata: {"type":"delta","text":"B"}\n\n';
    const { events } = parseSseFrames(buf);
    expect(events).toHaveLength(2);
    expect(events[0].text).toBe('A');
    expect(events[1].text).toBe('B');
  });

  it('pomija malformed JSON bez rzucania wyjątku', () => {
    const buf = 'data: {BROKEN}\n\n';
    expect(() => parseSseFrames(buf)).not.toThrow();
    const { events } = parseSseFrames(buf);
    expect(events).toHaveLength(0);
  });
});

// ── isValidPhone / formatPhone ────────────────────────────────────────────────

describe('isValidPhone, walidacja telefonu w lead form', () => {
  it.each(['+48 600 100 200', '600100200', '0048600100200'])(
    'akceptuje "%s"',
    (phone) => {
      expect(isValidPhone(phone)).toBe(true);
    },
  );

  it.each(['12345', 'abc', ''])(
    'odrzuca "%s"',
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    },
  );
});

describe('formatPhone, formatowanie polskich numerów', () => {
  it('9-cyfrowy numer bez prefiksu → xxx xxx xxx', () => {
    expect(formatPhone('600100200')).toBe('600 100 200');
  });

  it('11-cyfrowy z prefiksem 48 → +48 xxx xxx xxx', () => {
    expect(formatPhone('48600100200')).toBe('+48 600 100 200');
  });

  it('numer z + zostawia bez zmian (trim)', () => {
    expect(formatPhone('+48 600 100 200')).toBe('+48 600 100 200');
  });
});

// ── isSalonClosed ─────────────────────────────────────────────────────────────

describe('isSalonClosed, banner informacyjny (bot zawsze odpowiada)', () => {
  it('zwraca false gdy brak konfiguracji godzin', () => {
    expect(isSalonClosed(null, null, [])).toBe(false);
    expect(isSalonClosed(9, 17, [])).toBe(false);
  });

  it('zwraca true gdy dzisiaj nie jest dniem pracy', () => {
    // Wymuszamy dzień 0 (niedziela) jako dzień poza listą [1,2,3,4,5]
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:00:00')); // poniedziałek = 1
    expect(isSalonClosed(9, 17, [2, 3, 4, 5, 6])).toBe(true); // pon. nie ma na liście
    vi.useRealTimers();
  });

  it('zwraca false gdy end >= 24 (całą dobę)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T03:00:00')); // godzina 3 rano
    expect(isSalonClosed(0, 24, [1])).toBe(false);
    vi.useRealTimers();
  });
});
