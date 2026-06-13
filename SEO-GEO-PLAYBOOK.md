# SEO + GEO Playbook — Botiko.pl

Stan po wdrożeniu silnika organicznego (branch `seo/gsc-fixes`). Ten dokument
zbiera: co zostało zrobione w kodzie, co trzeba zrobić ręcznie (off-page) oraz
backlog treści. Zaktualizuj po każdym kroku.

## Co jest już w kodzie (zrobione)

**Technical SEO / GEO foundation**
- Site-wide `Organization` + `WebSite`/`SearchAction` JSON-LD (`app/layout.tsx`, builder w `lib/seo.ts`).
- `/faq` — answer-first Q&A + people-also-ask, `FAQPage` + `BreadcrumbList` schema (treść w `lib/faq.ts`).
- `/llms.txt` — mapa encji + URL-i dla crawlerów AI (`app/llms.txt/route.ts`).
- `/o-nas` reaktywowane + `AboutPage` schema (E-E-A-T: tożsamość wydawcy).
- `BreadcrumbList` na wszystkich `/dla/*`.
- Sitemap odchudzony + nowe URL-e; `POSTS_PER_PAGE` 12; OG na `/kontakt`.

**Programmatic branża × miasto** (`/dla/[branza]/[miasto]`)
- 4 branże × 6 miast (Białystok, Warszawa, Kraków, Wrocław, Poznań, Gdańsk).
- Dane + quality gate w `lib/local-seo.ts` (renderuje tylko kompletne kombinacje).
- `Service` + `FAQPage` + `BreadcrumbList` schema, linkowanie przez `CityLinks`.

**Narzędzia (link-magnets)** — `/narzedzia`
- Kalkulator utraconych klientów + kalkulator ROI bota, `WebApplication` schema.

**Strony pieniężne**
- `/cennik` (`Product`/`Offer` schema), `/integracje/wordpress` (`HowTo` schema),
  `/porownanie` + `/porownanie/[slug]` (bot vs ręczne odpowiadanie, bot vs ogólny ChatGPT).

---

## Do zrobienia ręcznie — OFF-PAGE (poza kodem, krytyczne)

Bez tego nie wyjdziemy poza ruch brandowy. Zero backlinków = sufit.

- [ ] **Bing Webmaster Tools** — załóż konto, zweryfikuj `botiko.pl`, zgłoś `botiko.pl/sitemap.xml`. ChatGPT Search korzysta z indeksu Bing — to warunek widoczności w ChatGPT.
- [ ] **Google Search Console** — po deployu zgłoś ponownie sitemap; monitoruj indeksację nowych URL-i (`/dla/*/*`, `/cennik`, `/faq`, `/porownanie/*`).
- [ ] **Google Business Profile** (Białystok) — wizytówka = encja lokalna, sygnał dla Map i AI.
- [ ] **Katalogi PL** — firmowe + SaaS/oprogramowanie (np. katalogi narzędzi, opinie o software). Spójny NAP (nazwa, adres, kontakt).
- [ ] **Reddit / grupy FB branżowe** — Perplexity mocno cytuje Reddit. Wartościowa obecność w wątkach „bot/chatbot dla salonu/firmy", grupach właścicieli salonów/gastro. Bez spamu.
- [ ] **2–3 wpisy gościnne** na blogach beauty/gastro/automotive z linkiem do pillara branżowego.
- [ ] **Wzmianki encyklopedyczne** gdzie zasadne (ChatGPT mocno cytuje Wikipedię/źródła autorytatywne).

---

## Backlog treści (iteracyjnie, w kodzie)

**GEO answer-first (WS2) — rewrite istniejących stron**
- [ ] Przepisać sekcje H2 na `/dla/*` i pillar-postach tak, by zaczynały się od zwięzłej, cytowalnej odpowiedzi (1–2 zdania), potem rozwinięcie.
- [ ] Wpleść konkretne, **prawdziwe** liczby/statystyki z atrybucją (bez zmyślania). AI cytuje treść bogatą w dane.

**Blog clusters (WS6)**
- [ ] Każdy pillar (beauty/health/food/auto/WordPress) → 4–6 wpisów satelitarnych linkujących do pillara i do `/dla/*` (kontekstowo).
- [ ] Rozszerzyć `getRelatedPosts` o linkowanie cross-cluster (nie tylko ta sama kategoria).
- [ ] Nowe tematy pod AI: „ile kosztuje chatbot dla [branża] 2026", „chatbot a RODO", „czy bot AI zastąpi recepcjonistkę", „jak ustawić bota na WordPress" — każdy z `<FAQ>` + liczbami.
- [ ] Konsekwentnie używać komponentu `<FAQ>` w postach (format Q&A = cytowalny przez AI).
- [ ] Każdy nowy post: 3 grafiki w `public/blog/` (`{slug}-hero/-1/-2.jpg`).

**Rozbudowa programmatic (gdy treść gotowa)**
- [ ] Dodać kolejne miasta w `lib/local-seo.ts` — TYLKO z prawdziwymi dzielnicami i własnym FAQ (quality gate odrzuca niekompletne).
- [ ] Rozważyć więcej porównań w `lib/comparisons.ts` (uczciwych, bez nazywania konkurentów).

---

## Weryfikacja po deployu
- `botiko.pl/sitemap.xml` zawiera nowe URL-e; `botiko.pl/llms.txt` zwraca treść.
- Google Rich Results Test: `/faq`, `/cennik`, `/dla/salon-beauty/warszawa`, `/integracje/wordpress`.
- GSC (ciągle): wzrost wyświetleń na frazy nie-brandowe, rosnące linki wewnętrzne poza `/blog`.
- Bing WMT: indeksacja pod ChatGPT Search.
