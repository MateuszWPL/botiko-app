import { extractMainContent } from './content-extractor';

const filler = 'x'.repeat(250); // keep text over the 200-char minimum

describe('extractMainContent: phone/contact detection', () => {
  it('bierze numer z linku tel: (nawet gdy jest w stopce)', () => {
    const html = `<html><body><main>${filler}</main><footer><a href="tel:+48695683971">Zadzwoń</a></footer></body></html>`;
    const page = extractMainContent(html, 'https://x.pl');
    expect(page?.phones).toEqual(['+48695683971']);
  });

  it('NIE traktuje liczby z atrybutu (timestamp/REGON) jako telefonu', () => {
    // 259442090 lives only in a data-* attribute: the old code matched it via
    // $.html(); the fix runs the regex over visible text only.
    const html = `<html><body><main><div data-ts="1751259442090">${filler}</div></main></body></html>`;
    const page = extractMainContent(html, 'https://x.pl');
    expect(page?.phones).toEqual([]);
  });

  it('wykrywa prawdziwy numer w widocznej treści', () => {
    const html = `<html><body><main>Zadzwoń: 695 683 971. ${filler}</main></body></html>`;
    const page = extractMainContent(html, 'https://x.pl');
    expect(page?.phones).toContain('695 683 971');
  });

  it('bierze e-mail z linku mailto:', () => {
    const html = `<html><body><main>${filler}</main><footer><a href="mailto:kontakt@x.pl?subject=hi">Napisz</a></footer></body></html>`;
    const page = extractMainContent(html, 'https://x.pl');
    expect(page?.emails).toContain('kontakt@x.pl');
  });
});
