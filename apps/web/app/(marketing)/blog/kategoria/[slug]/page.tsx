import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getAllCategories,
  getPostsByCategory,
  getAllTags,
  getPaginatedPosts,
  MIN_INDEXABLE_CATEGORY_POSTS,
} from '@/lib/blog';
import PostCard from '@/components/blog/PostCard';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import Pagination from '@/components/blog/Pagination';
import TagCloud from '@/components/blog/TagCloud';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbListSchema } from '@/lib/seo';

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { strona?: string };
}): Promise<Metadata> {
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) return {};

  const page = Math.max(1, parseInt(searchParams.strona ?? '1', 10));
  const canonical =
    page > 1
      ? `https://botiko.pl/blog/kategoria/${cat.slug}?strona=${page}`
      : `https://botiko.pl/blog/kategoria/${cat.slug}`;

  // Index only substantial categories, and only their first page. Thin
  // categories and deep pagination are noindex,follow (links still crawled).
  const indexable =
    cat.count >= MIN_INDEXABLE_CATEGORY_POSTS && page === 1;

  return {
    title: `${cat.name}. Blog Botiko.pl`,
    description: `Artykuły z kategorii "${cat.name}", praktyczne porady o automatyzacji i AI dla małych firm usługowych.`,
    alternates: { canonical },
    robots: { index: indexable, follow: true },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { strona?: string };
}) {
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const page = Math.max(1, parseInt(searchParams.strona ?? '1', 10));
  const posts = getPostsByCategory(params.slug);
  const { posts: pagePosts, totalPages } = getPaginatedPosts(posts, page);
  const allTags = getAllTags();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      <JsonLd
        data={breadcrumbListSchema([
          { label: 'Strona główna', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: cat.name },
        ])}
      />
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
              { label: cat.name },
            ]}
          />
          <h1 className="text-3xl font-bold mt-4 mb-2">{cat.name}</h1>
          <p className="text-indigo-200 text-sm">
            {cat.count} {cat.count === 1 ? 'artykuł' : cat.count < 5 ? 'artykuły' : 'artykułów'}
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
                <p className="font-medium text-slate-600">
                  Brak artykułów w tej kategorii
                </p>
                <a href="/blog" className="text-indigo-600 text-sm hover:underline mt-2 block">
                  ← Wróć do wszystkich artykułów
                </a>
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/blog/kategoria/${params.slug}`}
            />
          </div>

          <aside className="hidden lg:block min-w-0 space-y-6 lg:w-[280px] lg:shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <TagCloud tags={allTags} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Inne kategorie
              </h3>
              <ul className="space-y-2">
                {categories
                  .filter((c) => c.slug !== params.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <a
                        href={`/blog/kategoria/${c.slug}`}
                        className="flex items-center justify-between text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <span>{c.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                          {c.count}
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white">
              <p className="font-bold text-sm mb-1">Wypróbuj Botiko za darmo</p>
              <p className="text-indigo-100 text-xs mb-4">14 dni, bez karty kredytowej.</p>
              <a
                href="/rejestracja"
                className="block text-center py-2.5 rounded-lg bg-white text-indigo-700 font-bold text-sm"
              >
                Zacznij teraz →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
