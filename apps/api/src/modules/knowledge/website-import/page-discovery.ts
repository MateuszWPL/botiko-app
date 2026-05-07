import * as cheerio from 'cheerio';
import type { RobotsRules } from './robots-parser';
import { assertSafePublicHost } from './ssrf-guard';

const MAX_PAGES = 20;
const MAX_SITEMAP_ENTRIES = 50;

// High-value path patterns for Polish micro-business sites
const PRIORITY_PATH_PATTERNS = [
  /\/(o-nas|o-firmie|about|kim-jestesmy)/i,
  /\/(uslugi|oferta|services|cennik|pricing|co-robimy)/i,
  /\/(kontakt|contact)/i,
  /\/(faq|pytania|czesto-zadawane)/i,
  /\/(godziny|hours|otwarcie)/i,
  /\/(menu|jedzenie|dania)/i,
  /\/(galeria|gallery)/i,
];

const PRIORITY_LINK_TEXTS = [
  'o nas',
  'o firmie',
  'usługi',
  'oferta',
  'cennik',
  'kontakt',
  'faq',
  'menu',
  'galeria',
];

export async function discoverPages(
  origin: URL,
  robots: RobotsRules,
): Promise<URL[]> {
  const seen = new Set<string>();
  const results: Array<{ url: URL; score: number }> = [];

  // Always include homepage
  const homepageUrl = new URL('/', origin);
  seen.add(homepageUrl.toString());
  results.push({ url: homepageUrl, score: 100 });

  // Try sitemap sources
  const sitemapUrls = await trySitemaps(origin, robots);
  for (const urlStr of sitemapUrls) {
    if (seen.has(urlStr)) continue;
    seen.add(urlStr);
    let parsed: URL;
    try {
      parsed = new URL(urlStr);
    } catch {
      continue;
    }
    if (!robots.allow(parsed.pathname)) continue;
    const score = scoreUrl(parsed.pathname, '');
    results.push({ url: parsed, score });
  }

  // If we have plenty from sitemap, skip crawling
  if (results.length < MAX_PAGES) {
    const homepageLinks = await crawlHomepageLinks(origin, robots, seen);
    results.push(...homepageLinks);
  }

  // Sort by score descending, cap at MAX_PAGES
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, MAX_PAGES).map((r) => r.url);
}

async function trySitemaps(
  origin: URL,
  robots: RobotsRules,
): Promise<string[]> {
  const candidates = [
    `${origin.protocol}//${origin.hostname}/sitemap.xml`,
    `${origin.protocol}//${origin.hostname}/sitemap_index.xml`,
    ...robots.sitemapUrls,
  ];

  for (const sitemapUrl of candidates) {
    try {
      // Validate each sitemap URL before fetching — robots.txt entries are attacker-controlled
      const sitemapHost = new URL(sitemapUrl).hostname;
      await assertSafePublicHost(sitemapHost);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5_000);
      const res = await fetch(sitemapUrl, {
        headers: { 'User-Agent': 'BotikoBot/1.0 (+https://botiko.pl)' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const xml = await res.text();
      const matches = [
        ...xml.matchAll(/<loc>\s*(https?:\/\/[^<]+?)\s*<\/loc>/g),
      ];
      const urls = matches
        .map((m) => m[1].trim())
        .filter((u) => {
          try {
            const parsed = new URL(u);
            return (
              parsed.hostname === origin.hostname &&
              !u.endsWith('.xml') &&
              !u.endsWith('.pdf') &&
              !u.endsWith('.jpg') &&
              !u.endsWith('.png')
            );
          } catch {
            return false;
          }
        })
        .slice(0, MAX_SITEMAP_ENTRIES);

      if (urls.length > 0) return urls;
    } catch {
      continue;
    }
  }

  return [];
}

async function crawlHomepageLinks(
  origin: URL,
  robots: RobotsRules,
  seen: Set<string>,
): Promise<Array<{ url: URL; score: number }>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(origin.toString(), {
      headers: { 'User-Agent': 'BotikoBot/1.0 (+https://botiko.pl)' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const discovered: Array<{ url: URL; score: number }> = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      let parsed: URL;
      try {
        parsed = new URL(href, origin.toString());
      } catch {
        return;
      }

      if (parsed.hostname !== origin.hostname) return;
      if (!robots.allow(parsed.pathname)) return;

      // Normalize (strip hash and tracking params)
      const normalized = new URL(
        parsed.protocol + '//' + parsed.hostname + parsed.pathname,
      );
      const key = normalized.toString();
      if (seen.has(key)) return;
      seen.add(key);

      // Skip resource URLs
      if (/\.(css|js|png|jpg|gif|svg|ico|woff|pdf|xml)$/i.test(parsed.pathname))
        return;

      const linkText = $(el).text().trim().toLowerCase();
      const score = scoreUrl(parsed.pathname, linkText);
      if (score > 0) {
        discovered.push({ url: normalized, score });
      }
    });

    return discovered;
  } catch {
    return [];
  }
}

function scoreUrl(pathname: string, linkText: string): number {
  let score = 1;

  for (const pattern of PRIORITY_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      score += 10;
      break;
    }
  }

  for (const text of PRIORITY_LINK_TEXTS) {
    if (linkText.includes(text)) {
      score += 5;
      break;
    }
  }

  // Prefer short paths (nav links) over deep nested pages
  const depth = pathname.split('/').filter(Boolean).length;
  score -= depth;

  return score;
}
