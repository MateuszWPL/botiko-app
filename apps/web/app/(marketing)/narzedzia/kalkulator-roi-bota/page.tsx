import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import { ROICalculator } from '@/components/blog/mdx/ROICalculator';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

const URL = `${SITE_URL}/narzedzia/kalkulator-roi-bota`;

export const metadata: Metadata = {
  title: 'Kalkulator ROI bota, czy 99 zł/mies. się zwróci',
  description:
    'Darmowy kalkulator zwrotu z inwestycji w bota obsługi klienta. Sprawdź, ilu nowych klientów wystarczy, by Botiko za 99 zł/mies. się opłacił.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator ROI bota. Botiko',
    description:
      'Policz zwrot z inwestycji w bota obsługi klienta. Za darmo, bez logowania.',
    url: URL,
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Jak liczony jest zwrot z inwestycji w bota?',
    a: 'ROI = (liczba nowych klientów pozyskanych przez bota × średnia wartość klienta) podzielone przez koszt Botiko (99 zł/mies.). Jeśli bot domknie choć jednego klienta wartego więcej niż 99 zł, koszt już się zwrócił.',
  },
  {
    q: 'Ilu klientów musi domknąć bot, żeby się opłacił?',
    a: 'Przy kliencie wartym 150-300 zł wystarczy jeden dograny klient miesięcznie, by pokryć koszt 99 zł. Każdy kolejny to już czysty zysk.',
  },
  {
    q: 'Czy bot sam pozyskuje klientów?',
    a: 'Bot nie robi marketingu, zamienia wiadomości od osób, które już piszą do Ciebie, w leady z kontaktem. Pozyskanie ruchu (reklama, social media, polecenia) zostaje po Twojej stronie.',
  },
];

const APP_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kalkulator ROI bota obsługi klienta',
  url: URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description:
    'Kalkulator zwrotu z inwestycji w bota obsługi klienta dla firm usługowych.',
};

export default function RoiToolPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          APP_SCHEMA,
          faqPageSchema(FAQS),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'Narzędzia', href: '/narzedzia' },
            { label: 'Kalkulator ROI bota' },
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
                { label: 'Kalkulator ROI bota' },
              ]}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-4">
            Czy bot za 99 zł/mies. się zwróci?
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Bot obsługi klienta kosztuje 99 zł miesięcznie. Aby się opłacił, wystarczy,
            że domknie jednego-dwóch klientów, których inaczej byś stracił. Przesuń
            suwaki i sprawdź swój zwrot z inwestycji.
          </p>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ROICalculator industry="other" className="my-0" />
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
            <h2 className="text-2xl font-extrabold mb-3">Sprawdź to na żywo</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              14 dni za darmo, bez karty. Konfiguracja w ~15 minut.
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
