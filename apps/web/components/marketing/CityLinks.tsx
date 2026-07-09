import Link from 'next/link';
import { getCitiesForIndustry, getIndustry } from '@/lib/local-seo';

/**
 * Internal-linking block for the industry landing pages: links to the
 * city-specific variants (/dla/[branza]/[miasto]). Surfaces the programmatic
 * pages to crawlers and users. Server component, reads server-only data.
 */
export default function CityLinks({ industrySlug }: { industrySlug: string }) {
  const industry = getIndustry(industrySlug);
  if (!industry) return null;

  const cities = getCitiesForIndustry(industrySlug);
  if (cities.length === 0) return null;

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: industry.accent }}
        >
          Twoje miasto
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">
          Botiko dla {industry.labelGenitive} w Twoim mieście
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Wybierz miasto, strona z lokalnymi przykładami rozmów i odpowiedziami na
          najczęstsze pytania klientów z Twojej okolicy.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/dla/${industry.slug}/${c.slug}`}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 hover:border-brand hover:text-brand transition-colors"
            >
              {industry.labelTitle} {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
