import { Injectable, Logger } from '@nestjs/common';
import { assertSafePublicHost } from './ssrf-guard';
import { fetchAndCheckRobots } from './robots-parser';
import { discoverPages } from './page-discovery';
import { extractMainContent, type ExtractedPage } from './content-extractor';
import { safeFetch } from './safe-fetch';

const MAX_PAGES = 20;
const MAX_TOTAL_BYTES = 5 * 1024 * 1024; // 5MB total
const PAGE_THROTTLE_MS = 1_000;

export interface ScraperProgress {
  scrapedUrls: string[];
  failedUrls: string[];
}

export interface ScraperResult {
  pages: ExtractedPage[];
  scrapedUrls: string[];
  failedUrls: string[];
}

@Injectable()
export class WebsiteScraperService {
  private readonly logger = new Logger(WebsiteScraperService.name);

  async scrape(
    sourceUrl: string,
    tenantWebsiteUrl: string,
    onProgress?: (progress: ScraperProgress) => Promise<void>,
  ): Promise<ScraperResult> {
    const origin = new URL(sourceUrl);

    // SSRF check
    await assertSafePublicHost(origin.hostname);

    // Robots.txt
    const robots = await fetchAndCheckRobots(origin);

    // Page discovery
    const urlsToScrape = await discoverPages(origin, robots);
    this.logger.log(
      `Discovered ${urlsToScrape.length} pages to scrape for ${origin.hostname}`,
    );

    const pages: ExtractedPage[] = [];
    const scrapedUrls: string[] = [];
    const failedUrls: string[] = [];
    let totalBytes = 0;

    for (const pageUrl of urlsToScrape.slice(0, MAX_PAGES)) {
      if (!robots.allow(pageUrl.pathname)) {
        this.logger.debug(`Skipped by robots.txt: ${pageUrl.pathname}`);
        continue;
      }

      try {
        const { html, finalUrl } = await safeFetch(pageUrl, {
          maxBytes: 512_000,
          timeoutMs: 10_000,
          tenantWebsiteUrl,
        });

        totalBytes += html.length;
        if (totalBytes > MAX_TOTAL_BYTES) {
          this.logger.warn(
            `Total byte budget exceeded at ${pageUrl.toString()} — stopping scrape`,
          );
          break;
        }

        const extracted = extractMainContent(html, finalUrl);
        if (extracted) {
          pages.push(extracted);
          scrapedUrls.push(finalUrl);
          this.logger.debug(`Scraped: ${finalUrl} (${extracted.text.length} chars)`);
        } else {
          this.logger.debug(`Skipped empty page: ${pageUrl.toString()}`);
          // Still count as visited, just no usable content
          scrapedUrls.push(pageUrl.toString());
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Failed to scrape ${pageUrl.toString()}: ${msg}`);
        failedUrls.push(pageUrl.toString());
      }

      if (onProgress) {
        await onProgress({ scrapedUrls: [...scrapedUrls], failedUrls: [...failedUrls] });
      }

      // Polite crawl rate limiting
      await new Promise((r) => setTimeout(r, PAGE_THROTTLE_MS));
    }

    return { pages, scrapedUrls, failedUrls };
  }
}
