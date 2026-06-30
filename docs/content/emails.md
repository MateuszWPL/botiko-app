# Botiko.pl — Email Set

Kompletny zestaw maili do wysyłki z Resend. Każdy mail: subject (3 warianty do A/B), preheader, body plain text + zmienne do podstawienia.

Zmienne: `{{firstName}}`, `{{companyName}}`, `{{botName}}`, `{{dashboardUrl}}`, `{{trialEndsAt}}`, `{{leadsCount}}`, `{{conversationsCount}}`, `{{topQuestion}}`, `{{unsubscribeUrl}}`

---

## KATEGORIA 1: ONBOARDING TRIAL (7 maili w 14 dni)

---

### 1.1 — Natychmiast po rejestracji (D+0)

**Trigger:** `user.created` event  
**Cel:** potwierdzenie + skierowanie do onboarding wizard

**Subject A:** Witaj w Botiko — zacznijmy od 5 minut konfiguracji  
**Subject B:** Konto gotowe. Twój bot czeka na dane.  
**Subject C:** {{firstName}}, dokończmy konfigurację Botiko

**Preheader:** Masz 14 dni trial. Pokażemy Ci jak wycisnąć z niego maksimum.

**Body:**
```
Cześć {{firstName}},

Dzięki za rejestrację w Botiko. Twoje konto jest gotowe.

Masz 14 dni trial — bez karty, bez umowy. Żeby bot zaczął 
odpowiadać za Ciebie, musisz zrobić 3 rzeczy:

1. Uzupełnić dane firmy (2 min)
2. Dodać cennik, godziny pracy i FAQ do bazy wiedzy (5 min)
3. Wkleić kod na swoją stronę (3 min)

Dokończ konfigurację →
{{dashboardUrl}}/onboarding

Jak coś nie zadziała — odpisz na tego maila. Czytamy wszystko.

Zespół Botiko
botiko.pl
```

---

### 1.2 — 24h po rejestracji (D+1), jeśli onboarding niedokończony

**Trigger:** `user.created` + 24h + `onboarding.completed != true`  
**Cel:** przypomnienie, usunięcie tarcia

**Subject A:** Twój bot czeka — zostało 10 minut  
**Subject B:** {{firstName}}, utknąłeś na konfiguracji?  
**Subject C:** 3 kroki dzielą Cię od działającego bota

**Preheader:** Najczęstszy powód — baza wiedzy. Mamy na to sposób.

**Body:**
```
Cześć {{firstName}},

Widzimy, że konfiguracja bota utknęła. To normalne —
najczęstszy powód to etap "co wpisać do bazy wiedzy".

Krótka rada: zacznij od tego co masz pod ręką.

• Cennik — skopiuj jak jest, bot sam sobie poradzi
• Godziny pracy — jedna linijka wystarczy
• 5-10 najczęstszych pytań które dostajesz telefonicznie

Bot nie potrzebuje idealnie ułożonej wiedzy. Potrzebuje 
Twojej rzeczywistej — takiej jaką przekazujesz klientowi
gdy dzwoni.

Wróć do konfiguracji →
{{dashboardUrl}}/onboarding

Utknąłeś na konkretnym kroku? Odpisz na tego maila
i powiedz na czym — pomogę osobiście.

Zespół Botiko
```

---

### 1.3 — Pierwsza wiadomość bota (D+0 do D+14, trigger event-based)

**Trigger:** `bot.first_real_message` (pierwszy prawdziwy message, nie test z dashboardu)  
**Cel:** celebracja aktywacji + uspokojenie ("to naprawdę działa")

**Subject A:** 🎉 Twój bot odpowiedział pierwszemu klientowi  
**Subject B:** Pierwsza wiadomość. Bot odpowiedział w {{responseTime}}s.  
**Subject C:** {{firstName}}, Botiko właśnie zaczął pracę

**Preheader:** Zobacz jak wygląda rozmowa i co dalej z leadem.

**Body:**
```
Cześć {{firstName}},

Wydarzyło się. Twój bot właśnie odpowiedział prawdziwemu
klientowi na stronie {{companyName}}.

Czas odpowiedzi: {{responseTime}}s
Pytanie klienta: "{{firstQuestion}}"

Zobacz pełną rozmowę →
{{dashboardUrl}}/conversations

Co teraz?

• Jeśli bot odpowiedział dobrze — nic nie rób, pracuje.
• Jeśli widzisz że mógł lepiej — dodaj brakującą info 
  do bazy wiedzy. Bot uczy się od razu.
• Jeśli klient zostawił numer — masz leada w dashboardzie.

Trzymaj rękę na pulsie przez pierwszy tydzień. Potem 
bot robi swoje, Ty wracasz do pracy.

Zespół Botiko
```

---

### 1.4 — Dzień 3 trial (D+3)

**Trigger:** `user.created` + 72h  
**Cel:** edukacja — pokazać jak działa dashboard, gdzie sprawdzać leady

**Subject A:** Jak nie przegapić żadnego leada  
**Subject B:** 3 miejsca w dashboardzie do których zaglądasz codziennie  
**Subject C:** {{firstName}}, pokażemy Ci dashboard w 2 minuty

**Preheader:** Leady, konwersacje, baza wiedzy — co gdzie jest.

**Body:**
```
Cześć {{firstName}},

Jesteś w Botiko od 3 dni. Szybkie wprowadzenie co gdzie
w dashboardzie — żebyś nie tracił czasu na szukanie:

→ Leady (/leads)
  Każdy klient który zostawił numer. Status "NEW" = 
  jeszcze nie oddzwoniłeś. Zmień na "CONTACTED" gdy 
  oddzwonisz. Prosty CRM.

→ Konwersacje (/conversations)  
  Pełna historia rozmów. Podgląd tego o czym klienci 
  pytają. Świetne źródło pomysłów co jeszcze dodać 
  do bazy wiedzy.

→ Baza wiedzy (/knowledge)
  Tutaj edytujesz co bot wie. Zmiana jest aktywna 
  w ciągu minuty.

Masz pytanie? Odpisz — odpowiadamy w 24h, zwykle szybciej.

Zespół Botiko
```

---

### 1.5 — Dzień 7 trial — półmetek (D+7)

**Trigger:** `user.created` + 7 dni  
**Cel:** podsumowanie wartości + przypomnienie że zostało 7 dni

**Subject A:** Tydzień z Botiko — oto co się wydarzyło  
**Subject B:** {{leadsCount}} leady w tydzień. Warto?  
**Subject C:** Półmetek trialu — podsumowanie

**Preheader:** Liczby mówią więcej niż marketing.

**Body:**
```
Cześć {{firstName}},

Minął tydzień. Zostało 7 dni trialu. Krótkie podsumowanie:

• Rozmów: {{conversationsCount}}
• Leadów zebranych: {{leadsCount}}
• Najczęstsze pytanie klientów: "{{topQuestion}}"

Jeśli bot zebrał choć jednego leada którego udało Ci się
zamienić w klienta — subskrypcja już się zwróciła.

Zobacz statystyki →
{{dashboardUrl}}

Jeśli liczby Cię nie powalają — napisz dlaczego. Może:
• Bot nie dostał jeszcze ruchu (sprawdź czy widget działa)
• Baza wiedzy jest za uboga (klient pyta, bot nie wie)
• Widget jest schowany (zmień pozycję w ustawieniach)

Każdy z tych problemów rozwiązujemy w 10 minut. Odpisz.

Zespół Botiko
```

---

### 1.6 — Dzień 12 trial — konwersja (D+12)

**Trigger:** `user.created` + 12 dni + `subscription.active != true`  
**Cel:** konwersja na płacącego — decyzja przed końcem trialu

**Subject A:** 2 dni do końca trialu — co dalej?  
**Subject B:** {{firstName}}, zostały 2 dni. Zostajesz?  
**Subject C:** Trial kończy się {{trialEndsAt}}

**Preheader:** 99 zł/mies. Bez umowy. Anuluj kiedy chcesz.

**Body:**
```
Cześć {{firstName}},

Twój trial kończy się {{trialEndsAt}}.

Co zebrałeś w 12 dni:
• {{leadsCount}} leadów
• {{conversationsCount}} rozmów z klientami

Żeby bot dalej pracował — aktywuj subskrypcję. 
99 zł miesięcznie. Bez umowy. Anulujesz jednym 
kliknięciem.

Aktywuj plan →
{{dashboardUrl}}/billing

Masz wątpliwości? Odpisz na tego maila. Jeśli coś 
nie działa jak powinno — naprawimy to zanim zapłacisz.

Nie chcesz kontynuować? Nic nie musisz robić. 
Po {{trialEndsAt}} bot się wyłączy. Twoje dane 
(leady, historia rozmów) zostaną na koncie przez 30 
dni na wypadek gdybyś zmienił zdanie.

Zespół Botiko
```

---

### 1.7 — Dzień 14 — koniec trialu, brak płatności (D+14)

**Trigger:** `trial.ended` + `subscription.active != true`  
**Cel:** ostatnia szansa + godne pożegnanie (nie spam)

**Subject A:** Twój bot właśnie się wyłączył  
**Subject B:** Trial zakończony — co teraz z Twoimi danymi  
**Subject C:** {{firstName}}, co poszło nie tak?

**Preheader:** Dane są bezpieczne przez 30 dni. Możesz wrócić.

**Body:**
```
Cześć {{firstName}},

Trial zakończony. Bot przestał odpowiadać na stronie
{{companyName}}.

Twoje dane są bezpieczne:
• Leady i historia rozmów — zostają 30 dni
• Baza wiedzy — zostaje na koncie
• Po 30 dniach wszystko jest bezpowrotnie usuwane 
  (RODO)

Jeśli chcesz wrócić — wystarczy aktywować plan:
{{dashboardUrl}}/billing

Jeśli nie wracasz — pomóż nam zrozumieć dlaczego.
Odpisz jednym zdaniem:
• Za drogo
• Brak ruchu na stronie
• Bot nie działał jak oczekiwałem
• Inne: _______

Każda odpowiedź pomaga nam poprawić produkt. Dziękujemy
że daliście szansę.

Zespół Botiko
```

---

## KATEGORIA 2: TRANSAKCYJNE

---

### 2.1 — Potwierdzenie rejestracji (email verification)

**Trigger:** `auth.signup` — PRZED utworzeniem user.created event  
**Cel:** weryfikacja emaila

**Subject:** Potwierdź adres email — Botiko  
**Preheader:** Jedno kliknięcie dzieli Cię od konfiguracji bota.

**Body:**
```
Cześć,

Potwierdź że to Ty zakładasz konto w Botiko.

Potwierdź email →
{{verificationUrl}}

Link wygasa za 24h. Jeśli to nie Ty — zignoruj tego maila,
konto nie zostanie utworzone.

Zespół Botiko
botiko.pl
```

---

### 2.2 — Reset hasła

**Trigger:** `auth.password_reset_requested`  
**Cel:** link do resetu

**Subject:** Reset hasła — Botiko  
**Preheader:** Link wygasa za 1 godzinę.

**Body:**
```
Cześć,

Dostaliśmy prośbę o reset hasła do Twojego konta
w Botiko ({{userEmail}}).

Zresetuj hasło →
{{resetUrl}}

Link wygasa za 1 godzinę.

Jeśli to nie Ty prosiłeś o reset — zignoruj tego maila.
Twoje obecne hasło dalej działa.

Zespół Botiko
```

---

### 2.3 — Potwierdzenie płatności (pierwsza płatność po trialu)

**Trigger:** Stripe webhook `invoice.payment_succeeded` + pierwszy raz  
**Cel:** potwierdzenie + faktura

**Subject:** Płatność przyjęta. Botiko aktywne.  
**Preheader:** Faktura w załączniku. Następna płatność: {{nextPaymentDate}}.

**Body:**
```
Cześć {{firstName}},

Płatność 99 zł przyjęta. Plan STARTER aktywny.

Szczegóły:
• Kwota: 99 zł brutto
• Metoda: {{paymentMethod}} kończąca na {{last4}}
• Następna płatność: {{nextPaymentDate}}
• Faktura VAT: w załączniku PDF

Dashboard →
{{dashboardUrl}}

Anulować subskrypcję możesz zawsze w zakładce Billing.
Pieniądze nie są zwracane za bieżący miesiąc, ale bot
pracuje do końca opłaconego okresu.

Pytania do faktury? Odpisz — zmienimy dane lub prześlemy
korektę.

Zespół Botiko
```

---

### 2.4 — Faktura miesięczna (każda kolejna płatność)

**Trigger:** Stripe webhook `invoice.payment_succeeded` (nie pierwsza)  
**Cel:** sucha faktura, bez marketingu

**Subject:** Faktura VAT — Botiko {{month}}/{{year}}  
**Preheader:** Płatność 99 zł przyjęta automatycznie.

**Body:**
```
Cześć,

Faktura VAT za miesiąc {{month}}/{{year}} w załączniku.

• Kwota: 99 zł brutto
• Okres: {{periodStart}} — {{periodEnd}}
• Metoda płatności: {{paymentMethod}} *{{last4}}

Pobierz fakturę →
{{invoiceUrl}}

Zmiana danych do faktury: {{dashboardUrl}}/billing

Zespół Botiko
```

---

### 2.5 — Nieudana płatność (card declined)

**Trigger:** Stripe webhook `invoice.payment_failed`  
**Cel:** prosta instrukcja naprawy

**Subject:** Problem z płatnością — aktualizuj kartę  
**Preheader:** Bot dalej działa. Masz 3 dni na aktualizację.

**Body:**
```
Cześć {{firstName}},

Nasz system nie mógł pobrać 99 zł z Twojej karty
{{paymentMethod}} *{{last4}}.

Typowe powody:
• Karta wygasła
• Brak środków
• Bank zablokował płatność (bezpieczeństwo)

Bot dalej działa — mamy 3 dni na ponowną próbę.

Zaktualizuj kartę →
{{dashboardUrl}}/billing

Jeśli nie zaktualizujesz do {{retryDate}}, bot zostanie
wstrzymany. Wznowisz go w każdej chwili po opłaceniu.

Zespół Botiko
```

---

### 2.6 — Anulowanie subskrypcji (potwierdzenie)

**Trigger:** `subscription.canceled` przez usera  
**Cel:** potwierdzenie + open door

**Subject:** Subskrypcja anulowana — potwierdzenie  
**Preheader:** Bot pracuje do {{endDate}}. Potem stop.

**Body:**
```
Cześć {{firstName}},

Anulowałeś subskrypcję Botiko. Bez problemu.

Co dalej:
• Bot pracuje do {{endDate}} — za opłacony okres
• Po {{endDate}} widget przestanie odpowiadać
• Leady i dane zostają 30 dni — potem RODO wyczyszczenie
• Możesz reaktywować plan kiedy zechcesz — dane wrócą

Reaktywuj plan →
{{dashboardUrl}}/billing

Jedna prośba — odpisz na tego maila jednym słowem
dlaczego odchodzisz. To dla nas najważniejszy feedback,
lepszy niż wszystkie ankiety.

Zespół Botiko
```

---

## KATEGORIA 3: RETENTION (weekly digest)

---

### 3.1 — Weekly Digest (co poniedziałek rano)

**Trigger:** CRON co poniedziałek 8:00, dla wszystkich `subscription.active`  
**Cel:** pokazać wartość tygodnia + zachęcić do powrotu do dashboardu  
**Uwaga:** jeśli w tygodniu było 0 konwersacji — wyślij wariant B (patrz niżej)

**Subject A (są leady):** {{leadsCount}} leady w zeszłym tygodniu  
**Subject B (są rozmowy, brak leadów):** Tydzień w Botiko: {{conversationsCount}} rozmów  
**Subject C (cisza):** Twój bot miał spokojny tydzień — sprawdź dlaczego

**Preheader:** Top pytanie klientów: "{{topQuestion}}"

**Body — wariant standardowy (są leady):**
```
Cześć {{firstName}},

Podsumowanie tygodnia {{weekStart}} – {{weekEnd}}:

📊 LICZBY
• Leady: {{leadsCount}} nowych
• Rozmowy: {{conversationsCount}}
• Godzina szczytu: {{peakHour}}
• Odpowiedzi poza godzinami pracy: {{afterHoursCount}}

🔥 TOP 3 PYTANIA KLIENTÓW
1. "{{topQuestion1}}" — {{count1}}x
2. "{{topQuestion2}}" — {{count2}}x
3. "{{topQuestion3}}" — {{count3}}x

💡 SUGESTIA
{{topQuestion1}} pojawiło się {{count1}} razy.
Jeśli jeszcze nie ma pełnej odpowiedzi w bazie wiedzy — 
dodaj. Każde nieobsłużone pytanie to potencjalny lead 
który odchodzi.

Sprawdź leady →
{{dashboardUrl}}/leads

Zobacz rozmowy →
{{dashboardUrl}}/conversations

Zespół Botiko
```

**Body — wariant cisza (0 rozmów w tygodniu):**
```
Cześć {{firstName}},

Twój bot miał spokojny tydzień — 0 rozmów na stronie
{{companyName}}.

To może oznaczać 3 rzeczy:

1. Strona ma mało ruchu w tym tygodniu
   → sprawdź Google Analytics, to zewnętrzny czynnik

2. Widget jest schowany lub nie ładuje się
   → wejdź na stronę, sprawdź czy bąbelek jest widoczny
   → jeśli nie — zmień pozycję w ustawieniach widgetu

3. Klienci nie wiedzą że bot istnieje
   → dodaj na stronie sekcję "Pytania? Napisz do nas!" 
     ze strzałką na widget
   → wspomnij w social media że bot odpowiada 24/7

Test widgetu →
{{dashboardUrl}}/embed

Masz problem którego nie widzisz? Odpisz — zerkniemy 
razem na stronę.

Zespół Botiko
```

---

### 3.2 — Monthly Summary (pierwszego dnia miesiąca)

**Trigger:** CRON 1. każdego miesiąca  
**Cel:** większe podsumowanie z miesiąca + ROI

**Subject A:** Miesiąc w Botiko: {{totalLeads}} leadów  
**Subject B:** {{month}} podsumowany — oto Twoje wyniki  
**Subject C:** ROI za {{month}}: {{leadsCount}} leadów × Twoja wizyta

**Preheader:** Oblicz ile Ci się zwróciło.

**Body:**
```
Cześć {{firstName}},

Miesiąc {{month}} zamknięty. Podsumowanie:

📊 CAŁY MIESIĄC
• Leady: {{totalLeads}}
• Rozmowy: {{totalConversations}}
• Unikalne osoby: {{uniqueUsers}}
• Odpowiedzi 24/7 (poza godzinami pracy): {{afterHoursPercent}}%

💰 ROI
Koszt Botiko: 99 zł
Jeśli chociaż jeden lead z {{totalLeads}} zamienił się 
w klienta — miesiąc już Ci się zwrócił.

📈 PORÓWNANIE DO POPRZEDNIEGO MIESIĄCA
Leady: {{leadsChange}} ({{leadsChangePercent}})
Rozmowy: {{conversationsChange}} ({{conversationsChangePercent}})

🎯 DO POPRAWY W TYM MIESIĄCU
• Pytanie które pojawiało się często bez odpowiedzi:
  "{{mostMissedQuestion}}"
  → dodaj do bazy wiedzy
• Najczęstsza godzina zapytań: {{peakHour}}
  → upewnij się że pracownicy oddzwaniają do leadów 
    z tej godziny

Pełne statystyki →
{{dashboardUrl}}

Zespół Botiko
```

---

## KATEGORIA 4: CHURN PREVENTION

---

### 4.1 — Brak aktywacji po 48h od signup

**Trigger:** `user.created` + 48h + `bot.first_real_message != true`  
**Cel:** pomoc w instalacji widgetu (największa bariera)

**Subject A:** Widget na stronę — wkleisz go w 2 minuty?  
**Subject B:** {{firstName}}, pomóc z instalacją widgetu?  
**Subject C:** Jeden krok Cię dzieli od działającego bota

**Preheader:** Najczęstsza bariera. Mamy na to tutorial.

**Body:**
```
Cześć {{firstName}},

Zauważyliśmy że Twój bot jeszcze nie odebrał pierwszej
wiadomości. Najczęstszy powód — widget nie został 
wklejony na stronie.

Zrobienie tego zajmuje dosłownie 2 minuty:

WordPress (najczęściej):
1. WP Admin → Wygląd → Widżety lub Edytor motywu
2. Wklej kod w sekcji "stopka" (przed </body>)
3. Zapisz — gotowe

Shopify:
Online Store → Themes → Edit code → theme.liquid →
wklej przed </body>

Inne (GTM, Wix, Squarespace):
{{dashboardUrl}}/embed — tam masz tutorial per platforma

Nie jesteś techniczny? Odpisz na tego maila — wyślę
instrukcje dla Twojego konkretnego systemu. Naprawdę,
5 minut rozmowy i będziesz miał bota online.

Zespół Botiko
```

---

### 4.2 — Aktywny ale brak leadów po 10 dniach

**Trigger:** `user.created` + 10 dni + `leads.count == 0` + `conversations.count > 0`  
**Cel:** diagnoza dlaczego rozmowy nie zamieniają się w leady

**Subject A:** Bot rozmawia, ale nie zbiera leadów — zdiagnozujmy  
**Subject B:** {{conversationsCount}} rozmów, 0 leadów. Sprawdźmy dlaczego.  
**Subject C:** {{firstName}}, mam pomysł dlaczego leady nie wpadają

**Preheader:** 3 typowe powody. Każdy do naprawy w 5 minut.

**Body:**
```
Cześć {{firstName}},

Widget działa, klienci rozmawiają z botem ({{conversationsCount}}
rozmów), ale żadna rozmowa nie skończyła się zostawieniem
numeru.

To rozwiązywalne. 3 typowe powody:

1. BOT ODPOWIADA NA WSZYSTKO Z BAZY WIEDZY
   Klient dostaje odpowiedź i wychodzi zadowolony,
   ale bez zostawienia kontaktu.
   → Dodaj na końcu kluczowych odpowiedzi: "Chcesz się
     umówić? Zostaw numer — oddzwonimy."

2. LEAD FORM NIE POKAZUJE SIĘ
   Sprawdź w ustawieniach bota czy "Zbieraj leady" 
   jest ON i po ilu wymianach.
   → Rekomendacja: po 3-4 wymianach LUB przy intencji
     rezerwacji.

3. FORMULARZ ZA DŁUGI
   Jeśli prosisz o imię, nazwisko, email i telefon —
   ludzie odpadają.
   → Zostaw tylko imię i telefon. Resztę zbierzesz 
     przez telefon.

Zobacz rozmowy →
{{dashboardUrl}}/conversations

Chcesz żebym zerkną na Twoją konfigurację? Odpisz — 
zrobię szybki audyt.

Zespół Botiko
```

---

### 4.3 — Spadek aktywności (was aktywny, przestał)

**Trigger:** `subscription.active` + średnio 10+ rozmów/tydzień przez ostatnie 4 tygodnie, a ostatni tydzień = 0  
**Cel:** wyłapać problem techniczny ZANIM klient anuluje

**Subject A:** Coś poszło nie tak? Twój bot zamilkł.  
**Subject B:** {{companyName}} — widget przestał zbierać rozmowy  
**Subject C:** Zerkamy na Twoje konto — jest problem?

**Preheader:** Z 10+ rozmów/tydzień do 0. Sprawdźmy co się stało.

**Body:**
```
Cześć {{firstName}},

Coś jest nie tak. W ostatnich tygodniach Twój bot miał
średnio {{avgConversations}} rozmów/tydzień. Ten tydzień: 0.

Sprawdzamy nasze systemy — wszystko działa poprawnie.
Czyli problem jest na Twojej stronie.

3 rzeczy do sprawdzenia w 30 sekund:

1. Otwórz {{websiteUrl}} w przeglądarce
2. Czy widzisz bąbelek Botiko w rogu?
3. Kliknij — czy bot się otwiera?

Jeśli NIE widzisz widgetu — ktoś mógł zmienić kod strony
(redesign, aktualizacja motywu WordPress). Wklej 
widget ponownie:
{{dashboardUrl}}/embed

Jeśli widget jest, ale bot nie odpowiada — to nasza
sprawa, odpisz i zajmiemy się natychmiast.

Nie chcemy żebyś płacił za produkt który nie działa.
Każdy dzień bez bota to nasza wspólna strata.

Zespół Botiko
```

---

### 4.4 — Wczesna oznaka churnu — 2x nie zalogowany + brak aktywności (30+ dni)

**Trigger:** `subscription.active` + `last_login > 30 dni temu`  
**Cel:** reengagement przed anulowaniem

**Subject A:** {{firstName}}, wszystko OK z Botiko?  
**Subject B:** Nie logowałeś się do Botiko od miesiąca  
**Subject C:** Twój bot pracuje — Ty go już nie sprawdzasz

**Preheader:** Może coś poszło nie tak. Chętnie zerkniemy.

**Body:**
```
Cześć {{firstName}},

Nie logowałeś się do dashboardu Botiko od 30+ dni.
To nie jest zarzut — możesz mieć zaufanie że bot sobie
radzi. Ale chcemy sprawdzić czy na pewno wszystko gra.

Jeden z trzech scenariuszy:

A) Wszystko działa, nie potrzebujesz zaglądać — świetnie.
   Bot zebrał {{last30DaysLeads}} leadów w ostatnie 30 dni.
   Zobacz →{{dashboardUrl}}/leads

B) Jest jakiś problem, ale jeszcze nie znalazłeś czasu 
   żeby się zająć.
   → Odpisz co się dzieje. Naprawimy.

C) Rozważasz anulowanie, bo nie widzisz wartości.
   → Też odpisz. Może mamy rozwiązanie którego nie znasz
     (np. webhook do Slacka, export do CSV, integracja
     z Twoim CRM).

Nie chcemy Cię tracić bez rozmowy.

Zespół Botiko
```

---

## ZASADY TECHNICZNE IMPLEMENTACJI

### Kolejkowanie i throttling
- Max 1 mail marketingowy/dzień (onboarding + retention łącznie)
- Transakcyjne nie liczą się do limitu
- Jeśli user dostał dziś onboarding → weekly digest odłóż na jutro
- Unsubscribe dotyczy tylko kategorii 1, 3, 4 (transakcyjne wysyłamy zawsze, RODO)

### Opt-in / opt-out
- Każdy mail z kategorii 1, 3, 4 MUSI mieć link `{{unsubscribeUrl}}` w stopce
- Transakcyjne (2.x) — bez linku wypisz, bo to obowiązek umowny
- Stopka minimum: adres firmy + link do polityki prywatności

### Trackowanie w PostHog
Każdy mail wysyła event:
```
email.sent { type: "1.3", userId, variant: "A|B|C" }
email.opened { type: "1.3", userId, variant }
email.clicked { type: "1.3", userId, link, variant }
```
Potem funnel: sent → opened → clicked → conversion_event (np. `subscription.active`)

### A/B testing subject lines
PostHog feature flag per mail: `email_subject_{mailId}` z trzema wariantami.
Po 100 wysyłkach na wariant — wybierz zwycięzcę (najwyższy open rate).

### Template engine
Resend + React Email albo proste Handlebars. NIE pisz HTML od zera per mail.
Stwórz w `apps/api/src/email/templates/`:
- `base-layout.tsx` (header, footer, styl)
- `onboarding-welcome.tsx`, `onboarding-day1.tsx`, etc.
- Zmienne przez Handlebars lub JSX props

### Testowanie przed wysyłką
- Resend ma test mode — włącz w dev
- Mail-tester.com — sprawdź spam score (cel: 9+/10)
- Wyślij do siebie na Gmail, Outlook, Proton — sprawdź renderowanie
- Unsubscribe link MUSI działać w jednym kliku (bez loginowania)

### Priorytet implementacji
1. **Transakcyjne 2.1, 2.2, 2.3, 2.4** — bez tego nie możesz przyjmować płatności
2. **Onboarding 1.1, 1.2** — bez tego trial-to-activation leci
3. **Weekly digest 3.1** — retention driver #1
4. **Churn prevention 4.1, 4.2** — gdy będziesz mieć pierwszych 5+ klientów
5. Reszta — w miarę jak potrzebujesz

---

*Ostatnia aktualizacja: 2026-04-22*
