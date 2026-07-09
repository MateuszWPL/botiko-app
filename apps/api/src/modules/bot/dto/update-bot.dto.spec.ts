import { updateBotSchema } from './update-bot.dto';

describe('updateBotSchema: linki http(s) (bezpieczeństwo: blokada javascript:/data:)', () => {
  // Każde z tych pól używa helpera httpUrl(), te same reguły dla wszystkich.
  const urlFields = ['websiteUrl', 'googleMapsUrl', 'reservationUrl'] as const;

  it.each(urlFields)('akceptuje poprawny https:// w polu "%s"', (field) => {
    expect(
      updateBotSchema.safeParse({ [field]: 'https://przyklad.pl/miejsce' })
        .success,
    ).toBe(true);
  });

  it.each(urlFields)('akceptuje http:// w polu "%s"', (field) => {
    expect(
      updateBotSchema.safeParse({ [field]: 'http://przyklad.pl' }).success,
    ).toBe(true);
  });

  it.each(urlFields)(
    'ODRZUCA schemat javascript: w polu "%s" (XSS przez href)',
    (field) => {
      expect(
        updateBotSchema.safeParse({ [field]: 'javascript:alert(1)' }).success,
      ).toBe(false);
    },
  );

  it.each(urlFields)(
    'ODRZUCA schemat data: w polu "%s" (data-URI injection)',
    (field) => {
      expect(
        updateBotSchema.safeParse({
          [field]: 'data:text/html,<script>alert(1)</script>',
        }).success,
      ).toBe(false);
    },
  );

  it.each(urlFields)('ODRZUCA schemat ftp:// w polu "%s"', (field) => {
    // Zod .url() sam w sobie przepuszcza ftp:, refine http(s) musi to złapać.
    expect(
      updateBotSchema.safeParse({ [field]: 'ftp://przyklad.pl' }).success,
    ).toBe(false);
  });

  it.each(urlFields)(
    'akceptuje pusty string w polu "%s" (wyczyszczenie linku)',
    (field) => {
      expect(updateBotSchema.safeParse({ [field]: '' }).success).toBe(true);
    },
  );

  it.each(urlFields)('akceptuje null w polu "%s"', (field) => {
    expect(updateBotSchema.safeParse({ [field]: null }).success).toBe(true);
  });

  it('odrzuca websiteUrl dłuższy niż 500 znaków', () => {
    expect(
      updateBotSchema.safeParse({
        websiteUrl: 'https://przyklad.pl/' + 'x'.repeat(500),
      }).success,
    ).toBe(false);
  });

  it('googleMapsUrl dopuszcza dłuższe linki (limit 1000): długie URL-e Maps', () => {
    expect(
      updateBotSchema.safeParse({
        googleMapsUrl: 'https://maps.google.com/?q=' + 'x'.repeat(900),
      }).success,
    ).toBe(true);
  });
});

describe('updateBotSchema: companyEmail', () => {
  it('akceptuje poprawny e-mail', () => {
    expect(
      updateBotSchema.safeParse({ companyEmail: 'kontakt@przyklad.pl' })
        .success,
    ).toBe(true);
  });

  it('akceptuje pusty string (wyczyszczenie)', () => {
    expect(updateBotSchema.safeParse({ companyEmail: '' }).success).toBe(true);
  });

  it('akceptuje null', () => {
    expect(updateBotSchema.safeParse({ companyEmail: null }).success).toBe(
      true,
    );
  });

  it('odrzuca niepoprawny e-mail', () => {
    expect(
      updateBotSchema.safeParse({ companyEmail: 'nie-email' }).success,
    ).toBe(false);
  });

  it('odrzuca e-mail dłuższy niż 200 znaków', () => {
    expect(
      updateBotSchema.safeParse({
        companyEmail: 'x'.repeat(196) + '@a.pl',
      }).success,
    ).toBe(false);
  });
});

describe('updateBotSchema: nowe pola firmowe (nip, owner)', () => {
  it('akceptuje nip i owner w granicach limitów', () => {
    expect(
      updateBotSchema.safeParse({
        nip: '123-456-32-18',
        owner: 'Jan Kowalski',
      }).success,
    ).toBe(true);
  });

  it('akceptuje null dla nip/owner', () => {
    expect(updateBotSchema.safeParse({ nip: null, owner: null }).success).toBe(
      true,
    );
  });

  it('odrzuca nip dłuższy niż 20 znaków', () => {
    expect(updateBotSchema.safeParse({ nip: 'x'.repeat(21) }).success).toBe(
      false,
    );
  });

  it('odrzuca owner dłuższy niż 200 znaków', () => {
    expect(updateBotSchema.safeParse({ owner: 'x'.repeat(201) }).success).toBe(
      false,
    );
  });

  it('trimmuje owner', () => {
    const result = updateBotSchema.safeParse({ owner: '  Jan Kowalski  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.owner).toBe('Jan Kowalski');
    }
  });
});

describe('updateBotSchema: allowedDomains', () => {
  it('akceptuje do 5 domen', () => {
    expect(
      updateBotSchema.safeParse({
        allowedDomains: [
          'https://a.pl',
          'https://b.pl',
          'https://c.pl',
          'https://d.pl',
          'https://e.pl',
        ],
      }).success,
    ).toBe(true);
  });

  it('odrzuca więcej niż 5 domen', () => {
    expect(
      updateBotSchema.safeParse({
        allowedDomains: [
          'https://a.pl',
          'https://b.pl',
          'https://c.pl',
          'https://d.pl',
          'https://e.pl',
          'https://f.pl',
        ],
      }).success,
    ).toBe(false);
  });

  it('odrzuca domenę bez poprawnego URL', () => {
    expect(
      updateBotSchema.safeParse({ allowedDomains: ['nie-url'] }).success,
    ).toBe(false);
  });
});

describe('updateBotSchema: primaryColor (hex)', () => {
  it('akceptuje poprawny hex 6-znakowy', () => {
    expect(updateBotSchema.safeParse({ primaryColor: '#6366F1' }).success).toBe(
      true,
    );
  });

  it.each(['#FFF', '6366F1', 'red', '#GGGGGG'])(
    'odrzuca niepoprawny kolor "%s"',
    (primaryColor) => {
      expect(updateBotSchema.safeParse({ primaryColor }).success).toBe(false);
    },
  );
});

describe('updateBotSchema: textColor / logoBgColor (ręczne kolory, nullable)', () => {
  it('akceptuje poprawny hex oraz null (czyszczenie override)', () => {
    expect(updateBotSchema.safeParse({ textColor: '#FFFFFF' }).success).toBe(
      true,
    );
    expect(updateBotSchema.safeParse({ textColor: null }).success).toBe(true);
    expect(updateBotSchema.safeParse({ logoBgColor: '#0F172A' }).success).toBe(
      true,
    );
    expect(updateBotSchema.safeParse({ logoBgColor: null }).success).toBe(true);
  });

  it.each(['#FFF', 'white', '6366F1', '#GGGGGG'])(
    'odrzuca niepoprawny kolor "%s"',
    (bad) => {
      expect(updateBotSchema.safeParse({ textColor: bad }).success).toBe(false);
      expect(updateBotSchema.safeParse({ logoBgColor: bad }).success).toBe(
        false,
      );
    },
  );
});

describe('updateBotSchema: godziny otwarcia (refine start < end)', () => {
  it('akceptuje start < end', () => {
    expect(
      updateBotSchema.safeParse({
        businessHoursStart: 9,
        businessHoursEnd: 17,
      }).success,
    ).toBe(true);
  });

  it('odrzuca start >= end', () => {
    expect(
      updateBotSchema.safeParse({
        businessHoursStart: 18,
        businessHoursEnd: 9,
      }).success,
    ).toBe(false);
  });

  it('nie waliduje relacji, gdy podano tylko jedną godzinę', () => {
    expect(updateBotSchema.safeParse({ businessHoursStart: 18 }).success).toBe(
      true,
    );
  });
});

describe('updateBotSchema: pusty payload', () => {
  it('akceptuje pusty obiekt (wszystkie pola opcjonalne)', () => {
    expect(updateBotSchema.safeParse({}).success).toBe(true);
  });
});
