# WORKLOG — dziennik prac Botiko.pl

**Jeden plik-źródło prawdy: co, kiedy i przez kogo zostało zrobione.**
Najnowsze wpisy na górze. Claude dopisuje wpis po każdym logicznym etapie (przy commicie).

> Po co: szybki przegląd „co się działo ostatnio" bez czytania git loga. Backlog +
> historia w jednym miejscu. Roadmapa (co PLANUJEMY) żyje w [`TASK.md`](TASK.md) —
> tu zapisujemy co ZROBIONE.

## Format wpisu

```
## RRRR-MM-DD (dzień tygodnia)

### <krótki tytuł etapu> — <agent/rola> — [PR #xx | branch]
- Co zrobione: <punkty>
- Pliki/obszar: <gdzie>
- Review: <którzy agenci sprawdzili, werdykt>
- Status: ✅ done / 🔄 w toku / ⏸ czeka
```

Legenda statusu: ✅ ukończone i sprawdzone · 🔄 w toku · ⏸ zablokowane/czeka na decyzję

---

## 2026-07-02 (czwartek)

### Poprawki wtyczki WordPress po review wp.org (v1.0.6) — Claude — branch fix/wp-plugin-review-enqueue
- Co zrobione (2 uwagi z review `P0TDX334837HGN`):
  - **Enqueue widgetu**: `Botiko_Embed` przepisane z surowego `printf('<script data-bot-id async>')` na `wp_footer` → `wp_enqueue_script()` na `wp_enqueue_scripts` (footer, strategia `async` przez `wp_script_add_data`, back-compat od WP 5.8). `data-bot-id` doklejane przez filtr `script_loader_tag`. Usunięte `phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript` — sniff przechodzi naturalnie.
  - **Contributors**: `readme.txt` `botiko` → `mateuszworonowicz` (username właściciela na wp.org).
  - Bump wersji 1.0.5 → 1.0.6 (`botiko.php` header + `BOTIKO_VERSION`, `readme.txt` Stable tag), wpis do changelogu.
  - Samodzielny przegląd „get ahead of us": ABSPATH guardy OK we wszystkich plikach (`uninstall.php` używa `WP_UNINSTALL_PLUGIN` — poprawnie); reszta enqueue/escaping/nonce bez zastrzeżeń.
- Pliki/obszar: `wordpress-plugin/botiko/includes/class-botiko-embed.php`, `readme.txt`, `botiko.php`
- Review: kod zgodny z podlinkowaną dokumentacją make.wordpress.org (async strategy 6.3 + script attributes 5.7); PHPCS/`php -l` lokalnie niedostępne (brak PHP na maszynie) → weryfikacja w CI job `WordPress plugin`
- Status: 🔄 czeka na test na czystym WP (WP_DEBUG) + re-upload ZIP 1.0.6 przez „Add your plugin" i odpowiedź na maila

### Audyt strategiczny + plan działania — Claude — branch docs/plan-dzialania
- Co zrobione:
  - **Pełny audyt strategiczny**: web research konkurencji (Tidio/Lyro, Smartsupp Mira, polska nisza: BeautyBoost AI, Smart-Asystenci, AutomatyzujSalon), benchmarki churnu SMB SaaS, dane GUS o stronach WWW mikrofirm; walkthrough na żywo botiko.pl + dashboard + widget (Chrome).
  - **Zweryfikowane w kodzie defekty produktu**: hardkod `#fff` w `ChatWindow.tsx` (biały tekst na jasnym akcencie), skaner WWW bez renderu JS (`safe-fetch.ts`) + agresywne limity ekstrakcji, skaczący ekran mobile przy klawiaturze, ucinane odpowiedzi bota (demo live).
  - **Nowy dokument** `docs/PLAN-DZIALANIA.md`: werdykt (cena 99 zł zostaje — najtańsza w segmencie; problem = dystrybucja + polish), sprinty naprawcze P0–P2 w dniach, higiena copy („Cancel kiedy chcesz" ×3 na landingu), plan sprzedaży (piloty done-for-you, „Start za Ciebie" 199 zł, partnerstwa z twórcami stron), bramka decyzyjna po 10 rozmowach, lista „czego NIE robić".
- Pliki/obszar: `docs/PLAN-DZIALANIA.md` (nowy), `DOCS.md` (indeks)
- Review: audyt oparty o dane (GSC/Senuto z audytu SEO 2026-06-30, research 2026-07); kod nie zmieniany
- Status: ✅ raport gotowy · 🔄 sprinty naprawcze i sprzedaż wg planu

## 2026-07-01 (środa)

### Nowy wpis blogowy „Urlop bez utraty klientów" + fix lokalnego dev — Claude — branch feat/blog-urlop
- Co zrobione:
  - **Nowy post MDX** `urlop-bez-utraty-klientow-firma-uslugowa.mdx` (temat sezonowy: bot odbiera pytania, gdy właściciel jest na urlopie). Answer-first, box „W skrócie", InfoBox ze **zweryfikowaną statystyką** (78% klientów kupuje u firmy, która odpowie pierwsza — Vendasta/Lead Connect 2025), Callout, CTABlock, FAQ, 4 linki wewnętrzne (pytania-nocne, WordPress, ROI, leady). 3 grafiki (hero + 2 inline) wygenerowane przez Gemini nano banana (AI Studio), zoptymalizowane do webp (81/48/96 KB) w `public/blog/`.
  - **Fix lokalnego dev** (`apps/web`): `.env.local` nie miał wymaganych `NEXT_PUBLIC_SUPABASE_*` (middleware 500 na każdej trasie) → dodane placeholdery; `node_modules` był niekompletny (brak `@vercel/speed-insights`) → reinstall pnpm 9. Szczegóły w pamięci projektu.
- Pliki/obszar: `apps/web/content/blog/urlop-*.mdx`, `apps/web/public/blog/urlop-*.webp`
- Review: **botiko-content — 0 blokerów** (język marki, cena 99 zł, brak obietnic rezerwacji → Booksy/Calendly, autor Mateusz Woronowicz, bez emoji, statystyka ocytowana). Poprawione niespójne cudzysłowy. Zweryfikowane renderem lokalnym (HTTP 200).
- Status: 🔄 wpis gotowy, data publikacji 15.07.2026 (auto-publish); PR do review

### PageSpeed: LCP hero + labelki suwaków (a11y/agentic) — Claude — branch fix/pagespeed-lcp-a11y
- Co zrobione:
  - **LCP** (mobile 5,4 s → element LCP malował się ~3,4 s po FCP): `<h1>` hero miał `animate-fade-in-up` (opacity 0→1), a animowanie opacity elementu LCP opóźnia Largest Contentful Paint. Nowy keyframe `heroRise` (tylko `transform: translateY`, bez opacity) + klasa `animate-hero-rise` z guardem `prefers-reduced-motion`. Wszystkie elementy above-the-fold hero (badge, h1, opis, CTA, mockup) malują się teraz od razu przy pełnej widoczności — entrance zachowany, ale bez kosztu LCP.
  - **Dostępność 89 + Przeglądanie agentowe 2/3** („Form elements must have labels"): dwa suwaki `range` w `Pricing.tsx` (kalkulator ROI) nie miały powiązanych labeli. Dodane `htmlFor`/`id` do widocznych `<label>` + `aria-label`. Pozostałe suwaki (`ROICalculator`, `LostClientsCalculator`) już miały `aria-label`.
- Pliki/obszar: `apps/web/components/marketing/Hero.tsx`, `apps/web/components/marketing/Pricing.tsx`, `apps/web/app/globals.css`
- Review: type-check czysty (jedyny błąd pre-existujący: brak `@vercel/speed-insights` w lokalnym env). Weryfikacja wyniku PSI po deployu.
- Status: 🔄 wdrożone w kodzie — do potwierdzenia re-runem PageSpeed Insights po merge

### Porządki repo + spójność oferty — Claude — PR #82, #83
- Co zrobione:
  - **Spójność cen** (audyt subagentem): `docs/CODEMAPS/*` miały nieaktualne 149 PLN (10 miejsc, m.in. „Stripe charges") → 99 zł. Kod billingu był OK. Naprawiony over-promise rezerwacji w `blog/chatbot-recepcja.mdx` (live sloty, „integracja z systemem rezerwacji", tabela, FAQ) — bot odsyła do Booksy/Calendly. Usunięte martwe PRO/PREMIUM w `BillingClient.tsx` (MVP = jeden plan).
  - **Kontekst**: `CLAUDE.md` — aktualny stan (wtyczka WP zgłoszona do wp.org), roadmapa Fazy 2, limit widgetu ujednolicony do 14 KB (był rozjazd 12/13/14), lista 5 jobów CI. Nowa zasada: **commity/PR bez śladów AI** + wpis w pamięci.
  - **Sprzątanie**: usunięte binaria `MasterPlan` i nietrackowany `botiko.pl-audit/` (raport został w `docs/seo/audyt-2026-06-30.md`), usunięty nieużywany `components/ui/Spinner.tsx`, emoji z `apps/api/README.md`. Emoji w szablonach PDF świadomie zostawione.
- Pliki/obszar: `docs/CODEMAPS/*`, `CLAUDE.md`, `DOCS.md`, `.github/workflows/ci.yml`, `apps/web` (BillingClient, chatbot-recepcja, Spinner), `apps/api/README.md`
- Review: audyt cen/oferty + raport martwego kodu przez subagentów; CI zielone na obu PR-ach.
- Status: ✅ done — repo uporządkowane i spójne przed kolejnymi zmianami

### Zgłoszenie wtyczki do wp.org + zgodność z Plugin Check — Claude — PR #78, #79, #80
- Co zrobione:
  - **Fix builda Railway** (PR #77): `railway.json` buildCommand ustawiał `NODE_ENV=production` → `pnpm install` przycinał devDeps (prisma, @nestjs/cli) → `prisma generate` padał. Prefiks `NODE_ENV=development` + `--frozen-lockfile`.
  - **Plugin Check — runda 1** (PR #78, v1.0.3): readme.txt w całości po angielsku (wymóg wp.org), `Tested up to: 7.0`, usunięto `load_plugin_textdomain()`, Plugin Name/Description po angielsku (UI panelu zostaje PL).
  - **Slug** (PR #79, v1.0.4): slug wynika z nazwy → `botiko-ai-customer-service-bot`. Zsynchronizowano review URL w panelu, `SLUG` w `wp-deploy.yml`, `PUBLISHING.md`.
  - **Plugin Check — runda 2** (PR #80, v1.0.5): 72 błędy `TextDomainMismatch` — text domain musi = slug. Zmieniono text domain we wszystkich wywołaniach i18n + nagłówek + `phpcs.xml.dist` + `.pot`; `build.sh` pakuje ZIP do folderu = slug (folder instalacji musi = text domain). `PAGE_SLUG` bez zmian.
- Pliki/obszar: `apps/api/railway.json`, `wordpress-plugin/botiko/*`, `wordpress-plugin/build.sh`, `.github/workflows/wp-deploy.yml`, `wordpress-plugin/PUBLISHING.md`
- Review: **Plugin Check = 0 błędów** (potwierdzone przez użytkownika). CI zielone na każdym PR.
- Status: ✅ wtyczka zgłoszona do katalogu wp.org, czeka na review zespołu Plugins (~1–10 dni)

### M4 — przygotowanie do publikacji w wp.org — Claude — branch `chore/wordpress-org-publishing`
- Co zrobione:
  - **Merge** PR #75 (przeprojektowany panel) do `main` — PR #74 (pairing) już wcześniej wdrożony na produkcję; endpointy `/bot/pair` i `/bot/:id/pairing-token` żywe (zweryfikowane curl: 200/401/400).
  - **Assety katalogu** w `wordpress-plugin/.wordpress-org/`: `icon.svg` (gradient marki + biały mark), `icon-256/128.png`, `banner-772x250.png`, `banner-1544x500.png` (wygenerowane z brand SVG: svglib+cairo render + Pillow gradient/tekst). Screenshoty — do dorobienia przez użytkownika z żywego panelu (opisy już w `readme.txt`).
  - **Automatyzacja wydań**: `.github/workflows/wp-deploy.yml` (10up action, trigger na tag semver, nieaktywny do czasu sekretów SVN_USERNAME/PASSWORD + akceptacji wp.org).
  - **Guide**: `wordpress-plugin/PUBLISHING.md` (proces zgłoszenia + wydań + „co PO publikacji"); wpis w `DOCS.md`.
  - Wersja wtyczki 1.0.2 (cache-bust CSS + poprawki: wyśrodkowane pola wyboru, link do `/dashboard/overview`).
- Pliki/obszar: `wordpress-plugin/.wordpress-org/`, `wordpress-plugin/PUBLISHING.md`, `.github/workflows/wp-deploy.yml`, `DOCS.md`, `wordpress-plugin/botiko/*` (v1.0.2)
- Review: CI zielone (PHPCS + build). Landing/EmbedCode/SetupWizard **świadomie NIE zmieniane** — dopiero po realnej publikacji w katalogu (bez fałszywych obietnic).
- Status: ✅ assety + tooling + docs gotowe · ⏸ samo zgłoszenie do wp.org + review (~1–2 tyg) = akcja użytkownika (konto wp.org, upload ZIP)

### Przeprojektowanie panelu wtyczki (UX/UI) — Claude — branch `feat/wordpress-plugin`
- Co zrobione:
  - **Menu top-level** z logo Botiko (base64 SVG mark) zamiast pozycji w „Ustawienia" (`add_menu_page`); zaktualizowane URL-e i `screen->id` w notices + hook `enqueue`.
  - **Zero emoji/znaków-jako-ikon** — cały panel na inline SVG (styl Lucide, `currentColor`), wypisywane przez `wp_kses()` z allowlistą svg/path/line/circle/polyline/polygon. Usunięte 🤖 ✓ ⚠ ● ○.
  - **Branded header** (gradient marki + biały wordmark `botiko-logo-white.svg` + pill wersji/panelu), układ 2-kolumnowy (main + sidebar), karty z zaokrągleniami/cieniem.
  - **Naprawiony rozjeżdżający się napis** „Przytrzymaj Ctrl/Cmd" — hint jako blok pod selectem (nie inline), select 100% szer.; picker stron chowa się dla trybu „wszystkie" (progressive disclosure w JS).
  - **Rozbudowana pomoc** (sidebar): karta „Przydatne linki" (dokumentacja / panel / kontakt) z ikonami, karta-notka „wygląd zmienisz w panelu", **karta z prośbą o opinię** (gwiazdki + „Oceń wtyczkę" → wp.org reviews, filtrowalny URL).
  - Przebudowany ZIP do uploadu (`C:\…\Downloads\botiko.zip`, 15 plików).
- Pliki/obszar: `wordpress-plugin/botiko/includes/class-botiko-admin.php` (rewrite), `assets/admin.css` (rewrite), `assets/admin.js`, `assets/botiko-logo-white.svg` (nowy), `includes/class-botiko-notices.php`, `readme.txt`
- Review: reguła „SVG nie emoji" zapisana w pamięci (rozszerzona na PHP/WordPress). PHP niesprawdzalne lokalnie (brak PHP) — walidacja przez CI (PHPCS + php -l).
- Status: 🔄 czeka na zielony CI (PHPCS) + wizualną akceptację użytkownika

### Oficjalna wtyczka WordPress + one-click pairing — Claude — branch `feat/wordpress-plugin`
- Co zrobione:
  - **M1 — rdzeń wtyczki (PHP)** w `wordpress-plugin/botiko/`: Settings API, wstrzyknięcie loadera widgetu w `wp_footer` (skip `wp-admin`), reguły wyświetlania + tryb testowy, panel statusu przez publiczny `/bot/:id/config` (`domainAllowed`), i18n PL+EN, `uninstall.php`, `readme.txt`, GPLv2. Bezpieczeństwo: nonce, `manage_options`, sanityzacja (CUID), escapowanie.
  - **M2 — one-click pairing (cross-app):** model `BotPairingToken` + migracja (token 15 min, jednorazowy, w DB tylko SHA-256); `POST /bot/:id/pairing-token` (auth) + `POST /bot/pair` (publiczny, throttle, Zod, atomowa wymiana w `$transaction`, dopis domeny www-insensitive, limit 5); UI „Generuj kod połączenia" w panelu (`EmbedCode.tsx`); flow „Połącz" we wtyczce. 8 testów jednostkowych.
  - **M3 — tooling/CI:** composer + PHPCS (WordPress + Extra), `build.sh` (ZIP), nowy job CI „WordPress plugin (PHPCS + build)".
- Pliki/obszar: `wordpress-plugin/`, `apps/api/src/modules/bot/*`, `apps/api/prisma/*`, `apps/web/app/dashboard/embed/EmbedCode.tsx`, `.github/workflows/ci.yml`
- Review: `security-reviewer` na endpoincie pairing — **zero Critical/High**; naprawione 2 drobne (twardsza walidacja domeny http(s), atomowy delete+create tokena). API: tsc + ESLint + 8 testów ✅.
- Status: ✅ M1–M3 done · ⏸ M4 (publikacja w katalogu WordPress.org + aktualizacja landingu „dostępna") — czeka na review wp.org (osobny proces ~1–2 tyg.); do tego czasu landing trzyma obecną obietnicę (bez fałszywych twierdzeń).

---

## 2026-06-30 (wtorek)

### Workflow armii subagentów + dziennik prac — Claude — branch `feat/agent-workflow`
- Co zrobione:
  - Utworzono `WORKLOG.md` (ten plik) — jeden dziennik prac, wpis po każdym etapie.
  - Utworzono `docs/AGENT-WORKFLOW.md` — spisany proces „kiedy którego agenta" + definition of done.
  - Dodano 2 nowe agenty wersjonowane w repo: `.claude/agents/botiko-content.md` (poprawność treści PL + język marki) i `.claude/agents/botiko-business.md` (logika biznesowa + zakres MVP).
  - Zmapowano 7 ról zespołu na istniejących + nowych agentów.
  - Zarejestrowano nowe dokumenty w `DOCS.md`; dodano sekcję workflow do `CLAUDE.md`.
- Pliki/obszar: `.claude/agents/`, `WORKLOG.md`, `docs/AGENT-WORKFLOW.md`, `DOCS.md`, `CLAUDE.md`
- Review: zgodność z DOCS.md (jedna funkcja = jeden dokument) ✅
- Status: ✅ done
