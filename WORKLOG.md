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
