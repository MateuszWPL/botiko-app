import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import Pricing from '@/components/marketing/Pricing';
import { CalendarCheck, ShieldCheck, PhoneCall, Rocket } from 'lucide-react';
import { SITE_URL, breadcrumbListSchema, faqPageSchema } from '@/lib/seo';

// Reframe braku rezerwacji jako zaleta (obiekcja „a Booksy sam umawia" z SXO).
const BOOKING_REFRAME = [
  {
    Icon: CalendarCheck,
    title: 'Zostajesz przy swoim kalendarzu',
    text: 'Dalej używasz Booksy, Calendly albo Google Kalendarza. Bez migracji i bez uzależnienia od jednego dostawcy, bot tylko kieruje do tego, co już masz.',
  },
  {
    Icon: ShieldCheck,
    title: 'Bez ryzyka podwójnej rezerwacji',
    text: 'Bot nie ma dostępu do Twojego grafiku, więc nie zapisze dwóch klientów na tę samą godzinę. Terminami sterujesz Ty, tam, gdzie zawsze.',
  },
  {
    Icon: PhoneCall,
    title: 'Ty domykasz rezerwację',
    text: 'Bot odpowiada 24/7 i zbiera numer, a Ty oddzwaniasz i proponujesz termin na swoich warunkach. Kontakt trafia od razu do panelu Botiko, gotowy do oddzwonienia.',
  },
] as const;

// Opcjonalna usługa done-for-you (jednorazowa), poza planem 99 zł. Rozwiązuje
// główny killer konwersji: właściciel nie skonfiguruje bota sam. Nie zmienia
// planu, plan zostaje jeden (99 zł/mies.).
const SETUP_INCLUDES = [
  'Import wiedzy z Twojej strony i cennika',
  'Ustawienie bota pod Twoją branżę i markę',
  'Instalacja na stronie (WordPress lub skrypt)',
  'Test na realnych pytaniach klientów przed startem',
] as const;

const URL = `${SITE_URL}/cennik`;

export const metadata: Metadata = {
  title: 'Cennik, ile kosztuje bot obsługi klienta',
  description:
    'Botiko kosztuje 99 zł miesięcznie w jednym planie: bot 24/7, do 1000 rozmów, zbieranie leadów, baza wiedzy. 14 dni za darmo bez karty, bez umowy.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cennik Botiko, 99 zł/mies., bez umowy',
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
    a: 'Nie ma obowiązkowej opłaty wdrożeniowej, bota konfigurujesz samodzielnie w ~15 minut. Jeśli wolisz, możemy skonfigurować go za Ciebie w ramach opcjonalnej usługi „Start za Ciebie" (199 zł jednorazowo). Sam plan dalej kosztuje 99 zł miesięcznie.',
  },
  {
    q: 'Na czym polega usługa „Start za Ciebie" za 199 zł?',
    a: 'To jednorazowa, opcjonalna usługa done-for-you: importujemy wiedzę z Twojej strony i cennika, ustawiamy bota pod Twoją branżę, instalujemy go na stronie i testujemy na realnych pytaniach. Dostajesz gotowego bota do zaakceptowania. Nie zmienia ceny abonamentu (99 zł/mies.), napisz na kontakt@botiko.pl, jeśli chcesz z niej skorzystać.',
  },
  {
    q: 'Co się stanie, jeśli przekroczę 1000 rozmów miesięcznie?',
    a: 'Limit 1000 rozmów miesięcznie z naddatkiem pokrywa potrzeby mikro i małych firm usługowych. Jeśli Twój ruch jest większy, napisz na kontakt@botiko.pl, dobierzemy rozwiązanie.',
  },
];

// Botiko to usługa (SaaS), nie produkt sklepowy, dlatego @type: 'Service', nie
// 'Product'. Product + Offer sprawia, że Google klasyfikuje stronę jako merchant
// listing / product snippet i wymaga pól sklepowych (image, review,
// aggregateRating, dane wysyłki), których usługa subskrypcyjna nie ma, to
// generowało błędy w GSC. Service + Offer niesie cenę bez tych wymagań i jest
// spójne ze stronami /dla/*.
const OFFER_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Botiko, bot obsługi klienta',
  description:
    'Bot obsługi klienta 24/7 dla polskich firm usługowych: odpowiada na pytania, zbiera leady, odsyła do rezerwacji.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'Polska' },
  serviceType: 'Customer service automation',
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
            Bez droższych progów, bez opłaty wdrożeniowej, bez umowy. 14 dni za darmo,
            bez karty kredytowej. Poniżej sprawdzisz, czy bot się u Ciebie zwróci.
          </p>
        </div>
      </section>

      {/* Plan + ROI calculator (reused component) */}
      <Pricing />

      {/* Opcjonalny setup done-for-you, 199 zł jednorazowo (poza planem) */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-bg p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="shrink-0 w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center" aria-hidden>
                  <Rocket className="w-5 h-5" strokeWidth={2} />
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
                  Nie chcesz konfigurować sam?
                </h2>
              </div>
              <p className="text-slate-500 leading-relaxed mb-5 max-w-xl">
                Skonfigurujemy bota za Ciebie, od importu wiedzy po instalację na stronie.
                Dostajesz gotowego bota do zaakceptowania. Opcjonalnie, poza planem, sam
                plan dalej kosztuje 99 zł miesięcznie.
              </p>
              <ul className="flex flex-col gap-2.5">
                {SETUP_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text">
                    <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center text-brand" aria-hidden>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-56 shrink-0 text-center md:text-left md:border-l md:border-slate-200 md:pl-8">
              <p className="text-4xl font-extrabold text-text">199 zł</p>
              <p className="text-slate-500 text-sm mt-1 mb-5">jednorazowo · bez abonamentu</p>
              <a
                href="mailto:kontakt@botiko.pl?subject=Start%20za%20Ciebie%20%E2%80%94%20konfiguracja%20bota"
                className="block text-center py-3 px-5 rounded-full bg-brand text-white font-bold text-sm shadow-lg shadow-brand/20 hover:bg-brand-dark transition-colors"
              >
                Napisz do nas
              </a>
              <p className="text-xs text-slate-400 mt-3">
                Odpowiadamy w 24h na kontakt@botiko.pl
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Co Botiko robi, a czego nie, reframe braku rezerwacji jako zaleta */}
      <section className="py-16 bg-bg border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
              Co Botiko robi, a czego świadomie nie robi
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Bot odpowiada na pytania i zbiera kontakt, a rezerwację zostawia Tobie i Twojemu systemowi
              (Booksy, Calendly). To celowe, i korzystne:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {BOOKING_REFRAME.map((p) => {
              const { Icon } = p;
              return (
                <div
                  key={p.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="mb-3 text-brand" aria-hidden>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-text mb-2">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
