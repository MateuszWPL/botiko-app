# Botiko.pl

Polska SaaS platforma AI chatbot B2B dla mikro i małych firm usługowych.

**Polska dokumentacja:** `CLAUDE.md` | **Angielska dokumentacja:** `CODEMAPS/` | **Zadania:** `TASK.md`

---

## Struktura

```
apps/web/     — Next.js 14 + Tailwind v4 (Frontend + Dashboard)
apps/api/     — NestJS + Prisma (Backend REST API)
apps/widget/  — Preact + Vite (Embed script <12KB)
wordpress-plugin/ — Oficjalna wtyczka WordPress (PHP) — osadza widget + one-click pairing
```

---

## Architektura & Codemaps

Architektura projektu opisana w `/docs/CODEMAPS/` (angielski, techniczny):

| Dokument | Zawartość |
|----------|-----------|
| **[INDEX.md](./docs/CODEMAPS/INDEX.md)** | Przegląd całego systemu, architektura, kluczowe decyzje |
| **[backend.md](./docs/CODEMAPS/backend.md)** | NestJS API, moduły, guardy, RAG pipeline |
| **[frontend.md](./docs/CODEMAPS/frontend.md)** | Next.js aplikacja, routing, formularze, state management |
| **[widget.md](./docs/CODEMAPS/widget.md)** | Preact widget, Shadow DOM, bundle size management |
| **[database.md](./docs/CODEMAPS/database.md)** | Prisma schema, pgvector, encryption, RLS policies |
| **[integrations.md](./docs/CODEMAPS/integrations.md)** | OpenAI, Supabase, Stripe, Resend, CDN |

---

## Local Development

Wymagania: Node.js 20+, `pnpm`

Zmienne środowiskowe bazują na `.env.example` w root.

### API (Terminal 1)
```bash
cd apps/api
pnpm install
cp ../../.env.example .env
# Uzupełnij: DATABASE_URL, SUPABASE_*, OPENAI_API_KEY, JWT_SECRET, ENCRYPTION_KEY
pnpm start:dev
# Dostępne na: http://localhost:3001
```

### Web (Terminal 2)
```bash
cd apps/web
pnpm install
cp ../../.env.example .env.local
# Uzupełnij: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev
# Dostępne na: http://localhost:3000
```

### Widget (Terminal 3)
```bash
cd apps/widget
pnpm install
pnpm dev
# Dostępne na: http://localhost:5173
pnpm build   # Sprawdza limit <12KB gzip
```

---

## Supabase Setup

### RLS Policies

Włącz polityki Row-Level Security w Supabase:

1. Otwórz Supabase dashboard
2. SQL Editor → nowy query
3. Wklej zawartość: `supabase/migrations/001_rls_policies.sql`
4. Uruchom (Run)

### Database Connection

- **Dla localhost:** Użyj poolera: `*.pooler.supabase.com` (IPv6-safe)
- **Dla produkcji:** Użyj bezpośredniego hosta: `db.*.supabase.co`

---

## Testing

### API Unit Tests
```bash
cd apps/api
pnpm test              # Wszystkie testy
pnpm test:watch       # Watch mode
pnpm test:cov         # Coverage report
```

### API E2E Tests
```bash
cd apps/api
pnpm test:e2e         # End-to-end testy
```

### Web Type Checking
```bash
cd apps/web
pnpm tsc --noEmit     # TypeScript check
```

### Widget Bundle Size
```bash
cd apps/widget
pnpm build            # Fail jeśli >12KB gzip
```

---

## Git Workflow

Repozytorium używa Conventional Commits (wymagane przez commitlint):

```bash
# Format
git commit -m "feat(api): dodaj endpoint /api/v1/bots"
git commit -m "fix(widget): napraw resize container"
git commit -m "docs(README): zaktualizuj instrukcje setup"
```

Prawidłowe prefiksy: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

Scope (opcjonalny): `api`, `web`, `widget`

---

## Dokumentacja Kontekstu

**`DOCS.md` to mapa wszystkich dokumentów (funkcja → dokument).** Zacznij tam, jeśli szukasz, gdzie co mieszka.

### Dla AI (Claude)
- `CLAUDE.md` — Pełny kontekst architektoniczny + konwencje
- `TASK.md` — Mapa zadań (roadmapa, etapy)
- `docs/AI-COMMANDS.md` — Quick reference komend / agentów / MCP

### Dla Całego Zespołu
- `DOCS.md` — Indeks całej dokumentacji
- `/docs/CODEMAPS/` — Detailowana architektura techniczna (angielski)
- `/docs/seo/` — Playbook i audyty SEO/GEO
- README.md files w każdym app (`apps/api/README.md`, etc.)

---

## Project Status

**Faza:** 1A ukończona — **MVP na produkcji** (`botiko.pl`). Trwa Faza 2 (piloty).

**Infrastruktura:** Web → Vercel (auto-deploy z `main`) · API → Railway · Widget → Vercel.
Instrukcja env vars + DNS: [`docs/PRODUCTION_ENV.md`](./docs/PRODUCTION_ENV.md)

**Co działa na produkcji:**
- ✅ RAG pipeline (embeddings → pgvector → GPT-4o-mini)
- ✅ Widget (<12KB, Shadow DOM, natywnie pod WordPress; działa też na każdej innej stronie WWW)
- ✅ Dashboard (10 stron + Stripe billing + import strony WWW)
- ✅ System emailowy (Resend — drip scheduler, powiadomienia o leadach, billing webhooks)
- ✅ Landing page + blog SEO (32 posty MDX z content runway do lipca 2026, auto-publikacja wg daty)
- ✅ Security (CORS, UUID validation, AES-256-GCM encryption)

**Backlog (drobne, nie blokują):**
- Monitoring produkcyjny (Sentry + UptimeRobot)
- Uzupełnienie brakujących testów jednostkowych (`TASK.md §1A.7`)

---

## Zasoby

- **Repo:** https://github.com/MateuszWPL/botiko-app
- **Produkcja:** https://botiko.pl
- **Hosting:** Railway (API) · Vercel (Web + Widget)
- **Supabase:** https://supabase.com (PostgreSQL + Auth)
- **Stripe:** https://stripe.com (Billing)
- **OpenAI:** https://openai.com (API key)
- **Resend:** https://resend.com (Email)

---

## Support

- Issue reporting: GitHub Issues
- Questions: Check `CLAUDE.md` or `/docs/CODEMAPS/`
- Architecture decisions: See `/docs/CODEMAPS/INDEX.md`
