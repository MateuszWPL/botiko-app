# Raport SEO z Google Search Console — botiko.pl

**Data audytu:** 12.06.2026
**Stack docelowy:** `apps/web` (Next.js 14 App Router + MDX blog)
**Stan ogólny:** Strona nowa, dane od 14.05.2026. 17 stron zindeksowanych, 12 nie. 8 kliknięć / 26 wyświetleń w 28 dni — widoczność praktycznie tylko na brand ("botiko"). Nie ma katastrof, ale jest kilka konkretnych rzeczy do naprawy w kodzie.

---

## TL;DR — priorytety

1. **Sitemap jest zaśmiecony** — 111 URL-i, z czego ~65 to cienkie strony tagów (`/blog/tag/*`) i ~15 kategorii, często z 1 wpisem. Google zindeksował tylko 17. To rozwadnia crawl budget.
2. **Linkowanie wewnętrzne leży** — łącznie 17 linków wewnętrznych, WSZYSTKIE prowadzą do `/blog`. Strony pieniężne (`/dla/*`) i posty nie mają praktycznie żadnych linków wewnętrznych.
3. **0 backlinków** — zero linków zewnętrznych. Off-page do zrobienia ręcznie (nie kod).
4. **404 na `/opengraph-image`** — Next.js route OG zwraca 404 Googlebotowi.
5. **FAQ schema jest martwy** — Google wycofuje rich results FAQ (od 7.05.2026). Markup FAQPage nie daje już snippetów.

---

## Szczegóły + co zrobić w kodzie

### 1. Sitemap bloat (NAJWAŻNIEJSZE)
**Problem:** `sitemap.xml` ma 111 URL-i. Rozkład:
- ~10 stron głównych (OK: `/`, `/blog`, `/kontakt`, `/dla/*`, `/prywatnosc`, `/regulamin`)
- ~20 wpisów blogowych (OK)
- ~15 stron kategorii `/blog/kategoria/*`
- **~65 stron tagów `/blog/tag/*`** ← problem, większość ma 1 wpis = thin/duplicate content

**Do zrobienia:**
- Usuń strony tagów z sitemapy ALBO dodaj `noindex` na `/blog/tag/*` (jeśli mają zostać dla UX) — wygeneruj je dynamicznie, ale nie pchaj do indeksu.
- Kategorie: zostaw w sitemapie tylko te, które mają ≥3 wpisy. Resztę `noindex`.
- Strony tagów i kategorii w sitemapie **nie mają `lastmod`** — dodaj, albo usuń te wpisy.
- Cel: sitemap powinien zawierać ~30 realnie wartościowych URL-i, nie 111.

Plik prawdopodobnie: `apps/web/app/sitemap.ts` + logika tagów/kategorii w `apps/web/app/blog/`.

### 2. Linkowanie wewnętrzne
**Problem:** GSC pokazuje 17 linków wewnętrznych łącznie, wszystkie do `/blog`. Strony `/dla/salon-beauty`, `/dla/restauracja`, `/dla/warsztat-mechaniczny` itd. (Twoje landing page'e pod konwersję) nie są nigdzie podlinkowane wewnętrznie.

**Do zrobienia:**
- Dodaj sekcję linków do stron `/dla/*` w stopce ORAZ na stronie głównej (np. "Botiko dla Twojej branży: salon beauty, gabinet, restauracja, warsztat").
- W postach blogowych dodaj kontekstowe linki do odpowiednich `/dla/*` (post o beauty → link do `/dla/salon-beauty`).
- Dodaj "powiązane wpisy" na końcu każdego posta MDX (3 linki do innych postów z tej kategorii).
- Komponent stopki: `apps/web/components/Footer.tsx` (lub podobny).

### 3. Strony zindeksowane: 12 niezindeksowanych — rozbiór
| Powód | Liczba | URL przykładowy | Werdykt |
|---|---|---|---|
| Alternatywna strona z poprawnym canonical | 6 | (warianty) | OK, naturalne |
| Zeskanowana, jeszcze nie zindeksowana | 2 | — | OK, poczekać |
| Duplikat — Google wybrał inny canonical | 1 | `botiko.pl/blog?strona=3` | Paginacja — patrz pkt 6 |
| 404 | 1 | `botiko.pl/opengraph-image` | Naprawić — pkt 4 |
| Zablokowana w robots.txt | 1 | `botiko.pl/register` | OK, celowo |
| Przekierowanie | 1 | `www.botiko.pl/blog` | OK, www→non-www |

### 4. 404 na `/opengraph-image`
**Problem:** Googlebot pukał do `https://botiko.pl/opengraph-image` i dostał 404 (ostatnio 17.05.2026). To route OG w Next.js.

**Do zrobienia:**
- Sprawdź czy `apps/web/app/opengraph-image.tsx` (lub `.ts`) istnieje i poprawnie eksportuje obraz. Jeśli OG generujesz per-route, upewnij się że root `/opengraph-image` nie jest referowany jako goły URL w metadanych.
- Zweryfikuj `og:image` w `<head>` strony głównej — czy wskazuje na działający URL. Jeśli 404, social share + Google Discover nie pokażą miniatury.
- Szybki test: otwórz `botiko.pl/opengraph-image` w przeglądarce — powinien zwrócić obraz, nie 404.

### 5. FAQ structured data — wycofane przez Google
**Problem:** GSC pokazuje banner: rich results typu FAQ znikają z wyszukiwarki (od 7.05.2026), raport będzie usunięty w czerwcu 2026.

**Do zrobienia:**
- Nie ma sensu utrzymywać schema `FAQPage` pod kątem snippetów — Google już ich nie renderuje (poza nielicznymi autorytetami).
- Możesz zostawić markup (nie szkodzi), ale **nie inwestuj** w rozbudowę FAQ pod rich results. Lepiej przekierować ten wysiłek na treść i linkowanie.

### 6. Paginacja bloga (`?strona=3`)
**Problem:** `botiko.pl/blog?strona=3` ma canonical wskazujący gdzie indziej → Google traktuje paginację jako duplikat i nie indeksuje.

**Do zrobienia:**
- To jest częściowo OK (nie chcesz indeksować głębokiej paginacji), ale upewnij się, że wpisy z głębszych stron paginacji są dostępne też przez kategorie/tagi/sitemap, żeby crawler do nich dotarł. Przy 20 wpisach paginacja prawdopodobnie nie jest potrzebna — rozważ pokazanie wszystkich na jednej stronie `/blog`.

### 7. Core Web Vitals
**Stan:** "Za mało danych" (mobile i desktop) — za mały ruch, żeby Google miał dane z Chrome UX Report. Nic do naprawy w GSC.
**Do zrobienia:** Odpal ręcznie PageSpeed Insights na `/` i `/dla/salon-beauty`, napraw co wyjdzie (lazy loading obrazów, rozmiar JS). Profilaktyka.

### 8. Backlinki: 0
Nie kod — działanie ręczne. Załóż wizytówkę Google, dodaj firmę do katalogów PL (np. branżowych), rozważ 2–3 wpisy gościnne. Dla nowego SaaS to normalne że jest 0, ale bez backlinków nie wyjdziesz poza brand.

---

## Czego NIE ruszać (jest OK)
- HTTPS — 0 problemów.
- Redirect www→non-www — działa poprawnie.
- `/register` zablokowany w robots.txt — celowo, zostaw.
- Sitemap status "Sukces" — przesyłka działa, problem jest w zawartości, nie w mechanizmie.

---

## Gotowy prompt do Claude Code

> Pracujemy w `apps/web` (Next.js 14 App Router + MDX blog). Zadania SEO wg audytu GSC, w kolejności priorytetu:
>
> 1. **Odchudź sitemap.** W `app/sitemap.ts`: usuń z sitemapy wszystkie strony tagów (`/blog/tag/*`). Kategorie (`/blog/kategoria/*`) zostaw w sitemapie tylko jeśli mają ≥3 wpisy — resztę pomiń. Dodaj `lastmod` do wszystkich pozostałych wpisów kategorii.
> 2. **Dodaj `noindex` na cienkie strony.** Strony `/blog/tag/*` oraz kategorie z <3 wpisami mają mieć `robots: { index: false, follow: true }` w `generateMetadata`.
> 3. **Popraw linkowanie wewnętrzne.** W stopce dodaj sekcję z linkami do wszystkich `/dla/*`. Na stronie głównej dodaj sekcję "Botiko dla branż" linkującą do `/dla/salon-beauty`, `/dla/gabinet-spa`, `/dla/restauracja`, `/dla/warsztat-mechaniczny`. Na końcu każdego wpisu MDX dodaj komponent "Powiązane wpisy" (3 linki z tej samej kategorii).
> 4. **Napraw 404 na `/opengraph-image`.** Sprawdź `app/opengraph-image.tsx` i metadane `og:image` — endpoint musi zwracać obraz, nie 404.
> 5. **Paginacja bloga:** przy ~20 wpisach rozważ usunięcie paginacji `?strona=` i pokazanie wszystkich wpisów na `/blog`.
>
> Pokaż mi diff plik po pliku, nie commituj. Trzymaj TypeScript strict, zero `any`.
