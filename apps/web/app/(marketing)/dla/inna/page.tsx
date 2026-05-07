import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bot dla Twojej firmy usługowej — odpowiada klientom 24/7 i zbiera leady',
  description:
    'Botiko dla każdej firmy usługowej: fryzjer, fizjoterapeuta, trener, fotograf, studio, kancelaria. Bot odpowiada na pytania i zbiera kontakty 24/7. 99 zł/mies., 14 dni za darmo.',
  alternates: { canonical: 'https://botiko.pl/dla/inna' },
  openGraph: {
    title: 'Bot dla Twojej firmy usługowej — odpowiada klientom 24/7',
    description:
      'Klienci piszą wieczorem. Bot odpowiada, zbiera kontakt i odsyła do Booksy lub Twojego systemu. 99 zł/mies.',
    url: 'https://botiko.pl/dla/inna',
    type: 'website',
  },
};

const JSON_LD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bot obsługi klienta dla firm usługowych',
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

const USE_CASES = [
  {
    label: 'Fryzjer / barber',
    desc: 'Cennik strzyżeń, pytania o koloryzację, odesłanie do Booksy',
    color: '#8B5CF6',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Fizjoterapeuta',
    desc: 'Opis zabiegów, pytania o wskazania, zbieranie kontaktów',
    color: '#06B6D4',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    label: 'Trener personalny',
    desc: 'Plany treningowe, ceny pakietów, zapisy na próbny trening',
    color: '#10B981',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: 'Fotograf',
    desc: 'Pakiety sesji, pytania o styl, dostępność terminów',
    color: '#F59E0B',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    label: 'Kancelaria / notariat',
    desc: 'Zakres usług, wymagane dokumenty, umówienie spotkania',
    color: '#64748B',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Szkoła językowa',
    desc: 'Poziomy kursów, grafik, próbna lekcja, cennik grup i indywidualnych',
    color: '#EC4899',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: 'Studio / akademia tańca',
    desc: 'Harmonogram zajęć, style tańca, ceny karnetów i jednorazówek',
    color: '#F97316',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="5" r="2" />
        <path d="M10.5 8.5L8 14l3 1.5L12 22l1-6.5L16 14l-2.5-5.5" />
      </svg>
    ),
  },
  {
    label: 'Ogrodnik / architekt krajobrazu',
    desc: 'Zakres prac, sezonowość, wycena i kontakt do umówienia oględzin',
    color: '#84CC16',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9M12 12c0-5 5-9 10-9-1 5-5 9-10 9" />
      </svg>
    ),
  },
] as const;

const PAIN_POINTS = [
  {
    title: 'Klient pisze, gdy nie możesz odebrać',
    text: 'Prowadzisz sesję, trening, zabieg albo jesteś na spotkaniu z innym klientem. Bot odpowiada w 10 sekund — Ty oddzwaniasz kiedy jesteś wolny.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: 'Zapytania wieczorami i w weekendy',
    text: 'Większość decyzji o zakupie usługi zapada po 18:00 i w soboty. Bot jest dostępny dokładnie wtedy, gdy Ty nie pracujesz — i zbiera kontakty do listy na poniedziałek.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    title: 'Te same pytania — bez końca',
    text: '„Ile kosztuje?", „Jak długo trwa?", „Macie wolne w piątek?" — każdy nowy klient pyta od podstaw. Bot odpowiada za Ciebie, bez zmęczenia.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Klient odchodzi bo nikt nie odpowiedział',
    text: 'W serwisach lokalnych i Google Maps klient ma otwartych 3 karty jednocześnie. Wygrywa ta firma, która odpowie pierwsza — nie ta, która jest najlepsza.',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
] as const;

const FEATURES = [
  'Odpowiada na pytania o ceny, czas trwania i zakres usług',
  'Zbiera imię i telefon — odsyła do Booksy, Calendly lub Twojego systemu',
  'Opisuje Twoją ofertę na podstawie bazy wiedzy, którą sam tworzysz',
  'Działa na stronie www, Wix, WordPress, Squarespace, Webflow i Canva',
  'Obsługuje zapytania o promocje, vouchery i pakiety',
  'Widget dopasowany kolorystycznie do Twojej marki w ~5 minut',
] as const;

const ROI_ROWS = [
  { clients: 1, revenue: 200, note: 'Jedna usługa ~ 1–2 h pracy' },
  { clients: 2, revenue: 400, note: 'Dwa zlecenia z wieczornych pytań' },
  { clients: 5, revenue: 900, note: 'Aktywna strona + Google Maps' },
] as const;

const STEPS = [
  {
    step: '01',
    title: 'Rejestracja i wybór „Inna branża"',
    text: 'Zakładasz konto i wybierasz szablon ogólny. Dostajesz bazę z pytaniami i odpowiedziami pasującymi do większości firm usługowych — edytujesz pod siebie.',
  },
  {
    step: '02',
    title: 'Wklejasz swoją ofertę i FAQ',
    text: 'Opisujesz usługi, ceny i zasady działania. ~15 minut. Bot będzie odpowiadał wyłącznie na podstawie tego, co mu podasz — zero wymyślonych informacji.',
  },
  {
    step: '03',
    title: 'Wstawiasz widget na stronę',
    text: 'Natywna instalacja na WordPress (5 minut przez wtyczkę WPCode, bez edycji kodu) lub jeden tag HTML na każdej innej stronie WWW.',
  },
  {
    step: '04',
    title: 'Zbierasz leady, oddzwaniasz',
    text: 'Kontakty z rozmów lądują w dashboardzie. Rano masz listę osób zainteresowanych Twoją usługą — oddzwaniasz i zamykasz zlecenia.',
  },
] as const;

export default function InnaLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SERVICE) }}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 35%, #6d28d9 70%, #8B5CF6 100%)' }}
      >
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24 z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-white transition-colors"
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
              background: 'rgba(196, 181, 253, 0.15)',
              border: '1px solid rgba(196, 181, 253, 0.35)',
              color: '#ede9fe',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold leading-snug">
              <svg
                className="shrink-0 w-3.5 h-3.5 text-violet-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Dla każdej firmy usługowej · fryzjer · fizjoterapeuta · fotograf · i inne
            </span>
          </span>

          {/* Two-column hero layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                Klient pyta o Twoje usługi
                <br />
                <span style={{ color: '#c4b5fd' }}>o każdej porze.</span>
                <br />
                Bot odpowiada za Ciebie.
              </h1>

              <p className="text-violet-200 text-lg leading-relaxed mb-8">
                Botiko działa dla każdej małej firmy usługowej. Konfigurujesz go pod swoją ofertę w 15 minut —
                i <strong className="text-white">zbiera kontakty 24/7, gdy jesteś zajęty pracą z klientem</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
                <Link
                  href="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                  style={{ color: '#6d28d9' }}
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
                  <p className="text-violet-300 text-xs mt-1">Odpowiada nawet w niedzielę</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">~15 min</p>
                  <p className="text-violet-300 text-xs mt-1">Konfiguracja oferty</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">99 zł</p>
                  <p className="text-violet-300 text-xs mt-1">Miesięcznie, bez umowy</p>
                </div>
              </div>
            </div>

            {/* Use case pills grid */}
            <div className="grid grid-cols-2 gap-3">
              {USE_CASES.map((u) => (
                <div
                  key={u.label}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${u.color}25`, color: u.color }}
                  >
                    {u.svg}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug">{u.label}</p>
                    <p className="text-violet-300 text-xs leading-snug truncate">{u.desc}</p>
                  </div>
                </div>
              ))}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
              Znasz to?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Niezależnie od branży — problemy są te same
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Każda mała firma usługowa traci klientów z tego samego powodu: brak odpowiedzi wtedy, gdy klient pyta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#f5f3ff', color: '#8B5CF6' }}
                >
                  {p.svg}
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1.5">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Dla kogo ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
              Dla kogo
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Botiko działa w każdej branży usługowej
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Tworzysz własną bazę wiedzy — bot odpowiada tak, jakbyś to Ty pisał. Branża nie ma znaczenia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u) => (
              <div
                key={u.label}
                className="rounded-2xl p-5 border border-slate-100 bg-white hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${u.color}15`, color: u.color }}
                >
                  {u.svg}
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1">{u.label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            i wiele innych — jeśli masz ofertę usługową i stronę www, Botiko zadziała.
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
                Co robi bot
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-5">
                Twój cennik + FAQ + Booksy —{' '}
                <span style={{ color: '#6d28d9' }}>w jednym widgecie</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Wklejasz swoją ofertę raz. Bot zna ją na pamięć i odpowiada klientom kiedy śpisz, pracujesz z innym klientem albo masz wolne. Wszystko bez umów, bez IT, bez zatrudniania recepcji.
              </p>

              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#8B5CF6' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Bot mówi tylko to, co mu powiesz</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Żadnych ogólnych informacji z internetu. Odpowiada wyłącznie na podstawie Twojej bazy wiedzy — ceny, warunki, oferta są zawsze zgodne z prawdą.
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
                    style={{ background: '#8B5CF6' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
              Jak to działa
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Od rejestracji do działającego bota — w jeden dzień
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-6 top-8 bottom-8 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, #8B5CF6, #6d28d9)' }}
              aria-hidden
            />
            <ol className="flex flex-col gap-8">
              {STEPS.map((s) => (
                <li key={s.step} className="flex gap-6 sm:gap-10 items-start">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-md z-10"
                    style={{ background: 'linear-gradient(135deg, #6d28d9, #8B5CF6)' }}
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
              Zwrot z inwestycji
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
              Ilu klientów miesięcznie = Botiko się zwraca?
            </h2>
            <p className="mt-3 text-slate-500">
              Koszt Botiko to <strong>99 zł/mies</strong>. W większości branż jeden lead z wieczoru zwraca cały koszt.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f5f3ff' }} className="text-left">
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
                      +{row.revenue - 99} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            * Szacunki orientacyjne — wartość zlecenia zależy od branży. Bot zbiera leady, Ty zamieniasz je w klientów.
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Moja branża nie jest na liście — czy Botiko zadziała?',
                a: 'Tak. Bot nie jest ograniczony do konkretnych branż — działa na bazie wiedzy, którą mu podasz. Jeśli możesz opisać swoją ofertę słowami (usługi, ceny, FAQ), bot będzie odpowiadał na te pytania. Sprawdza się wszędzie tam, gdzie klienci pytają o to samo wiele razy.',
              },
              {
                q: 'Czy muszę mieć stronę www?',
                a: 'Nie. Widget możesz wstawić na profil Linktree, stronę Canva, wizytówkę w Google lub każdy serwis obsługujący własny HTML. Wystarczy jeden tag skryptu. Działa też z WordPress, Wix, Squarespace i Webflow.',
              },
              {
                q: 'Czy bot działa z Booksy, Calendly albo moim własnym systemem?',
                a: 'Bot nie integruje się bezpośrednio — zbiera dane kontaktowe klienta i odsyła do Booksy, Calendly lub Twojego linku rezerwacyjnego. Ty masz pełną kontrolę nad kalendarzem i potwierdzasz spotkania samodzielnie.',
              },
              {
                q: 'Ile czasu zajmuje konfiguracja?',
                a: 'Rejestracja i podstawowa konfiguracja — ok. 15–20 minut. Wklejasz opis usług, ceny i FAQ. Bot działa od razu. Możesz uzupełniać bazę wiedzy w dowolnym momencie, gdy coś się zmienia.',
              },
              {
                q: 'Co gdy klient zapyta o coś, o czym bot nie wie?',
                a: 'Bot grzecznie informuje, że nie ma tej odpowiedzi i proponuje pozostawienie kontaktu do oddzwonienia. Nic nie wymyśla — odpowiada tylko na podstawie Twojej bazy wiedzy.',
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
            style={{ background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #6d28d9 70%, #8B5CF6 100%)' }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }}
              aria-hidden
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Zacznij dziś — bot działa już jutro rano
              </h2>
              <p className="text-violet-200 text-base mb-8 max-w-xl mx-auto">
                14 dni za darmo. Bez karty kredytowej. Bez umowy. Konfiguracja oferty i FAQ w ~15 minut.
              </p>
              <Link
                href="/rejestracja"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                style={{ color: '#6d28d9' }}
              >
                Uruchom bota w mojej firmie
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="mt-5 text-violet-300 text-xs flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {['Bez karty kredytowej', '99 zł/mies.', 'Cancel w każdej chwili'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 shrink-0 text-violet-200"
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
