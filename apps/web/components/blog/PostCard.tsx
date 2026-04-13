import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/blog';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PostCard({
  post,
  featured = false,
}: {
  post: PostMeta;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
      >
        {/* Hero image */}
        <div className="relative w-full aspect-[16/7] bg-slate-100 overflow-hidden">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime} min czytania</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors leading-snug">
            {post.title}
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-5">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
            Czytaj artykuł
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold border border-indigo-100">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min</span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm mt-auto">
          Czytaj
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-0.5 transition-transform"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
