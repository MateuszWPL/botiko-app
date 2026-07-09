import { chatMessageSchema } from './chat-message.dto';

const VALID_CUID = 'cjld2cjxh0000qzrmn831i7rn';
const VALID_SESSION = 's_abc123';

describe('chatMessageSchema: botId (P2: CUID validation)', () => {
  it('akceptuje poprawny CUID', () => {
    expect(
      chatMessageSchema.safeParse({
        botId: VALID_CUID,
        sessionId: VALID_SESSION,
        message: 'cześć',
      }).success,
    ).toBe(true);
  });

  it.each([
    'nie-cuid',
    '123',
    '',
    'uuid-style-but-not-cuid-xxxxxxxx-xxxx-xxxx',
  ])('odrzuca botId "%s" (nie jest CUID)', (botId) => {
    expect(
      chatMessageSchema.safeParse({
        botId,
        sessionId: VALID_SESSION,
        message: 'cześć',
      }).success,
    ).toBe(false);
  });
});

describe('chatMessageSchema: message (P0: limit długości)', () => {
  it('akceptuje wiadomość do 1000 znaków', () => {
    expect(
      chatMessageSchema.safeParse({
        botId: VALID_CUID,
        sessionId: VALID_SESSION,
        message: 'x'.repeat(1000),
      }).success,
    ).toBe(true);
  });

  it('odrzuca wiadomość dłuższą niż 1000 znaków', () => {
    const result = chatMessageSchema.safeParse({
      botId: VALID_CUID,
      sessionId: VALID_SESSION,
      message: 'x'.repeat(1001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      expect(msgs.some((m) => m.toLowerCase().includes('długa'))).toBe(true);
    }
  });

  it('odrzuca pustą wiadomość', () => {
    expect(
      chatMessageSchema.safeParse({
        botId: VALID_CUID,
        sessionId: VALID_SESSION,
        message: '',
      }).success,
    ).toBe(false);
  });

  it('trimmuje wiadomość przed walidacją', () => {
    const result = chatMessageSchema.safeParse({
      botId: VALID_CUID,
      sessionId: VALID_SESSION,
      message: '  cześć  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('cześć');
    }
  });
});

describe('chatMessageSchema: sessionId', () => {
  it('odrzuca sessionId dłuższy niż 64 znaki', () => {
    expect(
      chatMessageSchema.safeParse({
        botId: VALID_CUID,
        sessionId: 'x'.repeat(65),
        message: 'cześć',
      }).success,
    ).toBe(false);
  });

  it('odrzuca sessionId ze znakami specjalnymi (tylko [a-zA-Z0-9_-])', () => {
    expect(
      chatMessageSchema.safeParse({
        botId: VALID_CUID,
        sessionId: 'session with spaces',
        message: 'cześć',
      }).success,
    ).toBe(false);
  });
});
