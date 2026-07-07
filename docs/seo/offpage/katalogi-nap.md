# Katalogi + spójny blok NAP (do zgłoszeń off-page)

> **Cel:** pierwsze 5–10 backlinków / cytowań marki w 1. miesiąc (cel z `PLAYBOOK.md`).
> **Zasada:** wszędzie wklejaj **identyczny** blok NAP (poniżej) — spójność nazwy/adresu/kontaktu to sygnał zaufania dla Google i wzmacnia encję marki (spójną ze schematem `Organization` na stronie).
> **Uwaga:** część katalogów daje linki `nofollow` — i tak są wartościowe (cytowanie marki, ruch, spójność NAP, discovery dla AI). Kolumnę „dofollow?" traktuj orientacyjnie i zweryfikuj sam przed poświęceniem czasu.

---

## 1. Blok NAP — źródło prawdy (kopiuj 1:1)

Botiko jest firmą **online (SaaS)** — nie ma lokalu z obsługą klienta. Dane spójne ze schematem na stronie:

```
Nazwa:        Botiko
Marka/domena: Botiko.pl
Twórca:       Mateusz Woronowicz
Miasto:       Białystok, woj. podlaskie, Polska
E-mail:       kontakt@botiko.pl
WWW:          https://botiko.pl
Kategoria:    Oprogramowanie SaaS / bot obsługi klienta dla firm usługowych
```

**Decyzja do podjęcia (Twoja):**
- **Telefon** — schema strony nie zawiera numeru. Jeśli chcesz go używać w katalogach (część wymaga), ustal **jeden** numer i dodaj go też do schematu (`Organization.telephone` w `lib/seo.ts`) oraz do Google Business Profile — inaczej powstanie niespójność NAP. Jeśli nie chcesz podawać numeru, wybieraj katalogi, które go nie wymagają.
- **Adres** — jako firma online podaj tylko **miasto (Białystok)**, bez ulicy, chyba że masz zarejestrowany adres działalności, który świadomie chcesz upubliczniać.

### Opisy firmy — 3 długości (gotowe do wklejenia)

**Krótki (~90 zn.):**
```
Botiko — bot obsługi klienta 24/7 dla firm usługowych. Odpowiada na pytania i zbiera leady.
```

**Średni (~160 zn.):**
```
Botiko to polski bot obsługi klienta dla mikro i małych firm usługowych. Odpowiada na pytania klientów 24/7 z Twojego cennika i FAQ, zbiera leady i odsyła do rezerwacji. Od 99 zł/mies.
```

**Długi (~300 zn.):**
```
Botiko to polska platforma SaaS z botem obsługi klienta dla firm usługowych — salonów beauty, gabinetów, restauracji i warsztatów. Bot odpowiada na pytania klientów 24/7 na podstawie Twojego cennika i bazy wiedzy, zbiera leady (imię + telefon) i odsyła do rezerwacji w Booksy/Calendly. Instalacja w 15 minut, także jako oficjalna wtyczka WordPress. Jeden plan 99 zł/mies, 14 dni za darmo bez karty.
```

---

## 2. Katalogi PL — firmowe (priorytet 1)

| Katalog | URL | dofollow? | Uwagi |
|---|---|---|---|
| **Aleo** (Grupa ING) | aleo.com | zwykle nofollow | Duży katalog B2B, mocna domena, dobre dla cytowania NAP i discovery. Darmowy wpis firmy. |
| **Panorama Firm** | panoramafirm.pl | mieszane | Klasyczny katalog PL, rozpoznawalny; darmowy podstawowy wpis. |
| **PKT.pl** | pkt.pl | mieszane | Katalog + mapa; darmowy wpis podstawowy. |
| **GoWork** | gowork.pl | mieszane | Profil firmy + opinie; wysoka widoczność w Google na frazy „opinie". |
| **Baza firm / Firmy.net** | firmy.net | mieszane | Prosty darmowy wpis firmowy. |
| **Bing Places** | bingplaces.com | n/d | Odpowiednik GBP dla Bing — masz już Bing WMT, dołóż Places (spójność NAP + widoczność w Bing/Copilot). |

> **GBP (Google Business Profile)** — już zrobione (patrz `PLAYBOOK.md`). Upewnij się tylko, że NAP tam = blok wyżej.

---

## 3. Katalogi SaaS / software (priorytet 1 — najbliżej intencji zakupowej)

Tu trafiają osoby szukające narzędzia — najwyższa jakość ruchu i realne intencje „alternatywa dla…".

| Katalog | URL | dofollow? | Uwagi |
|---|---|---|---|
| **Capterra** (Gartner) | capterra.com / .pl | link nofollow, ale ruch B2B | Kategoria: Live Chat / Chatbot / Customer Support. Wysoka wiarygodność, PL wersja. Wymaga weryfikacji firmy. |
| **GetApp** (Gartner) | getapp.com | jw. | Bliźniak Capterry, jeden proces zgłoszenia często pokrywa oba. |
| **G2** | g2.com | nofollow | Największy katalog + recenzje SaaS. Profil produktu + zbieraj recenzje pilotów (patrz Faza 3). |
| **SaaSHub** | saashub.com | częściowo dofollow | Katalog alternatyw („Botiko alternatives"), dobry pod intencję „alternatywa dla Tidio". |
| **AlternativeTo** | alternativeto.net | nofollow | Zgłoś jako alternatywę dla Tidio/Intercom/Chatbot.com — łapie ruch „alternatywa". |
| **Product Hunt** | producthunt.com | dofollow (profil) | Jednorazowy „launch" + stały profil. Dobry dla discovery i pierwszych recenzji. Zaplanuj launch na konkretny dzień. |
| **SourceForge / Slashdot** | sourceforge.net | dofollow | Listing biznesowy oprogramowania; akceptują SaaS. |
| **Startup listy PL** | np. MamStartup, „polskie startupy" | mieszane | Zgłoś jako startup — cytowanie marki + potencjalny artykuł. |

**Co zgłaszać (każdy SaaS-katalog):** nazwa, kategoria (Chatbot / Live Chat / Customer Service), opis (wersja średnia/długa), logo (`botiko-logo-full.svg` → PNG), zrzuty ekranu dashboardu, link do `/` i do `/cennik`, link do wtyczki wp.org.

---

## 4. Kolejność działania (tydzień 1)

1. **Bing Places** + potwierdź NAP w GBP (spójność).
2. **Capterra + GetApp** (jeden proces, najwyższa intencja).
3. **G2 + SaaSHub + AlternativeTo** (łapią „alternatywa dla…").
4. **Aleo + Panorama Firm + GoWork** (katalogi PL, cytowanie marki).
5. **Product Hunt** — zaplanuj launch (osobno, wymaga przygotowania grafik + „maker comment").

> Po każdym udanym wpisie zanotuj URL profilu w `PLAYBOOK.md` (sekcja backlinki) — będzie łatwiej śledzić w GSC → Links i sprawdzać, co realnie indeksuje Google.

---

## 5. Czego NIE robić
- **Żadnych masowych „katalogów SEO"** / farm linków / płatnych paczek „1000 backlinków" — to ryzyko kary i zero wartości.
- Nie podawaj **różnych** wariantów nazwy/adresu w różnych miejscach — psuje spójność NAP.
- Nie wymyślaj telefonu/adresu „na potrzebę formularza" — użyj realnych danych albo pomiń katalog.
