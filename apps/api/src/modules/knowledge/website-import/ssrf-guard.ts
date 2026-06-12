import dns from 'dns';
import net from 'net';
import { BadRequestException } from '@nestjs/common';

// Private/reserved IPv4 ranges (RFC 1918 + special-use addresses)
const PRIVATE_IPV4_RANGES: RegExp[] = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^240\./,
  /^255\./,
];

function isPrivateIPv4(ip: string): boolean {
  return PRIVATE_IPV4_RANGES.some((r) => r.test(ip));
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return (
    lower === '::1' ||
    lower === '::' ||
    lower.startsWith('fc') ||
    lower.startsWith('fd') ||
    lower.startsWith('fe8') ||
    lower.startsWith('fe9') ||
    lower.startsWith('fea') ||
    lower.startsWith('feb') ||
    lower.startsWith('::ffff:0:') ||
    lower.startsWith('64:ff9b:')
  );
}

function checkMappedIPv4(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.slice(7);
    if (net.isIPv4(v4)) return isPrivateIPv4(v4);
  }
  return false;
}

/**
 * Returns true if the given resolved address must NOT be connected to
 * (private, loopback, link-local, or otherwise non-public).
 * Unknown address families are blocked by default (fail closed).
 */
export function isBlockedAddress(address: string, family: number): boolean {
  if (family === 4) return isPrivateIPv4(address);
  if (family === 6) return isPrivateIPv6(address) || checkMappedIPv4(address);
  return true;
}

const DEV_LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function devLocalhostAllowed(hostname: string): boolean {
  return (
    process.env.DEV_ALLOW_LOCALHOST === 'true' &&
    DEV_LOCAL_HOSTS.has(hostname.toLowerCase())
  );
}

export async function assertSafePublicHost(hostname: string): Promise<void> {
  // Allow localhost in dev (explicit env flag required — never default true in prod)
  if (devLocalhostAllowed(hostname)) {
    return;
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await dns.promises.lookup(hostname, { all: true, family: 0 });
  } catch {
    throw new BadRequestException(
      'Nie można rozwiązać adresu DNS dla podanego URL.',
    );
  }

  for (const { address, family } of addresses) {
    if (isBlockedAddress(address, family)) {
      throw new BadRequestException({
        code: 'SSRF_BLOCKED',
        message: `Adres IP ${address} jest prywatny i nie może być skanowany.`,
      });
    }
  }
}

interface LookupAddress {
  address: string;
  family: number;
}

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | LookupAddress[],
  family?: number,
) => void;

/**
 * Custom DNS lookup for the HTTP(S) agent that re-validates every resolved
 * address at connection time. This closes the DNS-rebinding TOCTOU gap: the
 * pre-flight `assertSafePublicHost` check and the socket's own resolution
 * are otherwise two independent lookups, so an attacker controlling DNS could
 * return a public IP for the check and a private one (e.g. cloud metadata at
 * 169.254.169.254) for the actual connection. Because this lookup is what the
 * socket uses, the address we validate is the address we connect to.
 *
 * TLS is unaffected — SNI and certificate validation still use the original
 * hostname, only the resolved IP is pinned by this function.
 */
export function secureLookup(
  hostname: string,
  options: dns.LookupOneOptions | dns.LookupAllOptions | number,
  callback: LookupCallback,
): void {
  const wantsAll = typeof options === 'object' && options.all === true;
  const requestedFamily =
    typeof options === 'object' ? options.family : options;

  const allowPrivate = devLocalhostAllowed(hostname);

  dns.lookup(hostname, { all: true, family: 0 }, (err, resolved) => {
    if (err) {
      callback(err, '', 0);
      return;
    }

    const list = resolved as LookupAddress[];

    if (!allowPrivate) {
      for (const a of list) {
        if (isBlockedAddress(a.address, a.family)) {
          const blocked = new Error(
            `Adres ${a.address} jest prywatny i nie może być pobrany.`,
          ) as NodeJS.ErrnoException;
          blocked.code = 'SSRF_BLOCKED';
          callback(blocked, '', 0);
          return;
        }
      }
    }

    const candidates =
      requestedFamily === 4 || requestedFamily === 6
        ? list.filter((a) => a.family === requestedFamily)
        : list;

    if (candidates.length === 0) {
      const notFound = new Error(
        `Brak adresów IP dla hosta ${hostname}.`,
      ) as NodeJS.ErrnoException;
      notFound.code = 'ENOTFOUND';
      callback(notFound, '', 0);
      return;
    }

    if (wantsAll) {
      callback(null, candidates);
    } else {
      callback(null, candidates[0].address, candidates[0].family);
    }
  });
}
