import { BadRequestException } from '@nestjs/common';
import { assertSafePublicHost } from './ssrf-guard';
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

export async function safeFetch(
  url: URL,
  opts: SafeFetchOptions = {},
): Promise<SafeFetchResult> {
  const { maxBytes = 512_000, timeoutMs = 10_000, tenantWebsiteUrl } = opts;

  let currentUrl = url;
  let redirectCount = 0;

  // Validate initial host
  await assertSafePublicHost(currentUrl.hostname);

  while (true) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(currentUrl.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': BOTIKO_USER_AGENT,
          Accept: 'text/html,application/xhtml+xml;q=0.9',
          'Accept-Language': 'pl,en;q=0.5',
        },
        redirect: 'manual',
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new BadRequestException({
          code: 'TIMEOUT',
          message: 'Strona za wolno odpowiada (limit 10s).',
        });
      }
      throw new BadRequestException(
        `Błąd połączenia z ${currentUrl.hostname}: ${String(err)}`,
      );
    }
    clearTimeout(timeout);

    // Handle redirects manually to re-validate each destination
    if (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.get('location')
    ) {
      if (redirectCount >= MAX_REDIRECTS) {
        throw new BadRequestException(
          'Zbyt wiele przekierowań (max 3). Sprawdź URL.',
        );
      }
      const location = response.headers.get('location')!;
      let nextUrl: URL;
      try {
        nextUrl = new URL(location, currentUrl.toString());
      } catch {
        throw new BadRequestException(
          `Nieprawidłowy URL przekierowania: ${location}`,
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
      throw new BadRequestException({
        code: 'ROBOTS_DISALLOWED',
        message: `Strona ${currentUrl.hostname} odmówiła dostępu (403).`,
      });
    }

    if (response.status === 404) {
      throw new BadRequestException(
        `Strona ${currentUrl.pathname} nie istnieje (404).`,
      );
    }

    if (!response.ok) {
      throw new BadRequestException(
        `Strona odpowiedziała błędem ${response.status}.`,
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    const isHtml = ACCEPTED_CONTENT_TYPES.some((t) =>
      contentType.toLowerCase().includes(t),
    );
    if (!isHtml) {
      throw new BadRequestException({
        code: 'NON_HTML_CONTENT',
        message: `URL nie wskazuje na stronę HTML (typ: ${contentType || 'nieznany'}).`,
      });
    }

    // Stream body with byte limit
    const reader = response.body?.getReader();
    if (!reader) {
      throw new BadRequestException('Brak treści w odpowiedzi serwera.');
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          reader.cancel().catch(() => {});
          break;
        }
        chunks.push(value);
      }
    } catch {
      throw new BadRequestException('Błąd podczas pobierania treści strony.');
    }

    const html = new TextDecoder('utf-8', { fatal: false }).decode(
      concatUint8Arrays(chunks),
    );

    return {
      html,
      contentType,
      finalUrl: currentUrl.toString(),
    };
  }
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((acc, a) => acc + a.byteLength, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}
