import { buildClassifyMessages } from './extraction-prompt';
import { classifyTextSchema } from './dto/classify-text.dto';
import { classifySaveSchema } from './dto/classify-save.dto';

describe('buildClassifyMessages', () => {
  it('zwraca dwie wiadomości: system + user', () => {
    const msgs = buildClassifyMessages(
      'Salon urody, manicure 80 zł.',
      'BEAUTY',
    );
    expect(msgs).toHaveLength(2);
    expect(msgs[0].role).toBe('system');
    expect(msgs[1].role).toBe('user');
  });

  it('system prompt NIE zawiera atrybucji źródła ani pola sourceUrl (to blob, nie podstrony)', () => {
    const [system] = buildClassifyMessages('tekst', 'OTHER');
    expect(system.content).not.toContain('===');
    expect(system.content).not.toContain('sourceUrl');
    expect(system.content).not.toContain('ATRYBUCJA');
  });

  it('user message zawiera podpowiedź branży i wklejoną treść', () => {
    const [, user] = buildClassifyMessages('Warsztat, wymiana oleju.', 'AUTO');
    expect(user.content).toContain('warsztat');
    expect(user.content).toContain('Warsztat, wymiana oleju.');
  });

  it('przycina wklejony tekst do 90 000 znaków', () => {
    const text = 'X'.repeat(90_000) + 'CUTMARKER' + 'Y'.repeat(20_000);
    const [, user] = buildClassifyMessages(text, 'FOOD');
    expect(user.content).not.toContain('CUTMARKER');
  });

  it('krótki tekst z markerem przechodzi w całości', () => {
    const [, user] = buildClassifyMessages(
      'krótka treść CUTMARKER koniec',
      'FOOD',
    );
    expect(user.content).toContain('CUTMARKER');
  });
});

describe('classifyTextSchema', () => {
  it('odrzuca tekst < 30 znaków', () => {
    expect(classifyTextSchema.safeParse({ text: 'za krótko' }).success).toBe(
      false,
    );
  });

  it('odrzuca tekst > 90 000 znaków', () => {
    expect(
      classifyTextSchema.safeParse({ text: 'a'.repeat(90_001) }).success,
    ).toBe(false);
  });

  it('akceptuje normalny blob', () => {
    expect(
      classifyTextSchema.safeParse({
        text: 'Salon urody w centrum. Manicure 80 zł, pedicure 120 zł. Otwarte pon-pt 9-18.',
      }).success,
    ).toBe(true);
  });
});

describe('classifySaveSchema', () => {
  const service = { name: 'Manicure', selected: true };
  const faq = {
    question: 'Ile kosztuje?',
    answer: 'Od 80 zł.',
    selected: true,
  };

  it('przyjmuje 40 usług i 30 par FAQ (więcej niż confirmImportSchema 20/15)', () => {
    const r = classifySaveSchema.safeParse({
      services: Array.from({ length: 40 }, () => service),
      faq: Array.from({ length: 30 }, () => faq),
    });
    expect(r.success).toBe(true);
  });

  it('odrzuca 41 usług', () => {
    const r = classifySaveSchema.safeParse({
      services: Array.from({ length: 41 }, () => service),
    });
    expect(r.success).toBe(false);
  });

  it('odrzuca 31 par FAQ', () => {
    const r = classifySaveSchema.safeParse({
      faq: Array.from({ length: 31 }, () => faq),
    });
    expect(r.success).toBe(false);
  });
});
