# Botiko.pl — Baza wiedzy bota (content do wgrania)

> Dokument przeznaczony do wgrania jako baza wiedzy bota Botiko działającego na stronie botiko.pl.
> Każda sekcja oznaczona `###` to osobny "wpis" — możesz je wgrać pojedynczo w panelu (Baza wiedzy)
> albo wyeksportować całość do PDF i wgrać jako jeden plik.
> Ostatnia aktualizacja: 2026-05-14

---

## 0. Dane kontaktowe i podstawowe

- **Nazwa:** Botiko.pl
- **Strona:** https://botiko.pl
- **E-mail (ogólny / sprzedaż):** kontakt@botiko.pl
- **E-mail (wsparcie techniczne):** pomoc@botiko.pl
- **Telefon:** 695 683 971
- **Adres:** Białystok, woj. podlaskie, Polska
- **Bot na stronie:** dostępny 24/7
- **Wsparcie ludzkie (e-mail):** pon.–pt. 9:00–17:00, odpowiedź w ciągu 24 h w dni robocze
- **Cena:** 99 zł / miesiąc (jeden plan, bez umowy)
- **Trial:** 14 dni za darmo, bez podawania karty

---

## 1. Czym jest Botiko

### Czym jest Botiko
Botiko to polski bot obsługi klienta dla małych i mikro firm usługowych. Instalujesz go na swojej stronie internetowej jako okienko czatu — bot odpowiada na pytania klientów 24 godziny na dobę, 7 dni w tygodniu, także w nocy, w weekendy i święta. Bot zna Twój cennik, godziny pracy i odpowiedzi na najczęstsze pytania, bo to Ty go nimi "karmisz" w prostym panelu. Gdy klient jest zainteresowany, bot zbiera jego imię i numer telefonu, a Ty dostajesz gotowego leada do oddzwonienia.

### Po co mi bot Botiko
Najczęstszy problem małej firmy usługowej: klient pisze wiadomość o 22:00, nie ma kto odpowiedzieć, a rano klient zapisał się już do konkurencji. Drugi problem: telefon dzwoni w trakcie pracy z pytaniami o cennik i godziny — to rozprasza i kosztuje czas. Botiko rozwiązuje oba: odpowiada natychmiast o każdej porze i przejmuje powtarzalne pytania, żebyś Ty mógł skupić się na pracy. Jeden pozyskany klient (150–300 zł) zwraca cały miesięczny koszt bota.

### Czym Botiko NIE jest
Botiko nie jest systemem rezerwacji — bot nie blokuje terminów w kalendarzu. Zamiast tego odsyła klienta do Twojego narzędzia rezerwacji (Booksy, Fresha, Calendly) lub zbiera dane, żebyś oddzwonił. Botiko nie obsługuje płatności klientów końcowych. Bot nie zastępuje Ciebie ani pracowników — uzupełnia pracę, przejmując pytania, na które odpowiedź jest zawsze taka sama.

---

## 2. Jak to działa

### Jak uruchomić bota — 3 kroki
1. **Wybierasz branżę** — salon beauty, gabinet/SPA, restauracja, warsztat samochodowy albo "inna branża". Bot dostaje gotowy szablon wiedzy i styl komunikacji dopasowany do branży.
2. **Dodajesz wiedzę o firmie** — wklejasz cennik, godziny pracy, odpowiedzi na najczęstsze pytania. Bez programowania, w prostym panelu.
3. **Instalujesz widget na stronie** — kopiujesz jeden fragment kodu i wklejasz na stronę (na WordPress przez darmową wtyczkę WPCode, na innych stronach jako kod HTML). Bot zaczyna pracować i zbierać leady od razu.

### Ile trwa wdrożenie
W większości przypadków uruchomienie bota zajmuje 15–20 minut. Nie potrzebujesz programisty ani agencji. Cały proces przechodzisz przez kreator onboardingu krok po kroku.

### Czy muszę umieć programować
Nie. Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel — wklejasz cennik, godziny, FAQ. Na koniec dostajesz jeden fragment kodu, który wystarczy wkleić na stronę. Jeśli korzystasz z WordPressa, robisz to przez darmową wtyczkę, bez dotykania kodu motywu.

---

## 3. Funkcje

### Co potrafi bot Botiko
- Odpowiada na pytania klientów po polsku, 24/7, natychmiast.
- Zna Twój cennik, godziny otwarcia, ofertę i odpowiedzi na FAQ — tyle, ile mu dodasz w bazie wiedzy.
- Zbiera leady: gdy klient jest zainteresowany, bot prosi o imię i numer telefonu.
- Wysyła Ci e-mail z powiadomieniem o każdym nowym leadzie.
- Odsyła klienta do rezerwacji online (Booksy, Fresha, Calendly), jeśli podasz link.
- Działa na dialektach, skrótach i literówkach — rozumie naturalny język.
- Ma wbudowaną ochronę przed spamem, wulgaryzmami i próbami nadużycia.
- Gdy nie zna odpowiedzi — informuje klienta, że przekaże pytanie, i zbiera kontakt zamiast zmyślać.

### Panel (dashboard) — co w nim masz
- **Przegląd** — podsumowanie aktywności bota.
- **Leady** — lista zebranych kontaktów (imię, telefon, wiadomość, status, data); eksport do CSV.
- **Rozmowy** — pełna historia konwersacji bota z klientami.
- **Baza wiedzy** — tu dodajesz i edytujesz cennik, FAQ, godziny, oferty.
- **Instalacja** — kod widgetu do wklejenia na stronę + instrukcja dla WordPress.
- **Ustawienia** — powitanie bota, sugerowane pytania, styl komunikacji, dozwolone domeny.
- **Płatności** — status subskrypcji, faktury, zarządzanie planem.
- **Pomoc** — FAQ i kontakt do wsparcia.

### Widget na stronie — jak wygląda i działa
Widget to okienko czatu w rogu strony. Jest lekki (nie spowalnia strony), izolowany od stylów Twojej witryny (nie psuje wyglądu), a kolory dopasujesz do swojej marki. Historia rozmowy klienta jest pamiętana w obrębie jednej sesji w przeglądarce — znika po zamknięciu karty (celowo, dla prywatności). Bot odpowiada zawsze, niezależnie od ustawionych godzin otwarcia — godziny są informacją dla klienta, nie blokadą czatu.

### Zbieranie leadów — jak to działa
Gdy klient pyta o termin, cenę konkretnej usługi albo wyraźnie chce kontaktu, bot prosi o imię i numer telefonu. Dane trafiają do zakładki Leady w panelu, a Ty dostajesz e-mail z powiadomieniem. Lead jest "podgrzany" — klient już wie, czego chce, i czeka na Twój telefon. Numery telefonów i imiona są szyfrowane (AES-256-GCM).

---

## 4. Branże i szablony

### Dla jakich branż jest Botiko
Botiko ma gotowe szablony dla 4 głównych branż: **salony beauty** (manicure, rzęsy, brwi, fryzjer, kosmetyka), **gabinety zdrowia i SPA** (fizjoterapia, kosmetologia, stomatologia, masaż), **restauracje** (menu, alergeny, rezerwacje), **warsztaty samochodowe** (wyceny, terminy napraw). Dla każdej innej firmy usługowej — korepetytor, fotograf, coach, trener personalny, szkoła tańca, studio jogi, sklep lokalny — jest opcja "inna branża" z uniwersalnym, w pełni konfigurowalnym szablonem.

### Szablon "inna branża"
Jeśli Twoja firma nie pasuje do gotowych szablonów, wybierasz "inna branża". Dostajesz uniwersalny szablon, do którego wgrywasz własne FAQ i cennik oraz dostosowujesz styl komunikacji. Działa dla każdej firmy usługowej. Przy konfiguracji możesz liczyć na wsparcie z naszej strony.

---

## 5. Cennik i płatności

### Ile kosztuje Botiko
Botiko kosztuje **99 zł miesięcznie** — jeden plan, wszystko w środku, bez ukrytych kosztów. To około 3,30 zł dziennie. Jeden klient pozyskany przez bota w miesiącu zwraca cały koszt.

### Co jest w cenie 99 zł
- 1 bot AI odpowiadający 24/7 na Twojej stronie
- Do 1 000 rozmów z klientami miesięcznie
- Gotowy szablon branżowy (beauty, health, food, auto lub uniwersalny)
- Własna baza wiedzy: cennik, FAQ, godziny pracy
- Automatyczne zbieranie leadów (imię + telefon)
- E-mail z powiadomieniem o każdym nowym leadzie
- Dashboard z historią rozmów i leadów
- Integracja z WordPress
- Kolorowy widget dopasowany do Twojej marki
- Wsparcie e-mail z odpowiedzią w 24 h

### Trial — 14 dni za darmo
Pierwsze 14 dni są bezpłatne i **nie wymagają podania karty kredytowej**. Przez ten czas masz pełny dostęp do wszystkich funkcji. Po zakończeniu triala, jeśli chcesz kontynuować, podajesz dane karty i przechodzisz na plan 99 zł/mies.

### Czy jest umowa
Nie ma umowy długoterminowej. Subskrypcja jest miesięczna i możesz ją anulować w dowolnym momencie z poziomu panelu (zakładka Płatności). Po anulowaniu dostęp pozostaje aktywny do końca opłaconego okresu. Opłata za bieżący miesiąc nie jest zwracana.

### Jak płacę
Płatność kartą, obsługiwana przez Stripe (bezpieczny, międzynarodowy operator płatności). Po pierwszej płatności i przy każdej kolejnej dostajesz e-mail z potwierdzeniem i fakturą. Fakturami i metodą płatności zarządzasz w portalu klienta dostępnym z zakładki Płatności.

### Co jeśli płatność się nie powiedzie
Jeśli płatność karty się nie uda, bot nie jest wyłączany od razu — Stripe ponawia próbę przez kilka dni (okres karencji), a bot przez ten czas działa normalnie. Dostajesz e-mail z informacją. Bot zostaje wyłączony dopiero, gdy wszystkie próby pobrania płatności się nie powiodą.

### Co po przekroczeniu 1000 rozmów
W cenie masz 1 000 rozmów miesięcznie. Po przekroczeniu limitu nie blokujemy bota z dnia na dzień — skontaktuj się z nami, a zaproponujemy indywidualną wycenę dopasowaną do Twojego ruchu.

---

## 6. Instalacja i WordPress

### Czy Botiko działa na WordPress
Tak — Botiko jest natywnie zoptymalizowane pod WordPress, który obsługuje ok. 93% polskiego rynku stron. Instalacja przez darmową wtyczkę WPCode zajmuje ok. 5 minut, bez edycji motywu i bez programisty. Pracujemy też nad dedykowaną wtyczką Botiko do katalogu WordPress.org — żeby zapisać się na listę oczekujących, napisz na kontakt@botiko.pl.

### Czy Botiko działa na innych stronach
Tak. Skrypt widgetu to uniwersalny kod HTML, który działa na praktycznie każdej stronie WWW — wklejasz go przed zamykającym tagiem `</body>`. Oficjalne instrukcje krok po kroku przygotowaliśmy dla WordPressa i uniwersalnego HTML. Na platformach typu Webflow, Shopify, Wix, Squarespace czy PrestaShop skrypt działa technicznie, ale nie mamy dla nich dedykowanych instrukcji.

### Jak zainstalować widget
W panelu wejdź w zakładkę Instalacja, skopiuj kod widgetu i wklej go na stronę przed tagiem `</body>`. Na WordPress robisz to przez wtyczkę WPCode (kopiuj-wklej, bez kodu). Gdy chcesz, możesz ograniczyć w Ustawieniach domeny, na których widget ma działać — bot uruchomi się tylko na Twoich stronach.

### Czy mogę zmieniać treści bota po wdrożeniu
Tak, w każdej chwili. Panel pozwala edytować cennik, FAQ, godziny pracy i styl komunikacji. Zmiany wchodzą w życie natychmiast — bez ponownej instalacji czy wdrożenia.

---

## 7. Bezpieczeństwo i RODO

### Czy dane klientów są bezpieczne
Tak. Dane przechowujemy na serwerach w Unii Europejskiej. Imię i numer telefonu każdego leada są szyfrowane (AES-256-GCM) — nawet w naszej bazie nie są zapisane jawnym tekstem. Botiko nie udostępnia danych osobom trzecim.

### Botiko a RODO
Botiko działa zgodnie z RODO. Dane są hostowane w UE, szyfrowane i nie są sprzedawane ani przekazywane podmiotom trzecim. Możemy podpisać umowę powierzenia przetwarzania danych (DPA). W Ustawieniach masz prawo usunąć wszystkie dane jednym kliknięciem.

### Ochrona przed spamem i nadużyciami
Bot ma wbudowaną ochronę: filtruje próby wstrzyknięcia kodu (script/HTML injection), próby manipulacji bota (prompt injection), spam, wulgaryzmy (po polsku i angielsku) oraz wiadomości bez sensu. Możesz też ograniczyć domeny, na których działa widget, oraz obowiązują limity liczby zapytań na minutę.

---

## 8. Integracje

### Czy mogę zintegrować z Booksy / Fresha / Calendly
Tak. Dodaj link do swojego systemu rezerwacji w Bazie wiedzy lub w Ustawieniach bota. Gdy klient zapyta o termin, bot poda link i przekieruje do Twojego narzędzia. Bot sam nie rezerwuje terminów — oddaje tę część Twojemu systemowi albo zbiera dane do oddzwonienia.

### Czy bot działa na Facebooku i Instagramie
Obecnie widget instalujemy na stronie WWW. Integracja z Facebook Messengerem i Instagram Direct jest w planach rozwoju — jeśli jesteś zainteresowany, napisz na kontakt@botiko.pl, zbieramy zgłoszenia.

---

## 9. Wsparcie

### Jak uzyskać pomoc
Napisz na **pomoc@botiko.pl** — odpowiadamy w ciągu 24 godzin w dni robocze (pon.–pt. 9:00–17:00). Im więcej kontekstu podasz, tym szybciej pomożemy — zrzuty ekranu bardzo przyspieszają sprawę. W sprawach sprzedażowych i ogólnych pisz na kontakt@botiko.pl lub dzwoń: 695 683 971.

### Kiedy zobaczę pierwsze leady
Zazwyczaj w ciągu 2–3 dni od instalacji widgetu, jeśli strona ma ruch. Bot zaczyna działać od razu, ale leady pojawiają się wtedy, gdy klienci zostawiają kontakt. Warto dobrze uzupełnić Bazę wiedzy — im więcej bot wie, tym lepiej odpowiada i tym częściej klient zostawia numer.

### Co jeśli bot nie zna odpowiedzi
Bot nie zmyśla. Jeśli nie ma informacji w bazie wiedzy, mówi klientowi, że przekaże pytanie do Ciebie, i prosi o dane kontaktowe. Dostajesz powiadomienie, a klient jest już zainteresowany i czeka na kontakt.

---

## 10. Plany na przyszłość (roadmapa)

> Uwaga dla bota: o tych funkcjach mów wyłącznie jako o planach. Nie obiecuj terminów.

### Co planujecie dodać do Botiko
Botiko stale się rozwija. W planach mamy m.in.:
- **Dedykowaną wtyczkę Botiko do katalogu WordPress.org** — instalacja jednym kliknięciem.
- **Integrację z Facebook Messengerem i Instagram Direct** — bot obsłuży też wiadomości z social media.
- **Wyższe pakiety** — dla firm z większym ruchem niż 1 000 rozmów miesięcznie planujemy plany z wyższymi limitami i dodatkowymi funkcjami (np. więcej niż jeden bot, zaawansowana analityka).
Jeśli któraś z tych funkcji jest dla Ciebie ważna, napisz na kontakt@botiko.pl — zgłoszenia od klientów ustalają kolejność prac. Aktualnie dostępny jest jeden plan: 99 zł/mies.

### Czy będą droższe pakiety
Dziś Botiko ma jeden plan — 99 zł/mies z limitem 1 000 rozmów. W przyszłości planujemy wyższe pakiety dla firm z większym ruchem (wyższe limity, więcej botów, dodatkowa analityka). Jeśli już teraz przekraczasz limit, napisz na kontakt@botiko.pl — zrobimy indywidualną wycenę.

---

## 11. FAQ — pełna lista

### FAQ: Czy muszę umieć programować?
Nie. Botiko konfigurujesz przez prosty panel — wklejasz cennik, godziny, FAQ. Na koniec kopiujesz jeden fragment kodu na stronę. Na WordPress robisz to przez darmową wtyczkę, bez dotykania kodu.

### FAQ: Ile kosztuje Botiko i czy jest umowa?
99 zł miesięcznie. Pierwsze 14 dni za darmo, bez karty. Brak umowy długoterminowej — anulujesz kiedy chcesz z poziomu panelu.

### FAQ: Jak długo trwa wdrożenie?
Zwykle 15–20 minut: wybierasz branżę, uzupełniasz dane firmy, wklejasz cennik i FAQ, instalujesz widget. Bez agencji i programisty.

### FAQ: Czy Botiko działa na WordPress?
Tak, natywnie. Instalacja przez darmową wtyczkę WPCode zajmuje ok. 5 minut. Skrypt działa też na każdej innej stronie WWW.

### FAQ: Co z RODO i bezpieczeństwem danych?
Dane na serwerach w UE, imię i telefon leada szyfrowane AES-256. Możemy podpisać umowę powierzenia danych (DPA). Nie udostępniamy danych osobom trzecim.

### FAQ: Czy mogę zmieniać treści bota po wdrożeniu?
Tak, w każdej chwili i bez ponownego wdrożenia. Edytujesz cennik, FAQ, godziny i styl w panelu — zmiany działają natychmiast.

### FAQ: Czy bot zastąpi mnie lub pracowników?
Nie — bot uzupełnia pracę. Przejmuje powtarzalne pytania i zbiera leady. Ty dostajesz gotowego, zainteresowanego klienta zamiast tracić czas na telefony.

### FAQ: Co jeśli bot nie zna odpowiedzi?
Informuje klienta, że przekaże pytanie do Ciebie, i zapisuje jego kontakt. Dostajesz powiadomienie — klient czeka na Twój telefon.

### FAQ: Czy mogę zrezygnować w każdej chwili?
Tak. Subskrypcja miesięczna, bez umowy. Anulujesz w panelu. Dostęp działa do końca opłaconego okresu; opłata za bieżący miesiąc nie jest zwracana.

### FAQ: Czy bot działa na Facebooku i Instagramie?
Na razie widget działa na stronie WWW. Integracja z Messengerem i Instagram Direct jest w planach — zgłoszenia zbieramy na kontakt@botiko.pl.

### FAQ: Co po przekroczeniu 1000 rozmów miesięcznie?
Nie blokujemy bota z dnia na dzień. Skontaktuj się z nami — zaproponujemy indywidualną wycenę dopasowaną do ruchu.

### FAQ: Czy mogę zintegrować z Booksy / Fresha / Calendly?
Tak. Dodaj link do rezerwacji w Bazie wiedzy lub Ustawieniach. Bot poda go klientowi pytającemu o termin.

### FAQ: Czy bot działa po polsku?
Tak, w pełni. Wszystkie teksty, formularze i odpowiedzi są po polsku. Bot radzi sobie też ze skrótami, literówkami i potocznym językiem.

### FAQ: Jak eksportować leady?
W zakładce Leady kliknij "Eksportuj". CSV zawiera imię, telefon, wiadomość, status i datę — gotowe do Excela lub CRM.

### FAQ: Dla jakich branż jest Botiko?
Gotowe szablony: beauty, gabinety/SPA, restauracje, warsztaty. Dla każdej innej firmy usługowej jest uniwersalny szablon "inna branża".

### FAQ: Czy potrzebuję karty kredytowej na start?
Nie. 14-dniowy trial nie wymaga karty. Kartę podajesz dopiero, gdy chcesz kontynuować po triau.

### FAQ: Czy Botiko spowolni moją stronę?
Nie. Widget jest bardzo lekki i ładuje się niezależnie od reszty strony. Style bota są odizolowane, więc nie psują wyglądu witryny.

### FAQ: Gdzie jest Botiko / kto za tym stoi?
Botiko to polski produkt, siedziba w Białymstoku. Kontakt: kontakt@botiko.pl, tel. 695 683 971.

---

## 12. Rekomendowana konfiguracja bota na stronie botiko.pl

> To sekcja dla Ciebie (właściciela), nie dla wgrania do bazy wiedzy bota — wpisz to w Ustawieniach.

### Powitanie bota (greeting)
> "Cześć! Tu bot Botiko 👋 Pomogę Ci sprawdzić, czy Botiko pasuje do Twojej firmy — pytaj o cenę, wdrożenie, branże albo cokolwiek innego. A jeśli chcesz, od razu zostaw kontakt, to się odezwiemy."

### Sugerowane pytania na start (3–5 sztuk)
Najlepiej te, które realnie decydują o zakupie:
1. "Ile kosztuje Botiko?"
2. "Jak szybko uruchomię bota?"
3. "Czy działa na WordPress?"
4. "Czy potrzebuję karty na trial?"
5. "Dla jakich branż to jest?"

### Styl komunikacji
- Ton: bezpośredni, konkretny, ciepły — jak rozmowa z kimś, kto zna produkt, a nie ulotka.
- Słownictwo: mów **"bot"** i **"Botiko"** — nie "chatbot AI", nie "asystentka".
- Zawsze podawaj konkret (cena 99 zł, 14 dni, 15 minut) — nie owijaj.
- Przy pytaniach zakupowych delikatnie kieruj do triala lub do zostawienia kontaktu.
- Nie obiecuj funkcji z roadmapy jako dostępnych — mów o nich jako o planach.

### Eskalacja do człowieka
Gdy klient chce rozmowy z człowiekiem, ma nietypowe pytanie (faktury, indywidualna wycena, większy ruch niż 1000 rozmów, DPA) albo bot nie zna odpowiedzi — bot prosi o imię i numer telefonu i informuje, że odezwiemy się w 24 h w dni robocze. Alternatywnie podaje kontakt: kontakt@botiko.pl / 695 683 971.

### Link do rezerwacji / kontaktu
Botiko nie ma rezerwacji — zamiast linku do Booksy podaj w Ustawieniach link do strony rejestracji (https://botiko.pl/rejestracja) jako "miejsce, gdzie klient sam startuje trial".

---

## 13. Granice bota — czego bot NIE powinien robić

- Nie zmyślać cen, terminów ani funkcji — jeśli nie ma w bazie wiedzy, zbiera kontakt.
- Nie obiecywać funkcji z roadmapy jako dostępnych dziś.
- Nie podawać innej ceny niż 99 zł/mies (jeden plan) — wyższe pakiety to plany na przyszłość.
- Nie udzielać porad prawnych/podatkowych — przy pytaniach o RODO/DPA kierować do kontaktu.
- Nie obsługiwać rezerwacji ani płatności klientów końcowych — to nie jest funkcja Botiko.
- Przy wulgaryzmach/spamie — krótka, uprzejma odmowa i powrót do tematu.
