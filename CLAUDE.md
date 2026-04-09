# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Projekt

Botiko.pl — polska SaaS platforma AI chatbot B2B dla mikro/małych firm usługowych (salony beauty, gabinety, restauracje, warsztaty). Jeden produkt, wiele branż. Klient wybiera branżę w onboardingu → dostaje gotowy szablon asystentki AI.

**Cel MVP:** 15 płacących klientów w 6 miesięcy.

### Czego NIE robimy w MVP
- NIE budujemy systemu rezerwacji (bot odsyła do Booksy/Calendly)
- NIE obsługujemy płatności za usługi klientów końcowych
- NIE budujemy osobnych domen per branża — JEDNA platforma Botiko.pl
- NIE robimy natywnej apki mobilnej — dashboard jest responsive PWA
- NIE targetujemy korporacji — tylko mikro i małe firmy usługowe
- NIE używamy Turborepo/monorepo workspace — 3 osobne apps z własnym `pnpm install`

---

## Struktura repo

```
apps/web/      → Next.js 14 App Router + Tailwind v4 (dashboard, port 3000)
apps/api/      → NestJS + Prisma (REST API, port 3001)
apps/widget/   → Preact + Vite (embed script, port 5173, target <12KB gzip)
supabase/      → SQL migrations (RLS policies)
```

---

## Development Commands

### API (`apps/api`)
```bash
pnpm start:dev       # Watch mode
pnpm build           # Compile to dist/
pnpm lint            # ESLint + autofix
pnpm format          # Prettier
pnpm test            # Jest unit tests (src/**/*.spec.ts)
pnpm test:watch      # Jest watch mode
pnpm test:e2e        # Supertest e2e (test/**/*.e2e-spec.ts)
pnpm test:cov        # Coverage report
```

Pojedynczy plik testowy:
```bash
pnpm test -- --testPathPattern=chat.service
```

### Web (`apps/web`)
```bash
pnpm dev             # Next.js dev server
pnpm build           # Production build
pnpm lint            # ESLint
```

### Widget (`apps/widget`)
```bash
pnpm dev             # Vite dev server
pnpm build           # Build dist/embed.js — rzuca błąd jeśli >12KB gzip
pnpm preview         # Preview zbudowanego bundle
```

---

## Environment Setup

Skopiuj z root `.env.example`:
- **API**: `cp .env.example apps/api/.env`
- **Web**: `cp .env.example apps/web/.env.local` (tylko `NEXT_PUBLIC_*` zmienne)

Wymagane zmienne: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `JWT_SECRET` (min. 64 znaki hex), `ENCRYPTION_KEY` (min. 64 znaki hex).

API waliduje wszystkie zmienne przez Zod przy starcie (`src/config/env.ts`) — process exits przy błędzie.

**Windows + Supabase SSL**: dodaj `NODE_TLS_REJECT_UNAUTHORIZED=0` do `apps/api/.env`.

---

## Architektura

### Multi-Tenancy
Każda tabela ma `tenant_id`. Supabase RLS policies wymuszają izolację wierszy. W NestJS — `TenantGuard` + `@CurrentTenant()` dekorator wyciągają `tenant_id` z JWT (`user_metadata.tenant_id`). Widget nie ma auth — używa `botId` do mapowania na tenant.

### Authentication Flow
1. **Web**: Supabase Auth (SSR via `@supabase/ssr`) → JWT
2. **API**: `AuthGuard` weryfikuje JWT przez `supabase.auth.getUser(token)` (service role)
3. **Widget** (`/chat`, `/leads`, `/bot/:id/config`): publiczne, bez auth — chronione domain whitelistingiem (`bot.allowedDomains`) i rate limitami

### Chat / RAG Pipeline
`POST /api/v1/chat` → ChatService:
1. Załaduj config bota
2. Embed zapytania użytkownika (OpenAI `text-embedding-3-small`, 1536-dim)
3. pgvector similarity search na tabeli `KnowledgeChunk` (próg 0.3)
4. Zbuduj system prompt z szablonu branżowego (BEAUTY/HEALTH/FOOD/AUTO/OTHER) + pobrane chunki
5. Wyślij do OpenAI `gpt-4o-mini` z historią rozmowy
6. Zapisz parę wiadomości, zwróć odpowiedź

### Data Security
- **PII encryption**: imię i telefon leada — AES-256-GCM at-rest
- **Format**: `{iv}:{authTag}:{ciphertext}` (hex) — `src/common/services/encryption.service.ts`
- **Walidacja**: wszystkie request DTOs przez Zod + custom `ZodValidationPipe`

### API Middleware Stack (kolejność ma znaczenie)
Helmet → CORS → Throttler → GlobalExceptionFilter → ZodValidationPipe → AuthGuard → TenantGuard

### Rate Limits (per IP)
- Default: 100 req/min
- Auth endpoints: 10 req/min
- Chat: 20 req/min
- Leads: 5 req/min (antyspam)

### Widget Constraints
- **Hard limit**: <12KB gzip — wymuszany przez plugin Vite w `vite.config.ts`
- Shadow DOM izoluje style od strony hosta
- Preact (nie React) — dla rozmiaru bundle
- Konfigurowany przez `data-bot-id` na tagu `<script>`, opcjonalnie `data-api-url`

### Database Schema (Prisma — `apps/api/prisma/schema.prisma`)
Główne modele: `Tenant`, `User`, `Bot`, `KnowledgeChunk` (pgvector), `Lead` (PII encrypted), `Conversation`, `Message`

Enums: `Industry` (BEAUTY/HEALTH/FOOD/AUTO/OTHER), `Plan` (STARTER/PRO/PREMIUM), `LeadStatus` (NEW/CONTACTED/CONVERTED/LOST), `MsgRole` (USER/ASSISTANT)

---

## Konwencje

- TypeScript strict mode — zero `any`, zero `ts-ignore`
- Walidacja przez Zod na WSZYSTKICH endpoints (nie class-validator)
- Brak wspólnego pakietu `@botiko/types` — każda aplikacja ma własne typy
- Komponenty: PascalCase | Hooks: use+PascalCase | Utils: camelCase | Types: PascalCase
- API endpoints: REST, format `/api/v1/*`

---

## Git Workflow (OBOWIĄZKOWY — Claude robi to autonomicznie)

### Zasada główna — Claude zarządza git samodzielnie
**Użytkownik NIE musi pilnować commitów, pushów ani PR-ów.**
Claude wykonuje cały flow git autonomicznie po każdym logicznym etapie pracy — bez czekania na polecenie.

### Autonomiczny flow Claude'a (krok po kroku)
```
1. Przed pracą → sprawdź branch (jeśli main: utwórz nowy branch)
2. Podczas pracy → commit po każdym działającym etapie
3. Po etapie → push na branch
4. Po skończeniu zadania → gh pr create (jeśli PR jeszcze nie istnieje)
```

Claude informuje użytkownika co zrobił ("Zacommitowałem X na branchu Y, PR: link") — ale nie pyta o pozwolenie na każdy krok.

### Kiedy commitować (checkpoint strategy)
| Zdarzenie | Akcja Claude'a |
|---|---|
| Nowa funkcjonalność działa | `git commit` + `git push` |
| Bug naprawiony i sprawdzony | `git commit` + `git push` |
| Zmiana konfiguracji / deps | `git commit` + `git push` |
| Logiczny etap większego zadania skończony | `git commit` + `git push` |
| Zadanie całkowicie skończone | `gh pr create` (jeśli nie ma jeszcze PR) |

### Nazewnictwo branchy
```
feat/<opis>        # nowa funkcjonalność
fix/<opis>         # naprawa błędu
chore/<opis>       # konfiguracja, dependencies, infrastruktura
refactor/<opis>    # refaktoryzacja bez zmiany zachowania
docs/<opis>        # tylko dokumentacja
```

### Conventional Commits (wymagane, commitlint to blokuje)
```
feat: dodaj endpoint /api/v1/bots
fix: napraw błąd walidacji leada
chore: zaktualizuj zależności Supabase
refactor: wydziel ChatService do osobnego modułu
docs: opisz RAG pipeline w README
test: dodaj testy jednostkowe dla EncryptionService
ci: dodaj job sprawdzający rozmiar widgetu
```
Scope opcjonalny: `feat(api):`, `fix(web):`, `chore(widget):`

### Staging — zawsze konkretne pliki
```bash
git add <konkretne pliki>   # NIGDY git add -A bez weryfikacji
git add apps/api/src/...    # jawnie, żeby nie commitować .env przez pomyłkę
```

### Czego NIGDY nie commitować
- Pliki `.env` — pre-commit hook blokuje automatycznie
- `node_modules/`, `.next/`, `dist/`
- Sekrety, klucze API, tokeny

### CI (GitHub Actions) — uruchamia się automatycznie na każdym PR
- `API (lint + test)` — ESLint + Jest
- `Web (lint + type-check)` — ESLint + tsc
- `Widget (build + size check)` — Vite build z limitem <12KB

Merge możliwy tylko gdy wszystkie 3 przechodzą. Claude informuje o statusie CI.

## Brand Colors

```
brand: '#6366F1'    brandDark: '#4338CA'    brandSoft: '#EEF2FF'
accent: '#10B981'   warning: '#F59E0B'
beauty: '#EC4899'   health: '#06B6D4'   food: '#F97316'   auto: '#64748B'
text: '#0F172A'     bg: '#F8FAFC'
```

## Język marketingowy

NIE mów "chatbot AI". Mów **"asystentka która odpowiada za Ciebie"**.
- Ból: "tracisz klientki o 22:00 bo nie odbierasz"
- ROI: "1 klientka = 150-300 zł. Bot = 149 zł/mies."
