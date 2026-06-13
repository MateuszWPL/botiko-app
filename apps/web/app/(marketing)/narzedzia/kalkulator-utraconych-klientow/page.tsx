import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import LostClientsCalculator from '@/components/marketing/calculators/LostClientsCalculator';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

const URL = `${SITE_URL}/narzedzia/kalkulator-utraconych-klientow`;

export const metadata: Metadata = {
  title: 'Kalkulator utraconych klientów — ile tracisz przez brak odpowiedzi',
  description:
    'Darmowy kalkulator: oblicz, ile pieniędzy miesięcznie i rocznie tracisz, gdy nie odpisujesz na wiadomości klientów na czas. Bez logowania.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator utraconych klientów — Botiko',
    description:
      'Oblicz stratę z nieodebranych wiadomości klientów. Za darmo, bez logowania.',
    url: URL,
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Jak liczona jest strata z nieodebranych wiadomości?',
    a: 'Kalkulator mnoży liczbę nieodebranych zapytań tygodniowo przez ~4,33 tygodnia w miesiącu i przez odsetek osób, które kupiłyby przy szybkiej odpowiedzi. Wynik mnożymy przez średnią wartość klienta, otrzymując utracony przychód miesięcznie i rocznie.',
  },
  {
    q: 'Dlaczego szybka odpowiedź ma znaczenie?',
    a: 'Klienci firm usługowych często piszą wieczorami i porównują kilka miejsc naraz. Kto odpowie pierwszy, ten zwykle dostaje rezerwację. Brak odpowiedzi w ciągu kilku godzin najczęściej oznacza utratę klienta na rzecz konkurencji.',
  },
  {
    q: 'Jak zmniejszyć tę stratę?',
    a: 'Bot obsługi klienta odpowiada natychmiast 24/7 i zbiera kontakt, nawet gdy pracujesz lub śpisz. Botiko kosztuje 99 zł miesięcznie — zwykle ułamek straty pokazywanej przez ten kalkulator.',
  },
];

const APP_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kalkulator utraconych klientów',
  url: URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description:
    'Kalkulator szacujący utracony przychód firmy usługowej z powodu nieodebranych wiadomości klientów.',
};

export default function LostClientsToolPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          APP_SCHEMA,
          faqPageSchema(FAQS),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'Narzędzia', href: '/narzedzia' },
            { label: 'Kalkulator utraconych klientów' },
          ]),
        ]}
      />

      <section className="pt-28 pb-6 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Botiko.pl', href: '/' },
                { label: 'Narzędzia', href: '/narzedzia' },
                { label: 'Kalkulator utraconych klientów' },
              ]}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-4">
            Ile klientów tracisz, bo nie odpisujesz na czas?
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Wiele firm usługowych traci klientów nie przez ceny, lecz przez brak
            szybkiej odpowiedzi. Klient pisze wieczorem, nie dostaje odpowiedzi i
            rezerwuje gdzie indziej. Ten kalkulator szacuje, ile Cię to kosztuje
            miesięcznie i rocznie — wpisz swoje dane poniżej.
          </p>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <LostClientsCalculator />
        </div>
      </section>

      {/* How it works (text for SEO/GEO — content the calculator's JS can't expose) */}
      <section className="py-12 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-text mb-5">Jak działa ten kalkulator</h2>
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <p>
              Strata = (nieodebrane wiadomości tygodniowo) × 4,33 × (odsetek, który by
              kupił) × (średnia wartość klienta). To liczba klientów i przychodu, który
              przepada, zanim ktokolwiek zdąży odpisać.
            </p>
            <p>
              Przykład: 10 zapytań tygodniowo, 20% gotowych kupić, klient wart 200 zł →
              około 8–9 utraconych klientów i ~1 700 zł miesięcznie. Bot obsługi klienta
              za 99 zł/mies. odpowiada od razu i zbiera kontakt, więc te wiadomości nie
              przepadają.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-text mb-6">Najczęstsze pytania</h2>
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

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold mb-3">Przestań tracić te wiadomości</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              Botiko odpowiada klientom 24/7 i zbiera kontakt. 14 dni za darmo, bez karty.
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
