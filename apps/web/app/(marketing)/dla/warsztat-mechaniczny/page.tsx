import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bot dla warsztatu samochodowego — odpowiada klientom 24/7 i zbiera leady',
  description:
    'Botiko dla warsztatów mechanicznych i wulkanizacji: przeglądy, naprawy, wymiana opon. Bot odpowiada o 21:00, zbiera telefon i odsyła do Booksy lub kalendarza. 149 zł/mies., 14 dni za darmo.',
  alternates: { canonical: 'https://botiko.pl/dla/warsztat-mechaniczny' },
  openGraph: {
    title: 'Bot dla warsztatu mechanicznego — odpowiada klientom 24/7',
    description:
      'Klienci piszą wieczorem. Bot odpowiada, zbiera kontakt i odsyła do Booksy lub Twojego kalendarza. 149 zł/mies.',
    url: 'https://botiko.pl/dla/warsztat-mechaniczny',
    type: 'website',
  },
};

const JSON_LD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bot obsługi klienta dla warsztatów samochodowych',
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
    title: 'Klient dzwoni gdy jesteś pod autem',
    text: 'Ręce w oleju, głowa pod maską — telefon dzwoni trzeci raz. Klient, który nie dostaje odpowiedzi w ciągu dnia, wpisuje w Google „inny warsztat" i jedzie do konkurencji.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: 'Pytania o cenę — zanim w ogóle przyjadą',
    text: '„Ile kosztuje wymiana klocków?", „Co z przeglądem po 3 latach?", „Czy macie diagnostykę komputerową?" — klient porównuje warsztaty jeszcze w domu. Bot daje mu odpowiedź jako pierwszy.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Sezon wymiany opon — telefon urywa się',
    text: 'Kwiecień i październik to dwa tygodnie chaosu. Setki połączeń, kolejka na hali, a każdy pyta o to samo. Bot odpowiada na wszystkie pytania o wymianę opon jednocześnie, bez zajmowania stanowiska.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Klient nie wie, co naprawdę potrzebuje',
    text: '„Skrzypi przy hamowaniu", „Coś stuka z przodu przy zakrętach" — klient opisuje objaw, nie usterkę. Bot zadaje pytania, zbiera opis i kontakt, żebyś wiedział czego się spodziewać zanim samochód wjedzie na stanowisko.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Wieczorowe pytania giną do rana',
    text: 'Klient pisze o 20:00 po pracy — „czy macie jutro wolne?". Warsztat zamknięty, nikt nie odpowiada. Rano już jedzie do mechanika, który wziął wczoraj o 20:00.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    title: 'Stali klienci pytają o przypomnienia',
    text: '„Kiedy mam następny przegląd?", „Czy już czas na wymianę oleju?" — bot informuje o zalecanych interwałach serwisowych i zachęca do kontaktu, zanim klient sam o tym pomyśli.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
] as const;

const FEATURES = [
  'Opisuje usługi i orientacyjne ceny: przeglądy, hamulce, zawieszenie, klimatyzacja',
  'Zbiera opis usterki przed wizytą — mechanik wie czego się spodziewać',
  'Zbiera imię i telefon — odsyła do Booksy lub Twojego kalendarza online',
  'Odpowiada na pytania o terminy, dostępność i czas naprawy',
  'Informuje o wymianie opon sezonowych — zbiera zapisy w szczycie sezonu',
  'Zna markę i rocznik pojazdów obsługiwanych przez warsztat',
  'Odpowiada na pytania o przeglądy rejestracyjne i diagnostykę',
  'Widget w kolorystyce warsztatu — solidny, rzeczowy, bez zbędnych ozdobników',
] as const;

const SAMPLE_QUESTIONS = [
  {
    q: 'Ile kosztuje wymiana klocków hamulcowych? Mam Golfa VII 2015.',
    a: 'Przy Golfie VII wymiana klocków przód to ok. 250–320 zł robocizna + koszt klocków (70–180 zł zależnie od marki). Tarcze przód, jeśli będą wymagały wymiany — osobno ok. 150–250 zł/szt. Diagnozę robimy przy wizycie. Chcesz wjechać? Zostaw numer albo zarezerwuj termin przez Booksy.',
  },
  {
    q: 'Czy macie wolne w tym tygodniu na wymianę opon? 205/55 R16.',
    a: 'Wymiana 4 opon na gotowych felgach to ok. 80 zł (20 zł/szt.). Przechowujemy też opony — 120 zł/sezon. Wolnych terminów nie znam na bieżąco — zostaw numer, zadzwonimy z dostępnymi okienkami, albo zarezerwuj przez Booksy.',
  },
  {
    q: 'Coś stuka z przodu przy skręcaniu. Co to może być?',
    a: 'Stuk przy skręcaniu najczęściej wskazuje na zużyty przegub kulowy, łożysko piasty lub drążek kierowniczy. Żeby ocenić dokładnie, potrzebna jest diagnostyka na stanowisku (bezpłatna przy naprawie u nas). Zostaw numer i krótki opis — mechanik oddzwoni i zapyta o szczegóły przed wizytą.',
  },
];

const ROI_ROWS = [
  { clients: 1, revenue: 350, note: 'Wymiana klocków + tarcze' },
  { clients: 2, revenue: 560, note: '2 wymiany opon sezonowych' },
  { clients: 3, revenue: 1050, note: 'Przegląd + 2 naprawy bieżące' },
  { clients: 5, revenue: 2200, note: 'Aktywny warsztat, sezon opon' },
] as const;

const TRUST_POINTS = [
  {
    title: 'Opis usterki zanim auto wjedzie',
    text: 'Bot pyta klienta o markę, rok, przebieg i objawy. Rano masz kartkę z opisem zamiast rozmowy od zera — mechanik może od razu zaplanować stanowisko i części.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Działa w szczycie sezonu opon',
    text: 'Kwiecień i październik to nie czas na odbieranie telefonów. Bot obsługuje dziesiątki zapytań jednocześnie, zbiera kontakty i rozkłada zapisy w kalendarzu — Ty oddzwaniasz z potwierdzeniem.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Nie daje gwarancji ani kosztorysów',
    text: 'Bot podaje orientacyjne widełki cen i jasno zaznacza, że dokładna wycena jest możliwa dopiero po obejrzeniu auta. Żadnych obietnic, które potem musisz tłumaczyć klientowi przy odbiorze.',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function MechanicLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #64748B 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0">
            <Image
              src="/botiko-mechanic.png"
              alt=""
              fill
              priority
              className="object-cover object-right opacity-80"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 34%, rgba(51,65,85,0.92) 52%, rgba(100,116,139,0.0) 78%)',
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #94a3b8, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #cbd5e1, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
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
              background: 'rgba(148, 163, 184, 0.15)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              color: '#e2e8f0',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold leading-snug">
              <svg
                className="shrink-0 w-3.5 h-3.5 text-slate-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              Dla warsztatów samochodowych · mechanika · wulkanizacja · diagnostyka
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-3xl">
            Klient pyta o naprawę
            <br />
            <span style={{ color: '#cbd5e1' }}>gdy masz ręce w oleju.</span>
            <br />
            Bot odpowiada za Ciebie.
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed max-w-xl mb-8">
            Botiko zna Twój cennik usług, obsługiwane marki i godziny otwarcia. Odpowiada klientom
            kiedy pracujesz na stanowisku albo warsztat jest zamknięty —
            i <strong className="text-white">zbiera kontakt z opisem usterki do oddzwonienia rano</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
            <Link
              href="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              style={{ color: '#334155' }}
            >
              Testuj 14 dni za darmo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-white hover:bg-white/10 transition-colors"
              style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              Zobacz demo bota
            </Link>
          </div>

          <div
            className="grid grid-cols-3 gap-6 pt-8 max-w-xl"
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div>
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-slate-400 text-xs mt-1">Odpowiada nawet w niedzielę</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">~15 min</p>
              <p className="text-slate-400 text-xs mt-1">Konfiguracja cennika usług</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">149 zł</p>
              <p className="text-slate-400 text-xs mt-1">Miesięcznie, bez umowy</p>
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Znasz to?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              6 sytuacji, w których tracisz klientów
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Klient, który nie dostał odpowiedzi w 5 minut, jest już na stronie następnego warsztatu.
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
                  style={{ background: '#f1f5f9', color: '#64748B' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Realne rozmowy
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Jak bot odpowiada klientom warsztatu
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Bot mówi wprost — orientacyjne ceny, opis usługi i jedno zdanie: zostaw numer albo zarezerwuj przez Booksy.
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
                    style={{ background: '#334155', borderBottomRightRadius: 4 }}
                  >
                    {s.q}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed"
                    style={{ background: '#f8fafc', borderBottomLeftRadius: 4, border: '1px solid #e2e8f0' }}
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
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
                Co robi bot
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-5">
                Recepcja warsztatu —{' '}
                <span style={{ color: '#334155' }}>bez odrywania mechanika od roboty</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Klient dostaje odpowiedź w 10 sekund. Ty dostajesz rano lead z opisem usterki, marką auta i numerem do oddzwonienia — zamiast 12 nieodebranych połączeń.
              </p>
              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#64748B' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Bot nie daje wiążących kosztorysów</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Podaje orientacyjne widełki i zaznacza, że dokładna cena jest możliwa po obejrzeniu auta. Klient wie, czego się spodziewać — bez niepotrzebnych zobowiązań z Twojej strony.
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
                    style={{ background: '#64748B' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Jak to działa
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Od rejestracji do działającego bota — w jeden dzień
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-6 top-8 bottom-8 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, #64748B, #334155)' }}
              aria-hidden
            />
            <ol className="flex flex-col gap-8">
              {[
                {
                  step: '01',
                  title: 'Rejestracja i wybór branży',
                  text: 'Zakładasz konto, wybierasz „Warsztat samochodowy" — dostajesz gotowy szablon z typowymi pytaniami dla mechaniki: ceny usług, obsługiwane marki, diagnostyka, opony.',
                },
                {
                  step: '02',
                  title: 'Wklejasz cennik i opis usług',
                  text: 'Opisujesz usługi, orientacyjne ceny i godziny. ~15 minut. Bot odpowiada wyłącznie na podstawie tych danych — żadnych cen z internetu ani wymyślonych kosztorysów.',
                },
                {
                  step: '03',
                  title: 'Wstawiasz widget na stronę',
                  text: 'Jeden tag HTML na stronę warsztatu, profil Google, Facebooka lub landing page. Widget pojawia się w rogu i obsługuje pytania, gdy jesteś na hali.',
                },
                {
                  step: '04',
                  title: 'Leady lądują w dashboardzie',
                  text: 'Bot zbiera imię, telefon, markę auta i opis problemu. Rano masz gotową listę z briefem — oddzwaniasz do konkretnych osób z konkretnymi informacjami.',
                },
              ].map((s) => (
                <li key={s.step} className="flex gap-6 sm:gap-10 items-start">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-md z-10"
                    style={{ background: 'linear-gradient(135deg, #334155, #64748B)' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Zwrot z inwestycji
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Ilu klientów miesięcznie = Botiko się zwraca?
            </h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>149 zł/mies</strong>. Jeden klient dogryziony z wieczoru zwraca cały koszt.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f1f5f9' }} className="text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">Nowi klienci / mies.</th>
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
                      +{row.revenue - 149} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            * Szacunki orientacyjne. Bot zbiera leady — Ty oddzwaniasz i zamykasz zlecenie. Duże naprawy (skrzynia, silnik) to 3 000–10 000 zł przychodu z jednego klienta.
          </p>
        </div>
      </section>

      {/* ─── Trust section ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Dlaczego Botiko, nie inny chatbot
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Zaprojektowany dla warsztatu, nie korporacji
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TRUST_POINTS.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl p-7 flex flex-col gap-3"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#334155' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              Porównanie
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Bot vs. telefon bez odpowiedzi
            </h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="grid grid-cols-3 text-sm">
              <div className="px-5 py-3 font-semibold text-slate-500 bg-slate-50" />
              <div
                className="px-5 py-3 font-bold text-center text-white text-sm"
                style={{ background: '#334155' }}
              >
                Botiko
              </div>
              <div className="px-5 py-3 font-semibold text-center text-slate-500 bg-slate-50">
                Bez bota
              </div>
            </div>
            {[
              ['Odpowiedź gdy jesteś pod autem', true, false],
              ['Odpowiedź o 20:00 po zamknięciu', true, false],
              ['Opis usterki przed wizytą', true, false],
              ['Obsługuje sezon wymiany opon', true, false],
              ['Zbiera kontakt, odsyła do Booksy', true, false],
              ['Orientacyjna wycena bez zobowiązań', true, false],
              ['Koszt miesięczny', '149 zł', 'Twój czas'],
            ].map(([label, yes, no], i) => (
              <div
                key={String(label)}
                className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
              >
                <div className="px-5 py-3.5 text-slate-600 font-medium">{label}</div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  {typeof yes === 'boolean' ? (
                    yes ? (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#64748B' }}>
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
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#64748B' }}>
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Czy bot działa z moim systemem kalendarza (Booksy, Google Calendar)?',
                a: 'Bot nie integruje się bezpośrednio z kalendarzem — zbiera dane klienta i odsyła do Booksy lub Twojego linku rezerwacyjnego. Ty potwierdzasz termin i planujesz stanowisko. Masz pełną kontrolę nad harmonogramem.',
              },
              {
                q: 'Czy bot może podawać ceny napraw?',
                a: 'Tak, jeśli wpiszesz orientacyjne widełki do bazy wiedzy. Bot zawsze zaznacza, że dokładna wycena jest możliwa dopiero po obejrzeniu auta. To chroni Cię przed sytuacją, gdy klient trzyma Cię za słowo na podstawie rozmowy przez internet.',
              },
              {
                q: 'Co gdy klient opisuje usterkę, której bot nie rozpoznaje?',
                a: 'Bot zbiera opis objawów i kontakt, po czym odpisuje, że mechanik oddzwoni z oceną. Nic nie wymyśla — jeśli coś wykracza poza bazę wiedzy, grzecznie odsyła do rozmowy z człowiekiem.',
              },
              {
                q: 'Czy bot obsłuży sezon wymiany opon kiedy telefon dzwoni non stop?',
                a: 'To jeden z głównych przypadków użycia. Bot obsługuje dziesiątki zapytań jednocześnie, zbiera kontakty i preferencje (rozmiar opon, termin) — Ty oddzwaniasz z potwierdzeniem. Bez chaosu telefonicznego w październiku i kwietniu.',
              },
              {
                q: 'Czy muszę mieć stronę www, żeby używać Botiko?',
                a: 'Nie. Widget możesz wstawić na profil Linktree, stronę na Canva, wizytówkę Google lub każdą inną stronę obsługującą własny HTML. Wystarczy jeden tag skryptu — działa też z WordPress i Webflow.',
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
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 70%, #64748B 100%)' }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #94a3b8, transparent 70%)' }}
              aria-hidden
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #cbd5e1, transparent 70%)' }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Zacznij dziś — bot działa już jutro rano
              </h2>
              <p className="text-slate-300 text-base mb-8 max-w-xl mx-auto">
                14 dni za darmo. Bez karty kredytowej. Bez umowy. Konfiguracja cennika i FAQ w ~15 minut.
              </p>
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                style={{ color: '#334155' }}
              >
                Uruchom bota w moim warsztacie
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-5 text-slate-400 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {['Bez karty kredytowej', '149 zł/mies.', 'Cancel w każdej chwili'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 shrink-0 text-slate-300"
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
