import type { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://botiko.pl';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/rejestracja`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/prywatnosc`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/o-nas`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/regulamin`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/kontakt`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.85 : 0.75,
  }));

  const categories = getAllCategories().map((cat) => ({
    url: `${baseUrl}/blog/kategoria/${cat.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tags = getAllTags().map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...posts, ...categories, ...tags];
}
