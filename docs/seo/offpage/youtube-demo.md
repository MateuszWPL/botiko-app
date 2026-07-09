# Demo YouTube, scenariusz + opis + osadzenie

> **Dlaczego to priorytet:** wzmianki/treści na YouTube to jeden z najsilniejszych sygnałów cytowań w AI-search (Perplexity, Google AI Overviews chętnie sięgają po wideo), a Botiko dziś **w ogóle** nie ma wideo. To także materiał do osadzenia na `/` i `/integracje/wordpress` (dłuższy czas na stronie) i do CTA w guest postach.
> **Zakres:** 1 główny film demo (2-3 min) + opcjonalnie 1 krótki (30-45 s, pod Shorts/reels). Nagrasz ekranem, nie musi być produkcja premium, ma być konkretny i szczery.

---

## 1. Film główny, „Botiko w 3 minuty" (2:30-3:00)

**Cel:** pokazać realnie, jak w 15 minut ustawia się bota i jak odpowiada klientowi. Bez lania wody.

### Scenariusz (sceny + narracja)

| # | Kadr | Narracja (skrót) | Czas |
|---|---|---|---|
| 1 | Strona `botiko.pl`, hero | „Klienci piszą po godzinach, a Ty nie zawsze możesz odpisać. Botiko to bot, który robi to za Ciebie, pokażę w 3 minuty, jak działa." | 0:00-0:20 |
| 2 | Rejestracja / SetupWizard, wybór branży | „Zakładasz konto, wybierasz branżę, salon, gabinet, restauracja, warsztat albo inna. Dostajesz gotowy szablon bota." | 0:20-0:50 |
| 3 | Wklejanie cennika/FAQ do bazy wiedzy | „Wklejasz swój cennik, godziny i najczęstsze pytania. Bot odpowiada tylko z tej wiedzy, nie zmyśla." | 0:50-1:20 |
| 4 | Instalacja: wtyczka WordPress **lub** kod | „Instalacja: wtyczka z katalogu WordPress.org jednym kliknięciem, albo wklejasz kod na dowolnej stronie. Bez programisty." | 1:20-1:50 |
| 5 | Widget na stronie klienta: rozmowa na żywo | „I tak to wygląda u klienta: pyta o cenę, bot odpowiada, prosi o kontakt." (pokaż realną rozmowę) | 1:50-2:20 |
| 6 | Dashboard: lead w panelu | „Kontakt trafia do panelu jako lead, imię i telefon, gotowe do oddzwonienia. Rezerwację robi klient w Booksy/Calendly." | 2:20-2:45 |
| 7 | CTA końcowe | „14 dni za darmo, bez karty. Link w opisie. To tyle, dzięki!" | 2:45-3:00 |

**Wskazówki nagraniowe:**
- Nagrywaj 1080p, powiększ UI (czytelność na telefonie).
- Realne dane demo (np. salon), nie „lorem ipsum".
- Nie obiecuj rezerwacji przez bota: scena 6 wprost mówi „rezerwację robi klient w Booksy" (zgodność z produktem).
- Podpisy/napisy (captions): YouTube je indeksuje = SEO + dostępność.

---

## 2. Metadane filmu (SEO YouTube)

**Tytuł (≤ 70 zn.):**
```
Botiko: bot obsługi klienta 24/7 dla firm usługowych (demo w 3 min)
```

**Opis (wklej całość):**
```
Botiko to polski bot obsługi klienta dla mikro i małych firm usługowych, salonów,
gabinetów, restauracji i warsztatów. Odpowiada na pytania klientów 24/7 z Twojego
cennika i FAQ, zbiera leady (imię + telefon) i odsyła do rezerwacji w Booksy/Calendly.

W tym demo:
00:00 Po co bot obsługi klienta
00:20 Wybór branży i gotowy szablon
00:50 Baza wiedzy: cennik, godziny, FAQ
01:20 Instalacja: wtyczka WordPress lub kod
01:50 Rozmowa bota z klientem na żywo
02:20 Lead w panelu
02:45 Jak zacząć

▶ Wypróbuj 14 dni za darmo (bez karty): https://botiko.pl
🧩 Wtyczka WordPress: https://wordpress.org/plugins/botiko-ai-customer-service-bot/
💬 Kontakt: kontakt@botiko.pl

Botiko nie obsługuje rezerwacji: odpowiada na pytania i odsyła do Twojego systemu
(Booksy, Calendly). Jeden plan: 99 zł/mies. Zrobione w Białymstoku.

#chatbot #obslugaklienta #malafirma #wordpress #botiko
```

**Tagi:** `bot obsługi klienta, chatbot dla firmy, chatbot polski, bot na stronę, wtyczka WordPress chatbot, chatbot salon, chatbot restauracja, automatyzacja obsługi klienta, Botiko`

**Miniatura:** duży tekst „BOT 24/7", zrzut widgetu + logo. Kontrast, czytelność na telefonie.

**Rozdziały:** timestampy w opisie (wyżej) tworzą rozdziały automatycznie, zostaw je.

---

## 3. Krótki film (Shorts / reels, 30-45 s)

Jeden problem → jedno rozwiązanie:
- Kadr: telefon, godzina 22:14, przychodzi wiadomość „ile kosztuje...".
- Napis: „Nie odpisujesz o 22? Klient idzie do konkurencji."
- Cięcie: bot odpowiada natychmiast + zbiera numer.
- Napis: „Botiko odpowiada za Ciebie. 99 zł/mies. 14 dni za darmo."
- CTA: „botiko.pl".

Ten sam plik wrzuć jako YouTube Short, Instagram Reel i TikTok (te same napisy).

---

## 4. Gdzie osadzić / wykorzystać (po nagraniu)
- **`/` (homepage)** i **`/integracje/wordpress`**: osadź przez istniejący komponent `VideoEmbed` (CSP już zezwala na `youtube.com` w `frame-src`). Dłuższy czas na stronie + sygnał jakości.
- **Product Hunt / katalogi SaaS**: link do wideo w profilu (patrz `katalogi-nap.md`).
- **Guest posty i odpowiedzi w społecznościach**: jako „pokazuję jak to działa" zamiast ściany tekstu.
- **GBP (Google Business Profile)**: dodaj wideo do profilu.

> Po publikacji: dopisz `sameAs` z kanałem YouTube do `organizationSchema()` w `lib/seo.ts` (domyka lukę „brak sameAs organizacji" z audytu) i uzupełnij `VideoObject` schema na stronie z osadzonym filmem.
