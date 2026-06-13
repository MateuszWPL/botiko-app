import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import {
  getComparison,
  getAllComparisonSlugs,
  type CompareCell,
} from '@/lib/comparisons';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllComparisonSlugs();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getComparison(params.slug);
  if (!c) return {};
  const url = `${SITE_URL}/porownanie/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url, type: 'website' },
  };
}

function Cell({ value }: { value: CompareCell }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700" aria-label="Tak">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500" aria-label="Nie">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return <span className="text-sm text-slate-600">{value}</span>;
}

export default function ComparisonPage({ params }: { params: Params }) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          faqPageSchema(c.faqs),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'Porównania', href: '/porownanie' },
            { label: c.title },
          ]),
        ]}
      />

      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338CA 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Botiko.pl', href: '/' },
                { label: 'Porównania', href: '/porownanie' },
                { label: c.title },
              ]}
              variant="dark"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            {c.h1}
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">{c.intro}</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-brand-soft text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">Cecha</th>
                  <th className="px-5 py-3 font-semibold text-brand">{c.optionA}</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">{c.optionB}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-t border-slate-100 align-top">
                    <td className="px-5 py-4 font-medium text-slate-700">{row.feature}</td>
                    <td className="px-5 py-4"><Cell value={row.a} /></td>
                    <td className="px-5 py-4"><Cell value={row.b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl bg-brand-soft border border-brand/20 p-6">
            <h2 className="font-bold text-text mb-2">Werdykt</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{c.verdict}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-text mb-6">Najczęstsze pytania</h2>
          <div className="flex flex-col gap-3">
            {c.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-text text-sm sm:text-base">
                  <span className="flex-1">{faq.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 transition-transform duration-300 group-open:rotate-45" aria-hidden>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold mb-3">Przetestuj Botiko na swojej stronie</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              14 dni za darmo, bez karty. Zobacz, jak bot odpowiada Twoim klientom.
            </p>
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-indigo-700 font-bold text-base shadow-xl hover:shadow-2xl transition-all"
            >
              Zacznij za darmo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
