import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

const URL = `${SITE_URL}/integracje/wordpress`;

export const metadata: Metadata = {
  title: 'Bot na WordPress — jak dodać Botiko w 5 minut',
  description:
    'Jak zainstalować bota obsługi klienta na stronie WordPress: krok po kroku przez darmową wtyczkę WPCode, bez edycji motywu i bez programisty. Działa na ~93% polskich stron.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Bot na WordPress — instalacja Botiko w 5 minut',
    description:
      'Dodaj bota do WordPress przez wtyczkę WPCode. Krok po kroku, bez programisty.',
    url: URL,
    type: 'website',
  },
};

const STEPS = [
  {
    name: 'Skopiuj kod bota z panelu Botiko',
    text: 'W panelu Botiko wejdź w zakładkę „Instalacja” i skopiuj swój fragment kodu (jedna linijka <script> z Twoim identyfikatorem bota).',
  },
  {
    name: 'Zainstaluj darmową wtyczkę WPCode',
    text: 'W panelu WordPress wejdź w Wtyczki → Dodaj nową, wyszukaj „WPCode”, zainstaluj i aktywuj. To darmowa, popularna wtyczka do wstawiania fragmentów kodu.',
  },
  {
    name: 'Wklej kod w sekcji Header',
    text: 'W WPCode otwórz Header & Footer i wklej kod Botiko w polu „Header”. Zapisz zmiany.',
  },
  {
    name: 'Sprawdź bota na stronie',
    text: 'Otwórz swoją stronę — w prawym dolnym rogu pojawi się okienko bota. Gotowe; cała instalacja zajmuje około 5 minut.',
  },
];

const FAQS = [
  {
    q: 'Czy muszę edytować motyw WordPress, żeby dodać bota?',
    a: 'Nie. Dzięki wtyczce WPCode wklejasz kod w panelu, bez dotykania plików motywu. Aktualizacja motywu nie usunie bota.',
  },
  {
    q: 'Czy Botiko działa na każdym motywie WordPress?',
    a: 'Tak. Bot ładuje się jako niezależny skrypt w sekcji Header, więc działa niezależnie od motywu (Astra, Divi, Elementor, OceanWP i inne) oraz buildera strony.',
  },
  {
    q: 'Czy bot spowolni moją stronę WordPress?',
    a: 'Wpływ jest minimalny — skrypt ładuje się asynchronicznie, a sam widget jest lekki. Bot nie blokuje renderowania strony.',
  },
  {
    q: 'Czy jest dedykowana wtyczka Botiko w katalogu WordPress.org?',
    a: 'Pracujemy nad dedykowaną wtyczką Botiko do katalogu WordPress.org. Do tego czasu rekomendujemy instalację przez WPCode. Chcesz dołączyć do listy oczekujących? Napisz na kontakt@botiko.pl.',
  },
];

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Jak dodać bota Botiko na stronę WordPress',
  description:
    'Instalacja bota obsługi klienta Botiko na WordPress przez wtyczkę WPCode, krok po kroku.',
  totalTime: 'PT5M',
  inLanguage: 'pl-PL',
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
};

export default function WordPressIntegrationPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          HOWTO_SCHEMA,
          faqPageSchema(FAQS),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'Integracje' },
            { label: 'WordPress' },
          ]),
        ]}
      />

      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Botiko.pl', href: '/' },
                { label: 'Integracje' },
                { label: 'WordPress' },
              ]}
              variant="dark"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Bot obsługi klienta na WordPress — w 5 minut
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            WordPress napędza około 93% polskich stron firmowych, dlatego Botiko jest pod
            niego zoptymalizowane. Instalacja zajmuje ~5 minut przez darmową wtyczkę
            WPCode — bez edycji motywu i bez programisty.
          </p>
        </div>
      </section>

      {/* Steps (HowTo) */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
            Jak zainstalować bota na WordPress — krok po kroku
          </h2>
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.name} className="flex gap-4">
                <span className="shrink-0 w-9 h-9 rounded-full bg-brand text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-text mb-1">{s.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl bg-brand-soft border border-brand/20 p-5">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Wskazówka:</strong> kod wystarczy wkleić raz. Bot pojawi się na całej
              stronie, a treści (cennik, FAQ, godziny) edytujesz później w panelu Botiko —
              bez ponownego dotykania WordPress.
            </p>
          </div>
        </div>
      </section>

      {/* Why WordPress-first */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-5">
            Dlaczego Botiko stawia na WordPress
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <p>
              Większość polskich mikro i małych firm usługowych ma stronę na WordPress.
              Zamiast budować dziesiątki integracji per platforma, skupiliśmy się na tym,
              by instalacja na WordPress była naprawdę bezproblemowa.
            </p>
            <p>
              Skrypt Botiko działa też na każdej innej stronie WWW (HTML, Wix, Squarespace
              i inne), ale dedykowane instrukcje i wsparcie kierujemy przede wszystkim do
              użytkowników WordPress.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">
            Najczęstsze pytania — Botiko na WordPress
          </h2>
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
            <h2 className="text-2xl font-extrabold mb-3">Dodaj bota do swojej strony WordPress</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              14 dni za darmo, bez karty. Instalacja w 5 minut przez WPCode.
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
