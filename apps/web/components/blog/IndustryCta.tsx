import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Kontekstowy link z wpisu bloga do strony pieniężnej /dla/*.
 * - Wpis branżowy (categorySlug beauty/zdrowie/food/auto...) → link do konkretnej branży.
 * - Wpis ogólny → blok ze wszystkimi branżami (każdy wpis linkuje do stron konwersji).
 *
 * Cel: linkowanie wewnętrzne blog → /dla/* (audyt SEO/GSC, strony pieniężne
 * były dotąd bez linków przychodzących z treści).
 */

type Industry = {
  slug: string;
  label: string;
  href: string;
  color: string;
};

const INDUSTRIES: Record<string, Industry> = {
  'salon-beauty': {
    slug: 'salon-beauty',
    label: 'salonu beauty',
    href: '/dla/salon-beauty',
    color: '#EC4899',
  },
  'gabinet-spa': {
    slug: 'gabinet-spa',
    label: 'gabinetu i SPA',
    href: '/dla/gabinet-spa',
    color: '#06B6D4',
  },
  restauracja: {
    slug: 'restauracja',
    label: 'restauracji',
    href: '/dla/restauracja',
    color: '#F97316',
  },
  'warsztat-mechaniczny': {
    slug: 'warsztat-mechaniczny',
    label: 'warsztatu samochodowego',
    href: '/dla/warsztat-mechaniczny',
    color: '#64748B',
  },
};

// categorySlug wpisu → branża /dla/*
const INDUSTRY_BY_CATEGORY: Record<string, string> = {
  beauty: 'salon-beauty',
  'ai-dla-beauty': 'salon-beauty',
  zdrowie: 'gabinet-spa',
  food: 'restauracja',
  'ai-dla-gastronomii': 'restauracja',
  auto: 'warsztat-mechaniczny',
};

export default function IndustryCta({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const target = INDUSTRY_BY_CATEGORY[categorySlug];
  const industry = target ? INDUSTRIES[target] : undefined;

  if (industry) {
    return (
      <div
        className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
        style={{ borderLeftWidth: 4, borderLeftColor: industry.color }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Botiko dla Twojej branży
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          Prowadzisz tego typu firmę? Zobacz, jak Botiko działa u Ciebie
        </h2>
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          Gotowy bot dla {industry.label}, odpowiada klientom 24/7, zbiera
          kontakt i odsyła do rezerwacji. 99 zł/mies., 14 dni za darmo.
        </p>
        <Link
          href={industry.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-shadow hover:shadow-lg"
          style={{ backgroundColor: industry.color }}
        >
          Bot dla {industry.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Wpis ogólny, link do wszystkich branż.
  return (
    <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Botiko dla Twojej branży
      </p>
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
        Zobacz gotowy bot dla swojej firmy usługowej
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {Object.values(INDUSTRIES).map((ind) => (
          <Link
            key={ind.slug}
            href={ind.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ind.color }}
            />
            Bot dla {ind.label}
          </Link>
        ))}
        <Link
          href="/dla/inna"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-brand" />
          Inna firma usługowa
        </Link>
      </div>
    </div>
  );
}
