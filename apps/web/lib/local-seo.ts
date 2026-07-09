import 'server-only';

import type { FaqEntry } from '@/lib/seo';

/**
 * Data behind the programmatic /dla/[branza]/[miasto] landing pages.
 *
 * Quality gate (avoids thin programmatic content): a page only renders when
 * BOTH the industry and the city exist here. Each page composes industry-level
 * substance (pain points, features, ROI, sample chats) with genuinely
 * city-specific copy (real districts, locative grammar, city+industry FAQ), so
 * no two URLs are near-duplicates. Do not add a city without real districts and
 * its own FAQ answers, a templated stub is worse than no page.
 *
 * No fabricated statistics: local colour comes from verifiable facts (district
 * names, booking norms), never invented precise numbers.
 */

export type City = {
  slug: string;
  /** Mianownik, "Białystok" */
  name: string;
  /** Po przyimku "w/we", "w Białymstoku" (includes the preposition) */
  inLocative: string;
  /** Przymiotnik, "białostocki" (forma męska, do odmiany w tekście) */
  adjectiveMasc: string;
  /** Real districts, used in intro + sample chats to ground the copy locally. */
  districts: string[];
  /** One-line, non-numeric description of the local service-business scene. */
  sceneNote: string;
};

export type IndustryFaq = (city: City) => FaqEntry[];

export type Industry = {
  slug: string;
  /** Lowercase noun for inline copy, "salon beauty" */
  label: string;
  /** Dopełniacz, "Bot dla {salonu beauty}" */
  labelGenitive: string;
  /** Capitalised for headings/breadcrumbs, "Salon beauty" */
  labelTitle: string;
  accent: string;
  gradient: string;
  serviceType: string;
  /** Sample chats; {city} is replaced with the city mianownik. */
  sampleChats: { q: string; a: string }[];
  features: string[];
  roiRows: { clients: number; revenue: number; note: string }[];
  /** Industry intro, parametrised by city for local relevance. */
  intro: (city: City) => string;
  painLocal: (city: City) => string;
  faq: IndustryFaq;
};

export const CITIES: City[] = [
  {
    slug: 'bialystok',
    name: 'Białystok',
    inLocative: 'w Białymstoku',
    adjectiveMasc: 'białostocki',
    districts: ['Centrum', 'Nowe Miasto', 'Antoniuk', 'Bojary', 'Wygoda'],
    sceneNote:
      'firmy usługowe skupione wokół Centrum, Nowego Miasta i osiedli mieszkaniowych, z dużym ruchem z poleceń na lokalnych grupach',
  },
  {
    slug: 'warszawa',
    name: 'Warszawa',
    inLocative: 'w Warszawie',
    adjectiveMasc: 'warszawski',
    districts: ['Mokotów', 'Śródmieście', 'Wola', 'Praga-Południe', 'Ursynów'],
    sceneNote:
      'bardzo konkurencyjny rynek, gdzie klient porównuje kilka firm naraz i wybiera tę, która odpowie najszybciej',
  },
  {
    slug: 'krakow',
    name: 'Kraków',
    inLocative: 'w Krakowie',
    adjectiveMasc: 'krakowski',
    districts: ['Stare Miasto', 'Kazimierz', 'Podgórze', 'Krowodrza', 'Dębniki'],
    sceneNote:
      'mieszanka stałych klientów z osiedli i ruchu turystycznego w centrum, który pisze o nietypowych porach',
  },
  {
    slug: 'wroclaw',
    name: 'Wrocław',
    inLocative: 'we Wrocławiu',
    adjectiveMasc: 'wrocławski',
    districts: ['Stare Miasto', 'Krzyki', 'Śródmieście', 'Fabryczna', 'Psie Pole'],
    sceneNote:
      'dużo młodych klientów i pracujących zdalnie, którzy załatwiają sprawy wieczorami i przez telefon',
  },
  {
    slug: 'poznan',
    name: 'Poznań',
    inLocative: 'w Poznaniu',
    adjectiveMasc: 'poznański',
    districts: ['Stare Miasto', 'Jeżyce', 'Grunwald', 'Wilda', 'Nowe Miasto'],
    sceneNote:
      'klienci ceniący konkret i szybką, rzeczową odpowiedź na pytanie o cenę i termin',
  },
  {
    slug: 'gdansk',
    name: 'Gdańsk',
    inLocative: 'w Gdańsku',
    adjectiveMasc: 'gdański',
    districts: ['Śródmieście', 'Wrzeszcz', 'Oliwa', 'Przymorze', 'Zaspa'],
    sceneNote:
      'sezonowe skoki ruchu i klienci z Trójmiasta piszący po godzinach pracy',
  },
];

export const INDUSTRIES: Industry[] = [
  {
    slug: 'salon-beauty',
    label: 'salon beauty',
    labelGenitive: 'salonu beauty',
    labelTitle: 'Salon beauty',
    accent: '#EC4899',
    gradient: 'linear-gradient(135deg, #831843 0%, #9d174d 30%, #be185d 70%, #EC4899 100%)',
    serviceType: 'Customer service automation for beauty salons',
    intro: (c) =>
      `Prowadzisz salon beauty ${c.inLocative}? Botiko odpowiada Twoim klientkom 24/7, także wtedy, gdy robisz zabieg albo już skończyłaś pracę. Bot zna Twój cennik (hybryda, rzęsy, brwi, kosmetologia), godziny i lokalizację, a numer telefonu klientki zapisuje do oddzwonienia. Działa dla salonów na osiedlach ${c.districts.slice(0, 3).join(', ')} i w całym mieście.`,
    painLocal: (c) =>
      `${c.name} to ${c.sceneNote}. Wiadomości o manicure i rzęsy spływają najczęściej wieczorem, gdy już nie odpisujesz, klientka zapisuje się gdzie indziej.`,
    sampleChats: [
      {
        q: 'Ile kosztuje manicure hybrydowy?',
        a: 'Manicure hybrydowy to 90 zł (ok. 75 min). W pakiecie z pedicure, 160 zł. Zostaw imię i telefon, a rano sprawdzę kalendarz i oddzwonię z wolnymi terminami.',
      },
      {
        q: 'Macie wolny termin na rzęsy w sobotę?',
        a: 'W soboty pracujemy 9:00-17:00 (stylizacja 1:1, naturalna, objętość, 150-250 zł). Zostaw numer, a właścicielka oddzwoni z wolnym okienkiem.',
      },
      {
        q: 'Gdzie dokładnie jest salon i czy jest parking?',
        a: 'Salon znajduje się w {city}. Podam dokładny adres i wskazówki dojazdu, napisz, z której części miasta jedziesz, a podpowiem najbliższy parking.',
      },
    ],
    features: [
      'Odpowiada na pytania o cennik: hybryda, żel, manicure japoński, pedicure',
      'Zna czas trwania zabiegów i godziny otwarcia salonu',
      'Zbiera imię i telefon klientki, oddzwaniasz z wolnym terminem',
      'Wyjaśnia różnice między usługami (np. henna pudrowa vs laminacja brwi)',
      'Informuje o promocjach i pakietach, które sama wprowadzasz',
      'Odsyła do rezerwacji w Booksy bez przejmowania kalendarza',
    ],
    roiRows: [
      { clients: 2, revenue: 200, note: '2 hybrydy dogrywane wieczorem' },
      { clients: 4, revenue: 480, note: '2 hybrydy + 2 stylizacje rzęs' },
      { clients: 8, revenue: 1120, note: 'Aktywny salon z ruchem na Instagramie' },
    ],
    faq: (c) => [
      {
        q: `Czy bot dla salonu beauty ${c.inLocative} obsłuży klientki z różnych dzielnic?`,
        a: `Tak. Bot działa przez stronę WWW i odpowiada niezależnie od tego, czy klientka pisze z ${c.districts[0]}, ${c.districts[1]} czy spoza ${c.name}. Możesz wpisać w nim, z których okolic najwygodniej do Ciebie dojechać i gdzie zaparkować.`,
      },
      {
        q: `Ile kosztuje bot dla salonu ${c.inLocative}?`,
        a: 'Botiko kosztuje 99 zł miesięcznie w jednym planie, 14 dni za darmo bez karty. To mniej niż przychód z jednej dogranej klientki, niezależnie od miasta.',
      },
      {
        q: `Jak szybko uruchomię bota w moim ${c.adjectiveMasc}m salonie?`,
        a: 'Zwykle 15-20 minut: wybierasz branżę beauty, wklejasz cennik i godziny, a kod osadzasz na stronie (np. przez wtyczkę WPCode na WordPress). Bez programisty.',
      },
    ],
  },
  {
    slug: 'gabinet-spa',
    label: 'gabinet / SPA',
    labelGenitive: 'gabinetu lub SPA',
    labelTitle: 'Gabinet / SPA',
    accent: '#06B6D4',
    gradient: 'linear-gradient(135deg, #155e75 0%, #0e7490 40%, #06B6D4 100%)',
    serviceType: 'Customer service automation for wellness and SPA',
    intro: (c) =>
      `Masz gabinet, SPA lub studio wellness ${c.inLocative}? Botiko odpowiada na pytania o masaże, zabiegi na twarz i aromaterapię 24/7, a kontakt do klienta zapisuje, gdy jesteś przy zabiegu. Zna Twój cennik i grafik, więc nie musisz przerywać pracy, by odpisać. Obsługuje klientów z ${c.districts.slice(0, 3).join(', ')} i całego miasta.`,
    painLocal: (c) =>
      `${c.name} to ${c.sceneNote}. Przy masażu czy zabiegu nie odbierzesz telefonu, a właśnie wtedy najczęściej pytają o wolny termin.`,
    sampleChats: [
      {
        q: 'Ile trwa i kosztuje masaż relaksacyjny całego ciała?',
        a: 'Masaż relaksacyjny całego ciała to 60 min i 160 zł. Mamy też wersję 90 min (220 zł). Zostaw numer, oddzwonimy z wolnym terminem, gdy skończymy bieżący zabieg.',
      },
      {
        q: 'Czy macie pakiety dla par?',
        a: 'Tak, pakiet SPA dla pary to dwa masaże w jednym pomieszczeniu (90 min, 420 zł) plus herbata. Chcesz rezerwację? Zostaw imię i telefon, oddzwonimy z propozycją terminów.',
      },
      {
        q: 'Jak trafić do gabinetu i czy jest parking?',
        a: 'Gabinet mieści się w {city}. Podam dokładny adres i wskazówki, napisz, z której okolicy jedziesz, a podpowiem dojazd i parking.',
      },
    ],
    features: [
      'Odpowiada na pytania o rodzaje masaży i zabiegów oraz ich czas',
      'Zna cennik i pakiety (np. SPA dla par, karnety)',
      'Zbiera kontakt, gdy jesteś przy kliencie, oddzwaniasz po zabiegu',
      'Doradza wybór zabiegu na podstawie potrzeb klienta',
      'Informuje o przeciwwskazaniach i przygotowaniu do wizyty',
      'Odsyła do rezerwacji w Booksy lub Calendly',
    ],
    roiRows: [
      { clients: 1, revenue: 160, note: '1 masaż dogrywany wieczorem' },
      { clients: 3, revenue: 540, note: '2 masaże + 1 zabieg na twarz' },
      { clients: 6, revenue: 1200, note: 'Gabinet z regularnym ruchem' },
    ],
    faq: (c) => [
      {
        q: `Czy bot dla gabinetu SPA ${c.inLocative} poradzi sobie z pytaniami o przeciwwskazania?`,
        a: 'Tak, w zakresie, który sam ustawisz. Bot przekazuje informacje z Twojej bazy wiedzy (przygotowanie do zabiegu, przeciwwskazania), a w razie wątpliwości zbiera kontakt i przekazuje pytanie Tobie.',
      },
      {
        q: `Ile kosztuje bot dla gabinetu ${c.inLocative}?`,
        a: 'Botiko to 99 zł miesięcznie, 14 dni za darmo bez karty. Zwykle zwraca się po jednym dogranym masażu lub zabiegu.',
      },
      {
        q: `Czy bot zastąpi recepcję w moim ${c.adjectiveMasc}m gabinecie?`,
        a: 'Nie zastąpi, ale przejmuje powtarzalne pytania o cennik, czas zabiegów i dostępność oraz zbiera kontakt po godzinach. Recepcja zajmuje się rozmowami wymagającymi decyzji.',
      },
    ],
  },
  {
    slug: 'restauracja',
    label: 'restauracja',
    labelGenitive: 'restauracji',
    labelTitle: 'Restauracja',
    accent: '#F97316',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #F97316 100%)',
    serviceType: 'Customer service automation for restaurants',
    intro: (c) =>
      `Prowadzisz restaurację, bistro lub kawiarnię ${c.inLocative}? Botiko odpowiada gościom na pytania o menu, alergeny, godziny i organizację imprez 24/7, także w środku serwisu, gdy obsługa nie ma czasu na telefon. Zna Twoją kartę i zasady rezerwacji, a kontakt do gościa zapisuje. Obsługuje gości z ${c.districts.slice(0, 3).join(', ')} i okolic.`,
    painLocal: (c) =>
      `${c.name} to ${c.sceneNote}. Wieczorem, w szczycie serwisu, telefon dzwoni z pytaniem o wolny stolik, a kelnerzy są na sali.`,
    sampleChats: [
      {
        q: 'Macie wolny stolik na 4 osoby w piątek wieczorem?',
        a: 'W piątki bywa pełno, dlatego rezerwujemy z wyprzedzeniem. Zostaw imię i telefon oraz preferowaną godzinę, oddzwonimy i potwierdzimy stolik.',
      },
      {
        q: 'Czy macie dania bezglutenowe i wegańskie?',
        a: 'Tak, w karcie mamy oznaczone dania wegańskie i bezglutenowe. Jeśli masz konkretną alergię, napisz jaką, sprawdzę, które pozycje są bezpieczne.',
      },
      {
        q: 'Organizujecie urodziny dla grupy?',
        a: 'Tak, przyjmujemy imprezy okolicznościowe w {city}. Zostaw kontakt i liczbę osób, oddzwonimy z propozycją menu i dostępnością sali.',
      },
    ],
    features: [
      'Odpowiada na pytania o menu, alergeny i dania specjalne',
      'Zna godziny otwarcia i zasady rezerwacji stolików',
      'Zbiera kontakt do rezerwacji i zapytań o eventy',
      'Informuje o cateringu, dowozie i organizacji imprez',
      'Odpowiada na pytania o parking i dojazd',
      'Działa w środku serwisu, gdy obsługa jest na sali',
    ],
    roiRows: [
      { clients: 2, revenue: 240, note: '2 rezerwacje stolików uratowane wieczorem' },
      { clients: 5, revenue: 800, note: 'Stoliki + jedno zapytanie o event' },
      { clients: 10, revenue: 2000, note: 'Lokal z dużym ruchem weekendowym' },
    ],
    faq: (c) => [
      {
        q: `Czy bot dla restauracji ${c.inLocative} przyjmie rezerwację stolika?`,
        a: 'Bot zbiera dane do rezerwacji (imię, telefon, liczba osób, godzina) i przekazuje je Tobie do potwierdzenia. Nie zarządza salą za Ciebie, zostawia decyzję obsłudze, ale gość nie zostaje bez odpowiedzi.',
      },
      {
        q: `Ile kosztuje bot dla restauracji ${c.inLocative}?`,
        a: 'Botiko kosztuje 99 zł miesięcznie, 14 dni za darmo bez karty. Wystarczy kilka uratowanych rezerwacji w miesiącu, by się zwrócił.',
      },
      {
        q: `Czy bot odpowie gościom z różnych części ${c.name}?`,
        a: `Tak. Bot działa na Twojej stronie i odpowiada gościom niezależnie od tego, czy piszą z ${c.districts[0]}, ${c.districts[1]} czy spoza miasta. Może też podać dojazd i parking.`,
      },
    ],
  },
  {
    slug: 'warsztat-mechaniczny',
    label: 'warsztat samochodowy',
    labelGenitive: 'warsztatu samochodowego',
    labelTitle: 'Warsztat samochodowy',
    accent: '#64748B',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 45%, #64748B 100%)',
    serviceType: 'Customer service automation for auto repair shops',
    intro: (c) =>
      `Masz warsztat samochodowy lub wulkanizację ${c.inLocative}? Botiko odpowiada klientom na pytania o przeglądy, naprawy i wymianę opon 24/7, także wtedy, gdy jesteś pod samochodem i nie odbierzesz telefonu. Zbiera markę, model i opis usterki, żebyś oddzwonił z gotową wyceną. Obsługuje kierowców z ${c.districts.slice(0, 3).join(', ')} i całego miasta.`,
    painLocal: (c) =>
      `${c.name} to ${c.sceneNote}. Gdy pracujesz pod autem, nie odbierzesz telefonu, a klient z usterką dzwoni do następnego warsztatu z listy.`,
    sampleChats: [
      {
        q: 'Ile kosztuje wymiana oleju i filtra?',
        a: 'Wymiana oleju z filtrem to zwykle 150-250 zł plus koszt oleju (zależnie od modelu). Podaj markę i rok auta, a oddzwonimy z dokładną wyceną i wolnym terminem.',
      },
      {
        q: 'Robicie sezonową wymianę opon? Ile to trwa?',
        a: 'Tak, wymiana opon to ok. 30-45 minut. W sezonie bywa kolejka, zostaw numer i rozmiar opon, a zapiszemy Cię na konkretną godzinę.',
      },
      {
        q: 'Mam stukanie na zawieszeniu, przyjmiecie na diagnostykę?',
        a: 'Tak, przyjmujemy auta na diagnostykę w {city}. Napisz markę, model i kiedy słychać stukanie, oddzwonimy i umówimy dogodny termin oględzin.',
      },
    ],
    features: [
      'Odpowiada na pytania o przeglądy, naprawy i wymianę opon',
      'Zbiera markę, model i opis usterki do wyceny',
      'Zna orientacyjne ceny i czas typowych usług',
      'Informuje o godzinach i terminach (np. sezon opon)',
      'Zapisuje kontakt, gdy jesteś pod samochodem',
      'Odsyła do rezerwacji terminu w kalendarzu lub Booksy',
    ],
    roiRows: [
      { clients: 1, revenue: 250, note: '1 naprawa uratowana wieczornym zapytaniem' },
      { clients: 4, revenue: 900, note: 'Przeglądy + sezonowa wymiana opon' },
      { clients: 8, revenue: 2000, note: 'Warsztat z dużym ruchem w sezonie' },
    ],
    faq: (c) => [
      {
        q: `Czy bot dla warsztatu ${c.inLocative} poda wycenę naprawy?`,
        a: 'Bot poda orientacyjne ceny z Twojego cennika i zbierze dane (marka, model, usterka), żebyś oddzwonił z dokładną wyceną. Nie wycenia napraw samodzielnie, dane ma gotowe, gdy wyjdziesz spod auta.',
      },
      {
        q: `Ile kosztuje bot dla warsztatu ${c.inLocative}?`,
        a: 'Botiko to 99 zł miesięcznie, 14 dni za darmo bez karty. Jedna uratowana naprawa zwykle pokrywa koszt na kilka miesięcy.',
      },
      {
        q: `Czy bot obsłuży kierowców z całego ${c.name}?`,
        a: `Tak. Bot odpowiada na stronie warsztatu niezależnie od dzielnicy, od ${c.districts[0]} po ${c.districts[1]} i okolice. Może też podać dojazd do warsztatu.`,
      },
    ],
  },
];

const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const INDUSTRY_BY_SLUG = new Map(INDUSTRIES.map((i) => [i.slug, i]));

export function getCity(slug: string): City | undefined {
  return CITY_BY_SLUG.get(slug);
}

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRY_BY_SLUG.get(slug);
}

export type LocalPage = {
  industry: Industry;
  city: City;
  sampleChats: { q: string; a: string }[];
  faqs: FaqEntry[];
};

/** Quality gate: returns null unless both industry and city are defined. */
export function getLocalPage(industrySlug: string, citySlug: string): LocalPage | null {
  const industry = getIndustry(industrySlug);
  const city = getCity(citySlug);
  if (!industry || !city) return null;

  const sampleChats = industry.sampleChats.map((chat) => ({
    q: chat.q,
    a: chat.a.replace(/\{city\}/g, city.name),
  }));

  return { industry, city, sampleChats, faqs: industry.faq(city) };
}

/** Every valid (industry, city) combination, for generateStaticParams + sitemap. */
export function getAllLocalParams(): { branza: string; miasto: string }[] {
  return INDUSTRIES.flatMap((industry) =>
    CITIES.map((city) => ({ branza: industry.slug, miasto: city.slug })),
  );
}

/** Cities offered for a given industry, for the "Botiko w Twoim mieście" links. */
export function getCitiesForIndustry(industrySlug: string): City[] {
  return getIndustry(industrySlug) ? CITIES : [];
}

/**
 * Botiko has a genuine local presence only in Białystok (founder location).
 * The other-city landing pages stay reachable for direct/ad traffic, but are
 * marked `noindex` and kept out of the sitemap, their copy is ~93% shared
 * across cities, so asking Google to rank them invites near-duplicate/doorway
 * penalties for cities where there is no real local presence.
 */
export const INDEXABLE_CITY_SLUGS = ['bialystok'] as const;

export function isIndexableLocalCity(citySlug: string): boolean {
  return (INDEXABLE_CITY_SLUGS as readonly string[]).includes(citySlug);
}
