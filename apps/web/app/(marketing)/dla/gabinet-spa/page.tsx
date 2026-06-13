import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import CityLinks from '@/components/marketing/CityLinks';
import { breadcrumbListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Bot dla gabinetu SPA — odpowiada klientom 24/7 i zbiera leady',
  description:
    'Botiko dla gabinetów SPA i wellness: masaż, zabiegi na twarz, aromaterapia. Bot odpowiada o 22:00, zbiera telefon i odsyła do Booksy lub Calendly. 99 zł/mies., 14 dni za darmo.',
  alternates: { canonical: 'https://botiko.pl/dla/gabinet-spa' },
  openGraph: {
    title: 'Bot dla gabinetu SPA — odpowiada klientom 24/7',
    description:
      'Klienci piszą o 22:00. Bot odpowiada, zbiera telefon i odsyła do Booksy lub Calendly. 99 zł/mies.',
    url: 'https://botiko.pl/dla/gabinet-spa',
    type: 'website',
  },
};

const JSON_LD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bot obsługi klienta dla gabinetów SPA i wellness',
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
    title: 'Klienci piszą późnym wieczorem',
    text: 'Relaksacyjny masaż na weekend, zabieg na twarz przed urodzinami — pytania spływają po 20:00. Ty kończysz ostatni zabieg zmęczona. Bot odpowiada w ciągu sekund.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    title: 'Zabieg = cisza absolutna',
    text: 'Podczas masażu, peelingu czy zabiegu na twarz telefon musi milczeć. Ale klient, który nie dostanie odpowiedzi w 5 minut, dzwoni do konkurencji.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.5 16.5L19.59 19.59a2 2 0 0 1-2.83 0l-3.17-3.17" />
        <path d="M10.68 10.68l-4.17-4.17A2 2 0 0 1 9.34 3.66l3.17 3.17" />
      </svg>
    ),
  },
  {
    title: 'Klienci nie wiedzą czego wybrać',
    text: '„Jaka różnica między masażem gorącymi kamieniami a klasycznym?", „Co pomaga na ból pleców?" — każdy klient oczekuje doradztwa. Bot dostarcza go 24h na dobę.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
      </svg>
    ),
  },
  {
    title: 'Pakiety i vouchery giną w tłumaczeniu',
    text: 'Masz pakiet dla par, voucher urodzinowy, dzień relaksu dla dwóch osób. Klient o tym nie wie, bo nie przeczyta całej strony. Bot podpowiada odpowiedni pakiet w kontekście rozmowy.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Nowe klientki odpadają na „za drogo"',
    text: 'Cena bez kontekstu wygląda jak wydatek. Cena z wyjaśnieniem efektów i czasu trwania to inwestycja w siebie. Bot tłumaczy wartość, nie tylko kwotę.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Pytania o przeciwwskazania spowalniają rezerwację',
    text: '„Czy masaż jest ok przy ciąży?", „Mam alergię na olejki — co polecacie?" — te pytania blokują decyzję. Bot odpowiada na typowe FAQ i kieruje do specjalisty gdy trzeba.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
] as const;

const FEATURES = [
  'Opisuje każdy zabieg — czas trwania, efekty, przygotowanie i przeciwwskazania',
  'Zna cały cennik: masaże, zabiegi na twarz, peelingi, zabiegi ciała, pary',
  'Poleca odpowiedni zabieg zależnie od potrzeby (relaks, ból pleców, odnowa)',
  'Promuje pakiety i vouchery prezentowe w odpowiednim momencie rozmowy',
  'Zbiera imię i telefon — odsyła do Booksy lub Calendly, Ty potwierdzasz termin',
  'Informuje o godzinach otwarcia, lokalizacji i sposobie dojazdu / parkowania',
  'Odpowiada na FAQ o przeciwwskazaniach (ciąża, alergie, schorzenia)',
  'Widget w kolorystyce Twojego SPA — spokojny, elegancki, niedyskretny',
] as const;

const SAMPLE_QUESTIONS = [
  {
    q: 'Jaka różnica między masażem klasycznym a gorącymi kamieniami?',
    a: 'Masaż klasyczny (90 min, 220 zł) rozluźnia napięte mięśnie rękami — świetny na codzienny stres. Gorące kamienie (75 min, 260 zł) działają głębiej: ciepło bazaltowych kamieni rozpuszcza napięcia, które trudno osiągnąć dłońmi. Przy bólach pleców i karku polecam kamienie. Chcesz się umówić? Zostaw numer albo zarezerwuj od razu przez Booksy — link na górze strony.',
  },
  {
    q: 'Czy macie coś specjalnego dla pary na rocznicę?',
    a: 'Tak! Pakiet dla dwojga „Chwila tylko dla Was" to 2× masaż relaksacyjny w jednym gabinecie (90 min), lampka prosecco i olejki aromaterapeutyczne do wyboru — 480 zł za parę. Dostępny też jako voucher prezentowy (przesyłamy PDF). Chcesz zarezerwować? Zostaw kontakt — oddzwonimy, albo zarezerwuj bezpośrednio przez Booksy.',
  },
  {
    q: 'Czy mogę przyjść na masaż będąc w ciąży?',
    a: 'Oferujemy masaż prenatalny specjalnie dla przyszłych mam (od 2. trymestru). Wykonują go terapeuci z certyfikatem — 80 min, 210 zł. Masaż klasyczny i gorące kamienie w ciąży są przeciwwskazane. Zostaw numer — terapeuta oddzwoni i odpowie na dodatkowe pytania, a termin umówisz przez Booksy.',
  },
];

const ROI_ROWS = [
  { clients: 1, revenue: 260, note: '1 zabieg gorącymi kamieniami' },
  { clients: 2, revenue: 480, note: '2 masaże relaksacyjne' },
  { clients: 3, revenue: 740, note: 'Pakiet dla pary + masaż' },
  { clients: 6, revenue: 1560, note: 'Aktywne SPA z ruchem na IG i Google' },
] as const;

const TRUST_POINTS = [
  {
    title: 'Twoja wiedza, nie ogólnik',
    text: 'Bot odpowiada tylko na podstawie informacji, które mu podasz — cennik, zabiegi, FAQ. Żadnych wymyślonych cen ani mylących ogólników z internetu.',
  },
  {
    title: 'Nigdy nie rezerwuje za Ciebie',
    text: 'Bot celowo nie wchodzi w rolę systemu rezerwacji. Zbiera lead i odsyła do Booksy, Calendly lub numer telefonu — Ty masz kontrolę nad kalendarzem.',
  },
  {
    title: 'Klient zawsze może porozmawiać z człowiekiem',
    text: 'Gdy pytanie wykracza poza wiedzę bota albo klient chce porozmawiać z terapeutą — bot przekierowuje i zbiera dane kontaktowe do oddzwonienia.',
  },
];

export default function SpaLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { label: 'Botiko.pl', href: '/' },
          { label: 'Gabinet / SPA' },
        ])}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 30%, #0369a1 70%, #06B6D4 100%)' }}
      >
        {/* Background image + gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0">
            <Image
              src="/botiko-spa.webp"
              alt=""
              fill
              priority
              className="object-cover object-right opacity-90"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(12,74,110,1) 0%, rgba(7,89,133,1) 34%, rgba(3,105,161,0.90) 52%, rgba(6,182,212,0.0) 78%)',
            }}
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #67E8F9, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A5F3FC, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Botiko.pl
            </Link>
          </div>

          {/* Industry badge */}
          <span
            className="mb-6 block w-fit rounded-full overflow-hidden"
            style={{
              background: 'rgba(186, 230, 253, 0.15)',
              border: '1px solid rgba(186, 230, 253, 0.4)',
              color: '#E0F2FE',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold leading-snug">
              <svg
                className="shrink-0 w-3.5 h-3.5 text-cyan-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Dla gabinetów SPA i wellness · masaże · zabiegi · aromaterapia
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-3xl">
            Klient pyta o masaż
            <br />
            <span style={{ color: '#BAE6FD' }}>o 22:00.</span>{' '}
            Bot odpowiada za Ciebie.
          </h1>

          <p className="text-cyan-100 text-lg leading-relaxed max-w-xl mb-8">
            Botiko zna Twój cennik, zabiegi i FAQ. Odpowiada klientom kiedy prowadzisz sesję, odpoczywacie albo śpisz —
            i <strong className="text-white">zbiera kontakt do oddzwonienia następnego dnia rano</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              style={{ color: '#0369a1' }}
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

          {/* Stats strip */}
          <div
            className="grid grid-cols-3 gap-6 pt-8 max-w-xl"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div>
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-cyan-200 text-xs mt-1">Odpowiada nawet w niedzielę</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">~15 min</p>
              <p className="text-cyan-200 text-xs mt-1">Konfiguracja cennika</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">99 zł</p>
              <p className="text-cyan-200 text-xs mt-1">Miesięcznie, bez umowy</p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Znasz to?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              6 momentów, w których tracisz klientów
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Każde niezodpowiedziane pytanie to klient, który zarezerwuje wizytę gdzie indziej.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ECFEFF', color: '#06B6D4' }}>
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Realne rozmowy
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Jak bot odpowiada klientom SPA
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Bot odpowiada na podstawie Twojego cennika i oferty — nie generycznych informacji z sieci.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SAMPLE_QUESTIONS.map((s) => (
              <div
                key={s.q}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col"
              >
                {/* Klient */}
                <div className="flex justify-end mb-3">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-white leading-relaxed"
                    style={{ background: '#0369a1', borderBottomRightRadius: 4 }}
                  >
                    {s.q}
                  </div>
                </div>
                {/* Bot */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed"
                    style={{ background: '#ECFEFF', borderBottomLeftRadius: 4, border: '1px solid #CFFAFE' }}
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
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#06B6D4' }}
              >
                Co robi bot
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-5">
                Wszystko, czego SPA potrzebuje od recepcji —{' '}
                <span style={{ color: '#0369a1' }}>bez etatu</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Zamiast zatrudniać recepcjonistkę na wieczory i weekendy, konfigurujesz bota raz.
                Zna Twój cennik, zabiegi i styl komunikacji — i odpowiada tak, jak Ty byś chciała.
              </p>
              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ background: '#ECFEFF', border: '1px solid #CFFAFE' }}
              >
                <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#06B6D4' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Bot nigdy nie wymyśla cen</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Odpowiada wyłącznie na podstawie danych, które mu podasz. Żadnych halucynacji, żadnych pomyłek.
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
                    style={{ background: '#06B6D4' }}
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Jak to działa
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Od rejestracji do działającego bota — w jeden dzień
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-8 bottom-8 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, #06B6D4, #0369a1)' }}
              aria-hidden
            />

            <ol className="flex flex-col gap-8">
              {[
                {
                  step: '01',
                  title: 'Rejestracja i wybór branży',
                  text: 'Zakładasz konto, wybierasz „SPA / wellness" — dostajasz gotowy szablon z typowymi pytaniami i odpowiedziami dla branży.',
                },
                {
                  step: '02',
                  title: 'Wprowadzasz swój cennik i zabiegi',
                  text: 'Wklejasz opis zabiegów, ceny, czas trwania, przeciwwskazania i FAQ. To ~15 minut. Bot uczy się na tej bazie wiedzy.',
                },
                {
                  step: '03',
                  title: 'Wstawiasz widget na stronę',
                  text: 'Kopiujesz jeden tag HTML i wklejasz na swoją stronę — natywnie na WordPress (przez wtyczkę WPCode) lub każdą inną stronę WWW. Widget pojawia się w rogu strony.',
                },
                {
                  step: '04',
                  title: 'Bot pracuje, Ty odbierasz leady',
                  text: 'Od tej chwili bot odpowiada na pytania 24/7. Zebrane kontakty lądują w dashboardzie — rano masz listę osób do oddzwonienia.',
                },
              ].map((s) => (
                <li key={s.step} className="flex gap-6 sm:gap-10 items-start">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-md z-10"
                    style={{ background: 'linear-gradient(135deg, #0369a1, #06B6D4)' }}
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Zwrot z inwestycji
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Ile klientów miesięcznie = Botiko się zwraca?
            </h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>99 zł/mies</strong>. Jeden dogryziony klient z wieczoru zwraca cały koszt.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr style={{ background: '#ECFEFF' }} className="text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">Nowi klienci / mies.</th>
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
                      +{row.revenue - 99} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            * Szacunki orientacyjne. Bot nie robi marketingu — zamienia pytania klientów w leady, które Ty zamykasz telefonicznie.
          </p>
        </div>
      </section>

      {/* ─── Trust section ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Dlaczego Botiko, nie inny chatbot
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Zaprojektowany dla małych gabinetów, nie korporacji
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TRUST_POINTS.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl p-7 flex flex-col gap-3"
                style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#0369a1' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              Porównanie
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Bot vs. odbieranie telefonów samodzielnie
            </h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="grid grid-cols-3 text-sm">
              <div className="px-5 py-3 font-semibold text-slate-500 bg-slate-50" />
              <div
                className="px-5 py-3 font-bold text-center text-white text-sm rounded-t-sm"
                style={{ background: '#0369a1' }}
              >
                Botiko
              </div>
              <div className="px-5 py-3 font-semibold text-center text-slate-500 bg-slate-50">
                Bez bota
              </div>
            </div>
            {[
              ['Odpowiedź o 22:00', true, false],
              ['Odpowiedź w trakcie zabiegu', true, false],
              ['Nigdy nie zapomina cennika', true, false],
              ['Zbiera telefon do oddzwonienia', true, false],
              ['Poleca pakiety i vouchery', true, false],
              ['Konfiguracja w 15 minut', true, false],
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
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#06B6D4' }}>
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
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#06B6D4' }}>
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
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#06B6D4' }}
            >
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Czy bot działa z moim systemem rezerwacji (Booksy, Calendly)?',
                a: 'Bot nie łączy się bezpośrednio z systemem rezerwacji — zbiera dane kontaktowe klienta i odsyła go do Booksy, Calendly lub Twojego numeru telefonu. Ty decydujesz, gdzie przyjmujesz zapisy i masz pełną kontrolę nad kalendarzem.',
              },
              {
                q: 'Co jeśli klient zapyta o coś, czego bot nie wie?',
                a: 'Bot grzecznie informuje, że nie ma tej informacji i proponuje pozostawienie kontaktu. Nic nie wymyśla — jeśli nie ma danych w bazie wiedzy, nie odpowie na temat.',
              },
              {
                q: 'Czy muszę mieć swoją stronę www?',
                a: 'Nie. Widget możesz też wstawić na profil Linktree, Landing page Canva, czy inny serwis obsługujący własny HTML. Wystarczy jeden tag skryptu.',
              },
              {
                q: 'Ile czasu zajmuje konfiguracja?',
                a: 'Rejestracja i pierwsza wersja bota — około 15–20 minut. Wklejasz cennik, opisy zabiegów i FAQ. Bot działa od razu. Możesz uzupełniać bazę wiedzy stopniowo.',
              },
              {
                q: 'Czy mogę zmienić wygląd widgetu pod moją markę?',
                a: 'Tak. W ustawieniach wybierasz kolor główny, nazwę bota i avatar. Widget może być stonowany (biały, pastelowy) lub wyraźny — dopasowany do Twojego stylu.',
              },
            ].map((f) => (
              <div
                key={f.q}
                className="rounded-2xl p-6 border border-slate-100 bg-white"
              >
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
            style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 40%, #0369a1 70%, #06B6D4 100%)' }}
          >
            {/* Decorative blob */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #67E8F9, transparent 70%)' }}
              aria-hidden
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #BAE6FD, transparent 70%)' }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Zacznij dziś — bot działa już jutro rano
              </h2>
              <p className="text-cyan-100 text-base mb-8 max-w-xl mx-auto">
                14 dni za darmo. Bez karty kredytowej. Bez umowy. Konfiguracja cennika i FAQ w ~15 minut.
              </p>
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                style={{ color: '#0369a1' }}
              >
                Uruchom bota w moim SPA
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-5 text-cyan-200 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {['Bez karty kredytowej', '99 zł/mies.', 'Cancel w każdej chwili'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 shrink-0 text-cyan-100"
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

      <CityLinks industrySlug="gabinet-spa" />
    </>
  );
}
