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

export async function assertSafePublicHost(hostname: string): Promise<void> {
  // Allow localhost in dev (explicit env flag required — never default true in prod)
  if (
    process.env.DEV_ALLOW_LOCALHOST === 'true' &&
    (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1')
  ) {
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
    if (family === 4 && isPrivateIPv4(address)) {
      throw new BadRequestException({
        code: 'SSRF_BLOCKED',
        message: `Adres IP ${address} jest prywatny i nie może być skanowany.`,
      });
    }
    if (family === 6) {
      if (isPrivateIPv6(address) || checkMappedIPv4(address)) {
        throw new BadRequestException({
          code: 'SSRF_BLOCKED',
          message: `Adres IPv6 ${address} jest prywatny i nie może być skanowany.`,
        });
      }
    }
  }
}
