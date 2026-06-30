# Agent Workflow — armia subagentów Botiko.pl

**Jak pracujemy z subagentami: kiedy którego odpalić i kiedy zadanie jest „done".**
Quick-ref samych komend → [`AI-COMMANDS.md`](AI-COMMANDS.md). Tu jest *proces*.

---

## Zasada główna

Claude orkiestruje. Użytkownik nie musi pamiętać, którego agenta wywołać —
Claude dobiera agentów do etapu pracy automatycznie i **na koniec dopisuje wpis do
[`WORKLOG.md`](../WORKLOG.md)**. Agenci-recenzenci pracują równolegle (jedna wiadomość,
wiele wywołań), bo ich obszary są niezależne.

---

## Zespół — 7 ról → agent

| # | Rola | Agent | Kiedy odpalić |
|---|---|---|---|
| 1 | **Architekt / plan** | `architect`, `planner` | przed nową funkcją lub większym refaktorem |
| 2 | **Builder / dev** | Claude główny + `build-error-resolver` | pisanie kodu; gdy build/tsc się sypie |
| 3 | **Security / RODO** | `security-reviewer` | po kodzie z auth, input, PII, endpointami, billingiem |
| 4 | **Logika biznesowa** | `botiko-business` 🆕 | nowa funkcja, zmiana billingu/limitów, decyzja „czy w MVP" |
| 5 | **Poprawność treści PL** | `botiko-content` 🆕 | każda zmiana treści: landing, blog MDX, copy, maile, prompty bota |
| 6 | **SEO / GEO** | `claude-seo:*` + skille SEO | zmiana treści SEO, nowy post, audyt, schema, sitemap |
| 7 | **Dokumentacja** | `doc-updater` | zmiana architektury/modułów → codemapy, README, DOCS.md |

Wsparcie (na żądanie): `typescript-reviewer`, `code-reviewer`, `refactor-cleaner`,
`performance-optimizer` (widget <14KB), `e2e-runner`, `tdd-guide`.

🆕 = agent wersjonowany w repo (`.claude/agents/`). Reszta — globalna instalacja.

---

## Pipeline „definition of done"

Każde nielogiczne zadanie przechodzi przez te etapy. Drobny fix może pominąć 1 i 3.

```
1. PLAN        → architect/planner: rozbij zadanie, wskaż pliki, ryzyka
                 (przy funkcjach dotykających modelu biznesowego → botiko-business)
2. BUILD       → Claude pisze kod; build-error-resolver gdy build się sypie
3. REVIEW ⇉    → RÓWNOLEGLE (zależnie od typu zmiany):
                   • kod          → security-reviewer + typescript-reviewer/code-reviewer
                   • treść        → botiko-content (+ claude-seo:* jeśli SEO)
                   • funkcja      → botiko-business
4. FIX         → Claude nanosi poprawki ze znalezisk; ponowny review jeśli BLOKERY
5. DOCS        → doc-updater: codemapy/README/DOCS.md jeśli zmieniła się architektura
6. WORKLOG     → Claude dopisuje wpis do WORKLOG.md (data, dzień, co, review, status)
7. GIT         → commit (Conventional Commits) + push; gh pr create gdy zadanie skończone
```

### Co kiedy uruchomić (tabela decyzyjna)

| Typ zmiany | Obowiązkowy review przed commitem |
|---|---|
| Kod API/auth/billing/PII | `security-reviewer` + `botiko-business` |
| Kod TS/Preact (logika) | `typescript-reviewer` lub `code-reviewer` |
| Treść (landing/blog/copy/maile/prompty) | `botiko-content` |
| Treść SEO / nowy post / schema | `botiko-content` + `claude-seo:*` |
| Nowa funkcja / zmiana zakresu | `botiko-business` (najpierw, na etapie planu) |
| Schema Prisma | `database-migrations` skill — migracja w TYM SAMYM commicie |
| Zmiana architektury/modułów | `doc-updater` (codemapy) |
| Widget (rozmiar) | `performance-optimizer` — limit <14KB gzip |

---

## Reguły twarde (z CLAUDE.md — nie naruszać)

- **Schema Prisma = migracja w tym samym commicie** (Railway robi `migrate deploy`; brak migracji = prod 500).
- **`supabase/migrations/` tylko RLS/Postgres-specific** — nigdy DDL (drift).
- **Walidacja Zod na wszystkich endpointach**, TypeScript strict (zero `any`/`ts-ignore`).
- **Git:** branch per zmiana, nigdy direct push na `main`, commit po każdym etapie.
- **Treść:** „bot"/„Botiko" nie „asystentka"; SVG Lucide nie emoji; jeden plan 99 zł.

---

## Przykład przebiegu (nowa landing page branżowa)

```
botiko-business  → „W zakresie MVP? Tak, akwizycja. Branża usługowa = OK."
Claude (build)   → tworzy app/dla/<branza>/page.tsx
botiko-content   ⇉ język marki, brak „asystentki", CTA konkretne, PL poprawne
claude-seo:*     ⇉ meta, schema, internal linki, GEO
   (równolegle)
Claude (fix)     → nanosi poprawki z obu
doc-updater      → jeśli doszła nowa trasa do mapy
Claude           → wpis do WORKLOG.md + commit + push + PR
```
