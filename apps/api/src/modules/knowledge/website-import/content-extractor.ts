import * as cheerio from 'cheerio';

export interface ExtractedPage {
  url: string;
  title: string;
  text: string;
  headings: string[];
  phones: string[];
  emails: string[];
}

const POLISH_PHONE_RE =
  /(?:\+?48[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{3}|\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})/g;

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const MAX_TEXT_LENGTH = 30_000;

export function extractMainContent(
  html: string,
  url: string,
): ExtractedPage | null {
  const $ = cheerio.load(html);

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

  // Extract contact info from raw HTML (before stripping)
  const rawHtmlText = $.html();
  const phones = [...new Set(rawHtmlText.match(POLISH_PHONE_RE) ?? [])].slice(
    0,
    5,
  );
  const emails = [...new Set(rawHtmlText.match(EMAIL_RE) ?? [])]
    .filter((e) => !e.includes('example') && !e.includes('domain'))
    .slice(0, 5);

  return { url, title, text, headings, phones, emails };
}
