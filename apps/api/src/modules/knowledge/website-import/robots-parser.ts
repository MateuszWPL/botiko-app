const BOTIKO_USER_AGENT = 'botikobot';

export interface RobotsRules {
  allow: (path: string) => boolean;
  sitemapUrls: string[];
}

export function parseRobotsTxt(
  text: string,
  userAgentName = BOTIKO_USER_AGENT,
): RobotsRules {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const sitemapUrls: string[] = [];

  // Collect disallow rules per user-agent section
  const disallowAll: string[] = [];
  const disallowSpecific: string[] = [];

  let inAllSection = false;
  let inSpecificSection = false;

  for (const line of lines) {
    if (line.startsWith('#') || line === '') {
      continue;
    }

    const [field, ...valueParts] = line.split(':');
    const key = field?.trim().toLowerCase();
    const value = valueParts.join(':').trim();

    if (key === 'user-agent') {
      const ua = value.toLowerCase();
      inAllSection = ua === '*';
      inSpecificSection = ua === userAgentName.toLowerCase();
      continue;
    }

    if (key === 'sitemap' && value) {
      sitemapUrls.push(value);
      continue;
    }

    if (key === 'disallow' && value) {
      if (inSpecificSection) disallowSpecific.push(value);
      else if (inAllSection) disallowAll.push(value);
    }

    if (key === 'allow' && value) {
      // Allow overrides disallow: track with negative priority (ignore for simplicity: allow = allowed already)
    }
  }

  // Specific user-agent rules take priority over wildcard
  const disallowRules =
    disallowSpecific.length > 0 ? disallowSpecific : disallowAll;

  return {
    allow: (path: string) => {
      for (const disallow of disallowRules) {
        if (path.startsWith(disallow)) return false;
      }
      return true;
    },
    sitemapUrls,
  };
}

export async function fetchAndCheckRobots(origin: URL): Promise<RobotsRules> {
  const robotsUrl = `${origin.protocol}//${origin.hostname}/robots.txt`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const response = await fetch(robotsUrl, {
      headers: { 'User-Agent': 'BotikoBot/1.0 (+https://botiko.pl)' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return allowAll();
    }

    const text = await response.text();
    return parseRobotsTxt(text);
  } catch {
    // Network error or timeout: default to allow all (RFC behavior)
    return allowAll();
  }
}

function allowAll(): RobotsRules {
  return { allow: () => true, sitemapUrls: [] };
}
