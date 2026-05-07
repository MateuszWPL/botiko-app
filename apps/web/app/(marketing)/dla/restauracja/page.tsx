import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bot dla restauracji — odpowiada gościom 24/7 i zbiera leady',
  description:
    'Botiko dla restauracji i bistro: menu, godziny, eventy, catering. Bot odpowiada o 23:00, zbiera telefon i odsyła do Booksy lub Twojego systemu rezerwacji. 99 zł/mies., 14 dni za darmo.',
  alternates: { canonical: 'https://botiko.pl/dla/restauracja' },
  openGraph: {
    title: 'Bot dla restauracji — odpowiada gościom 24/7',
    description:
      'Goście piszą wieczorem. Bot odpowiada, zbiera kontakt i odsyła do Booksy lub Twojego systemu rezerwacji. 99 zł/mies.',
    url: 'https://botiko.pl/dla/restauracja',
    type: 'website',
  },
};

const JSON_LD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bot obsługi klienta dla restauracji i bistro',
  provider: {
    '@type': 'Organization',
    name: 'Botiko.pl',
    url: 'https://botiko.pl',
  },
  areaServed: { '@type': 'Country', name: 'Polska' },
  serviceType: 'Customer service automation',
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'PLN',
  },
};

const PAIN_POINTS = [
  {
    title: 'Goście pytają o stolik o 23:00',
    text: 'Rodzinna kolacja, urodziny, romantyczna randka — rezerwacje planuje się wieczorem, gdy jesteś zajęta obsługą lub już w domu. Bot odpowiada natychmiast i zbiera kontakt.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    title: 'Telefon dzwoni w środku serwisu',
    text: 'Kelnerzy biegają, kuchnia huczy, a telefon przy hostess dzwoni bez przerwy. Nieodebrane połączenie w piątek wieczór = stracona rezerwacja na weekend.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: '„Macie opcje wegetariańskie?"',
    text: '„Czy jest bezglutenowe?", „Czy obsługujecie alergie?", „Co jest w sosie carbonara?" — te pytania pytają wszyscy i każdy chce odpowiedzi przed przyjściem. Bot odpowiada za kelnerów.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Eventy i catering giną w mailach',
    text: 'Zapytania o przyjęcie urodzinowe dla 30 osób, catering firmowy albo Wigilię dla firmy — trafiają na ogólnego maila i giną. Bot pyta o szczegóły i zbiera brief zanim zadzwonisz.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Zmiany menu tracą się w mediach społecznościowych',
    text: '„Czy sezonowe risotto wróciło?", „Mamy dziś degustację?" — goście szukają aktualnych informacji. Bot wie, co mu powiesz — aktualizujesz bazę wiedzy i odpowiedzi się zmieniają.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Google Maps piszą zapytania, nie tylko opinie',
    text: 'Goście piszą przez Facebook, Instagram, stronę i Google jednocześnie. Bot na stronie www przechwytuje tych, którzy trafiają przez wyszukiwarkę — największy ruch.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
] as const;

const FEATURES = [
  'Opisuje dania — składniki, alergeny, opcje wegetariańskie i wegańskie',
  'Zna godziny otwarcia, lokalizację, parking i dojazd komunikacją',
  'Zbiera imię, telefon i preferencje gościa — odsyła do Booksy lub Twojego systemu rezerwacji',
  'Odpowiada na pytania o eventy, urodziny, komunie i catering firmowy',
  'Informuje o aktualnych promocjach, menu dnia i specjałach sezonu',
  'Opisuje politykę wobec alergenów i diety bezglutenowej',
  'Poleca zestawy obiadowe i menu degustacyjne przy okazji zapytania',
  'Widget w kolorystyce restauracji — elegancki, ciepły lub minimalistyczny',
] as const;

const SAMPLE_QUESTIONS = [
  {
    q: 'Czy macie opcję bezglutenową? Moja córka ma celiakię.',
    a: 'Tak, przygotowujemy dania bezglutenowe — mamy oznaczenia przy każdym daniu w menu. Makarony i pizza dostępne w wersji bezglutenowej (+5 zł). Kucharz jest poinformowany o krzyżowym zanieczyszczeniu. Chcesz zarezerwować stolik? Zostaw numer — oddzwonimy i poinformujemy kucharkę o alergiach, albo od razu zarezerwuj przez Booksy.',
  },
  {
    q: 'Chcemy zorganizować urodziny dla 25 osób w sobotę. Czy to możliwe?',
    a: 'Jak najbardziej! Sala prywatna mieści do 35 osób. Na eventy oferujemy menu bankietowe od 89 zł/os. (3 dania) lub 129 zł/os. (5 dań z winem). Dostępne też: torty na zamówienie, dekoracje, DJ. Zostaw imię i telefon — menedżer zadzwoni jutro rano z wolnymi terminami i szczegółami.',
  },
  {
    q: 'Jakie są godziny otwarcia w niedzielę? I czy jest parking?',
    a: 'W niedzielę pracujemy 12:00–21:00 (kuchnia do 20:30). Parking bezpłatny na 20 miejsc przy wejściu od ul. Kwiatowej. Jeśli parking zajęty — płatny parking miejski 50 m dalej. Planujesz przyjść w niedzielę? Zostaw numer albo zarezerwuj stolik przez Booksy.',
  },
];

const ROI_ROWS = [
  { clients: 1, revenue: 300, note: 'Stolik dla 4 osób, kolacja' },
  { clients: 3, revenue: 720, note: '3 leady weekendowe → Booksy' },
  { clients: 5, revenue: 1350, note: 'Regularni goście + jeden event' },
  { clients: 1, revenue: 2500, note: '1 event urodzinowy 25 os.' },
] as const;

const TRUST_POINTS = [
  {
    title: 'Twoje menu, nie internetowe ogólniki',
    text: 'Bot wie tylko tyle, ile mu powiesz. Aktualizujesz menu sezonowe, zmieniasz godziny na święta, dodajesz promocję — bot reaguje od razu.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: 'Wstępna rezerwacja, nie booking system',
    text: 'Bot zbiera preferencje i kontakt, po czym odsyła do Booksy, Restaumatic, OpenTable lub Twojego numeru telefonu. Ty masz kontrolę nad stolikami — bot nie blokuje miejsc.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Duże zapytania eventowe nie wpadają w pustkę',
    text: 'Organizator przyjęcia, który pisze o 22:00, dostaje odpowiedź w 10 sekund i zostawia kontakt. Rano masz brief i numer — zamiast milczenia przez trzy dni.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function RestaurantLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 30%, #c2410c 70%, #F97316 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0">
            <Image
              src="/botiko-restaurant.jpg"
              alt=""
              fill
              priority
              className="object-cover object-right opacity-85"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(124,45,18,1) 0%, rgba(154,52,18,1) 34%, rgba(194,65,12,0.92) 52%, rgba(249,115,22,0.0) 78%)',
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FED7AA, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFEDD5, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-orange-200 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Botiko.pl
            </Link>
          </div>

          <span
            className="mb-6 block w-fit rounded-full overflow-hidden"
            style={{
              background: 'rgba(254, 215, 170, 0.15)',
              border: '1px solid rgba(254, 215, 170, 0.4)',
              color: '#FFEDD5',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold leading-snug">
              <svg
                className="shrink-0 w-3.5 h-3.5 text-orange-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              Dla restauracji, bistro i kawiarni · menu · rezerwacje · eventy
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-3xl">
            Gość pyta o stolik
            <br />
            <span style={{ color: '#FED7AA' }}>o 23:00.</span>{' '}
            Bot odpowiada za Ciebie.
          </h1>

          <p className="text-orange-100 text-lg leading-relaxed max-w-xl mb-8">
            Botiko zna Twoje menu, godziny i politykę alergenów. Odpowiada gościom kiedy serwis pędzi albo lokal jest zamknięty —
            i <strong className="text-white">zbiera kontakt, odsyłając do Booksy lub Twojego systemu</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              style={{ color: '#c2410c' }}
            >
              Testuj 14 dni za darmo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
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

          <div
            className="grid grid-cols-3 gap-6 pt-8 max-w-xl"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div>
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-orange-200 text-xs mt-1">Odpowiada nawet w niedzielę</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">~15 min</p>
              <p className="text-orange-200 text-xs mt-1">Konfiguracja menu i FAQ</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">99 zł</p>
              <p className="text-orange-200 text-xs mt-1">Miesięcznie, bez umowy</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0" aria-hidden>
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80 C360 0 1080 0 1440 80 L1440 80 L0 80Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ─── Pain points ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Znasz to?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              6 momentów, w których tracisz gości
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Każde niezodpowiedziane pytanie to stolik, który zajmie ktoś inny.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="mb-3 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#FFF7ED', color: '#F97316' }}
                >
                  {p.svg}
                </div>
                <h3 className="font-bold text-text mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sample chat ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Realne rozmowy
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Jak bot odpowiada gościom
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Bot odpowiada na podstawie Twojego menu, oferty i FAQ — nie ogólnych informacji z sieci.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SAMPLE_QUESTIONS.map((s) => (
              <div
                key={s.q}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col"
              >
                <div className="flex justify-end mb-3">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-white leading-relaxed"
                    style={{ background: '#c2410c', borderBottomRightRadius: 4 }}
                  >
                    {s.q}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed"
                    style={{ background: '#FFF7ED', borderBottomLeftRadius: 4, border: '1px solid #FFEDD5' }}
                  >
                    {s.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
                Co robi bot
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-5">
                Recepcja, hostessa i informacja turystyczna —{' '}
                <span style={{ color: '#c2410c' }}>w jednym narzędziu</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Od pytania o alergen, przez zebranie kontaktu i odesłanie do Booksy, po zapytanie o event dla 40 osób.
                Bot prowadzi rozmowę i zbiera wszystko, czego potrzebujesz do oddzwonienia.
              </p>
              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#F97316' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Bot nie rezerwuje stolika za Ciebie</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Zbiera preferencje i kontakt, a potwierdzenie wysyłasz Ty — bo to Ty wiesz, które stoliki są wolne.
                  </p>
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5"
                    style={{ background: '#F97316' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Jak to działa
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Od rejestracji do działającego bota — w jeden dzień
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-6 top-8 bottom-8 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, #F97316, #c2410c)' }}
              aria-hidden
            />
            <ol className="flex flex-col gap-8">
              {[
                {
                  step: '01',
                  title: 'Rejestracja i wybór branży',
                  text: 'Zakładasz konto, wybierasz „Restauracja / bistro" — dostajesz gotowy szablon z typowymi pytaniami dla gastronomii: alergeny, rezerwacje, eventy.',
                },
                {
                  step: '02',
                  title: 'Wklejasz menu i FAQ',
                  text: 'Opisujesz dania, ceny, godziny, politykę alergenów i zasady rezerwacji. To ~15 minut. Bot uczy się na tej bazie i odpowiada tylko na jej podstawie.',
                },
                {
                  step: '03',
                  title: 'Wstawiasz widget na stronę',
                  text: 'Natywna instalacja na WordPress (5 minut przez wtyczkę WPCode) lub jeden tag HTML na dowolną inną stronę. Widget pojawia się w rogu — pasuje kolorystycznie do Twojej restauracji.',
                },
                {
                  step: '04',
                  title: 'Leady lądują w dashboardzie',
                  text: 'Od tej chwili bot odpowiada 24/7. Zebrane kontakty (imię, telefon, liczba osób, data) lądują w panelu. Rano masz gotową listę do potwierdzenia.',
                },
              ].map((s) => (
                <li key={s.step} className="flex gap-6 sm:gap-10 items-start">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-md z-10"
                    style={{ background: 'linear-gradient(135deg, #c2410c, #F97316)' }}
                  >
                    {s.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-text mb-1">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─── ROI table ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Zwrot z inwestycji
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Ilu gości miesięcznie = Botiko się zwraca?
            </h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>99 zł/mies</strong>. Jeden lead z wieczoru, który oddzwonisz rano, zwraca cały koszt.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#FFF7ED' }} className="text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">Nowi goście / mies.</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Przychód</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Scenariusz</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Zysk netto</th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-bold text-text">{row.clients}</td>
                    <td className="px-5 py-4 text-slate-600">{row.revenue} zł</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{row.note}</td>
                    <td className="px-5 py-4 text-right font-extrabold text-emerald-600">
                      +{row.revenue - 99} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            * Szacunki orientacyjne. Bot zamienia pytania gości w leady — stolik potwierdzasz Ty. Event urodzinowy dla 25 os. to 2000–4000 zł przychodu.
          </p>
        </div>
      </section>

      {/* ─── Trust section ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Dlaczego Botiko, nie inny chatbot
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Zaprojektowany dla restauracji, nie korporacji
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TRUST_POINTS.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl p-7 flex flex-col gap-3"
                style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#c2410c' }}
                >
                  {t.svg}
                </div>
                <h3 className="font-bold text-text">{t.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              Porównanie
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Bot vs. odbieranie telefonów podczas serwisu
            </h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="grid grid-cols-3 text-sm">
              <div className="px-5 py-3 font-semibold text-slate-500 bg-slate-50" />
              <div
                className="px-5 py-3 font-bold text-center text-white text-sm"
                style={{ background: '#c2410c' }}
              >
                Botiko
              </div>
              <div className="px-5 py-3 font-semibold text-center text-slate-500 bg-slate-50">
                Bez bota
              </div>
            </div>
            {[
              ['Odpowiedź o 23:00', true, false],
              ['Odpowiedź w środku serwisu', true, false],
              ['Zna skład każdego dania', true, false],
              ['Obsługuje zapytania eventowe', true, false],
              ['Zbiera kontakt, odsyła do Booksy', true, false],
              ['Odpowiada na pytania o alergeny', true, false],
              ['Koszt miesięczny', '99 zł', 'Twój czas'],
            ].map(([label, yes, no], i) => (
              <div
                key={String(label)}
                className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
              >
                <div className="px-5 py-3.5 text-slate-600 font-medium">{label}</div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  {typeof yes === 'boolean' ? (
                    yes ? (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#F97316' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-200">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </span>
                    )
                  ) : (
                    <span className="font-bold text-slate-800 text-xs">{yes}</span>
                  )}
                </div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  {typeof no === 'boolean' ? (
                    no ? (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#F97316' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-200">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 text-xs">{no}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Czy bot działa z moim systemem rezerwacji (Restaumatic, OpenTable)?',
                a: 'Bot nie integruje się bezpośrednio z systemami rezerwacji — zbiera dane kontaktowe i preferencje gościa, a następnie odsyła do Booksy, Restaumatic lub Twojego numeru telefonu. Ty potwierdzasz i zarządzasz stolikami.',
              },
              {
                q: 'Czy bot może odpowiadać na pytania o alergeny i diety specjalne?',
                a: 'Tak, jeśli wpiszesz tę informację do bazy wiedzy. Bot może opisać składniki i alergeny konkretnych dań, dostępność opcji wegańskich czy bezglutenowych — na podstawie dokładnie tego, co mu podasz.',
              },
              {
                q: 'Menu się często zmienia — czy muszę za każdym razem aktualizować bota?',
                a: 'Menu sezonowe i specjały dnia możesz aktualizować kiedy chcesz w panelu. Dla menu, które zmienia się codziennie, bot najlepiej sprawdza się jako informacja o ofercie stałej, natomiast dla dnia polecasz konkretną stronę lub fanpage.',
              },
              {
                q: 'Czy bot obsłuży zapytanie o catering i duże eventy?',
                a: 'Tak. Bot zbiera wstępne informacje (liczba osób, data, rodzaj eventu, budżet) i kontakt. Rano masz brief do rozmowy zamiast pisania od nowa. To szczególnie przydatne przy zapytaniach spływających wieczorami i w weekendy.',
              },
              {
                q: 'Czy widget pasuje do wyglądu mojej strony restauracji?',
                a: 'W ustawieniach wybierasz kolor główny, nazwę bota i avatar. Widget może być ciepły (burgundy, czerń, złoto) albo jasny — dopasowany do Twojego brandu. Minimalistyczny w rogu strony, widoczny, gdy potrzebny.',
              },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl p-6 border border-slate-100 bg-white">
                <p className="font-semibold text-text mb-2">{f.q}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="relative rounded-3xl overflow-hidden text-center px-8 py-14"
            style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #c2410c 70%, #F97316 100%)' }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #FED7AA, transparent 70%)' }}
              aria-hidden
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #FFEDD5, transparent 70%)' }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Zacznij dziś — bot działa już jutro rano
              </h2>
              <p className="text-orange-100 text-base mb-8 max-w-xl mx-auto">
                14 dni za darmo. Bez karty kredytowej. Bez umowy. Konfiguracja menu i FAQ w ~15 minut.
              </p>
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                style={{ color: '#c2410c' }}
              >
                Uruchom bota w mojej restauracji
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-5 text-orange-200 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {['Bez karty kredytowej', '99 zł/mies.', 'Cancel w każdej chwili'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 shrink-0 text-orange-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {label}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
