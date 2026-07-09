# Onboarding pilota, checklist wdrożenia w ~1h

> **Cel:** od „tak, testuję" do działającego bota na stronie klienta w jedno posiedzenie.
> **Model:** done-for-you, konfigurujesz Ty, klient tylko akceptuje i wkleja (albo Ty wklejasz przez wtyczkę). To główny killer konwersji z `PLAN-DZIALANIA.md`.
> **Reguła:** im mniej klient musi zrobić sam, tym większa szansa, że pilot dożyje 30 dni.

Powiązane: [`skrypty-outreach.md`](skrypty-outreach.md) · baza wiedzy: [`../content/bot-knowledge-base.md`](../content/bot-knowledge-base.md).

---

## Zanim zaczniesz, zbierz od klienta (1 wiadomość)

Poproś o komplet naraz, żeby nie pingpongować:
- [ ] Link do **strony WWW**.
- [ ] Link do **cennika** (albo PDF / zrzut / tekst: cokolwiek mają).
- [ ] **Godziny otwarcia** i adres.
- [ ] Gdzie przyjmują **rezerwacje/kontakt** (Booksy / Calendly / telefon / formularz).
- [ ] Czy strona jest na **WordPressie** (decyduje o metodzie instalacji).
- [ ] 3-5 **najczęstszych pytań** klientów (to złoto do FAQ bota).

---

## Krok 1. Konto i firma (~10 min)

- [ ] Załóż/aktywuj konto pilota (14-dniowy trial startuje automatycznie, bez karty).
- [ ] Onboarding `SetupWizard`: wybierz **branżę** (BEAUTY/HEALTH/FOOD/AUTO lub OTHER dla reszty usług).
- [ ] Uzupełnij **dane firmy** w Ustawieniach: nazwa, adres, godziny, `websiteUrl`, `googleMapsUrl`, `reservationUrl` (Booksy/Calendly).
- [ ] Sprawdź, że kolor widgetu pasuje do marki klienta (Wygląd widgetu → kolor + kontrast tekstu; jasny kolor = ustaw ciemny tekst).

## Krok 2. Baza wiedzy (~20 min, największa dźwignia na jakość)

- [ ] **Import ze strony**: wklej URL → podgląd wyekstrahowanej treści → popraw/uzupełnij przed zapisem.
- [ ] Jeśli strona ładuje treść skryptem (chudy import) → użyj pola **„Wklej cokolwiek"**: wklej cennik/opis/FAQ, AI rozbije na wpisy, Ty zatwierdzasz.
- [ ] Dodaj **cennik** (usługi + ceny): to najczęstsze pytanie klientów końcowych.
- [ ] Dodaj **3-5 FAQ** od klienta (godziny, dojazd, płatności, „czy robicie X").
- [ ] Ustaw **link rezerwacji** tak, żeby bot odsyłał do Booksy/Calendly (nie udaje, że rezerwuje).
- [ ] Sanity-check: baza ma ≥ kilkanaście sensownych wpisów, nie „3 zdania".

## Krok 3. Test bota (~10 min, ZANIM trafi do klienta)

Zadaj botowi realne pytania klienta końcowego i sprawdź odpowiedzi:
- [ ] „Ile kosztuje [usługa]?" → podaje cenę z cennika, nie zmyśla.
- [ ] „Do której jesteście otwarci?" / „Pracujecie w sobotę?" → poprawne godziny.
- [ ] „Jak się umówić?" → odsyła do Booksy/Calendly, **nie** twierdzi, że zapisał wizytę.
- [ ] „Chcę zostawić kontakt" / poda numer → otwiera się formularz leada (imię + telefon).
- [ ] Pytanie spoza wiedzy → grzecznie kieruje do kontaktu, nie halucynuje.
- [ ] Test na **telefonie** (nie tylko desktop): ekran nie skacze przy pisaniu.

## Krok 4. Instalacja na stronie klienta (~10 min)

**WordPress (priorytet):**
- [ ] Klient instaluje wtyczkę **Botiko** z katalogu WordPress.org (albo Ty przez jego panel).
- [ ] Połączenie: wygeneruj **kod połączenia** w panelu (embed) → wklej we wtyczce → autoryzuje domenę.
- [ ] Widget pojawia się na stronie; sprawdź na żywo.

**Inna strona (uniwersalny skrypt):**
- [ ] Skopiuj snippet `<script data-bot-id>` z panelu (embed → „Inna strona").
- [ ] Wklej przed `</body>` (albo poprowadź klienta / poproś o dostęp).
- [ ] Dodaj domenę klienta do **allowedDomains** (inaczej DomainWhitelistGuard zablokuje czat).
- [ ] Odśwież stronę → widget działa.

## Krok 5. Przekazanie i umówienie kontaktu (~5 min)

- [ ] Pokaż klientowi **panel**: gdzie widzi rozmowy i leady, gdzie przychodzi mail o nowym leadzie.
- [ ] Ustaw oczekiwania: „przez 30 dni zbieramy dane, za ~2 tygodnie sprawdzimy, ile pytań i leadów".
- [ ] Umów **konkretny termin kontroli** (np. za 14 dni), nie zostawiaj pilota samego.
- [ ] Zapisz w [`lista-firm.md`](lista-firm.md): data startu, kanał, gdzie piszą ich klienci.

---

## W trakcie pilota (30 dni)

- [ ] **Dzień ~14:** zajrzyj do panelu: ile rozmów, ile leadów? Wyślij klientowi krótkie podsumowanie („bot odebrał X pytań, złapał Y kontaktów").
- [ ] Reaguj na maile drip (system sam wysyła D+1, D+7, „2 dni do końca", „trial wygasł"), dopilnuj, że klient je widzi.
- [ ] **Dzień ~25-28:** rozmowa domykająca. Pokaż liczby, zaproponuj przejście na 99 zł/mies. (dodaje kartę w panelu → Stripe Checkout, 14 dni triala Stripe nakłada się bezproblemowo).

## Zapisz do bramki decyzyjnej (`PLAN-DZIALANIA.md` §6)

Po każdym pilocie, trzy liczby:
1. Gdzie piszą klienci tej firmy? (WWW / Google / IG / Messenger / telefon)
2. Ile rozmów bot odbył w 30 dni?
3. Czy właściciel umie wskazać wartość?

---

## Częste problemy (i szybki fix)

| Objaw | Przyczyna / fix |
|---|---|
| Czat nie odpowiada na stronie klienta | Domena nie jest w `allowedDomains` → dodaj (www i bez www). |
| Import ze strony dał „3 zdania" | Strona renderuje treść JS → użyj „Wklej cokolwiek" i wklej tekst ręcznie. |
| Napisy w widgecie nieczytelne | Jasny kolor akcentu → ustaw ciemny kolor tekstu w Wyglądzie widgetu. |
| Bot zmyśla cenę/termin | Braki w bazie wiedzy → uzupełnij cennik/FAQ; bot odpowiada tylko z tego, co ma. |
| Bot „potwierdza rezerwację" | Nie powinien: sprawdź, że `reservationUrl` ustawiony; bot odsyła, nie zapisuje. |
| 401 przy zapisie w panelu | Sesja wygasła po bezczynności → odśwież stronę (token się odnowi). |
