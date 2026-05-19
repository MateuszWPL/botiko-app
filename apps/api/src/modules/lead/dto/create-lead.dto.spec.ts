import { createLeadSchema } from './create-lead.dto';

const validBase = {
  botId: 'cjld2cjxh0000qzrmn831i7rn', // valid CUID
  name: 'Jan Kowalski',
  phone: '+48 600 123 456',
  consentGiven: true as const,
};

describe('createLeadSchema — botId (CUID validation)', () => {
  it('akceptuje poprawny CUID', () => {
    expect(createLeadSchema.safeParse(validBase).success).toBe(true);
  });

  it.each(['nie-cuid', '123', '', 'uuid-style-but-not-cuid'])(
    'odrzuca botId "%s" (nie jest CUID)',
    (botId) => {
      expect(
        createLeadSchema.safeParse({ ...validBase, botId }).success,
      ).toBe(false);
    },
  );
});

describe('createLeadSchema — walidacja telefonu', () => {
  it.each([
    '+48 600 123 456',
    '+48600123456',
    '600 123 456',
    '600-123-456',
    '+1 (555) 000-1234',
    '0048600123456',
  ])('akceptuje poprawny numer: "%s"', (phone) => {
    expect(createLeadSchema.safeParse({ ...validBase, phone }).success).toBe(
      true,
    );
  });

  it.each(['nie-numer', 'abc', '!!@@##', 'telefon: 600'])(
    'odrzuca niepoprawny numer: "%s"',
    (phone) => {
      const result = createLeadSchema.safeParse({ ...validBase, phone });
      expect(result.success).toBe(false);
    },
  );

  it('odrzuca numer krótszy niż 7 znaków', () => {
    expect(
      createLeadSchema.safeParse({ ...validBase, phone: '12345' }).success,
    ).toBe(false);
  });

  it('odrzuca numer dłuższy niż 20 znaków', () => {
    expect(
      createLeadSchema.safeParse({ ...validBase, phone: '1'.repeat(21) })
        .success,
    ).toBe(false);
  });
});

describe('createLeadSchema — zgoda RODO', () => {
  it('akceptuje consentGiven: true', () => {
    expect(
      createLeadSchema.safeParse({ ...validBase, consentGiven: true }).success,
    ).toBe(true);
  });

  it('odrzuca consentGiven: false', () => {
    expect(
      createLeadSchema.safeParse({ ...validBase, consentGiven: false }).success,
    ).toBe(false);
  });

  it('odrzuca brak pola consentGiven', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { consentGiven: _, ...withoutConsent } = validBase;
    expect(createLeadSchema.safeParse(withoutConsent).success).toBe(false);
  });
});

describe('createLeadSchema — pola opcjonalne', () => {
  it('akceptuje brak sessionId i message', () => {
    expect(createLeadSchema.safeParse(validBase).success).toBe(true);
  });

  it('odrzuca message dłuższy niż 1000 znaków', () => {
    expect(
      createLeadSchema.safeParse({ ...validBase, message: 'x'.repeat(1001) })
        .success,
    ).toBe(false);
  });
});
