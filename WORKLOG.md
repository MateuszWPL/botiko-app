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

## 2026-07-01 (środa)

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
