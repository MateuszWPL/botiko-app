import type { FaqEntry } from '@/lib/seo';

/**
 * Single source of truth for FAQ content. `HOME_FAQS` powers the homepage
 * accordion; the full set (HOME + EXTRA) powers the dedicated /faq page.
 *
 * Answers are written answer-first (the direct answer in the opening sentence)
 * because that is the format generative engines quote. Keep them factual and
 * specific, vague marketing copy does not get cited.
 */

export type FaqGroup = {
  heading: string;
  items: FaqEntry[];
};

export const HOME_FAQS: FaqEntry[] = [
  {
    q: 'Czy muszę umieć programować?',
    a: 'Nie, Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel, wklejasz cennik, godziny pracy i FAQ. Na koniec dostajesz jeden fragment kodu HTML, który wklejasz na stronę.',
  },
  {
    q: 'Czy Botiko działa na WordPress?',
    a: 'Tak. Botiko ma oficjalną wtyczkę w katalogu WordPress.org. Instalujesz ją z panelu WordPress (Wtyczki → Dodaj nową → wyszukaj „Botiko”), aktywujesz i łączysz stronę jednym kodem, bez edycji motywu ani pomocy programisty. Skrypt działa również na każdej innej stronie WWW.',
  },
  {
    q: 'Jak długo trwa wdrożenie?',
    a: 'W wielu przypadkach bota da się uruchomić w 15-20 minut: wybierasz branżę, uzupełniasz dane o firmie, wklejasz cennik/FAQ i gotowe. Nie potrzebujesz agencji ani programisty.',
  },
  {
    q: 'Co z RODO? Czy dane klientów są bezpieczne?',
    a: 'Tak, dane przechowujemy na serwerach w UE. Imię i telefon klienta są szyfrowane (AES-256). Możemy podpisać umowę powierzenia danych (DPA). Botiko nie udostępnia danych osobom trzecim.',
  },
  {
    q: 'Czy mogę zmieniać treści bota po wdrożeniu?',
    a: 'Tak, w każdej chwili. Panel pozwala edytować cennik, FAQ, godziny pracy i styl komunikacji. Zmiany wchodzą w życie natychmiast, bez żadnego ponownego wdrożenia.',
  },
  {
    q: 'Czy bot zastąpi mnie lub moich pracowników?',
    a: 'Nie, bot uzupełnia Twoją pracę, nie zastępuje jej. Odpowiada na powtarzające się pytania, zbiera dane od klientów i odsyła do rezerwacji. Ty dostajesz gotowego leada zamiast tracić czas na telefony.',
  },
  {
    q: 'Co jeśli bot nie zna odpowiedzi?',
    a: 'Bot informuje klienta, że przekaże pytanie do Ciebie, i zapisuje dane kontaktowe (imię, telefon). Dostajesz powiadomienie, klient jest już „podgrzany” i czeka na Twój kontakt.',
  },
  {
    q: 'Czy mogę zrezygnować w każdej chwili?',
    a: 'Tak. Brak umowy długoterminowej, subskrypcja jest miesięczna i możesz anulować kiedy chcesz. Opłata za bieżący miesiąc nie jest zwracana, ale dostęp pozostaje aktywny do końca okresu rozliczeniowego.',
  },
  {
    q: 'Czy bot działa na Facebooku i Instagramie?',
    a: 'Aktualnie widget embeddujemy na stronie WWW klienta. Integracja z Meta Messengerem i Instagram Direct jest w roadmapie, daj znać, że jesteś zainteresowany przez kontakt@botiko.pl.',
  },
  {
    q: 'Ile kosztuje Botiko i czy jest umowa?',
    a: 'Botiko kosztuje 99 zł miesięcznie. Pierwsze 14 dni są bezpłatne, bez karty kredytowej. Brak umowy długoterminowej, możesz anulować w dowolnym momencie z poziomu panelu.',
  },
];

/**
 * Extra questions sourced from "people also ask" intent, they target searches
 * and AI prompts we don't cover on the homepage. Grouped on the /faq page.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: 'Czym jest Botiko',
    items: [
      {
        q: 'Czym jest Botiko?',
        a: 'Botiko to bot obsługi klienta dla polskich firm usługowych. Odpowiada na pytania klientów 24/7 na podstawie Twojego cennika, godzin i FAQ, zbiera dane kontaktowe (leady) i odsyła do rezerwacji w Booksy lub Calendly. Kosztuje 99 zł miesięcznie.',
      },
      {
        q: 'Czym Botiko różni się od ChatGPT na stronie?',
        a: 'Botiko odpowiada wyłącznie na podstawie wiedzy Twojej firmy (cennik, usługi, godziny), więc nie zmyśla i nie odpowiada „jak encyklopedia”. Zwykły ChatGPT nie zna Twoich cen ani terminów. Botiko dodatkowo zbiera leady i ma gotowe szablony branżowe.',
      },
      {
        q: 'Dla jakich firm jest Botiko?',
        a: 'Dla mikro i małych firm usługowych: salonów beauty, gabinetów i SPA, restauracji, warsztatów samochodowych, a także fryzjerów, fizjoterapeutów, korepetytorów, fotografów i trenerów. Branżę wybierasz w onboardingu i dostajesz dopasowany szablon bota.',
      },
    ],
  },
  {
    heading: 'Cena i warunki',
    items: [
      {
        q: 'Ile kosztuje chatbot dla małej firmy w Polsce?',
        a: 'Botiko kosztuje 99 zł miesięcznie w jednym planie, bez ukrytych progów. Dla porównania jednorazowe wdrożenie chatbota przez agencję to zwykle kilka tysięcy złotych. Pierwsze 14 dni testujesz za darmo, bez karty.',
      },
      {
        q: 'Czy jest okres próbny?',
        a: 'Tak, 14 dni za darmo bez podawania karty kredytowej. Po okresie próbnym subskrypcja kosztuje 99 zł miesięcznie i możesz ją anulować w każdej chwili.',
      },
    ],
  },
  {
    heading: 'Wdrożenie i bezpieczeństwo',
    items: [
      {
        q: 'Jak zainstalować bota na stronie WordPress?',
        a: 'Zainstaluj oficjalną wtyczkę Botiko z katalogu WordPress.org (Wtyczki → Dodaj nową → wyszukaj „Botiko”), aktywuj ją i połącz stronę jednym kodem z panelu Botiko, bez edycji motywu. Nie chcesz wtyczki? Ten sam kod wkleisz też przez darmową wtyczkę WPCode w sekcji „Header”.',
      },
      {
        q: 'Czy bot zastąpi recepcjonistkę?',
        a: 'Nie zastąpi, ale przejmuje powtarzalną część jej pracy. Bot odpowiada na pytania o cennik, godziny i dostępność oraz zbiera kontakt po godzinach i podczas obsługi innych klientów. Człowiek zajmuje się rozmowami, które wymagają empatii i decyzji.',
      },
      {
        q: 'Gdzie przechowywane są dane klientów?',
        a: 'Na serwerach w Unii Europejskiej. Imię i telefon leada są szyfrowane algorytmem AES-256 w spoczynku. Botiko jest zgodne z RODO i może podpisać umowę powierzenia przetwarzania danych (DPA).',
      },
    ],
  },
];

/** Flat list of every FAQ (homepage + extra), used for the FAQPage schema. */
export const ALL_FAQS: FaqEntry[] = [
  ...HOME_FAQS,
  ...FAQ_GROUPS.flatMap((g) => g.items),
];
