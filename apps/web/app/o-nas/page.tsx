import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O nas',
  description:
    'Botiko to bot obsługi klienta 24/7 dla firm usługowych w Polsce. Poznaj zespół i podejście do produktu.',
  alternates: { canonical: 'https://botiko.pl/o-nas' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-sm text-slate-500 hover:text-brand transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Wróć do strony głównej
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">O Botiko</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">
            Budujemy <strong>bota obsługi klienta</strong>, który odpowiada na pytania 24/7, zbiera leady i odsyła do rezerwacji — tak,
            żeby właściciel firmy usługowej mógł skupić się na pracy, a nie na telefonach i wiadomościach.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-slate-900">Dla kogo?</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">
                Dla firm usługowych w Polsce: salony, gabinety, restauracje, warsztaty i inne branże. Startujesz od gotowego szablonu,
                a potem dopasowujesz bota do swojej oferty.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">Jak podchodzimy do produktu</h2>
              <ul className="mt-3 list-disc pl-5 text-slate-600 space-y-2">
                <li>Prosto: wdrożenie w kilkanaście minut.</li>
                <li>Konkretnie: bot ma działać na Twojej wiedzy (cennik, FAQ, godziny), a nie „zgadywać”.</li>
                <li>Bezpiecznie: dane leadów są szyfrowane, a infrastruktura jest w UE.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">Kontakt</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">
                Masz pytanie lub chcesz zobaczyć Botiko w Twojej branży? Napisz do nas na{' '}
                <a href="mailto:kontakt@botiko.pl" className="text-brand font-semibold hover:underline">
                  kontakt@botiko.pl
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

