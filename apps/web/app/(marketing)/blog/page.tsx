import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  getAllPosts,
  getAllCategories,
  getAllTags,
  getPaginatedPosts,
} from '@/lib/blog';
import PostCard from '@/components/blog/PostCard';
import BlogFilters from '@/components/blog/BlogFilters';
import Pagination from '@/components/blog/Pagination';
import TagCloud from '@/components/blog/TagCloud';

export const metadata: Metadata = {
  title: 'Blog — Botiko.pl | AI dla polskich firm usługowych',
  description:
    'Artykuły o automatyzacji obsługi klienta, chatbotach AI i rozwoju małych firm usługowych w Polsce. Poradniki, analizy, case studies.',
  alternates: { canonical: 'https://botiko.pl/blog' },
  openGraph: {
    title: 'Blog Botiko — AI dla małych firm usługowych',
    description:
      'Praktyczne artykuły o chatbotach AI, automatyzacji i pozyskiwaniu klientów dla salonów beauty, gabinetów i warsztatów.',
    url: 'https://botiko.pl/blog',
    type: 'website',
  },
};

type SearchParams = {
  strona?: string;
  kategoria?: string;
  sortuj?: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.strona ?? '1', 10));
  const activeCategory = searchParams.kategoria;
  const activeSort = searchParams.sortuj ?? 'newest';

  let posts = getAllPosts();
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  // Filter by category
  if (activeCategory) {
    posts = posts.filter((p) => p.categorySlug === activeCategory);
  }

  // Sort
  if (activeSort === 'oldest') {
    posts = [...posts].reverse();
  }

  const featuredPost = !activeCategory
    ? getAllPosts().find((p) => p.featured)
    : undefined;

  // Exclude featured from main grid on page 1 when no filter
  let gridPosts = posts;
  if (!activeCategory && page === 1 && featuredPost) {
    gridPosts = posts.filter((p) => p.slug !== featuredPost.slug);
  }

  const { posts: pagePosts, totalPages } = getPaginatedPosts(gridPosts, page);

  const spAsRecord = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, v ?? ''])
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Hero header */}
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
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            AI dla polskich firm usługowych
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Praktyczne porady o automatyzacji obsługi klienta, chatbotach i
            pozyskiwaniu klientów. Bez teorii — tylko to, co działa.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full min-w-0 px-4 sm:px-6 py-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
          {/* Main column */}
          <div className="min-w-0">
            {/* Filters */}
            <div className="mb-8">
              <Suspense fallback={null}>
                <BlogFilters
                  categories={allCategories}
                  activeCategory={activeCategory}
                  activeSort={activeSort}
                />
              </Suspense>
            </div>

            {/* Featured post — only on page 1 with no filter */}
            {featuredPost && !activeCategory && page === 1 && (
              <div className="mb-10">
                <PostCard post={featuredPost} featured />
              </div>
            )}

            {/* Grid */}
            {pagePosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6 min-w-0 w-full">
                {pagePosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <div className="text-4xl mb-4">📭</div>
                <p className="font-medium text-slate-600">Brak artykułów</p>
                <p className="text-sm mt-1">
                  Spróbuj innej kategorii lub{' '}
                  <a href="/blog" className="text-indigo-600 hover:underline">
                    wróć do wszystkich artykułów
                  </a>
                  .
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/blog"
              searchParams={spAsRecord}
            />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block mt-0 min-w-0 space-y-8 lg:w-[280px] lg:shrink-0">
            {/* Tag cloud */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <TagCloud tags={allTags} />
            </div>

            {/* Categories list */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Kategorie
              </h3>
              <ul className="space-y-2">
                {allCategories.map((cat) => (
                  <li key={cat.slug}>
                    <a
                      href={`/blog/kategoria/${cat.slug}`}
                      className="flex items-center justify-between text-sm text-slate-600 hover:text-indigo-600 transition-colors group"
                    >
                      <span className="group-hover:underline">{cat.name}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                        {cat.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white">
              <p className="font-bold text-sm mb-1">
                Wypróbuj Botiko za darmo
              </p>
              <p className="text-indigo-100 text-xs mb-4 leading-relaxed">
                14 dni bezpłatnego testu. Konfiguracja w 30 minut.
              </p>
              <a
                href="/rejestracja"
                className="block text-center py-2.5 rounded-lg bg-white text-indigo-700 font-bold text-sm hover:shadow-lg transition-shadow"
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
