import * as cheerio from 'cheerio';

export interface ExtractedPage {
  url: string;
  title: string;
  text: string;
  headings: string[];
  phones: string[];
  emails: string[];
}

// Phone regex with digit boundaries: must NOT be part of a longer digit run
// (guards against NIP/REGON/timestamps). Used only as a fallback over VISIBLE
// text; the primary source is tel: links (below).
const POLISH_PHONE_RE =
  /(?<![\d/+])(?:\+?48[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{3}|\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})(?![\d])/g;

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const MAX_TEXT_LENGTH = 30_000;

export function extractMainContent(
  html: string,
  url: string,
): ExtractedPage | null {
  const $ = cheerio.load(html);

  // Contact from the ORIGINAL DOM (before noise removal): the real phone/email
  // almost always live in the footer / a tel:/mailto: link, exactly what gets
  // stripped below. Prefer these authoritative sources over regex guessing.
  const telPhones = new Set<string>();
  const mailtoEmails = new Set<string>();
  $('a[href^="tel:"]').each((_, el) => {
    const num = ($(el).attr('href') ?? '').replace(/^tel:/i, '').trim();
    if (num) telPhones.add(num);
  });
  $('a[href^="mailto:"]').each((_, el) => {
    const addr = ($(el).attr('href') ?? '')
      .replace(/^mailto:/i, '')
      .split('?')[0]
      .trim();
    if (addr) mailtoEmails.add(addr);
  });

  // Remove noise elements
  $(
    'script, style, nav, footer, aside, noscript, iframe, svg, form, .cookie, [role="navigation"], [role="banner"], [role="complementary"]',
  ).remove();

  // Title
  const title =
    $('title').first().text().trim() || $('h1').first().text().trim();

  // Headings for structure hints
  const headings: string[] = [];
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().trim();
    if (text && headings.length < 20) headings.push(text);
  });

  // Main content extraction: prefer semantic elements, fallback to longest div
  let rawText = '';
  const main = $('main').first().text();
  const article = $('article').first().text();

  if (main.length > 300) {
    rawText = main;
  } else if (article.length > 300) {
    rawText = article;
  } else {
    // Find the div with the most text content
    let maxLen = 0;
    $('div').each((_, el) => {
      const text = $(el).text();
      if (text.length > maxLen) {
        maxLen = text.length;
        rawText = text;
      }
    });
    // Final fallback: entire body
    if (maxLen < 300) {
      rawText = $('body').text();
    }
  }

  // Normalize whitespace
  const text = rawText
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);

  if (text.length < 200) {
    return null;
  }

  // Phones: prefer tel: links; only fall back to a boundary-guarded regex over
  // VISIBLE text (never serialized HTML) so attribute/URL digit runs can't
  // masquerade as a phone.
  const phones =
    telPhones.size > 0
      ? [...telPhones].slice(0, 5)
      : [...new Set(text.match(POLISH_PHONE_RE) ?? [])].slice(0, 5);

  const emails = [
    ...new Set([...mailtoEmails, ...(text.match(EMAIL_RE) ?? [])]),
  ]
    .filter((e) => !e.includes('example') && !e.includes('domain'))
    .slice(0, 5);

  return { url, title, text, headings, phones, emails };
}
