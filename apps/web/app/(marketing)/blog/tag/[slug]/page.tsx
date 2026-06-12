import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getAllTags,
  getPostsByTag,
  getPaginatedPosts,
  getAllCategories,
} from '@/lib/blog';
import PostCard from '@/components/blog/PostCard';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import Pagination from '@/components/blog/Pagination';
import TagCloud from '@/components/blog/TagCloud';

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) return {};

  return {
    title: `#${tag.name} — Blog Botiko.pl`,
    description: `Artykuły oznaczone tagiem "${tag.name}" — chatboty AI i automatyzacja dla polskich firm usługowych.`,
    alternates: { canonical: `https://botiko.pl/blog/tag/${tag.slug}` },
    // Tag pages are thin/overlapping content — keep them usable for visitors
    // but out of the index. Links are still followed so posts get discovered.
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { strona?: string };
}) {
  const allTags = getAllTags();
  const tag = allTags.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const page = Math.max(1, parseInt(searchParams.strona ?? '1', 10));
  const posts = getPostsByTag(params.slug);
  const { posts: pagePosts, totalPages } = getPaginatedPosts(posts, page);
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Header */}
      <div
        className="relative overflow-hidden text-white pt-32 pb-24 px-4"
        style={{
          background:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338CA 65%, #6366F1 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: 'Strona główna', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: `#${tag.name}` },
            ]}
          />
          <h1 className="text-3xl font-bold mt-4 mb-2">#{tag.name}</h1>
          <p className="text-indigo-200 text-sm">
            {tag.count} {tag.count === 1 ? 'artykuł' : tag.count < 5 ? 'artykuły' : 'artykułów'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full min-w-0 px-4 sm:px-6 py-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
          <div className="min-w-0">
            {pagePosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6 min-w-0 w-full">
                {pagePosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <p>Brak artykułów z tym tagiem.</p>
                <a href="/blog" className="text-indigo-600 text-sm hover:underline mt-2 block">
                  ← Wróć do bloga
                </a>
              </div>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/blog/tag/${params.slug}`}
            />
          </div>

          <aside className="hidden lg:block min-w-0 space-y-6 lg:w-[280px] lg:shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <TagCloud tags={allTags} activeTag={params.slug} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Kategorie
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <a
                      href={`/blog/kategoria/${cat.slug}`}
                      className="flex items-center justify-between text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                        {cat.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
