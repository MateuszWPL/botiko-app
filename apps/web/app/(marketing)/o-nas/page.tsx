import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '@/components/icons/SocialIcons';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_URL, breadcrumbListSchema } from '@/lib/seo';
import { AUTHOR } from '@/lib/author';

const JSON_LD_ABOUT = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'O Botiko',
  url: `${SITE_URL}/o-nas`,
  inLanguage: 'pl-PL',
  mainEntity: { '@id': `${SITE_URL}/#organization` },
  about: { '@id': `${SITE_URL}/#person` },
  description:
    'Botiko to jednoosobowy projekt z Białegostoku, bot obsługi klienta 24/7 dla polskich firm usługowych.',
};

export const metadata: Metadata = {
  title: 'O nas, jednoosobowy projekt z Białegostoku',
  description:
    'Botiko to jednoosobowy projekt z Białegostoku. Bot obsługi klienta 24/7 dla firm usługowych w Polsce, robiony z myślą o realnych właścicielach salonów, gabinetów i restauracji.',
  alternates: { canonical: 'https://botiko.pl/o-nas' },
  openGraph: {
    title: 'O Botiko, jednoosobowy projekt z Białegostoku',
    description:
      'Botiko to bot obsługi klienta 24/7 dla firm usługowych. Poznaj podejście do produktu i filozofię pracy.',
    url: 'https://botiko.pl/o-nas',
    type: 'website',
  },
};

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Konkretnie, nie „magicznie"',
    desc: 'Bot odpowiada na podstawie Twojej wiedzy (cennik, FAQ, godziny), nie zgaduje. Jeśli czegoś nie wie, zbiera kontakt i przekazuje Tobie.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Ma działać szybko, nie „za pół roku"',
    desc: 'Konfiguracja ~15 min. Wklejasz fragment kodu i bot startuje na Twojej stronie. Bez programisty, bez agencji.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Bezpiecznie i po polsku',
    desc: 'Dane leadów szyfrowane (AES-256), serwery w UE, zgodność z RODO. Komunikacja po polsku, z wyczuciem kontekstu firm usługowych.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: 'Jeden plan, zero trików',
    desc: '99 zł/mies. i już. Bez ukrytych tierów, bez „skontaktuj się w sprawie ceny", bez rocznych umów. Anuluj kiedy chcesz.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          // personSchema() is emitted globally in the root layout, not repeated here.
          JSON_LD_ABOUT,
          breadcrumbListSchema([
            { label: 'Botiko.pl', href: '/' },
            { label: 'O nas' },
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Wróć do strony głównej
            </Link>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#a5b4fc' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Białystok, Polska
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Botiko to jednoosobowy projekt
            <br />
            <span className="text-[#a5b4fc]">z Białegostoku.</span>
          </h1>

          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl">
            Bez zespołu sprzedażowego, bez inwestorów, bez „disrupt”. Jeden produkt, który ma pomóc realnym właścicielom
            salonów, gabinetów, restauracji i warsztatów przestać tracić klientów, gdy nie patrzą w telefon.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Historia</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-6 leading-tight">
            Jak się to zaczęło
          </h2>
          <div className="space-y-5 text-slate-600 text-base leading-relaxed">
            <p>
              Pomysł narodził się z obserwacji znajomych prowadzących firmy usługowe w Białymstoku:
              salon beauty, warsztat, gabinet. Te same problemy wracały co tydzień:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>„Klientka napisała o 22:30 i zapisała się do konkurencji, bo ja już spałam.”</li>
              <li>„Odbieram telefony podczas zabiegu, tracę na tym koncentrację i czas.”</li>
              <li>„Te same pytania: cennik, godziny, parking. Codziennie 20×.”</li>
            </ul>
            <p>
              Istniejące rozwiązania były albo za drogie (agencje za kilka tysięcy za wdrożenie), albo za generyczne
              (ChatGPT na stronie, który nie zna Twojego cennika i odpowiada jak encyklopedia). Botiko ma być czymś
              pomiędzy: <strong className="text-text">konkretny, tani, uruchamiany w 15 minut</strong>.
            </p>
            <p>
              To nie jest startup z 50-osobowym zespołem. To projekt, który robię sam, i dlatego mogę sobie pozwolić
              na odpowiadanie na Twoje pytania osobiście, bez „skieruj zapytanie do Customer Success Managera”.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Kto za tym stoi
          </p>
          <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="shrink-0 w-20 h-20 rounded-full bg-brand-soft text-brand flex items-center justify-center text-2xl font-bold">
                {AUTHOR.initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-extrabold text-text">
                  {AUTHOR.name}
                </h2>
                <p className="text-brand font-semibold mb-4">{AUTHOR.role}</p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  23 lata, inżynier oprogramowania i student Politechniki
                  Białostockiej. Od 3 lat w software developmencie, z 40+
                  zbudowanymi stronami i aplikacjami na koncie. Botiko piszę i
                  rozwijam samodzielnie: od kodu i modeli AI, po rozmowy
                  z właścicielami salonów, gabinetów, restauracji i warsztatów.
                  Dlatego produkt jest konkretny, a nie „magiczny”, i dlatego
                  na Twoje pytanie odpowiadam osobiście, nie przez infolinię.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={AUTHOR.sameAs[0]}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href={AUTHOR.sameAs[1]}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
                  >
                    <GitHubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href={AUTHOR.sameAs[2]}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    mateuszworonowicz.pl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Zasady</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Jak podchodzę do produktu</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand/25 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-text text-lg mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-4">Masz pytanie? Napisz bezpośrednio</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Nie ma bota na tej stronie do filtrowania zapytań. Piszesz, ja odpowiadam. Zwykle w ciągu 1 dnia roboczego.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="mailto:kontakt@botiko.pl"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand text-white font-bold text-base shadow-lg hover:bg-brand-dark transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              kontakt@botiko.pl
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Formularz kontaktowy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
