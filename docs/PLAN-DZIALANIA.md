# Plan działania, audyt strategiczny i naprawczy

**Data:** 2026-07-02 · **Stan:** MVP na produkcji, 0 klientów, 0 outreachu
**Cel właściciela:** 3000-5000 zł/mies. dodatkowego przychodu
**Zasoby:** kilka godz./tydz. + ~500 zł/mies. (ale vibe-coding = sprinty kodowe liczone w dniach, nie tygodniach)

> Skrót werdyktu: **produkt jest technicznie dobry, biznes jeszcze nie istnieje.**
> Cena 99 zł jest właściwa i konkurencyjna, problemem nie jest cena, tylko
> (1) kilka realnych dziur jakościowych w widgecie/bazie wiedzy, które zabiłyby
> konwersję pilota, oraz (2) całkowity brak sprzedaży. Kolejność: najpierw krótki
> sprint naprawczy (dni), potem 100% czasu w pilotów.

---

## 1. Fakty (na czym stoi ten plan)

- **Widoczność organiczna ≈ 0:** GSC 8 kliknięć/28 dni (tylko brand), 0 backlinków,
  Senuto TOP10: 0, [audyt SEO](seo/audyt-2026-06-30.md). SEO nie będzie kanałem
  sprzedaży przez najbliższe 6-12 mies. niezależnie od jakości treści.
- **Churn SaaS dla mikrofirm: 3-7%/mies.**, 43% utrat w pierwszych 90 dniach
  (benchmarki B2B SaaS 2025/26). Przy 40 klientach tracisz ~2/mies. tylko żeby stać
  w miejscu → cel 30-50 klientów wymaga powtarzalnego kanału, nie zrywów.
- **Cena: potwierdzone researchem (2026-07):**
  - Tidio: darmowy plan = live chat; AI (Lyro) to dopłata od ~$39/mies. za 50 rozmów → realnie 250+ zł/mies.
  - Smartsupp Mira AI: ~$16/100 rozmów (rocznie), nastawione na e-commerce, nie PL-usługi.
  - Polskie agencje/nisza: 1 990-45 000 zł wdrożenie + 599-2 500 zł/mies.; Smart-Asystenci od 499 zł/mies.
  - **Botiko 99 zł / 1000 rozmów AI = najtańsza oferta segmentu. Ceny nie ruszamy.**
- **Konkurencja istnieje** (BeautyBoost AI: strona+IG+Messenger, Beauty Engine,
  AutomatyzujSalon, Starta.one, Smart-Asystenci) → claim „jedyny bot dla polskich
  mikrofirm" jest nieprawdziwy, do usunięcia z materiałów.
- **Rozjazd kanał-produkt:** własne copy na stronie głównej mówi „Wiadomość na
  Messengerze o 22:14", a produkt działa tylko na WWW. GUS: ~62% małych firm ma
  stronę WWW (mikro mniej), branża beauty żyje na Booksy/IG. Wartość widgetu
  skaluje się z ruchem na stronie klienta, którego mikrofirmy często nie mają.
  **Wniosek targetingowy: warsztaty i restauracje przed beauty** (częściej mają
  strony z ruchem z Google).
- Realny horyzont: 10-15 klientów (~1-1,5k zł MRR) w 6-9 mies. przy konsekwentnej
  sprzedaży; 3-5k zł MRR to 18-24 mies., pod warunkiem że jeden kanał zadziała.

---

## 2. Sprint naprawczy PRODUKT (kod, ~4-6 dni vibe-codingu)

Priorytet wg zasady: *naprawiamy to, co pilot zobaczy w pierwszej godzinie użycia.*

### P0, blokery wiarygodności (zrób przed pierwszym pilotem)

1. **Kontrast tekstu w widgecie (biały-na-białym).**
   `apps/widget/src/ChatWindow.tsx` ma zahardkodowane `color: '#fff'` na tle
   `--botiko-primary` (linie ~391, 450, 475, 551, 566, 584, 631). Jasny kolor
   akcentu = nieczytelny widget.
   Fix: util liczący luminancję z `primaryColor` → zmienna `--botiko-on-primary`
   (biały lub `#0f172a`), użyta wszędzie zamiast hardkodu. Dodatkowo w dashboardzie
   (`SettingsForm.tsx`, `SetupWizard.tsx`) ostrzeżenie/auto-korekta przy zbyt jasnym
   kolorze. Uwaga na limit 14KB gzip widgetu. **~0,5 dnia.**

2. **Skaner strony WWW zbiera „3 zdania".**
   Przyczyna nr 1: `website-import/safe-fetch.ts` robi zwykły HTTP fetch **bez
   renderowania JS**, strony na page-builderach (WordPress+Elementor, Wix itd.)
   zwracają szkielet HTML bez treści. Przyczyna nr 2: `extraction-prompt.ts`
   agresywnie streszcza (max 20 usług / 15 FAQ, 8k znaków/podstronę).
   Fix krok 1 (szybki): podnieść limity ekstrakcji; po imporcie pokazać
   **podgląd znalezionej treści z edycją przed zapisem**; gdy strona zwraca <X
   znaków treści → czytelny komunikat „Twoja strona ładuje treść skryptem, wklej
   tekst ręcznie" zamiast cichego mizernego wyniku. **~1 dzień.**
   Fix krok 2 (decyzja po pilotach, nie teraz): headless render (Playwright jako
   worker na Railway) albo zewnętrzny reader.

3. **Mobile: ekran skacze przy otwartej klawiaturze podczas pisania.**
   Klasyka `100vh` vs klawiatura. Fix: kontener czatu na `100dvh` +
   `window.visualViewport` (resize handler ustawiający wysokość), przypięcie
   scrolla do dołu przy focusie inputa. Test na prawdziwym telefonie (nie tylko
   DevTools). `apps/widget/src/ChatWindow.tsx` / `embed.ts`. **~0,5-1 dzień.**

4. **Ucinane odpowiedzi bota.** W demo na botiko.pl odpowiedź urwała się w pół
   słowa („...zbieramy zg"). Sprawdzić `max_tokens` w ChatService + obsługę
   `finish_reason: length` (dokończenie lub wyższy limit). **~0,5 dnia.**

### P1, jakość odpowiedzi widgetu (podnosi „wow" w pilocie)

5. **Ładne linki.** Odpowiedzi bota renderują URL-e jako goły tekst. Fix: detekcja
   linków w wiadomościach bota → stylowany przycisk/chip (jak istniejący CTA
   `tel:`). Booksy/Calendly/menu wyglądają wtedy jak produkt, nie jak spam.
   Uwaga na budżet 14KB. **~0,5 dnia.**

6. **„Mapa".** Nie osadzamy prawdziwej mapy (Google Static Maps = klucz API + koszty
   + waga). Zamiast tego lekka **karta lokalizacji**: ikona + adres + przycisk
   „Otwórz w Google Maps" (`https://maps.google.com/?q=<adres>`), pokazywana gdy bot
   odpowiada na pytanie o dojazd. 90% efektu za 2% kosztu. **~0,5 dnia.**

### P2, baza wiedzy (największa dźwignia na churn)

7. **Uproszczenie dodawania wiedzy.** Dziś: 5 tabów (Kontakt/FAQ/Tekst/PDF/Web),
   użytkownik musi sam decydować „czym" jest jego treść. Docelowo: **jedno pole
   „Wklej cokolwiek, cennik, FAQ, opis"** → AI klasyfikuje i rozbija na wpisy,
   użytkownik tylko zatwierdza. Taby zostają jako filtr/widok, nie jako decyzja
   przy wejściu. `apps/web/.../knowledge/KnowledgeManager.tsx` + endpoint
   klasyfikacji w API. **~1-2 dni.**
   Przy okazji: usunąć osierocony route `/dashboard/knowledge-base` (duplikat).

---

## 3. Sprint naprawczy TREŚĆ/HIGIENA (~1 wieczór)

- „**Cancel** kiedy chcesz" ×3 na stronie głównej → „Anuluj kiedy chcesz"
  (hero, cennik, CTA końcowe, `Hero.tsx`, `Pricing.tsx`, `CtaBanner.tsx`).
- Cennik: „wtyczka **w przygotowaniu**" → stan faktyczny (zgłoszona do wp.org /
  dostępna z ZIP).
- `/dashboard/billing`: brakujące logo Stripe („Płatności obsługiwane przez [pusto]").
- Usunąć „jedyny bot dla polskich mikrofirm" z `BOTIKO_CONTEXT.md` §19 i wszędzie
  indziej → np. „najtańszy polski bot AI dla firm usługowych, 99 zł bez dopłat za AI".
- Scroll-reveal na landingu ukrywa całe sekcje przy szybkim przewijaniu →
  skrócić/wyłączyć (LCP już było naprawiane w tym duchu. PR #85).

---

## 4. Kwestia prawna (strach „ktoś mnie pozwie, że jest słabe")

Ryzyko pozwu za **jakość** produktu B2B za 99 zł/mies. jest praktycznie zerowe,
niezadowolony klient anuluje subskrypcję (bez umowy!), nie idzie do sądu.
Realne ryzyka prawne to RODO (masz pokryte ponadprzeciętnie: AES-256, serwery EU,
DPA) i treść regulaminu. **Jedno zadanie:** zweryfikować, że regulamin zawiera
(a) ograniczenie odpowiedzialności do wysokości zapłaconych opłat, (b) klauzulę
„usługa świadczona w modelu as-is, bot może się mylić, treści bota nie są poradą",
(c) wyłączenie odpowiedzialności za utracone korzyści. Jeśli nie ma, dopisać
(wzorce standardowe SaaS). **~0,5 dnia, zdejmuje temat z głowy na stałe.**

---

## 5. SPRZEDAŻ, zaczyna się równolegle, nie „po sprintach"

Kod czeka na wieczory; rozmowy z ludźmi są nieodkładalne. **Dzień 1 = lista, nie kod.**

1. **Lista 30 firm** (Białystok + okolice): warsztaty, restauracje, gabinety,
   filtr: mają własną stronę WWW **i** aktywny profil Google Maps. Beauty dopiero
   w drugiej kolejności (żyją na Booksy/IG, gdzie widgetu nie ma).
2. **Oferta pilota:** „30 dni za darmo, wszystko skonfiguruję za Ciebie, potem
   99 zł/mies., bez umowy". Kontakt osobisty / przez znajomych / telefon,
   **zero masowego cold e-maila** (PKE/UŚUDE).
3. **„Start za Ciebie": 199 zł jednorazowo** jako stała pozycja oferty:
   konfiguracja bota przez nas. Rozwiązuje główny killer konwersji (właścicielka
   nie zrobi tego sama), finansuje Twój czas. Jeden plan 99 zł zostaje bez zmian.
4. **Przy każdym pilocie zapisz 3 rzeczy:** gdzie piszą klienci (WWW / IG /
   Messenger / telefon)? ile rozmów bot odbył w 30 dni? czy właściciel umie
   wskazać wartość („złapał mi 2 leady")?, to dane pod bramkę decyzyjną.
5. **Off-page quick wins (1 wieczór, z audytu SEO):** Google Business Profile
   (Białystok) + wpis do 5 katalogów SaaS/firm PL = pierwsze backlinki i cytowania.
6. **Kanał powtarzalny do przetestowania po pierwszych pilotach:** partnerstwa
   z twórcami stron WWW / małymi agencjami robiącymi strony mikrofirmom
   (prowizja 20-30% lub white-label). Najwyższa dźwignia na godzinę pracy,
   oni mają dokładnie naszych klientów w portfolio. Grupy FB właścicieli firm,
   posty wartościowe wg formatu z `BOTIKO_CONTEXT.md` §15.
7. **Budżet 500 zł/mies. na razie NIE idzie w Google Ads**, za mały wolumen fraz,
   brak dowodu konwersji landinga. Odpalamy dopiero po pierwszym płacącym z pilotów
   (wtedy: kampania brand + frazy „bot dla warsztatu/restauracji", 20-30 zł/dzień).

---

## 6. Bramka decyzyjna, po 10 rozmowach pilotażowych

Zapisana z góry, żeby nie przesuwać słupków:

| Wynik | Decyzja |
|---|---|
| ≥3 płacących, piloci widzą wartość | Skalujemy kanał partnerski; dopiero wtedy decyzja o integracji Messenger/IG |
| Piloci mówią „klienci piszą na IG/Messengerze, nie na stronie" | **Pivot produktu na Messenger/Instagram** przed jakimkolwiek innym featurem |
| <2 płacących mimo 10 rozmów | Zmiana modelu: done-for-you 499 zł setup + 149 zł/mies. (10 klientów = ten sam przychód), albo świadoma decyzja o zamknięciu jako projekt portfolio |

**Messenger/IG nie budujemy teraz** (tygodnie pracy + review Meta), piloci mają
najpierw udowodnić, że to jest ten brakujący kanał.

---

## 7. Czego NIE robić (lista anty-rozproszeniowa)

- ❌ Redesign strony „na Apple/Linear/Tidio": obecny design jest powyżej progu
  dla targetu; UX-owo krytyczne są tylko punkty z sekcji 2-3.
- ❌ Nowe posty blogowe: treść zaplanowana do końca lipca; SEO i tak nie ruszy
  bez backlinków.
- ❌ Plany Pro/Premium, pakiety, zmiany cennika: jeden plan 99 zł (+ „Start za
  Ciebie" 199 zł) i koniec.
- ❌ Kolejne porządki w repo, refaktory, podnoszenie coverage, produkt z 0 użytkowników
  nie potrzebuje lepszych testów, potrzebuje użytkowników.
- ❌ Natywna apka, nowe branże, nowe szablony: dopiero po 15 płacących.

---

## 8. Kolejność wykonania (sprinty vibe-coding + sprzedaż równolegle)

```
Dzień 1        → lista 30 firm + umówione pierwsze 3 rozmowy  [sprzedaż]
Sprint kod #1  → P0: kontrast, skaner (krok 1), mobile keyboard, ucinanie  (~3 dni)
Wieczór        → higiena copy (sekcja 3) + regulamin (sekcja 4)
Sprint kod #2  → P1: linki + karta lokalizacji  (~1 dzień)
Sprint kod #3  → P2: baza wiedzy „wklej cokolwiek"  (~1-2 dni)
Cały czas      → rozmowy pilotażowe aż do 10; GBP + katalogi w 1 wieczór
Po 10 rozmowach→ bramka decyzyjna (sekcja 6)
```

*Aktualizacja tego pliku: po bramce decyzyjnej albo przy zmianie strategii.
Postęp bieżący → `WORKLOG.md`, zadania → `TASK.md`.*
