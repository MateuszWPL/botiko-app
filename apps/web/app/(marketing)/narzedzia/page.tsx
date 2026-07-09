import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import { breadcrumbListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Darmowe narzędzia dla firm usługowych',
  description:
    'Bezpłatne kalkulatory dla właścicieli firm usługowych: sprawdź, ile klientów tracisz przez nieodebrane wiadomości i czy bot obsługi klienta zwróci się w Twojej firmie.',
  alternates: { canonical: 'https://botiko.pl/narzedzia' },
  openGraph: {
    title: 'Darmowe narzędzia dla firm usługowych. Botiko',
    description:
      'Kalkulator utraconych klientów i kalkulator ROI bota. Bez logowania, za darmo.',
    url: 'https://botiko.pl/narzedzia',
    type: 'website',
  },
};

const TOOLS = [
  {
    href: '/narzedzia/kalkulator-utraconych-klientow',
    title: 'Kalkulator utraconych klientów',
    desc: 'Policz, ile pieniędzy tracisz miesięcznie, gdy nie odpisujesz na wiadomości na czas.',
  },
  {
    href: '/narzedzia/kalkulator-roi-bota',
    title: 'Kalkulator ROI bota',
    desc: 'Sprawdź, ilu dograny klientów wystarczy, by bot za 99 zł/mies. się zwrócił.',
  },
];

export default function NarzedziaPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={breadcrumbListSchema([
          { label: 'Botiko.pl', href: '/' },
          { label: 'Narzędzia' },
        ])}
      />

      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338CA 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Botiko.pl', href: '/' }, { label: 'Narzędzia' }]} variant="dark" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Darmowe narzędzia dla firm usługowych
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">
            Krótkie kalkulatory, które pomogą Ci ocenić, ile kosztuje Cię brak szybkiej
            obsługi klienta, i czy bot się opłaca. Bez logowania, za darmo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-5">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand/30 transition-all"
            >
              <h2 className="font-bold text-text text-lg mb-2 group-hover:text-brand transition-colors">
                {t.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{t.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm">
                Otwórz kalkulator
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
