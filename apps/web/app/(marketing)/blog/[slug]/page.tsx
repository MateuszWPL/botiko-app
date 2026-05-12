import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 86400;
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  extractToc,
} from '@/lib/blog';
import { mdxComponents } from '@/components/blog/mdx/components';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import TableOfContents from '@/components/blog/TableOfContents';
import PostCard from '@/components/blog/PostCard';
import { rehypeHeadingIds } from '@/components/blog/mdx/rehypeHeadingIds';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} — Blog Botiko.pl`,
    description: post.excerpt,
    alternates: { canonical: `https://botiko.pl/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://botiko.pl/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [post.author],
      tags: post.tags,
      ...(post.image && {
        images: [
          {
            url: `https://botiko.pl${post.image}`,
            alt: post.imageAlt ?? post.title,
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.image && { images: [`https://botiko.pl${post.image}`] }),
    },
  };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Brak daty';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Brak daty';
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const relatedPosts = getRelatedPosts(post.slug, post.categorySlug, 3);

  // Article JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.image && { image: `https://botiko.pl${post.image}` }),
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Botiko.pl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://botiko.pl/botiko-logo-full.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://botiko.pl/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero */}
        <div className="relative w-full h-72 sm:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338CA 100%)' }}>
          {post.image && (
            <Image
              src={post.image}
              alt={post.imageAlt ?? ''}
              fill
              className="object-cover opacity-60"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <Link
              href={`/blog/kategoria/${post.categorySlug}`}
              className="inline-block px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-semibold mb-4 hover:bg-indigo-400 transition-colors"
            >
              {post.category}
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Strona główna', href: '/' },
                { label: 'Blog', href: '/blog' },
                {
                  label: post.category,
                  href: `/blog/kategoria/${post.categorySlug}`,
                },
                { label: post.title },
              ]}
            />
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
            {/* Article body */}
            <div>
              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                    {(post.author ?? '?').charAt(0)}
                  </div>
                  <div>
                    <div className="text-slate-700 font-medium text-xs">
                      {post.author ?? 'Botiko'}
                    </div>
                    {post.authorTitle && (
                      <div className="text-xs text-slate-400">
                        {post.authorTitle}
                      </div>
                    )}
                  </div>
                </div>
                <span>·</span>
                <time dateTime={post.date ?? ''}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingTime} min czytania</span>
                {post.updatedAt && post.updatedAt !== post.date && (
                  <>
                    <span>·</span>
                    <span className="text-slate-400">
                      Zaktualizowano: {formatDate(post.updatedAt)}
                    </span>
                  </>
                )}
              </div>

              {/* MDX Content */}
              <div className="prose-custom">
                <MDXRemote
                  source={post.content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeHeadingIds,
                        [
                          rehypeAutolinkHeadings,
                          { behavior: 'wrap', properties: { tabIndex: -1 } },
                        ],
                      ],
                    },
                  }}
                />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-slate-500 mr-1">Tagi:</span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 flex items-center gap-3">
                <span className="text-sm text-slate-500">Udostępnij:</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://botiko.pl/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Udostępnij na Facebook"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://botiko.pl/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Udostępnij na LinkedIn"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block mt-0 self-start h-fit">
              <div className="space-y-6">
                {/* ToC (nie sticky) */}
                <TableOfContents items={toc} />

                {/* CTA badge (sticky) */}
                <div className="sticky top-24 self-start">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white">
                    <p className="font-bold text-sm mb-1">
                      Chcesz bot dla swojej firmy?
                    </p>
                    <p className="text-indigo-100 text-xs mb-4 leading-relaxed">
                      14 dni za darmo. Konfiguracja w 30 minut. Bez programowania.
                    </p>
                    <a
                      href="/rejestracja"
                      className="block text-center py-2.5 rounded-lg bg-white text-indigo-700 font-bold text-sm hover:shadow-lg transition-shadow"
                    >
                      Zacznij za darmo →
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Podobne artykuły
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA (mobile) */}
          <div className="lg:hidden mt-10">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white text-center">
              <p className="font-bold mb-1">Wypróbuj Botiko za darmo</p>
              <p className="text-indigo-100 text-sm mb-4">
                14 dni testu, bez karty kredytowej.
              </p>
              <a
                href="/rejestracja"
                className="inline-block px-6 py-3 rounded-full bg-white text-indigo-700 font-bold text-sm"
              >
                Zacznij teraz →
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
