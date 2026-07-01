=== Botiko — bot obsługi klienta 24/7 ===
Contributors: botiko
Tags: chatbot, bot, obsługa klienta, customer service, lead generation
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Dodaj do swojej strony bota Botiko, który odpowiada klientom 24/7 i zbiera kontakty. Połącz stronę jednym kodem — bez edycji motywu.

== Description ==

Botiko to bot obsługi klienta (AI) dla polskich mikro i małych firm usługowych — salonów beauty, gabinetów i SPA, restauracji oraz warsztatów samochodowych. Bot odpowiada na pytania klientów 24/7 na podstawie wiedzy Twojej firmy (cennik, godziny, usługi), zbiera leady i odsyła do rezerwacji.

Ta wtyczka osadza widget Botiko na Twojej stronie WordPress bez edycji motywu i bez kodu.

**Najważniejsze:**

* **Połącz jednym kodem** — wklejasz kod połączenia z panelu Botiko, a wtyczka pobiera Twojego bota i autoryzuje domenę tej strony.
* **Status na żywo** — widzisz, czy bot jest połączony, czy domena jest autoryzowana i czy bot jest online.
* **Reguły wyświetlania** — pokaż bota na wszystkich stronach, albo z wyjątkami / tylko na wybranych.
* **Tryb testowy** — pokaż bota najpierw tylko zalogowanym administratorom.
* Bot nie pokazuje się w panelu administracyjnym WordPress.

Konto Botiko jest wymagane. Wygląd bota, godziny pracy i sugerowane pytania konfigurujesz w panelu Botiko (są wspólne dla każdej strony, na której działa bot).

== Installation ==

1. Zainstaluj i aktywuj wtyczkę (Wtyczki → Dodaj nową → wyszukaj „Botiko", albo wyślij ZIP).
2. W menu WordPress kliknij pozycję „Botiko".
3. W panelu Botiko (botiko.pl → Instalacja → WordPress) wygeneruj kod połączenia.
4. Wklej kod w polu „Połącz stronę" i kliknij przycisk. Gotowe — bot pojawi się na froncie strony.

Nie masz jeszcze konta? Załóż je na https://botiko.pl (14 dni za darmo).

== Frequently Asked Questions ==

= Czy potrzebuję konta Botiko? =
Tak. Wtyczka osadza Twojego istniejącego bota. Konto załóż na https://botiko.pl.

= Skąd wziąć kod połączenia? =
Z panelu Botiko: Instalacja → WordPress → „Generuj kod połączenia". Kod jest ważny 15 minut i jednorazowy.

= Czat się nie pojawia / nie odpowiada. =
Sprawdź na stronie ustawień wtyczki, czy status pokazuje „Domena autoryzowana". Jeśli nie — połącz stronę ponownie kodem albo dodaj domenę w panelu Botiko → Ustawienia → Domeny.

= Jak zmienić kolor bota lub godziny pracy? =
W panelu Botiko — te ustawienia są wspólne dla każdej strony, na której działa bot.

== Screenshots ==

1. Połączenie strony jednym kodem.
2. Status na żywo: połączono, domena autoryzowana, online.
3. Reguły wyświetlania i tryb testowy.
4. Bot na froncie strony.

== External services ==

Ta wtyczka łączy się z usługą Botiko, aby działał bot obsługi klienta:

* **Widget Botiko** — wtyczka ładuje skrypt widgetu z `https://widget.botiko.pl/embed.js`. Skrypt wyświetla okno czatu na froncie Twojej strony.
* **API Botiko** (`https://api.botiko.pl`) — wtyczka wywołuje publiczny endpoint konfiguracji (aby pokazać status bota) oraz endpoint parowania (aby przy łączeniu autoryzować domenę tej strony). Wysyłane dane: identyfikator bota oraz adres (domena) tej witryny. Wtyczka nie wysyła danych odwiedzających ani treści strony.

Korzystanie z usługi Botiko podlega regulaminowi (https://botiko.pl/regulamin) i polityce prywatności (https://botiko.pl/prywatnosc).

== Changelog ==

= 1.0.2 =
* Drobne poprawki UI: wyśrodkowane pola wyboru w regułach wyświetlania, poprawny link do panelu.

= 1.0.1 =
* Przeprojektowany panel: osobna pozycja „Botiko" w menu z logo, firmowy nagłówek, układ dwukolumnowy, ikony wektorowe, sekcja pomocy i ocen.

= 1.0.0 =
* Pierwsze wydanie: osadzanie widgetu, łączenie jednym kodem, status na żywo, reguły wyświetlania, tryb testowy.
