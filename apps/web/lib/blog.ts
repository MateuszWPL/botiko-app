import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { dedupeSlug, slugify } from '@/lib/slug';

// Fallback for when process.cwd() is already repo root (e.g. CI)
function getContentDir(): string {
  const fromApp = path.join(process.cwd(), '..', '..', 'content', 'blog');
  const fromRoot = path.join(process.cwd(), 'content', 'blog');
  if (fs.existsSync(fromApp)) return fromApp;
  if (fs.existsSync(fromRoot)) return fromRoot;
  return fromApp;
}

export type PostFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  authorTitle?: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

export type PostMeta = Omit<PostFrontmatter, 'image' | 'imageAlt'> & {
  slug: string;
  readingTime: number;
  image?: string;
  imageAlt?: string;
};

export type Post = PostMeta & {
  content: string;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

function _getAllPosts(): PostMeta[] {
  const dir = getContentDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts: PostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '');
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;

    return {
      slug,
      readingTime: calculateReadingTime(content),
      ...fm,
      categorySlug: fm.categorySlug ?? slugify(fm.category ?? ''),
      tags: fm.tags ?? [],
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function _getPostBySlug(slug: string): Post | null {
  const dir = getContentDir();
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);

  let filePath: string | null = null;
  if (fs.existsSync(mdxPath)) filePath = mdxPath;
  else if (fs.existsSync(mdPath)) filePath = mdPath;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  return {
    slug,
    readingTime: calculateReadingTime(content),
    content,
    ...fm,
    categorySlug: fm.categorySlug ?? slugify(fm.category ?? ''),
    tags: fm.tags ?? [],
  };
}

const shouldMemoize = process.env.NODE_ENV !== 'development';

export const getAllPosts = shouldMemoize ? cache(_getAllPosts) : _getAllPosts;
export const getPostBySlug = shouldMemoize
  ? cache(_getPostBySlug)
  : _getPostBySlug;

export function getAllCategories(): Array<{
  name: string;
  slug: string;
  count: number;
}> {
  const posts = getAllPosts();
  const map = new Map<string, { name: string; slug: string; count: number }>();

  posts.forEach((p) => {
    const key = p.categorySlug;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { name: p.category, slug: p.categorySlug, count: 1 });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getAllTags(): Array<{
  name: string;
  slug: string;
  count: number;
}> {
  const posts = getAllPosts();
  const map = new Map<string, { name: string; slug: string; count: number }>();

  posts.forEach((p) => {
    p.tags.forEach((tag) => {
      const slug = slugify(tag);
      if (map.has(slug)) {
        map.get(slug)!.count++;
      } else {
        map.set(slug, { name: tag, slug, count: 1 });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  return getAllPosts().filter((p) => p.categorySlug === categorySlug);
}

export function getPostsByTag(tagSlug: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => slugify(t) === tagSlug)
  );
}

export function getRelatedPosts(
  currentSlug: string,
  categorySlug: string,
  count = 3
): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.categorySlug === categorySlug)
    .slice(0, count);
}

/** Extract H2/H3 headings from raw MDX content for Table of Contents */
export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = dedupeSlug(slugify(text), slugCounts);
    items.push({ id, text, level });
  }

  return items;
}

export const POSTS_PER_PAGE = 6;

export function getPaginatedPosts(
  posts: PostMeta[],
  page: number
): { posts: PostMeta[]; totalPages: number } {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    totalPages,
  };
}
