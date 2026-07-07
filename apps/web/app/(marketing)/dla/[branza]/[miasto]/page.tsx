import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import {
  getAllLocalParams,
  getLocalPage,
  getCitiesForIndustry,
  isIndexableLocalCity,
} from '@/lib/local-seo';
import {
  SITE_URL,
  breadcrumbListSchema,
  faqPageSchema,
} from '@/lib/seo';

type Params = { branza: string; miasto: string };

export function generateStaticParams(): Params[] {
  return getAllLocalParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const page = getLocalPage(params.branza, params.miasto);
  if (!page) return {};

  const { industry, city } = page;
  const url = `${SITE_URL}/dla/${industry.slug}/${city.slug}`;
  const title = `Bot dla ${industry.labelGenitive} ${city.name} — odpowiada klientom 24/7`;
  const description = `Botiko dla ${industry.labelGenitive} ${city.inLocative}: odpowiada na pytania klientów 24/7, zbiera kontakt i odsyła do rezerwacji. 99 zł/mies., 14 dni za darmo.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Only the Białystok pages match a genuine local presence; the rest stay
    // crawlable for direct/ad traffic but are kept out of the index to avoid
    // near-duplicate/doorway penalties.
    robots: isIndexableLocalCity(city.slug)
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      title: `Bot dla ${industry.labelGenitive} ${city.name}`,
      description,
      url,
      type: 'website',
    },
  };
}

export default function LocalLandingPage({ params }: { params: Params }) {
  const page = getLocalPage(params.branza, params.miasto);
  if (!page) notFound();

  const { industry, city, sampleChats, faqs } = page;
  const url = `${SITE_URL}/dla/${industry.slug}/${city.slug}`;
  const otherCities = getCitiesForIndustry(industry.slug).filter(
    (c) => c.slug !== city.slug,
  );

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Bot obsługi klienta dla ${industry.labelGenitive} ${city.name}`,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'City', name: city.name },
    serviceType: industry.serviceType,
    url,
    offers: { '@type': 'Offer', price: '99', priceCurrency: 'PLN' },
  };

  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          serviceSchema,
          faqPageSchema(faqs),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: industry.labelTitle, href: `/dla/${industry.slug}` },
            { label: city.name },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: industry.gradient }}>
        <div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${industry.accent}, transparent 70%)` }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Botiko.pl', href: '/' },
                { label: industry.labelTitle, href: `/dla/${industry.slug}` },
                { label: city.name },
              ]}
              variant="dark"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Bot dla {industry.labelGenitive} {city.inLocative}
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl mb-8">
            {industry.intro(city)}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              style={{ color: industry.accent }}
            >
              Testuj 14 dni za darmo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white hover:bg-white/10 transition-colors"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              Zobacz demo bota
            </Link>
          </div>
        </div>
      </section>

      {/* Local pain */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-4">
            Dlaczego bot ma sens {city.inLocative}
          </h2>
          <p className="text-slate-600 leading-relaxed">{industry.painLocal(city)}</p>
        </div>
      </section>

      {/* Sample chats */}
      <section className="py-16 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
              Jak bot odpowiada klientom {city.inLocative}
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Bot odpowiada na podstawie Twojego cennika i wiedzy — nie zgaduje.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {sampleChats.map((s) => (
              <div key={s.q} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex justify-end mb-3">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-white leading-relaxed"
                    style={{ background: industry.accent, borderBottomRightRadius: 4 }}
                  >
                    {s.q}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed bg-slate-50"
                    style={{ borderBottomLeftRadius: 4, border: '1px solid #F1F5F9' }}
                  >
                    {s.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-8 text-center">
            Co bot robi dla {industry.labelGenitive}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {industry.features.map((f) => (
              <li key={f} className="flex items-start gap-3 bg-bg rounded-xl p-4 border border-slate-100">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5"
                  style={{ background: industry.accent }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-slate-700 text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
              Kiedy bot się zwraca?
            </h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>99 zł/mies.</strong> Jeden dograny klient zwykle pokrywa cały miesiąc.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left" style={{ background: `${industry.accent}12` }}>
                  <th className="px-5 py-3 font-semibold text-slate-700">Nowi klienci / mies.</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Przychód</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Scenariusz</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Zysk netto</th>
                </tr>
              </thead>
              <tbody>
                {industry.roiRows.map((row) => (
                  <tr key={row.clients} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-bold text-text">{row.clients}</td>
                    <td className="px-5 py-4 text-slate-600">{row.revenue} zł</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{row.note}</td>
                    <td className="px-5 py-4 text-right font-extrabold text-emerald-600">
                      +{row.revenue - 99} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            * Szacunki orientacyjne. Bot zamienia wiadomości w leady, które zamykasz telefonem.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">
            Najczęstsze pytania — {industry.label} {city.inLocative}
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-bg overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-text text-sm sm:text-base">
                  <span className="flex-1">{faq.q}</span>
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  >
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

      {/* Other cities */}
      {otherCities.length > 0 && (
        <section className="py-12 bg-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-lg font-bold text-text mb-4">
              Botiko dla {industry.labelGenitive} w innych miastach
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/dla/${industry.slug}/${c.slug}`}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 hover:border-brand hover:text-brand transition-colors"
                >
                  {industry.labelTitle} {c.name}
                </Link>
              ))}
            </div>
            <p className="mt-6">
              <Link href={`/dla/${industry.slug}`} className="text-brand font-semibold text-sm hover:underline">
                ← Wróć do strony: bot dla {industry.labelGenitive}
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-8 text-center text-white" style={{ background: industry.gradient }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Uruchom bota w swojej firmie {city.inLocative}
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              14 dni za darmo, bez karty. Konfiguracja w ~15 minut, działa na WordPress i każdej innej stronie.
            </p>
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              style={{ color: industry.accent }}
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
