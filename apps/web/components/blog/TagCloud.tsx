import Link from 'next/link';

type Tag = { name: string; slug: string; count: number };

export default function TagCloud({
  tags,
  activeTag,
}: {
  tags: Tag[];
  activeTag?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Tagi
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/blog/tag/${tag.slug}`}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTag === tag.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
          >
            #{tag.name}
            <span className="ml-1 opacity-60">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
