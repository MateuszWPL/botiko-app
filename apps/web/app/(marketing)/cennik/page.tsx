import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import Pricing from '@/components/marketing/Pricing';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

const URL = `${SITE_URL}/cennik`;

export const metadata: Metadata = {
  title: 'Cennik — ile kosztuje bot obsługi klienta',
  description:
    'Botiko kosztuje 99 zł miesięcznie w jednym planie: bot 24/7, do 1000 rozmów, zbieranie leadów, baza wiedzy. 14 dni za darmo bez karty, bez umowy.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cennik Botiko — 99 zł/mies., bez umowy',
    description:
      'Jeden plan: 99 zł miesięcznie, 14 dni za darmo bez karty. Bez ukrytych kosztów.',
    url: URL,
    type: 'website',
  },
};

// Pricing-page FAQ (commercial intent + AI citations on "ile kosztuje chatbot").
const FAQS = [
  {
    q: 'Ile kosztuje Botiko?',
    a: 'Botiko kosztuje 99 zł miesięcznie w jednym planie. Cena obejmuje bota odpowiadającego 24/7, do 1000 rozmów miesięcznie, zbieranie leadów, bazę wiedzy i dashboard. Nie ma droższych progów ani ukrytych opłat.',
  },
  {
    q: 'Czy jest darmowy okres próbny?',
    a: 'Tak, pierwsze 14 dni są bezpłatne i nie wymagają podania karty kredytowej. Po okresie próbnym subskrypcja kosztuje 99 zł miesięcznie.',
  },
  {
    q: 'Czy jest umowa długoterminowa?',
    a: 'Nie. Subskrypcja jest miesięczna i możesz ją anulować w dowolnym momencie z poziomu panelu. Dostęp pozostaje aktywny do końca opłaconego okresu.',
  },
  {
    q: 'Czy są dodatkowe opłaty za wdrożenie?',
    a: 'Nie ma opłaty wdrożeniowej. Konfigurujesz bota samodzielnie w ~15 minut, a fakturę za subskrypcję znajdziesz w panelu.',
  },
  {
    q: 'Co się stanie, jeśli przekroczę 1000 rozmów miesięcznie?',
    a: 'Limit 1000 rozmów miesięcznie z naddatkiem pokrywa potrzeby mikro i małych firm usługowych. Jeśli Twój ruch jest większy, napisz na kontakt@botiko.pl — dobierzemy rozwiązanie.',
  },
];

const OFFER_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Botiko — bot obsługi klienta',
  description:
    'Bot obsługi klienta 24/7 dla polskich firm usługowych: odpowiada na pytania, zbiera leady, odsyła do rezerwacji.',
  image: 'https://botiko.pl/opengraph-image.png',
  brand: { '@type': 'Brand', name: 'Botiko.pl' },
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'PLN',
    url: URL,
    availability: 'https://schema.org/InStock',
    description: 'Jeden plan, 14 dni za darmo bez karty, bez umowy.',
  },
};

export default function CennikPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          OFFER_SCHEMA,
          faqPageSchema(FAQS),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'Cennik' },
          ]),
        ]}
      />

      {/* Dark hero (keeps the fixed navbar legible) */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338CA 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Botiko.pl', href: '/' }, { label: 'Cennik' }]} variant="dark" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            99 zł miesięcznie. Jeden plan, wszystko w środku.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">
            Bez droższych progów, bez opłaty wdrożeniowej, bez umowy. 14 dni za darmo —
            bez karty kredytowej. Poniżej sprawdzisz, czy bot się u Ciebie zwróci.
          </p>
        </div>
      </section>

      {/* Plan + ROI calculator (reused component) */}
      <Pricing />

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">Pytania o cenę</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-bg overflow-hidden [&_summary::-webkit-details-marker]:hidden"
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
    </main>
  );
}
