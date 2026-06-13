import type { MetadataRoute } from 'next';
import {
  getAllPosts,
  getIndexableCategories,
  getCategoryLastModified,
} from '@/lib/blog';
import { getAllLocalParams } from '@/lib/local-seo';
import { getAllComparisonSlugs } from '@/lib/comparisons';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://botiko.pl';

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1, lastModified: now },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${baseUrl}/cennik`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${baseUrl}/integracje/wordpress`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${baseUrl}/porownanie`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${baseUrl}/narzedzia`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${baseUrl}/narzedzia/kalkulator-utraconych-klientow`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${baseUrl}/narzedzia/kalkulator-roi-bota`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${baseUrl}/o-nas`, changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${baseUrl}/kontakt`, changeFrequency: 'yearly', priority: 0.5, lastModified: new Date('2026-03-01') },
    { url: `${baseUrl}/dla/salon-beauty`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${baseUrl}/dla/gabinet-spa`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${baseUrl}/dla/restauracja`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${baseUrl}/dla/warsztat-mechaniczny`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${baseUrl}/dla/inna`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${baseUrl}/prywatnosc`, changeFrequency: 'yearly', priority: 0.3, lastModified: new Date('2026-03-01') },
    { url: `${baseUrl}/regulamin`, changeFrequency: 'yearly', priority: 0.3, lastModified: new Date('2026-03-01') },
  ];

  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.85 : 0.75,
  }));

  // Only categories with enough posts to be worth indexing. Tag pages and thin
  // categories are intentionally excluded — they dilute crawl budget and are
  // marked `noindex` on the page itself.
  const categories = getIndexableCategories().map((cat) => ({
    url: `${baseUrl}/blog/kategoria/${cat.slug}`,
    lastModified: getCategoryLastModified(cat.slug) ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Programmatic branża × miasto landing pages (quality-gated in lib/local-seo).
  const localPages = getAllLocalParams().map(({ branza, miasto }) => ({
    url: `${baseUrl}/dla/${branza}/${miasto}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const comparisons = getAllComparisonSlugs().map(({ slug }) => ({
    url: `${baseUrl}/porownanie/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts, ...categories, ...localPages, ...comparisons];
}
