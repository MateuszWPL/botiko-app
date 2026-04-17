import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bot dla salonu beauty — odpowiada klientkom 24/7 i zbiera leady',
  description:
    'Botiko dla salonów urody: manicure, stylizacja rzęs, brwi, kosmetologia. Bot odpowiada o 22:00, zbiera numer i odsyła do Booksy. 149 zł/mies., 14 dni za darmo.',
  alternates: { canonical: 'https://botiko.pl/dla/salon-beauty' },
  openGraph: {
    title: 'Bot dla salonu beauty — odpowiada klientkom 24/7',
    description:
      'Klientki piszą o 22:00. Bot odpowiada, zbiera telefon i odsyła do rezerwacji. 149 zł/mies.',
    url: 'https://botiko.pl/dla/salon-beauty',
    type: 'website',
  },
};

const JSON_LD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bot obsługi klienta dla salonów beauty',
  provider: {
    '@type': 'Organization',
    name: 'Botiko.pl',
    url: 'https://botiko.pl',
  },
  areaServed: { '@type': 'Country', name: 'Polska' },
  serviceType: 'Customer service automation',
  offers: {
    '@type': 'Offer',
    price: '149',
    priceCurrency: 'PLN',
  },
};

const PAIN_POINTS = [
  {
    icon: '🌙',
    title: 'Klientki piszą wieczorem',
    text: 'Najwięcej wiadomości o manicure i rzęsy spływa między 20:00 a 23:00. Ty już nie pracujesz, a klientka zapisuje się do sąsiedniej konkurencji.',
  },
  {
    icon: '💅',
    title: 'Zabieg = nie odbierasz',
    text: 'Podczas manicure hybrydowego, henny brwi czy makijażu nie możesz przerwać. Telefon dzwoni 3× — klientka myśli, że salon zamknięty.',
  },
  {
    icon: '🔁',
    title: 'Te same pytania co dzień',
    text: '„Ile kosztuje hybryda?", „Macie wolne w sobotę?", „Jak trafić?" — codziennie odpowiadasz 20× na te same rzeczy.',
  },
];

const FEATURES = [
  'Odpowiada na pytania o cennik (hybryda, żel, manicure japoński, pedicure)',
  'Zna czas trwania zabiegów i orientacyjne godziny rezerwacji',
  'Zbiera imię + telefon klientki i odsyła do Booksy / Calendly / Twojego systemu',
  'Wyjaśnia różnice między usługami (np. henna pudrowa vs laminacja brwi)',
  'Informuje o promocjach i pakietach, które sama wprowadzasz',
  'Kolorowy widget dopasowany do Twojej marki — różowy, pastelowy, jakikolwiek',
];

const SAMPLE_QUESTIONS = [
  {
    q: 'Ile kosztuje manicure hybrydowy?',
    a: 'Manicure hybrydowy to 90 zł (czas ok. 75 min). W pakiecie z pedicure — 160 zł. Chcesz się zapisać? Zostaw imię i telefon — oddzwonimy z wolnymi terminami!',
  },
  {
    q: 'Macie wolny termin na rzęsy w sobotę?',
    a: 'W sobotę mamy 2 okienka: 10:00 (stylizacja 1:1) i 14:30 (efekt naturalny/objętość). Zostaw numer — potwierdzimy termin i wyślemy SMS z przypomnieniem.',
  },
  {
    q: 'Jaka jest różnica między henną pudrową a klasyczną?',
    a: 'Henna pudrowa trzyma 4–6 tygodni (efekt jak permanent, ale bez kłucia) i kosztuje 120 zł. Klasyczna trzyma ~2 tygodnie, 40 zł. Jeśli masz rzadkie brwi, polecamy pudrową.',
  },
];

const ROI_ROWS = [
  { clients: 2, revenue: 200, note: '2 hybrydy dogrywane wieczorem' },
  { clients: 4, revenue: 480, note: '2 hybrydy + 2 stylizacje rzęs' },
  { clients: 8, revenue: 1120, note: 'Aktywny salon z ruchem na IG' },
];

export default function BeautyLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #831843 0%, #9d174d 30%, #be185d 70%, #EC4899 100%)' }}
      >
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F9A8D4, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FBBF24, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm text-pink-100 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Botiko.pl
          </Link>

          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#FCE7F3' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-200 animate-pulse" />
            Dla salonów urody · paznokcie · rzęsy · brwi · kosmetologia
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-3xl">
            Klientka pisze o hybrydę
            <br />
            <span style={{ color: '#FBCFE8' }}>o 22:30.</span>{' '}
            Bot odpowiada za Ciebie.
          </h1>

          <p className="text-pink-100 text-lg leading-relaxed max-w-xl mb-8">
            Botiko zna Twój cennik, godziny i usługi. Odpowiada klientkom kiedy śpisz, robisz zabieg albo odbierasz dziecko ze szkoły —
            i <strong className="text-white">zbiera numer telefonu do oddzwonienia</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-pink-700 font-bold text-base shadow-xl hover:shadow-2xl transition-all"
            >
              Testuj 14 dni za darmo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white hover:bg-white/10 transition-colors"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              Zobacz demo bota
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 max-w-xl" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-pink-200 text-xs mt-1">Odpowiada nawet w niedzielę</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">~15 min</p>
              <p className="text-pink-200 text-xs mt-1">Konfiguracja cennika</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">149 zł</p>
              <p className="text-pink-200 text-xs mt-1">Miesięcznie, bez umowy</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80 C360 0 1080 0 1440 80 L1440 80 L0 80Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#EC4899' }}>
              Znasz to?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              3 sytuacje, w których Botiko ratuje klientkę
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-text mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample chat */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#EC4899' }}>
              Realne rozmowy
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Jak bot odpowiada klientkom</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              To nie „chat AI w ogóle” — Botiko odpowiada na podstawie Twojego cennika i wiedzy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SAMPLE_QUESTIONS.map((s) => (
              <div
                key={s.q}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                {/* Client msg */}
                <div className="flex justify-end mb-3">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-white leading-relaxed"
                    style={{ background: '#EC4899', borderBottomRightRadius: 4 }}
                  >
                    {s.q}
                  </div>
                </div>
                {/* Bot msg */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed"
                    style={{ background: '#FDF2F8', borderBottomLeftRadius: 4, border: '1px solid #FCE7F3' }}
                  >
                    {s.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#EC4899' }}>
                Co robi bot
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-5">
                Wszystko, czego salon potrzebuje od recepcjonistki
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Bez zatrudniania. Bez szkolenia. Bez zmian w systemie rezerwacji, którego już używasz.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5"
                    style={{ background: '#EC4899' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-slate-700 text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ROI table */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#EC4899' }}>
              Zwrot z inwestycji
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Ile klientek miesięcznie = Botiko się zwraca?</h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>149 zł/mies</strong>. Jedna dogryziona klientka zwraca cały koszt.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pink-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">Nowe klientki / mies.</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Przychód</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Scenariusz</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Zysk netto</th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row) => (
                  <tr key={row.clients} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-bold text-text">{row.clients}</td>
                    <td className="px-5 py-4 text-slate-600">{row.revenue} zł</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{row.note}</td>
                    <td className="px-5 py-4 text-right font-extrabold text-emerald-600">
                      +{row.revenue - 149} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            * Szacunki orientacyjne. Bot nie robi marketingu — zamienia zapytania, które masz, w rezerwacje.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="relative rounded-3xl overflow-hidden text-center px-8 py-14"
            style={{ background: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #EC4899 100%)' }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #F9A8D4, transparent 70%)' }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Zacznij dziś — bot działa już jutro rano
              </h2>
              <p className="text-pink-100 text-base mb-8 max-w-xl mx-auto">
                14 dni za darmo. Bez karty kredytowej. Bez umowy. Konfiguracja cennika i FAQ w ~15 minut.
              </p>
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-pink-700 font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              >
                Uruchom bota w moim salonie
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="mt-5 text-pink-200 text-xs">
                ✓ Bez karty kredytowej &nbsp;·&nbsp; ✓ 149 zł/mies. &nbsp;·&nbsp; ✓ Cancel w każdej chwili
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
