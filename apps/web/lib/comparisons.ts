import 'server-only';

import type { FaqEntry } from '@/lib/seo';

/**
 * Data for /porownanie/[slug] pages. Comparisons stay fair and factual.
 * Most contrast Botiko with *approaches* (manual replies, generic AI). We also
 * include named-competitor pages (e.g. Botiko vs Tidio) where search intent
 * demands it ("tidio alternatywa") — kept to nominative fair use: verifiable,
 * non-disparaging, and WITHOUT hard competitor pricing (it changes; link to the
 * source instead). High commercial intent and good fodder for AI answers.
 */

export type CompareCell = boolean | string;

export type Comparison = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  optionA: string;
  optionB: string;
  rows: { feature: string; a: CompareCell; b: CompareCell }[];
  verdict: string;
  faqs: FaqEntry[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: 'bot-vs-reczne-odpowiadanie',
    title: 'Bot vs ręczne odpowiadanie na wiadomości',
    metaTitle: 'Bot obsługi klienta vs ręczne odpowiadanie — co się opłaca?',
    metaDescription:
      'Porównanie: bot obsługi klienta 24/7 kontra ręczne odpisywanie na wiadomości. Czas reakcji, koszt, dostępność po godzinach i wpływ na utracone leady.',
    h1: 'Bot obsługi klienta a ręczne odpowiadanie na wiadomości',
    intro:
      'Ręczne odpisywanie działa, dopóki masz czas i nie śpisz. Problem zaczyna się wieczorem i w trakcie pracy, gdy wiadomości zostają bez odpowiedzi, a klient idzie do konkurencji. Poniżej porównanie obu podejść w realiach małej firmy usługowej.',
    optionA: 'Bot Botiko',
    optionB: 'Ręczne odpowiadanie',
    rows: [
      { feature: 'Czas reakcji na wiadomość', a: 'Natychmiast', b: 'Od kilku minut do wielu godzin' },
      { feature: 'Dostępność po godzinach i w nocy', a: true, b: false },
      { feature: 'Odpowiada w trakcie pracy / zabiegu', a: true, b: false },
      { feature: 'Zbiera kontakt do oddzwonienia', a: true, b: 'Tylko jeśli zdążysz' },
      { feature: 'Koszt miesięczny', a: '99 zł', b: 'Twój czas (często najdroższy zasób)' },
      { feature: 'Skaluje się przy większym ruchu', a: true, b: false },
      { feature: 'Osobisty, ludzki ton rozmowy', a: 'Częściowo', b: true },
    ],
    verdict:
      'Bot nie zastępuje Ciebie w trudnych rozmowach — przejmuje powtarzalne pytania i nieodebrane wiadomości po godzinach, których ręcznie i tak byś nie obsłużył. Najlepiej działa jako pierwsza linia, która zbiera leady, a Ty domykasz je telefonem.',
    faqs: [
      {
        q: 'Czy bot całkowicie zastąpi ręczne odpowiadanie?',
        a: 'Nie. Bot obsługuje powtarzalne pytania (cennik, godziny, dostępność) i wiadomości po godzinach, a trudniejsze rozmowy przekazuje Tobie wraz z kontaktem klienta. To uzupełnienie, nie zamiennik człowieka.',
      },
      {
        q: 'Ile czasu realnie oszczędza bot?',
        a: 'Najwięcej tam, gdzie powtarzają się te same pytania. Zamiast odpisywać 20 razy dziennie na pytanie o cennik czy godziny, robi to bot, a Ty zajmujesz się pracą i domykaniem leadów.',
      },
    ],
  },
  {
    slug: 'bot-vs-chatgpt-na-stronie',
    title: 'Botiko vs ogólny ChatGPT na stronie',
    metaTitle: 'Botiko vs ogólny chatbot ChatGPT na stronie — różnice',
    metaDescription:
      'Porównanie bota Botiko z ogólnym chatbotem opartym o ChatGPT wklejonym na stronę: znajomość cennika, zbieranie leadów, szablony branżowe i ryzyko zmyślania.',
    h1: 'Botiko a ogólny chatbot ChatGPT na stronie',
    intro:
      'Ogólny model językowy wklejony na stronę potrafi rozmawiać, ale nie zna Twojego cennika ani terminów — i bywa, że zmyśla. Botiko odpowiada wyłącznie na podstawie wiedzy Twojej firmy i jest nastawione na zbieranie leadów. Oto różnice.',
    optionA: 'Bot Botiko',
    optionB: 'Ogólny ChatGPT na stronie',
    rows: [
      { feature: 'Odpowiada na podstawie Twojego cennika i FAQ', a: true, b: 'Tylko po ręcznej konfiguracji' },
      { feature: 'Ryzyko zmyślania odpowiedzi', a: 'Minimalne (odpowiada z bazy wiedzy)', b: 'Wyższe' },
      { feature: 'Zbieranie leadów (imię + telefon)', a: true, b: false },
      { feature: 'Gotowe szablony branżowe', a: true, b: false },
      { feature: 'Dashboard z historią rozmów i leadów', a: true, b: false },
      { feature: 'Zgodność z RODO, dane w UE', a: true, b: 'Zależy od konfiguracji' },
      { feature: 'Konfiguracja bez programisty', a: true, b: false },
    ],
    verdict:
      'Ogólny ChatGPT to świetny model do rozmowy, ale sam z siebie nie zna Twojej firmy i nie zbiera leadów. Botiko jest zbudowane pod konkretny cel: odpowiadać z Twojej wiedzy i zamieniać wiadomości w kontakty — bez budowania integracji od zera.',
    faqs: [
      {
        q: 'Czy Botiko używa ChatGPT?',
        a: 'Botiko korzysta z modeli językowych OpenAI, ale odpowiedzi są ograniczone do wiedzy Twojej firmy (cennik, FAQ, godziny) i opakowane w zabezpieczenia, które ograniczają zmyślanie. To różnica między „gołym” modelem a gotowym produktem.',
      },
      {
        q: 'Czy mogę po prostu wkleić ChatGPT na stronę za darmo?',
        a: 'Technicznie tak, ale stracisz znajomość cennika, zbieranie leadów, szablony branżowe i dashboard — i zwykle potrzebujesz programisty. Botiko daje to gotowe za 99 zł miesięcznie.',
      },
    ],
  },
  {
    slug: 'botiko-vs-tidio',
    title: 'Botiko vs Tidio — alternatywa dla firmy usługowej',
    metaTitle: 'Botiko vs Tidio — polska alternatywa dla firmy usługowej',
    metaDescription:
      'Szukasz alternatywy dla Tidio? Porównanie dla mikrofirmy usługowej: rynek docelowy, model cenowy, szablony branżowe, język i rezerwacje. Kiedy lepszy jest Tidio, a kiedy Botiko.',
    h1: 'Botiko a Tidio — co wybrać dla małej firmy usługowej',
    intro:
      'Tidio to dojrzałe, wielokanałowe narzędzie do live chatu i chatbotów, popularne zwłaszcza w e-commerce. Botiko jest węższe: zrobione pod polską mikrofirmę usługową — salon, gabinet, restaurację, warsztat. Poniżej uczciwe porównanie, żeby wybrać świadomie. Ceny Tidio zmieniają się i zależą od planu — aktualne sprawdzisz na tidio.com.',
    optionA: 'Botiko',
    optionB: 'Tidio',
    rows: [
      { feature: 'Rynek docelowy', a: 'Polskie mikrofirmy usługowe (beauty, SPA, gastro, auto)', b: 'Globalnie, mocno e-commerce/sklepy (np. Shopify)' },
      { feature: 'Gotowe szablony branżowe usługowe', a: true, b: 'Raczej ogólne / pod e-commerce' },
      { feature: 'Model cenowy', a: 'Jeden płaski plan 99 zł/mies (PLN), AI w cenie', b: 'Freemium + tiery liczone w USD; AI (Lyro) zwykle dodatkowo płatne' },
      { feature: 'Obsługa wielu kanałów (Messenger, Instagram, WhatsApp)', a: 'Skupienie na widgecie na stronie', b: true },
      { feature: 'Bot odpowiada z Twojej bazy wiedzy (cennik/FAQ)', a: true, b: 'Tak, w planach z AI' },
      { feature: 'Odsyła do rezerwacji (Booksy/Calendly) zamiast budować osobny system', a: true, b: 'Nastawione na e-commerce, nie na rezerwacje usługowe' },
      { feature: 'Instalacja na WordPress', a: 'Natywnie, przez wtyczkę', b: true },
      { feature: 'Wsparcie i komunikacja po polsku', a: true, b: 'Globalny dostawca, produkt anglojęzyczny first' },
    ],
    verdict:
      'Jeśli prowadzisz sklep internetowy i potrzebujesz obsługi na wielu kanałach oraz rozbudowanych przepływów automatyzacji — Tidio jest do tego stworzone i będzie mocniejsze. Botiko wybierz, gdy jesteś mikrofirmą usługową i zależy Ci na bocie po polsku, który odpowiada z Twojego cennika, ma gotowy szablon branżowy, odsyła do rezerwacji i kosztuje przewidywalne 99 zł miesięcznie z AI w cenie.',
    faqs: [
      {
        q: 'Czy Botiko jest tańsze od Tidio?',
        a: 'Botiko ma jeden płaski plan 99 zł miesięcznie (PLN) z AI w cenie. Tidio działa w modelu freemium z płatnymi tierami liczonymi w USD, gdzie funkcje AI bywają dodatkowo płatne, a koszt rośnie wraz z ruchem i liczbą operatorów. Co wyjdzie taniej, zależy od Twojego użycia — porównaj aktualny cennik Tidio na tidio.com z płaskim 99 zł.',
      },
      {
        q: 'Kiedy lepszym wyborem jest Tidio?',
        a: 'Gdy prowadzisz e-commerce, potrzebujesz obsługi na wielu kanałach (Messenger, Instagram, WhatsApp) i rozbudowanych automatyzacji. Tidio jest dojrzałe i bogate w funkcje — w tych scenariuszach wygrywa.',
      },
      {
        q: 'Czy łatwo przejść z Tidio na Botiko?',
        a: 'Tak. Konfiguracja Botiko to ok. 15 minut: wpisujesz cennik i FAQ, wklejasz kod lub instalujesz wtyczkę na WordPress. Nie migrujesz danych — bot startuje od Twojej bazy wiedzy.',
      },
    ],
  },
];

const BY_SLUG = new Map(COMPARISONS.map((c) => [c.slug, c]));

export function getComparison(slug: string): Comparison | undefined {
  return BY_SLUG.get(slug);
}

export function getAllComparisonSlugs(): { slug: string }[] {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}
