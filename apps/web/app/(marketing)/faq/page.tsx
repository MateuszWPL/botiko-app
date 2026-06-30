import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import { ALL_FAQS, FAQ_GROUPS, HOME_FAQS } from '@/lib/faq';
import { faqPageSchema, breadcrumbListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'FAQ — najczęstsze pytania o bocie obsługi klienta',
  description:
    'Odpowiedzi na najczęstsze pytania o Botiko: ile kosztuje bot, jak działa na WordPress, czy zastąpi recepcjonistkę, co z RODO i jak szybko go uruchomisz.',
  alternates: { canonical: 'https://botiko.pl/faq' },
  openGraph: {
    title: 'FAQ — najczęstsze pytania o Botiko',
    description:
      'Cena, wdrożenie, RODO, WordPress — wszystko co musisz wiedzieć przed uruchomieniem bota obsługi klienta.',
    url: 'https://botiko.pl/faq',
    type: 'website',
  },
};

// "Ogólne" groups the homepage questions; FAQ_GROUPS adds people-also-ask intent.
const SECTIONS = [{ heading: 'Ogólne', items: HOME_FAQS }, ...FAQ_GROUPS];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          faqPageSchema(ALL_FAQS),
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'FAQ' },
          ]),
        ]}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338CA 100%)' }}
      >
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: 'Botiko.pl', href: '/' }, { label: 'FAQ' }]}
              variant="dark"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Najczęstsze pytania o Botiko
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">
            Cena, wdrożenie, bezpieczeństwo danych i WordPress — krótkie, konkretne
            odpowiedzi. Nie znalazłeś swojego pytania?{' '}
            <a href="mailto:kontakt@botiko.pl" className="text-white underline hover:no-underline">
              Napisz do nas
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-extrabold text-text mb-5">{section.heading}</h2>
              <div className="flex flex-col gap-3">
                {section.items.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-text text-sm sm:text-base">
                      <span className="flex-1">{faq.q}</span>
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 transition-transform duration-300 group-open:rotate-45 group-open:border-brand group-open:text-brand"
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
          ))}

          {/* CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold mb-3">Gotowy, żeby przestać tracić klientów?</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              14 dni za darmo, bez karty kredytowej. Konfiguracja w ~15 minut.
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
