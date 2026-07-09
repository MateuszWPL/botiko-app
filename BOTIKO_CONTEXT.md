# BOTIKO.PL. KOMPLETNY KONTEKST PROJEKTU

> Plik przeznaczony dla Claude.ai Projects. Zawiera pełny obraz produktu, marki, marketingu i technikaliów. Używaj go jako bazę do tworzenia treści, reklam, grafik, blogów, kampanii i decyzji produktowych.

---

## 1. O PROJEKCIE. EXECUTIVE SUMMARY

**Botiko.pl** to polska platforma SaaS, która umożliwia mikro i małym firmom usługowym uruchomienie własnego bota AI na stronie WWW, bez programowania, w 15 minut.

Bot odpowiada na pytania klientów 24/7, zbiera dane kontaktowe (leady) i odsyła do rezerwacji. Właściciel firmy zarządza wszystkim przez prosty dashboard.

**Jedno zdanie:** Bot, który odpowiada za właściciela gdy ten pracuje, śpi lub po prostu nie może odebrać telefonu.

**Model biznesowy:** SaaS B2B, subskrypcja miesięczna. 99 zł/mies. Jeden plan. 14 dni trial bez karty kredytowej. Bez umowy.

**Cel MVP:** 15 płacących klientów w 6 miesięcy od launchu.

**Faza (2026-04-22):** Kod gotowy, testy przechodzą (297+ jednostkowych, 24 E2E), deploy infra w przygotowaniu.

---

## 2. CO BOTIKO ROBI. A CZEGO NIE ROBI

### Robi
- Odpowiada na pytania klientów 24/7 (cennik, godziny, lokalizacja, FAQ)
- Zbiera leady: imię i telefon klienta: właściciel dostaje powiadomienie email
- Odsyła do rezerwacji (link do Booksy/Calendly/Google: podany przez właściciela)
- Doradza na podstawie własnej bazy wiedzy firmy (usługi, promocje, przeciwwskazania)
- Reaguje na powitanie, pożegnanie, eskalację: naturalnie, po polsku
- Działa na każdej stronie WWW (WordPress, Shopify, Squarespace, Webflow, Wix, GTM)

### Nie robi
- NIE obsługuje rezerwacji bezpośrednio: odsyła do Booksy/Calendly
- NIE przyjmuje płatności
- NIE odpowiada na Facebooku/Instagramie (na razie: w roadmapie)
- NIE zastępuje ludzi: uzupełnia pracę, nie zastępuje jej

---

## 3. KLIENCI DOCELOWI

### Główny segment, 4 branże z gotowymi szablonami

| Branża | Przykłady | Kolor |
|---|---|---|
| **Beauty** | salon kosmetyczny, paznokcie, makijaż, brwi, rzęsy | #EC4899 (pink) |
| **Health/SPA** | gabinet SPA, wellness, masaż, fizjoterapeuta, yoga | #06B6D4 (cyan) |
| **Food** | restauracja, kawiarnia, catering, bistro, food truck | #F97316 (orange) |
| **Auto** | warsztat mechaniczny, blacharnia, auto-detailing | #64748B (slate) |

### Szerszy segment, każda mikrofirma usługowa

Fryzjer, barber, trener personalny, fotograf, kancelaria, szkoła językowa, studio tańca, ogrodnik, architekt krajobrazu, korepetytor, coach, terapeuta, każda firma, która:
- Ma stronę WWW i dostaje zapytania od klientów
- Pracuje sama lub z małym zespołem (1-10 osób)
- Nie ma dedykowanego działu obsługi klienta

### Profil idealnego klienta (ICP)

- Właściciel/ka mikrofirmy usługowej, 28-50 lat
- Firma w Polsce, 1-10 pracowników
- Dochód miesięczny firmy: 5 000-50 000 zł
- Ma stronę WWW (nawet prostą), jest na Google Maps
- Odczuwa problem: "tracę klientów bo nie mogę odebrać po 18:00"
- Nie jest techniczna: nie chce konfigurować API, nie rozumie programowania
- Decyzja zakupowa: samodzielna, szybka (<1 dzień), cena wrażliwa

### Czego NIE targetujemy

- Korporacje, firmy >50 pracowników
- Sklepy e-commerce (to nie ich problem)
- Firmy bez strony WWW
- Deweloperzy/programiści szukający API

---

## 4. KILLER FEATURES. USP

### 1. Odpowiada 24/7 bez żadnej konfiguracji zaawansowanej
Właściciel wkleja cennik jako zwykły tekst → bot zna ceny. Wkleja FAQ → bot odpowiada na te pytania. Zero JSON, zero promptów, zero programowania.

### 2. Baza wiedzy firmy. RAG pipeline
Bot odpowiada na podstawie dokumentów właściciela (nie losowych danych z internetu). Technologia: embeddingi OpenAI + pgvector similarity search. Wynik: odpowiedzi zgodne z realiami konkretnej firmy.

### 3. Lead capture z powiadomieniem email
Gdy bot nie zna odpowiedzi lub klient chce się umówić → zbiera imię i telefon → właściciel dostaje maila. Klient jest "podgrzany" i czeka na kontakt.

### 4. Gotowy szablon per branża
Onboarding zajmuje 15 minut. Wybierasz branżę → dostajesz gotowy ton komunikacji, sugerowane pytania startowe, domyślne guardrails. Nie zaczynasz od pustej kartki.

### 5. Widget <12KB, działa wszędzie
Shadow DOM, brak konfliktu ze stylami strony hosta, guard przed double-init. Wkleja się jako jeden tag HTML. Działa nawet przez Google Tag Manager bez dostepu do kodu.

### 6. Bezpieczeństwo i RODO
Szyfrowanie AES-256-GCM dla PII (imię, telefon) at-rest. Serwery EU. Gotowość do DPA. Brak cookies, brak trackingu klienta końcowego.

### 7. Session persistence z poszanowaniem prywatności
Historia rozmowy żyje w sessionStorage, ginie po zamknięciu zakładki. Celowo, klient nie jest śledzony między sesjami.

### 8. Pricing, który nie boli
99 zł/mies. = 3,30 zł/dzień. 1 pozyskany klient miesięcznie zwraca koszt subskrypcji przy średniej usłudze 150+ zł.

---

## 5. PRICING

| | STARTER |
|---|---|
| **Cena** | 99 zł/mies. |
| **Równoważnik dzienny** | 3,30 zł/dzień |
| **Trial** | 14 dni za darmo (bez karty) |
| **Umowa** | brak: anuluj kiedy chcesz |
| **Konwersacje** | do 1 000/mies. |
| **Boty** | 1 |
| **Leady** | nielimitowane |
| **Wsparcie** | email, odpowiedź w 24h |
| **RODO** | szyfrowanie AES-256, serwery UE, DPA na żądanie |

**Nie ma planów PRO/PREMIUM w MVP.** Jeden produkt, jedna cena, zero chaosu decyzyjnego.

---

## 6. STACK TECHNICZNY (BRIEF DLA KONTEKSTU)

- **Frontend dashboard:** Next.js 14 App Router + Tailwind v4 + Supabase Auth
- **Backend API:** NestJS + Prisma + Supabase PostgreSQL + pgvector
- **AI:** OpenAI `text-embedding-3-small` (embeddingi) + `gpt-4o-mini` (generacja odpowiedzi)
- **Widget:** Preact + Vite, <12KB gzip, Shadow DOM
- **Baza danych:** Supabase PostgreSQL + pgvector (similarity search próg 0.3)
- **Billing:** Stripe (webhooks z idempotency guard, audit trail BillingEvent)
- **Email:** Resend
- **Security:** Helmet, rate limity, DomainWhitelistGuard, UUID validation, AES-256-GCM PII encryption
- **CI:** GitHub Actions: 4 joby (API lint+test, Web lint+tsc, Widget size <12KB, Playwright E2E)
- **Deploy (planowany):** Railway (API) + Vercel (web) + Supabase Cloud

**Testy:** 297+ unit (Jest) + 24 E2E landing pages (Playwright) + Supertest E2E API

---

## 7. JĘZYK MARKI. TON KOMUNIKACJI

### Zasady bezwzględne

| Zamiast | Używaj |
|---|---|
| "chatbot AI" | **"bot"** |
| "asystentka" | **"bot"** (asystentka kojarzy się tylko z beauty) |
| "sztuczna inteligencja" | **"AI"** lub pomiń: nie chwalmy się technikaliami |
| "automatyzacja" | **"odpowiada za Ciebie"** |
| "rezerwacja przez bota" | **"odsyła do rezerwacji"** / **"zbiera leady"** |

### Ton głosu

- **Bezpośredni, konkretny**: liczby, ceny, czasy. Nie "szybko", ale "w 15 minut".
- **Polski, nie korporacyjny**: "Klientki piszą o 22:00. Bot odpowiada." Nie "Nasza platforma umożliwia automatyczną obsługę zapytań".
- **Empatyczny do problemu**: rozumiemy ból właściciela małej firmy, nie pouczamy.
- **Uczciwy**: bot nie "zastępuje człowieka", nie "rewolucjonizuje branży". Rozwiązuje konkretny problem.
- **Zwięzły**: zdania krótkie. Akapity max 3 zdania. Listy zamiast ścian tekstu.

### Kluczowe messagingi (gotowe do użycia)

**Główny ból:**
> "Klienci piszą o 22:00. Bot odpowiada za Ciebie."

**ROI:**
> "1 klientka w miesiącu zwraca cały koszt. Bot = 99 zł. Wizyta = 150-300 zł."

**Bezpieczeństwo zakupowe:**
> "14 dni za darmo. Bez karty. Bez umowy. Anuluj kiedy chcesz."

**Szybkość wdrożenia:**
> "Wklejasz kod na stronę i działa. 15 minut. Bez programisty."

**Dostępność 24/7:**
> "Większość decyzji o zakupie zapada po 18:00 i w weekendy. Bot jest tam, gdy Cię nie ma."

---

## 8. PAIN POINTS PER BRANŻA

### Salon Beauty

- Klientka pisze o 22:00, gdy salon od 2h zamknięty → nie widzi odpowiedzi → zapisuje się gdzie indziej
- Zabieg = telefon dzwoni, nie można odebrać → klientka myśli "zamknięte", odchodzi
- Te same pytania codziennie: "Ile kosztuje hybryda?", "Macie wolne w sobotę?", "Jak trafić?"
- Koszt okazji: 2 nieodebrane klientki/tydzień × 100 zł × 4 tyg. = 800 zł/mies. traconych przychodów

**Konwersja messagingu:**
> "Twój salon pracuje 10h dziennie. Klientki szukają 24h."

### Gabinet SPA / Wellness

- Zabieg wymaga ciszy absolutnej: telefon musi być wyłączony
- Klienci nie wiedzą, czego wybrać z oferty: bez pomocy odchodzą
- Pytania o przeciwwskazania (ciąża, alergie) spowalniają decyzję o rezerwacji
- Vouchery i pakiety "giną": klient nie rozumie różnic bez wyjaśnienia
- Nowe klientki odpadają na "za drogo" bez kontekstu wartości zabiegu

**Konwersja messagingu:**
> "Masaż gorącymi kamieniami nie może być przerwany telefonem. Bot nie przeszkadza."

### Restauracja

- Goście pytają o stolik o 23:00, gdy restauracja zamknięta, następnego dnia dzwonią do konkurencji
- Telefon dzwoni w środku serwisu → nieodebrane = stracona rezerwacja
- Pytania o menu (wegetariańskie, bezglutenowe, alergeny), bot zna odpowiedzi
- Eventy i catering: zapytania giną w skrzynce email
- Zmiany menu tracą się w social media: bot zawsze ma aktualne info

**Konwersja messagingu:**
> "Sobota, 13:30, serwis pełny, telefon nikt nie odbiera. Bot rezerwuje za Ciebie."

### Warsztat Mechaniczny

- Klient dzwoni gdy mechanik ma ręce w oleju: nie może odebrać
- Pytania o cenę "przed przyjazdem": bot podaje orientacyjną wycenę
- Sezon wymiany opon: telefon urywa się, każde nieodebrane = stracone zlecenie
- Wieczorowe pytania (po 18:00) giną do rana: klient jedzie do konkurencji rano
- Klient nie wie, co naprawdę potrzebuje: bot zadaje pytania diagnostyczne

**Konwersja messagingu:**
> "Ręce w oleju, telefon dzwoni. Bot odpowiada za Ciebie."

### Inne branże usługowe

**Fryzjer/Barber:** "Strzyżenie = cisza. Bot ustawia kolejkę."
**Fizjoterapeuta:** "Zabieg trwa 60 min. Pacjent pisze po 20:00."
**Trener personalny:** "Klient chce wiedzieć co jeść i kiedy trenować, cały dzień. Bot odpowiada, Ty trenujesz."
**Fotograf:** "Klienci pytają o terminy i pakiety o każdej porze, bot zna Twój cennik i kalendarz."
**Szkoła językowa:** "Rodzice pytają o wolne miejsca, poziomy, ceny, bot odpowiada 24/7."

---

## 9. PRZYKŁADOWE KONWERSACJE BOTA

### Beauty, cennik i lead capture
```
Klientka: Ile kosztuje manicure hybrydowy?

Bot: Manicure hybrydowy to 90 zł (ok. 75 min). W pakiecie z pedicure, 160 zł.
     Chcesz się zapisać? Zostaw imię i telefon, rano sprawdzę kalendarz
     i oddzwonię z wolnymi godzinami. Albo zarezerwuj od razu przez Booksy: [link]
```

### SPA, doradztwo + lead
```
Klient: Jaka różnica między masażem klasycznym a gorącymi kamieniami?

Bot: Masaż klasyczny (90 min, 220 zł): relaks i rozluźnienie mięśni, 
     świetny na codzienny stres. Gorące kamienie (75 min, 260 zł),
     ciepło bazaltowych kamieni działa głębiej, idealne przy bólach 
     pleców i karku. Masz konkretne dolegliwości? Chętnie doradzę 
     który będzie lepszy dla Ciebie.
```

### Restauracja, rezerwacja z pytaniem o alergie
```
Gość: Macie opcje bezglutenowe? Moja córka ma celiakię.

Bot: Tak, mamy dania z oznaczeniem bezglutenowym, a makaron i pizza 
     dostępne w wersji BG (+5 zł). Kucharz jest informowany o alergii.
     Chcesz zarezerwować stolik? Zostaw numer, oddzwonimy i uprzedzimy 
     kuchnię. Albo zarezerwuj przez [link].
```

### Warsztat, wycena + zapis
```
Klient: Ile kosztuje wymiana klocków? Mam Golfa VII 2015.

Bot: Przy Golfie VII wymiana klocków przód: 250-320 zł robocizna 
     + klocki 70-180 zł (zależnie od marki). Tarcze, jeśli wymagają 
     wymiany: osobno. Diagnozę robimy przy wizycie. Wjechać? 
     Zostaw numer albo zarezerwuj termin: [link]
```

---

## 10. ROI. ARGUMENTY FINANSOWE

### Kalkulator ROI (interaktywny na stronie)
- Suwak 1: Nowi klienci przez bota / miesiąc (1-20)
- Suwak 2: Średnia wartość wizyty / zamówienia (50-500 zł)
- Wynik: ROI multiplier, przychód, koszt bota (99 zł), zysk netto

### Liczby per branża

| Scenariusz | Przychód | Koszt bota | Zysk netto |
|---|---|---|---|
| Beauty: 2 klientki | 200 zł | 99 zł | +101 zł |
| Beauty: 4 klientki | 480 zł | 99 zł | +381 zł |
| Beauty: 8 klientek | 1 120 zł | 99 zł | +1 021 zł |
| SPA: 2 masaże | 520 zł | 99 zł | +421 zł |
| Restauracja: 1 event | 2 500 zł | 99 zł | +2 401 zł |
| Warsztat: 3 wizyty | 1 050 zł | 99 zł | +951 zł |

### Gotowe zdania do reklam
> "1 klientka miesięcznie zwraca koszt. Reszta to zysk."
> "Bot kosztuje 3,30 zł dziennie. Nieodebrane zlecenie, 300 zł."
> "Ile kosztuje Cię brak odpowiedzi o 22:00?"

---

## 11. IDENTYFIKACJA WIZUALNA

### Paleta barw

| Kolor | Hex | Zastosowanie |
|---|---|---|
| **Brand** | `#6366F1` | główny akcent, przyciski CTA, logo |
| **Brand Dark** | `#4338CA` | hover stany, nagłówki dark |
| **Brand Soft** | `#EEF2FF` | tła sekcji, karty, chip |
| **Accent Green** | `#10B981` | sukces, "online", pozytywne wskaźniki |
| **Warning** | `#F59E0B` | ostrzeżenia, trial countdown |
| **Text** | `#0F172A` | treść główna |
| **Background** | `#F8FAFC` | tło strony |
| **Beauty** | `#EC4899` | sekcje beauty, ikony branżowe |
| **Health/SPA** | `#06B6D4` | sekcje zdrowia/SPA |
| **Food** | `#F97316` | sekcje gastronomii |
| **Auto** | `#64748B` | sekcje automotive |
| **Other** | `#8B5CF6` | sekcje innych branż |

### Styl wizualny

- **Minimalistyczny, profesjonalny**: brak nadmiaru elementów dekoracyjnych
- **Ikony:** wyłącznie Lucide SVG: zero emoji w interfejsach
- **Fonty:** systemowe / Inter: czytelność ponad oryginalność
- **Zdjęcia/ilustracje:** realistyczne sytuacje z życia małej firmy (nie stock fotki korporacyjne)
- **Widget:** zaokrąglony, ciemna ramka czatu z bąbelkami, pulse indicator "Online 24/7"
- **Dashboard:** jasne tło (#F8FAFC), karty z cieniem, tabele danych czytelne

### Wytyczne do promptów graficznych (AI image generation)

**Styl ogólny Botiko:**
```
Polish small service business, professional and warm, minimalist UI mockup, 
indigo #6366F1 accent color, clean white background, no stock photo vibes,
authentic real-world setting, mobile-friendly design elements
```

**Grafika social media, beauty:**
```
Polish beauty salon owner at work, salon closed at 10pm, phone screen showing 
chat notification, warm pink #EC4899 and indigo #6366F1 color palette, 
modern minimalist style, text overlay space on right third, 
9:16 aspect ratio for Instagram Stories
```

**Grafika social media, warsztat:**
```
Polish auto mechanic workshop, mechanic with oil-covered hands, 
phone on workbench showing chat message, slate gray #64748B and 
indigo #6366F1 palette, authentic workshop background, 
dramatic lighting, text overlay space, 1:1 square crop
```

**Grafika dashboard/product:**
```
Clean SaaS dashboard mockup, dark sidebar with indigo #6366F1, 
chat conversation list, lead management table, Polish language UI,
flat design, laptop or desktop view, tech but accessible feel
```

**Grafika hero landing page:**
```
Split screen: left side shows small business owner sleeping peacefully at night, 
right side shows phone screen with active bot conversation at 22:00,
indigo gradient background, Polish text overlays, modern flat illustration style,
wide 16:9 landscape format
```

---

## 12. GOOGLE ADS. FRAMEWORK

### Typ kampanii: Search

**Główne słowa kluczowe (match: phrase/broad)**
```
bot obsługi klienta dla salonu
chatbot dla małej firmy
automatyczna odpowiedź na zapytania klientów
bot na stronę salon kosmetyczny
bot zbierający leady
obsługa klienta 24/7 mała firma
bot wordpress [branża]
chatbot bez programowania polska
```

**Negatywne słowa kluczowe**
```
darmowy, open source, budowanie chatbota, kod źródłowy,
API chatbot, developer, GPT API, korporacja, enterprise,
rezerwacje online (jeśli szukają systemu rezerwacji, nie bota FAQ)
```

### Nagłówki gotowe do użycia (max 30 znaków)

```
Bot na stronę: 99 zł/mies.
Odpowiada za Ciebie 24/7
14 dni za darmo, bez umowy
Gotowy szablon: beauty/SPA/food
Zbiera leady gdy śpisz
Wdrożenie w 15 minut
Klienci piszą o 22:00: bot jest
Bez programowania. Bez umowy.
1 klient zwraca koszt subskrypcji
Bot dla salonu / restauracji / warsztatu
```

### Opisy gotowe do użycia (max 90 znaków)

```
Klienci piszą gdy nie możesz odebrać. Bot odpowiada, zbiera leady, odsyła do Booksy.
Gotowy szablon dla Twojej branży. Wklej kod na stronę i działa. Bez programisty.
14 dni za darmo, bez karty. 1 klientka miesięcznie zwraca cały koszt 99 zł.
Bot AI na Twoją stronę. Odpowiada 24/7, zbiera imię i telefon klienta. RODO OK.
Zamiast tracić klientów po 18:00: bot przejmuje obsługę. Sprawdź 2 tygodnie free.
```

### Struktura grup reklam

| Grupa | Intent | Dopasowanie |
|---|---|---|
| Brand | "botiko" | exact |
| Problem-aware beauty | "bot dla salonu kosmetycznego" | phrase |
| Problem-aware auto | "bot dla warsztatu" | phrase |
| Problem-aware restauracja | "bot dla restauracji" | phrase |
| Solution-aware | "chatbot mała firma bez programowania" | broad |
| Competitor | konkurencja (jeśli pojawi się) | exact |

### Landing page per grupę reklam
- Beauty → `/dla/salon-beauty`
- SPA → `/dla/gabinet-spa`
- Restauracja → `/dla/restauracja`
- Warsztat → `/dla/warsztat-mechaniczny`
- Generyczny → `/dla/inna` lub `/`

### Stawki i budżet (orientacyjnie na start)
- CPC polskie frazy branżowe: 0.50-2.00 zł
- Dzienny budżet start: 30-50 zł/dzień
- Target CPA: <150 zł za płacącego klienta (1,5× MRR)
- Mierz: trial signup → aktywacja karty → płatność miesiąc 2

---

## 13. FACEBOOK / INSTAGRAM ADS. FRAMEWORK

### Grupy docelowe (targeting)

**Custom audiences:**
- Odwiedzający stronę botiko.pl (retargeting)
- Lista emaili (trial users, kontakty)
- Lookalike 1-2% od powyższych

**Cold targeting. Zainteresowania:**
```
Właściciele małych firm PL + zainteresowania:
[Salon kosmetyczny | Fryzjerstwo | SPA | Restauracja | Warsztat samochodowy]
+ [Prowadzenie firmy | Booking.com | Booksy | GetResponse | Wix | WordPress]
Lokalizacja: Polska
Wiek: 25-55
```

**Wykluczenia:**
```
Pracownicy korporacji (stanowiska: manager, director > 50 prac.)
Deweloperzy, programiści
Studenci
```

### Formaty reklamowe

**1. Facebook/Instagram Feed. Awareness/Consideration**
Format: 1:1 lub 4:5 grafika z tekstem
Budżet: 20-40 zł/dzień
Cel: Traffic / Lead Generation

**2. Instagram Stories / Reels. Upper Funnel**
Format: 9:16 wideo lub animacja
Czas: 15-30 sekund
Cel: Reach / Brand Awareness

**3. Facebook Lead Ads. Konwersja**
Format: Formularz w obrębie Facebooka
Cel: bezpośrednie trial signupy bez wychodzenia z FB

---

### Gotowe copy. Facebook Ads

**Hook #1. Problem (Beauty)**
```
Headline: Klientka napisała o 22:15. Nikt nie odpowiedział.
Body:     Twój salon jest zamknięty. Ale klientki nie wiedzą kiedy pytać.
          Bot Botiko odpowiada za Ciebie: o każdej porze.
          Zbiera imię i telefon. Rano masz gotowego leada.
          
          14 dni za darmo. Bez karty. Bez umowy.
          
CTA: Wypróbuj za darmo
URL: botiko.pl/dla/salon-beauty
```

**Hook #2. Problem (Warsztat)**
```
Headline: Ręce w oleju. Telefon dzwoni. Znowu nieodebrane.
Body:     Każde nieodebrane połączenie = potencjalne zlecenie, 
          które jedzie do konkurencji.
          
          Bot Botiko odpowiada na pytania klientów 24/7,
          ceny, terminy, co naprawić. Zbiera dane kontaktowe.
          Ty oddzwaniasz gdy możesz.
          
          Sprawdź 14 dni za darmo →
CTA: Zacznij za darmo
URL: botiko.pl/dla/warsztat-mechaniczny
```

**Hook #3. Solution (Generyczny)**
```
Headline: Bot na Twoją stronę. 15 minut. 99 zł/mies.
Body:     Nie potrzebujesz programisty.
          Nie potrzebujesz umowy.
          Potrzebujesz tylko strony WWW i 15 minut.
          
          Botiko = bot, który odpowiada na pytania klientów,
          zbiera leady i odsyła do rezerwacji.
          
          Wypróbuj 14 dni za darmo: bez karty kredytowej.
CTA: Wypróbuj za darmo
URL: botiko.pl
```

**Hook #4. Social Proof / ROI**
```
Headline: Ile tracisz nie odpowiadając po 18:00?
Body:     Klientka napisała w środę o 21:47.
          Dostała odpowiedź w 1,2 sekundy.
          W czwartek rano była już w kalendarzu.
          
          Bot Botiko. 99 zł miesięcznie.
          1 klientka w miesiącu zwraca cały koszt.
          
CTA: Sprawdź kalkulator ROI
URL: botiko.pl/#roi
```

**Hook #5. Retargeting (odwiedzający stronę)**
```
Headline: Jeszcze się wahasz? Rozumiemy.
Body:     14 dni za darmo. Bez podawania karty.
          Wdrożenie zajmuje 15 minut.
          Jak nie spodoba: anuluj jednym kliknięciem.
          
          Tysiące mikrofirm traci klientów po 18:00.
          Czy Twoja też musi?
CTA: Zacznij teraz: 14 dni free
URL: botiko.pl
```

### Video script, 30 sekund (Reels/Stories)

```
[0-3s] HOOK: "Napisała o 22:15. Nikt nie odebrał." [tekst na czarnym tle]
[3-8s] PROBLEM: Screen telefonu: klientka pisze, cisza, wychodzi
[8-15s] ROZWIĄZANIE: Bot odpowiada w 1,2 sekundy, zbiera dane, klientka zadowolona
[15-22s] HOW IT WORKS: 3 klatki: dashboard → kopiujesz kod → działa na stronie
[22-27s] PRICING: "99 zł/mies. 14 dni za darmo. Bez umowy."
[27-30s] CTA: "botiko.pl, wypróbuj za darmo"
```

---

## 14. CONTENT MARKETING. BLOG

### Zasady pisania na blogu Botiko

- Artykuły PL, dla właściciela małej firmy (nie dla marketera)
- Ton: pomocny, bez żargonu, konkretny
- Długość: 800-1500 słów (czytelność > SEO)
- Zawsze konkretny przykład z życia małej firmy
- CTA na końcu artykułu: naturalny, nie nachalny

### Pomysły na artykuły (posortowane priorytetowo)

**Pillarowe (SEO)**
1. `Jak uruchomić bota na stronie WordPress bez programowania [2026]`
2. `Ile traci salon kosmetyczny nie odpowiadając na wiadomości po 18:00`
3. `Bot obsługi klienta dla małej firmy: co potrafi, czego nie, ile kosztuje`
4. `Jak zbierać leady ze strony WWW automatycznie: poradnik dla mikrofirm`
5. `Booksy vs bot na stronie: czym się różnią i kiedy używać obu`

**Branżowe (konwersja)**
6. `Bot dla salonu kosmetycznego: konfiguracja krok po kroku`
7. `Restauracja i chatbot: jak odpowiadać na rezerwacje 24/7`
8. `Warsztat samochodowy i bot: pytania o ceny i terminy bez telefonu`
9. `SPA i gabinet wellness: jak nie przerywać zabiegu przez zapytania klientów`
10. `Fryzjer z botem: czy to ma sens dla 1-osobowej firmy?`

**Edukacyjne (trust building)**
11. `RODO a chatbot na stronie: co musisz wiedzieć jako właściciel`
12. `Czym różni się bot AI od zwykłego chatbota skryptowego`
13. `Jak pisać treści do bazy wiedzy bota: 5 zasad`
14. `Czy bot zastąpi obsługę klienta? Nie: i dlaczego to dobrze`
15. `Jak mierzyć efekty bota na stronie firmy usługowej`

### Struktura artykułu (template)

```
H1: [Konkretny problem/pytanie]: [Branża/target]
Intro: 2-3 zdania identyfikujące ból czytelnika
[Problem section] H2: Skala problemu + realne koszty
[Solution section] H2: Jak bot rozwiązuje ten problem (konkretnie)
[How to] H2: Kroki, screenshots z dashboardu
[Results] H2: Co się dzieje po wdrożeniu (lead flow, czas odpowiedzi)
[FAQ] H2: 3-5 pytań i odpowiedzi
[CTA]: "Wypróbuj Botiko 14 dni za darmo" + link
```

---

## 15. SOCIAL MEDIA. GOTOWE POSTY

### LinkedIn, format dla właścicieli firm (B2B)

**Post #1. Problem + liczba**
```
Twój salon jest zamknięty o 22:00.
Klientka pisze właśnie teraz.

Jutro rano sprawdzi konkurencję.

---

Większość decyzji o zakupie usług piękności 
zapada po 18:00 i w weekendy.

Bot Botiko odpowiada w 1,2 sekundy: o każdej porze.
Zbiera imię i telefon. Rano masz gotowego leada.

99 zł miesięcznie. 14 dni za darmo.

→ botiko.pl
```

**Post #2. Mini case study (format)**
```
Środa, 21:47.

Klientka: "Ile kosztuje hybryda z żelem?"
Bot: "Manicure hybrydowy to 90 zł (75 min). 
      Chcesz się zapisać? Zostaw imię i telefon."

Czwartek, 8:15.
Właścicielka salonu otwiera dashboard.
Widzi 2 nowe leady z nocy.

Taki jest Botiko.
14 dni za darmo na botiko.pl
```

**Post #3. Edukacja (bez sprzedaży)**
```
3 pytania, których klienci NIE zadają w godzinach pracy:

1. "Ile kosztuje...?" (piszą po 20:00)
2. "Macie wolne w...?" (piszą w weekendy)  
3. "Jak trafić?" (piszą gdy jesteś na zabiegu)

Twoja strona może odpowiadać na wszystkie 3.
24 godziny na dobę.

---

Jeśli chcesz wiedzieć jak: napisz w komentarzu
lub sprawdź botiko.pl
```

### Instagram, format wizualny

**Post kafelkowy, 1:1**
```
Grafika: ciemne tło, duży biały tekst
Tekst na grafice: "22:00 → klientka pisze → bot odpowiada"
Caption: Twój salon jest zamknięty. Bot nie. 
         14 dni za darmo bez karty: link w bio.
Hashtagi: #salon #salonkosmetyczny #botdlafirmy #malaprzedsiebiorczos
```

**Carousel, 5 slajdów**
```
Slajd 1: "5 pytań, na które Twój bot odpowie zamiast Ciebie"
Slajd 2: "Ile kosztuje hybryda?" → "90 zł, mamy wolne w piątek..."
Slajd 3: "Macie wolne jutro?" → "Sprawdzę kalendarz, zostaw numer..."
Slajd 4: "Jak trafić?" → "Jesteśmy na [adres], parking od tyłu..."
Slajd 5: "Zacznij 14 dni za darmo → botiko.pl"
```

### Facebook, grupy tematyczne (organic)

Grupy gdzie można wklejać wartościowe posty (nie spamować):
- Grupy właścicieliek salonów kosmetycznych PL
- Grupy właścicieli restauracji PL
- Grupy małych firm / przedsiębiorczość PL
- Grupy "Własna działalność 2026"

Format organicznego posta w grupie:
```
Cześć, prowadzę [firmę]. Napotkałam na problem [X].
Rozwiązałam go przez [wdrożenie bota].
Oto co się zmieniło: [konkret].
Jeśli chcesz wiedzieć więcej: chętnie podzielę się.
[BEZ linka: link w komentarzu jeśli zapytają]
```

---

## 16. EMAIL MARKETING

### Sekwencja onboarding (po rejestracji trial)

**Email 1, od razu po rejestracji**
```
Temat: Twój bot Botiko jest prawie gotowy ⚡
Treść: Cześć [Imię],
       
       Rejestracja gotowa. Zostały 2 kroki:
       1. Uzupełnij dane firmy i cennik (5 min)
       2. Wklej kod na stronę (2 min)
       
       Masz 14 dni: ale im szybciej uruchomisz, 
       tym szybciej zaczniesz zbierać leady.
       
       [Przycisk: Skonfiguruj bota →]
```

**Email 2, po 2 dniach (jeśli nie skonfigurował)**
```
Temat: Nie zdążyłeś/aś skonfigurować bota?
Treść: Rozumiemy: prowadzenie firmy to mało czasu.
       
       Konfiguracja zajmuje dosłownie 15 minut.
       Mamy tutorial wideo (7 min) i jesteśmy 
       dostępni na email.
       
       [Przycisk: Wróć do konfiguracji →]
```

**Email 3, dzień 7 trialu**
```
Temat: Połowa trialu za Tobą: co udało się osiągnąć?
Treść: Minął tydzień. Jeśli bot już działa,
       sprawdź ile leadów zebrał.
       
       Jeśli jeszcze nie: masz 7 dni. Pomożemy.
       Odpisz na tego maila lub napisz na kontakt@botiko.pl
       
       [Przycisk: Otwórz dashboard →]
```

**Email 4, dzień 12 (conversion email)**
```
Temat: 2 dni do końca trialu: co dalej?
Treść: Twój trial kończy się pojutrze.
       
       Jeśli bot zebrał choć 1 lead,
       subskrypcja jest już opłacona.
       
       99 zł/mies. Bez umowy. Anuluj kiedy chcesz.
       
       [Przycisk: Aktywuj plan →]
```

---

## 17. MESSAGING PER ETAP LEJKA

### Awareness (pierwszy kontakt)
> "Klienci piszą gdy Cię nie ma. Bot odpowiada za Ciebie."
Kanały: Google Ads, FB Ads, organic social, blog SEO

### Consideration (rozważa opcje)
> "14 dni za darmo. Wdrożenie 15 minut. Bez karty."
Kanały: landing page, retargeting, email nurture

### Decision (gotowy do zakupu)
> "1 klientka zwraca koszt. Reszta to zysk."
Kanały: pricing page, checkout flow, trial email D12

### Retention (po zakupie)
> "Twój bot zebrał X leadów w tym miesiącu."
Kanały: dashboard, email miesięczny raport

---

## 18. OBIEKCJE I ODPOWIEDZI

| Obiekcja | Odpowiedź |
|---|---|
| "Za drogie na małą firmę" | "3,30 zł dziennie. 1 klientka w miesiącu zwraca cały koszt." |
| "Nie znam się na technikaliach" | "Nie musisz. Wklej tekst, dostaniesz kod HTML. 15 minut." |
| "Moi klienci wolą telefon" | "Bot nie zastępuje telefonu, odpowiada gdy nie możesz odebrać." |
| "Bot będzie mówił głupoty" | "Bot odpowiada tylko na podstawie treści, które sam dodasz. Jeśli nie wie, zbiera dane kontaktowe i odsyła do Ciebie." |
| "Co z RODO?" | "Szyfrowanie AES-256, serwery EU, DPA na żądanie. Jesteśmy gotowi." |
| "A co jeśli mi nie pasuje?" | "Anuluj jednym kliknięciem. Brak umowy. Brak kary." |
| "Bot zastąpi moich pracowników?" | "Nie: odpowiada na powtarzające się pytania. Ty i zespół możecie zająć się rzeczami, które wymagają człowieka." |
| "Mam już Booksy" | "Booksy zarządza rezerwacjami. Bot odpowiada na pytania PRZED rezerwacją i zbiera leady od tych, którzy jeszcze się wahają." |

---

## 19. KONKURENCJA I POZYCJONOWANIE

### Kim NIE jesteśmy

- **Tidio / Intercom / Zendesk**: korporacyjne helpdesk tools, ceny od kilkuset zł, skomplikowana konfiguracja, po angielsku
- **Booksy / Calendly**: zarządzanie rezerwacjami, nie FAQ bot
- **ChatGPT widget**: generyczny, nie zna Twojej firmy, bez lead capture
- **Custom chatbot od agencji**: drogi (3 000-10 000 zł), długi czas wdrożenia, zależność od agencji

### Nasz positioning

> "Botiko to bot obsługi klienta zaprojektowany specjalnie dla polskich mikrofirm usługowych. Gotowy szablon branżowy, polska komunikacja, RODO, wdrożenie w 15 minut. 99 zł miesięcznie."

---

## 20. AKTUALNY STAN PROJEKTU (2026-04-22)

**Faza 1A. Gotowe do pilotu:**
- Core bot (RAG + OpenAI) z pełnym pre-processingiem
- Widget <12KB, Shadow DOM, WordPress/Shopify/GTM/Wix
- Dashboard: 10 stron + onboarding wizard 5-krokowy
- 5 landing pages branżowych
- Stripe billing (STARTER 99 zł, 14 dni trial, webhooks)
- 297+ testów jednostkowych + 24 E2E Playwright, 4-jobowy CI zielony
- Landing page + blog + formularz kontaktowy
- Security: CORS, UUID validation, PII encryption, rate limits

**Zostało przed deployem:**
- Railway (API) + Vercel (web) setup
- DNS + env vars produkcyjne
- Stripe prod keys + Supabase prod project
- QA ręczna (TASK.md §1A.6)
- Wix sandbox iframe test

**Roadmap po deploymentcie:**
- 15 płacących klientów (Cel MVP)
- Meta Messenger / Instagram Direct integration
- Raport miesięczny dla klientów
- Plan PRO (jeśli demand)
- Mobile app dashboard (PWA → native)

---

## 21. KONTAKT I ZASOBY

- **Email:** kontakt@botiko.pl
- **Lokalizacja:** Białystok, Podlaskie
- **Strona:** botiko.pl
- **GitHub repo:** MateuszWPL/botiko-app (private)
- **Supabase project:** ihfqmlkltpzmmgertfwh
- **Dokumentacja techniczna:** CLAUDE.md (root repo)
- **Deployment checklist:** TASK.md §1A.6
- **Architektura (ENG):** docs/CODEMAPS/

---

*Ostatnia aktualizacja: 2026-04-22*
*Plik do użytku w Claude.ai Projects jako stały kontekst projektu.*
