import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import {
  SITE_URL,
  WORDPRESS_PLUGIN_URL,
  breadcrumbListSchema,
  faqPageSchema,
  softwareApplicationSchema,
} from '@/lib/seo';

const URL = `${SITE_URL}/integracje/wordpress`;

export const metadata: Metadata = {
  title: 'Bot na WordPress, oficjalna wtyczka Botiko',
  description:
    'Zainstaluj bota obsługi klienta na WordPress oficjalną wtyczką Botiko z katalogu WordPress.org, bez edycji motywu i bez programisty. Łączysz stronę jednym kodem. WordPress to najpopularniejszy system stron firmowych w Polsce.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Bot na WordPress, oficjalna wtyczka Botiko',
    description:
      'Dodaj bota do WordPress oficjalną wtyczką z katalogu WordPress.org. Instalacja i połączenie jednym kodem, bez programisty.',
    url: URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bot na WordPress, oficjalna wtyczka Botiko',
    description:
      'Oficjalna wtyczka Botiko w katalogu WordPress.org. Zainstaluj i połącz stronę jednym kodem.',
  },
};

const STEPS = [
  {
    name: 'Zainstaluj wtyczkę Botiko z katalogu',
    text: 'W panelu WordPress wejdź w Wtyczki → Dodaj nową, wyszukaj „Botiko”, zainstaluj i aktywuj oficjalną wtyczkę. Bez edycji motywu.',
  },
  {
    name: 'Wygeneruj kod połączenia w panelu Botiko',
    text: 'W panelu Botiko wejdź w zakładkę „Instalacja” i kliknij „Generuj kod połączenia”. Kod jest jednorazowy i ważny kilka minut.',
  },
  {
    name: 'Wklej kod w ustawieniach wtyczki',
    text: 'W WordPress otwórz Ustawienia → Botiko i wklej kod połączenia. Wtyczka pobierze Twojego bota i automatycznie autoryzuje domenę tej strony.',
  },
  {
    name: 'Sprawdź bota na stronie',
    text: 'Otwórz swoją stronę, w prawym dolnym rogu pojawi się okienko bota. Gotowe; cała instalacja zajmuje kilka minut.',
  },
];

const FAQS = [
  {
    q: 'Czy jest oficjalna wtyczka Botiko w katalogu WordPress.org?',
    a: 'Tak. Botiko ma oficjalną wtyczkę w katalogu WordPress.org (slug botiko-ai-customer-service-bot). Instalujesz ją prosto z panelu WordPress: Wtyczki → Dodaj nową → wyszukaj „Botiko”, a WordPress zadba o aktualizacje.',
  },
  {
    q: 'Czy muszę edytować motyw WordPress, żeby dodać bota?',
    a: 'Nie. Oficjalna wtyczka osadza bota bez dotykania plików motywu, łączysz stronę jednym kodem w ustawieniach wtyczki. Aktualizacja motywu nie usunie bota.',
  },
  {
    q: 'Czy Botiko działa na każdym motywie WordPress?',
    a: 'Tak. Wtyczka ładuje widget niezależnie od motywu, więc działa z Astra, Divi, Elementor, OceanWP i innymi motywami oraz builderami strony.',
  },
  {
    q: 'Czy bot spowolni moją stronę WordPress?',
    a: 'Wpływ jest minimalny, skrypt widgetu ładuje się asynchronicznie, a sam widget jest lekki. Bot nie blokuje renderowania strony.',
  },
  {
    q: 'Nie chcę instalować wtyczki, czy da się inaczej?',
    a: 'Tak. Ten sam kod bota możesz wkleić przez darmową wtyczkę do fragmentów kodu (np. WPCode) w sekcji Header, albo osadzić uniwersalny skrypt na dowolnej innej stronie WWW (HTML). Wtyczka Botiko jest jednak najprostszą i zalecaną drogą.',
  },
];

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Jak dodać bota Botiko na stronę WordPress',
  description:
    'Instalacja bota obsługi klienta Botiko na WordPress przez oficjalną wtyczkę z katalogu WordPress.org, krok po kroku.',
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
          softwareApplicationSchema(),
          faqPageSchema(FAQS),
          // Bez pośredniego crumba „Integracje", nie ma strony /integracje, więc
          // element byłby bez href, a wtedy Google odrzuca ListItem bez pola `item`
          // (błąd krytyczny w GSC dla itemListElement).
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
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
                { label: 'WordPress' },
              ]}
              variant="dark"
            />
          </div>
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#a5b4fc' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Oficjalna wtyczka w katalogu WordPress.org
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Bot obsługi klienta na WordPress, oficjalna wtyczka
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            WordPress to najpopularniejszy system stron firmowych w Polsce, dlatego Botiko
            jest zoptymalizowane właśnie pod niego. Zainstaluj bota oficjalną wtyczką z
            katalogu WordPress.org i połącz stronę jednym kodem, bez edycji motywu i bez
            programisty.
          </p>
          <a
            href={WORDPRESS_PLUGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-sm shadow-xl hover:shadow-2xl transition-all"
          >
            Zobacz wtyczkę w katalogu WordPress.org
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* Steps (HowTo) */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
            Jak zainstalować bota na WordPress, krok po kroku
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
              <strong>Wskazówka:</strong> łączysz stronę tylko raz. Bot pojawi się na całej
              witrynie, a treści (cennik, FAQ, godziny) edytujesz później w panelu Botiko,
              bez ponownego dotykania WordPress.
            </p>
          </div>
        </div>
      </section>

      {/* Why WordPress-first + fallback */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-5">
            Dlaczego Botiko stawia na WordPress
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <p>
              Większość polskich mikro i małych firm usługowych ma stronę na WordPress.
              Zamiast budować dziesiątki integracji per platforma, zrobiliśmy oficjalną
              wtyczkę, żeby instalacja na WordPress była naprawdę bezproblemowa.
            </p>
            <p>
              Nie chcesz instalować wtyczki? Ten sam kod bota wkleisz przez darmową wtyczkę
              do fragmentów kodu (np. WPCode) w sekcji Header. Skrypt Botiko działa też na
              każdej innej stronie WWW (HTML), dedykowane wsparcie kierujemy jednak przede
              wszystkim do użytkowników WordPress.
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Więcej: przeczytaj{' '}
            <Link href="/blog/botiko-dla-wordpress-przewodnik-2026" className="text-brand font-semibold hover:underline">
              przewodnik Botiko dla WordPress
            </Link>{' '}
            albo{' '}
            <Link href="/blog/jak-ustawic-bota-na-wordpress-krok-po-kroku" className="text-brand font-semibold hover:underline">
              instrukcję krok po kroku
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-6">
            Najczęstsze pytania. Botiko na WordPress
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
              14 dni za darmo, bez karty. Zainstaluj oficjalną wtyczkę z katalogu WordPress.org.
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
