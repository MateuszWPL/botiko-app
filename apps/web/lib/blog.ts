import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ę/g, 'e')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ł/g, 'l')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z')
    .replace(/ć/g, 'c')
    .replace(/ń/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllPosts(): PostMeta[] {
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

export function getPostBySlug(slug: string): Post | null {
  const dir = getContentDir();
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);

  const actualPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!actualPath) return null;

  const raw = fs.readFileSync(actualPath, 'utf-8');
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
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = slugify(text);
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
