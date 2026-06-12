import http from 'node:http';
import https from 'node:https';
import type { Readable } from 'node:stream';
import { BadRequestException } from '@nestjs/common';
import { assertSafePublicHost, secureLookup } from './ssrf-guard';
import { validateAndNormalizeImportUrl } from './url-validator';

const BOTIKO_USER_AGENT = 'BotikoBot/1.0 (+https://botiko.pl)';
const ACCEPTED_CONTENT_TYPES = ['text/html', 'application/xhtml+xml'];
const MAX_REDIRECTS = 3;

export interface SafeFetchResult {
  html: string;
  contentType: string;
  finalUrl: string;
}

export interface SafeFetchOptions {
  maxBytes?: number;
  timeoutMs?: number;
  tenantWebsiteUrl?: string;
}

class FetchTimeoutError extends Error {
  constructor() {
    super('Request timed out');
    this.name = 'FetchTimeoutError';
  }
}

interface RawResponse {
  status: number;
  location: string | null;
  contentType: string;
  body: Readable;
}

/**
 * Single GET request over native http/https with SSRF-safe DNS pinning.
 *
 * Redirects are NOT followed here (`secureLookup` would still guard them, but
 * we follow manually in safeFetch so each hop is re-validated against the
 * tenant's domain too). Compression is not requested, so the body is returned
 * as-is without needing gzip/br decoding.
 */
function requestOnce(url: URL, timeoutMs: number): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'http:' ? http : https;
    const req = transport.request(
      url,
      {
        method: 'GET',
        headers: {
          'User-Agent': BOTIKO_USER_AGENT,
          Accept: 'text/html,application/xhtml+xml;q=0.9',
          'Accept-Language': 'pl,en;q=0.5',
          // Identity only — native http does not auto-decompress.
          'Accept-Encoding': 'identity',
        },
        lookup: secureLookup,
        timeout: timeoutMs,
      },
      (res) => {
        const location = res.headers.location;
        resolve({
          status: res.statusCode ?? 0,
          location: typeof location === 'string' ? location : null,
          contentType: res.headers['content-type'] ?? '',
          body: res,
        });
      },
    );

    req.on('timeout', () => {
      req.destroy(new FetchTimeoutError());
    });
    req.on('error', (err) => reject(err));
    req.end();
  });
}

function readBodyWithLimit(body: Readable, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let finished = false;

    const finish = (fn: () => void) => {
      if (finished) return;
      finished = true;
      body.destroy();
      fn();
    };

    body.on('data', (chunk: Buffer) => {
      totalBytes += chunk.byteLength;
      if (totalBytes > maxBytes) {
        // Stop reading — we have enough; truncate at the limit.
        chunks.push(chunk);
        finish(() =>
          resolve(
            new TextDecoder('utf-8', { fatal: false }).decode(
              Buffer.concat(chunks),
            ),
          ),
        );
        return;
      }
      chunks.push(chunk);
    });

    body.on('end', () => {
      finish(() =>
        resolve(
          new TextDecoder('utf-8', { fatal: false }).decode(
            Buffer.concat(chunks),
          ),
        ),
      );
    });

    body.on('error', (err) => finish(() => reject(err)));
  });
}

function mapRequestError(err: unknown, hostname: string): BadRequestException {
  if (err instanceof FetchTimeoutError) {
    return new BadRequestException({
      code: 'TIMEOUT',
      message: 'Strona za wolno odpowiada (limit 10s).',
    });
  }
  const code =
    err && typeof err === 'object' && 'code' in err
      ? (err as { code?: string }).code
      : undefined;
  if (code === 'SSRF_BLOCKED') {
    return new BadRequestException({
      code: 'SSRF_BLOCKED',
      message:
        err instanceof Error
          ? err.message
          : 'Adres prywatny nie może być pobrany.',
    });
  }
  return new BadRequestException(
    `Nie można połączyć się ze stroną ${hostname}. Sprawdź czy adres jest poprawny.`,
  );
}

export async function safeFetch(
  url: URL,
  opts: SafeFetchOptions = {},
): Promise<SafeFetchResult> {
  const { maxBytes = 512_000, timeoutMs = 10_000, tenantWebsiteUrl } = opts;

  let currentUrl = url;
  let redirectCount = 0;

  // Friendly pre-flight check (nice errors). The real SSRF guarantee comes
  // from secureLookup, which re-validates the IP at socket-connect time.
  await assertSafePublicHost(currentUrl.hostname);

  while (true) {
    let response: RawResponse;
    try {
      response = await requestOnce(currentUrl, timeoutMs);
    } catch (err) {
      throw mapRequestError(err, currentUrl.hostname);
    }

    // Handle redirects manually to re-validate each destination
    if (response.status >= 300 && response.status < 400 && response.location) {
      response.body.destroy();
      if (redirectCount >= MAX_REDIRECTS) {
        throw new BadRequestException(
          'Zbyt wiele przekierowań (max 3). Sprawdź URL.',
        );
      }
      let nextUrl: URL;
      try {
        nextUrl = new URL(response.location, currentUrl.toString());
      } catch {
        throw new BadRequestException(
          `Nieprawidłowy URL przekierowania: ${response.location}`,
        );
      }

      // Re-validate the redirect destination for SSRF and domain ownership
      await assertSafePublicHost(nextUrl.hostname);
      if (tenantWebsiteUrl) {
        validateAndNormalizeImportUrl(nextUrl.toString(), tenantWebsiteUrl);
      }

      currentUrl = nextUrl;
      redirectCount++;
      continue;
    }

    if (response.status === 403) {
      response.body.destroy();
      throw new BadRequestException({
        code: 'ROBOTS_DISALLOWED',
        message: `Strona ${currentUrl.hostname} odmówiła dostępu (403).`,
      });
    }

    if (response.status === 404) {
      response.body.destroy();
      throw new BadRequestException(
        `Strona ${currentUrl.pathname} nie istnieje (404).`,
      );
    }

    if (response.status < 200 || response.status >= 300) {
      response.body.destroy();
      throw new BadRequestException(
        `Strona odpowiedziała błędem ${response.status}.`,
      );
    }

    const contentType = response.contentType;
    const isHtml = ACCEPTED_CONTENT_TYPES.some((t) =>
      contentType.toLowerCase().includes(t),
    );
    if (!isHtml) {
      response.body.destroy();
      throw new BadRequestException({
        code: 'NON_HTML_CONTENT',
        message: `URL nie wskazuje na stronę HTML (typ: ${contentType || 'nieznany'}).`,
      });
    }

    let html: string;
    try {
      html = await readBodyWithLimit(response.body, maxBytes);
    } catch {
      throw new BadRequestException('Błąd podczas pobierania treści strony.');
    }

    return {
      html,
      contentType,
      finalUrl: currentUrl.toString(),
    };
  }
}
