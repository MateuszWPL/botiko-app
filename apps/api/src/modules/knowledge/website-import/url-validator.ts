import { BadRequestException } from '@nestjs/common';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const ALLOWED_PORTS = new Set(['', '80', '443']);

export function validateAndNormalizeImportUrl(
  rawUrl: string,
  tenantWebsiteUrl: string | null | undefined,
): URL {
  if (!tenantWebsiteUrl) {
    throw new BadRequestException(
      'Najpierw dodaj URL strony w Ustawieniach > Profil firmy.',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new BadRequestException('Nieprawidłowy format URL.');
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new BadRequestException(
      'URL musi zaczynać się od http:// lub https://',
    );
  }

  if (!ALLOWED_PORTS.has(parsed.port)) {
    throw new BadRequestException(
      'URL musi używać standardowego portu (80 lub 443).',
    );
  }

  // Normalize tenant base host (strip protocol, www prefix, trailing slash)
  const tenantHost = normalizeHost(tenantWebsiteUrl);
  const requestHost = parsed.hostname.toLowerCase();

  // Allow exact match or subdomain (e.g. blog.salon.pl when tenant = salon.pl)
  if (requestHost !== tenantHost && !requestHost.endsWith('.' + tenantHost)) {
    throw new BadRequestException(
      `URL musi prowadzić do Twojej domeny (${tenantHost}).`,
    );
  }

  return new URL(
    parsed.protocol +
      '//' +
      parsed.hostname.toLowerCase() +
      parsed.pathname +
      parsed.search,
  );
}

function normalizeHost(websiteUrl: string): string {
  let url = websiteUrl.trim().toLowerCase();
  if (!url.startsWith('http')) url = 'https://' + url;
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    // fallback: strip protocol and slashes manually
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
  }
}
