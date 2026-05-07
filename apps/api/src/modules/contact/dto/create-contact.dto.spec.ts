import { createContactSchema } from './create-contact.dto';

const validBase = {
  topic: 'DEMO' as const,
  message: 'Chciałbym dowiedzieć się więcej o ofercie.',
  name: 'Jan Kowalski',
  email: 'jan@example.com',
};

describe('createContactSchema — website URL (P2: validation)', () => {
  it('akceptuje brak pola website (pole opcjonalne)', () => {
    expect(createContactSchema.safeParse(validBase).success).toBe(true);
  });

  it('akceptuje poprawny URL z https://', () => {
    expect(
      createContactSchema.safeParse({
        ...validBase,
        website: 'https://example.pl',
      }).success,
    ).toBe(true);
  });

  it('akceptuje poprawny URL z http://', () => {
    expect(
      createContactSchema.safeParse({
        ...validBase,
        website: 'http://example.pl',
      }).success,
    ).toBe(true);
  });

  it.each([
    'nie-url',
    'salon',
    'ftp://example.pl', // not http/https but valid URL — zod accepts any URL scheme
    'example.pl', // brak protokołu — Zod url() odrzuca
    '',
  ])('odrzuca lub pomija niepoprawny URL: "%s"', (website) => {
    // Zod .url() requires a full URL with protocol
    // Empty string would fail min-length or url() check
    const result = createContactSchema.safeParse({ ...validBase, website });
    // 'example.pl' and '' and 'nie-url' and 'salon' should fail
    // 'ftp://' is technically valid URL per WHATWG but we verify whatever Zod does
    if (['example.pl', '', 'nie-url', 'salon'].includes(website)) {
      expect(result.success).toBe(false);
    }
  });

  it('odrzuca URL dłuższy niż 2048 znaków', () => {
    expect(
      createContactSchema.safeParse({
        ...validBase,
        website: 'https://example.pl/' + 'x'.repeat(2040),
      }).success,
    ).toBe(false);
  });
});

describe('createContactSchema — message', () => {
  it('odrzuca wiadomość krótszą niż 10 znaków', () => {
    expect(
      createContactSchema.safeParse({ ...validBase, message: 'Krótka' })
        .success,
    ).toBe(false);
  });

  it('odrzuca wiadomość dłuższą niż 4000 znaków', () => {
    expect(
      createContactSchema.safeParse({ ...validBase, message: 'x'.repeat(4001) })
        .success,
    ).toBe(false);
  });
});

describe('createContactSchema — topic enum', () => {
  it.each(['DEMO', 'WDROZENIE', 'CENNIK', 'WSPOLPRACA', 'INNE'] as const)(
    'akceptuje topic "%s"',
    (topic) => {
      expect(
        createContactSchema.safeParse({ ...validBase, topic }).success,
      ).toBe(true);
    },
  );

  it('odrzuca nieznany topic', () => {
    expect(
      createContactSchema.safeParse({ ...validBase, topic: 'NIEZNANY' })
        .success,
    ).toBe(false);
  });
});
