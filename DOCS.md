# Botiko.pl — Mapa dokumentacji

**Jeden dokument-źródło prawdy: gdzie co mieszka i kto za co odpowiada.**
Dodajesz / zmieniasz / usuwasz dokument? Zaktualizuj tę tabelę w tym samym commicie.

> Zasada: **jedna funkcja = jeden dokument**. Zanim utworzysz nowy plik, sprawdź, czy
> jego funkcji nie pełni już któryś z poniższych. Jeśli tak — rozbuduj istniejący.

---

## Indeks — funkcja → dokument

| Funkcja | Dokument | Język | Aktualizuj gdy |
|---|---|---|---|
| **Wejście / przegląd repo** | [`README.md`](README.md) | PL | zmiana struktury repo, setupu, statusu fazy |
| **Instrukcje dla Claude / konwencje / git flow** | [`CLAUDE.md`](CLAUDE.md) | PL | zmiana konwencji, architektury, zasad pracy |
| **Ta mapa dokumentacji** | [`DOCS.md`](DOCS.md) | PL | dodanie / przeniesienie / usunięcie dowolnego dokumentu |
| **Roadmapa / zadania (fazy 0–2)** | [`TASK.md`](TASK.md) | PL | po każdym ukończonym / nowym tasku |
| **Dziennik prac (co ZROBIONE, data + agent)** | [`WORKLOG.md`](WORKLOG.md) | PL | po każdym logicznym etapie pracy |
| **Workflow agentów (kiedy którego agenta, definition of done)** | [`docs/AGENT-WORKFLOW.md`](docs/AGENT-WORKFLOW.md) | PL | zmiana procesu pracy / zestawu agentów |
| **Pełny kontekst produktu (marka, marketing, oferta)** — do Claude.ai Projects | [`BOTIKO_CONTEXT.md`](BOTIKO_CONTEXT.md) | PL | zmiana pozycjonowania, oferty, marki |
| **Architektura techniczna (3 apki, RAG, schema, integracje)** | [`docs/CODEMAPS/`](docs/CODEMAPS/INDEX.md) | ENG | zmiana architektury / modułów / schematu DB |
| **Produkcyjne env + deploy (Railway/Vercel)** | [`docs/PRODUCTION_ENV.md`](docs/PRODUCTION_ENV.md) | PL | zmiana zmiennych środowiskowych / hostingu |
| **Komendy AI / agenci / MCP — quick ref** | [`docs/AI-COMMANDS.md`](docs/AI-COMMANDS.md) | PL | zmiana zestawu agentów / komend |
| **SEO/GEO — playbook (co zrobione, co off-page, backlog)** | [`docs/seo/PLAYBOOK.md`](docs/seo/PLAYBOOK.md) | PL | po każdym kroku SEO (on-page i off-page) |
| **SEO — raporty / audyty (punkt w czasie)** | [`docs/seo/`](docs/seo/) | PL | nowy audyt → nowy plik `audyt-RRRR-MM-DD.md` |
| **Treść: baza wiedzy bota (do wgrania)** | [`docs/content/bot-knowledge-base.md`](docs/content/bot-knowledge-base.md) | PL | zmiana oferty / FAQ / danych firmy |
| **Treść: zestaw maili (Resend)** | [`docs/content/emails.md`](docs/content/emails.md) | PL | zmiana szablonów / dripów mailowych |
| **Migracje DB — zasady (RLS vs Prisma)** | [`supabase/migrations/README.md`](supabase/migrations/README.md) | PL/ENG | zmiana procesu migracji |
| **Wtyczka WordPress — publikacja w katalogu (wp.org)** | [`wordpress-plugin/PUBLISHING.md`](wordpress-plugin/PUBLISHING.md) | PL | zmiana procesu wydań / assetów wtyczki |
| **Per-apka: setup, skrypty, deploy** | `apps/{api,web,widget}/README.md` | ENG | zmiana w danej aplikacji |

> Blog (treść marketingowa) żyje w `apps/web/content/blog/*.mdx`, nie tutaj — to treść produktu, nie dokumentacja.

---

## Struktura

```
Root (minimalny):
  README.md            — wejście do repo
  CLAUDE.md            — instrukcje dla Claude + konwencje
  DOCS.md              — TEN plik (mapa dokumentacji)
  TASK.md              — roadmapa (co PLANUJEMY)
  WORKLOG.md           — dziennik prac (co ZROBIONE)
  BOTIKO_CONTEXT.md    — pełny kontekst produktu (użycie zewnętrzne)

docs/
  AGENT-WORKFLOW.md    — proces pracy z subagentami
  AI-COMMANDS.md       — quick ref komend AI
  PRODUCTION_ENV.md    — env + deploy
  CODEMAPS/            — architektura (INDEX + backend/frontend/widget/database/integrations)
  seo/                 — PLAYBOOK + raporty/audyty SEO
  content/             — baza wiedzy bota + maile
```

---

## Zasady utrzymania

1. **Jedna funkcja = jeden dokument.** Nie twórz drugiego pliku o tej samej roli — rozbuduj istniejący.
2. **Nowy dokument → wpis w tej tabeli** (w tym samym commicie). Bez wpisu = dokument „nie istnieje".
3. **Grupuj po funkcji** w `docs/<obszar>/` (np. `docs/seo/`, `docs/content/`). Root trzymaj minimalny (5 plików powyżej).
4. **Raporty/audyty są punktem w czasie** — nazywaj z datą (`*-RRRR-MM-DD.md`), nie nadpisuj starych. Żywe ustalenia trafiają do właściwego żywego dokumentu (np. wnioski z audytu → `seo/PLAYBOOK.md`).
5. **Linki względne** i zgodne z wielkością liter (hosting bywa case-sensitive — `TASK.md`, nie `task.md`).
6. **Aktualizuj daty/statusy**, gdy dokument rozjeżdża się z rzeczywistością.
