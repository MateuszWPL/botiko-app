import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import { COMPARISONS } from '@/lib/comparisons';
import { breadcrumbListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Porównania — bot obsługi klienta a inne rozwiązania',
  description:
    'Porównaj bota Botiko z ręcznym odpowiadaniem na wiadomości i z ogólnym chatbotem ChatGPT. Czas reakcji, koszt, zbieranie leadów i znajomość Twojej oferty.',
  alternates: { canonical: 'https://botiko.pl/porownanie' },
  openGraph: {
    title: 'Porównania Botiko — co wybrać dla firmy usługowej',
    description:
      'Bot vs ręczne odpowiadanie, bot vs ogólny ChatGPT — uczciwe porównania.',
    url: 'https://botiko.pl/porownanie',
    type: 'website',
  },
};

export default function PorownaniaPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={breadcrumbListSchema([
          { label: 'Botiko.pl', href: '/' },
          { label: 'Porównania' },
        ])}
      />

      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338CA 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Botiko.pl', href: '/' }, { label: 'Porównania' }]} variant="dark" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Bot obsługi klienta — z czym warto go porównać
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">
            Zanim wybierzesz rozwiązanie, zobacz uczciwe porównania: gdzie bot wygrywa,
            a gdzie lepiej sprawdzi się człowiek lub inne narzędzie.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-5">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/porownanie/${c.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand/30 transition-all"
            >
              <h2 className="font-bold text-text text-lg mb-2 group-hover:text-brand transition-colors">
                {c.optionA} vs {c.optionB}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{c.intro.slice(0, 130)}…</p>
              <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm">
                Zobacz porównanie
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
