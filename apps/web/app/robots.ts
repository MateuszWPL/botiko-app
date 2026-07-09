import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://botiko.pl';

  const disallow = [
    '/dashboard/',
    '/login',
    '/register',
    '/rejestracja',
    '/forgot-password',
    '/api/',
  ];

  // AI-search crawlers. Allowed by the `*` rule already, but named explicitly so
  // our intent to be crawled/cited is unambiguous (GEO signal). Same disallow
  // set, only auth/dashboard/API stays private.
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: aiCrawlers, allow: '/', disallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
