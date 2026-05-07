import { registerSchema } from './register.dto';

describe('registerSchema — walidacja hasła', () => {
  const base = {
    email: 'test@example.com',
    websiteUrl: 'https://salon.pl',
    industry: 'BEAUTY' as const,
  };

  function parse(password: string) {
    return registerSchema.safeParse({ ...base, password });
  }

  it('akceptuje poprawne hasło (≥12 znaków, uppercase, cyfra)', () => {
    expect(parse('StrongPass1234').success).toBe(true);
  });

  it('odrzuca hasło krótsze niż 12 znaków', () => {
    const result = parse('Short1A');
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      expect(msgs.some((m) => m.includes('12'))).toBe(true);
    }
  });

  it('odrzuca hasło bez dużej litery', () => {
    const result = parse('lowercase1234567');
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      expect(msgs.some((m) => m.toLowerCase().includes('uppercase'))).toBe(
        true,
      );
    }
  });

  it('odrzuca hasło bez cyfry', () => {
    const result = parse('NoDigitsAtAllHere');
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      expect(msgs.some((m) => m.toLowerCase().includes('number'))).toBe(true);
    }
  });

  it('odrzuca hasło zbyt długie (>72 znaków)', () => {
    const result = parse('A1' + 'x'.repeat(72));
    expect(result.success).toBe(false);
  });

  it('akceptuje hasło dokładnie 12 znaków (granica dolna)', () => {
    expect(parse('Abcdefgh1234').success).toBe(true);
  });
});

describe('registerSchema — walidacja websiteUrl', () => {
  const base = {
    email: 'test@example.com',
    password: 'StrongPass1234',
    industry: 'BEAUTY' as const,
  };

  function parse(websiteUrl: string) {
    return registerSchema.safeParse({ ...base, websiteUrl });
  }

  it('akceptuje domenę bez protokołu i normalizuje do https://', () => {
    const result = parse('salon.pl');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.websiteUrl).toBe('https://salon.pl');
    }
  });

  it('akceptuje domenę z www (www jest zachowane — guard normalizuje podczas porównania)', () => {
    const result = parse('www.salon.pl');
    expect(result.success).toBe(true);
    if (result.success) {
      // Schema preserves www; DomainWhitelistGuard strips it during comparison
      expect(result.data.websiteUrl).toBe('https://www.salon.pl');
    }
  });

  it('akceptuje pełny URL z https://', () => {
    const result = parse('https://salon.pl');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.websiteUrl).toBe('https://salon.pl');
    }
  });

  it('odrzuca localhost', () => {
    expect(parse('localhost').success).toBe(false);
  });

  it('odrzuca słowo bez kropki (nie-domena)', () => {
    expect(parse('salon').success).toBe(false);
  });

  it('odrzuca losowy tekst niebędący URL-em', () => {
    expect(parse('to nie jest url!!!').success).toBe(false);
  });

  it('odrzuca pusty string', () => {
    expect(parse('').success).toBe(false);
  });
});

describe('registerSchema — walidacja email', () => {
  const base = {
    password: 'StrongPass1234',
    websiteUrl: 'https://salon.pl',
    industry: 'BEAUTY' as const,
  };

  it('normalizuje email do lowercase', () => {
    const result = registerSchema.safeParse({
      ...base,
      email: 'TEST@EXAMPLE.COM',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('odrzuca niepoprawny email', () => {
    expect(
      registerSchema.safeParse({ ...base, email: 'nie-email' }).success,
    ).toBe(false);
  });
});
