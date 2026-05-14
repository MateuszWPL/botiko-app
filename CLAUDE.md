# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Projekt

Botiko.pl — polska SaaS platforma AI chatbot B2B dla mikro/małych firm usługowych. Jeden produkt, wiele branż. Klient wybiera branżę w onboardingu → dostaje gotowy szablon bota.

**Główny fokus (gotowe szablony branżowe):** salony beauty, gabinety zdrowia/SPA, restauracje, warsztaty samochodowe. **Szerzej:** każda inna mikro/mała firma usługowa — fryzjer, kosmetyczka, fizjoterapeuta, korepetytor, fotograf, coach, trener personalny, sklep lokalny itp. → w onboardingu wybiera `OTHER` i dostaje generyczny szablon bota.

**Cel MVP:** 15 płacących klientów w 6 miesięcy.

### Czego NIE robimy w MVP
- NIE budujemy systemu rezerwacji (bot odsyła do Booksy/Calendly)
- NIE obsługujemy płatności za usługi klientów końcowych
- NIE budujemy osobnych domen per branża — JEDNA platforma Botiko.pl
- NIE robimy natywnej apki mobilnej — dashboard jest responsive PWA
- NIE targetujemy korporacji — tylko mikro i małe firmy usługowe
- NIE używamy Turborepo/monorepo workspace — 3 osobne apps z własnym `pnpm install`
- NIE supportujemy oficjalnie Webflow / Shopify / Squarespace / Wix / PrestaShop / Shoper — skrypt JS działa technicznie, ale nie ma per-platformowych instrukcji ani gwarancji. **Priority 1: WordPress + uniwersalny skrypt HTML.**

---

## Struktura repo

```
apps/web/      → Next.js 14 App Router + Tailwind v4 (dashboard + landing pages, port 3000)
apps/api/      → NestJS + Prisma (REST API, port 3001)
apps/widget/   → Preact + Vite (embed script, port 5173, target <12KB gzip)
supabase/      → SQL migrations + RLS policies
docs/CODEMAPS/ → 6 plików architektonicznych (ENG): INDEX, backend, frontend, widget, database, integrations
.github/workflows/ → ci.yml (4 joby: API lint+test, Web lint+tsc, Widget size, E2E Playwright)
apps/api/src/brand-templates/ → szablony promptów per branża (beauty, health, food, auto + generyczny)
```

**Dokumentacja pomocnicza w root:**
- `TASK.md` — szczegółowy checklist faz (1A, 1B…) — tu szukaj deployment checklist (§1A.6)
- `AI-COMMANDS.md` — quick reference komend Claude Code / MCP
- `DOCUMENTATION_SUMMARY.md` — indeks wszystkich dokumentów
- `README.md` — setup instructions + architecture overview

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
pnpm dev:turbo       # Next.js dev server z Turbopack
pnpm build           # Production build
pnpm lint            # ESLint
pnpm e2e             # Playwright E2E (headless)
pnpm e2e:ui          # Playwright E2E z UI
```

### Widget (`apps/widget`)
```bash
pnpm dev             # Vite dev server
pnpm build           # Build dist/embed.js — rzuca błąd jeśli >12KB gzip
pnpm build:watch     # Build w trybie watch
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
1. **Pre-processing** (`message-sanitizer.ts`) — zanim cokolwiek trafi do DB lub OpenAI:
   - Script/HTML injection → canned response
   - Prompt injection (PL + EN patterns) → canned response
   - Image/binary data → canned response
   - Profanity (PL + EN) → canned response
   - Gibberish (<25% liter) → canned response
   - Pożegnanie → canned response
   - Powitanie / acknowledgment → skip RAG, AI in-character (`action: 'no-rag'`)
2. Sprawdź tenant.isActive (403 jeśli wygasł plan)
3. Sprawdź plan limit (STARTER: 1000 konwersacji/mies.)
4. Eskalacja do człowieka (`isEscalationRequest`) → canned + showLeadForm
5. Embed zapytania (OpenAI `text-embedding-3-small`, 1536-dim)
6. pgvector similarity search na tabeli `KnowledgeChunk` (próg 0.3)
7. Fallback gdy context pusty → canned + showLeadForm (OpenAI nie wywoływane)
8. Zbuduj system prompt z szablonu branżowego + pobrane chunki + hard-coded guardrails
9. Wyślij do OpenAI `gpt-4o-mini` z historią rozmowy (max 10 wiadomości)
10. Zapisz parę wiadomości, zwróć odpowiedź

### Data Security
- **PII encryption**: imię i telefon leada — AES-256-GCM at-rest
- **Format**: `{iv}:{authTag}:{ciphertext}` (hex) — `src/common/services/encryption.service.ts`
- **Walidacja**: wszystkie request DTOs przez Zod + custom `ZodValidationPipe`

### API Middleware Stack (kolejność ma znaczenie)
Helmet → CORS → Throttler → GlobalExceptionFilter → ZodValidationPipe → AuthGuard → TenantGuard

### CORS
CORS jest **otwarty dla wszystkich originów** — widget musi działać na dowolnej domenie klienta (salonbeauty.pl, restauracja.pl itd.). `DomainWhitelistGuard` jest rzeczywistą warstwą bezpieczeństwa dla publicznych endpointów widgetu — sprawdza `bot.allowedDomains` vs `Origin` header. API używa JWT Bearer tokenów (nie cookies), więc CORS nie jest tu warstwą auth.

### Rate Limits (per IP)
- Default: 100 req/min
- Auth endpoints: 10 req/min
- Chat: 20 req/min
- Leads: 5 req/min (antyspam)
- Contact form: 10 req/min

### Widget Constraints
- **Hard limit**: <12KB gzip — wymuszany przez plugin Vite w `vite.config.ts`
- **Primary platform: WordPress** — instalacja przez wtyczkę WPCode, instrukcje w `EmbedCode.tsx`. Skrypt działa też na każdej innej stronie HTML (fallback). Inne CMS — Webflow/Shopify/Wix/Squarespace — wycięte z oficjalnych instrukcji.
- Shadow DOM izoluje style od strony hosta
- Preact (nie React) — dla rozmiaru bundle
- Konfigurowany przez `data-bot-id` na tagu `<script>`
- `document.currentScript` fallback na `querySelector('[data-bot-id]')` — guard against double-init (React Strict Mode, snippet wklejony 2x)
- `BotikoWidget.open/close/toggle` — globalne API dla strony hosta
- Session persistence: `sessionStorage` per `botiko_{botId}` (historia ginie po zamknięciu zakładki — celowo, prywatność)
- **Bot odpowiada 24/7** — `businessHours` config jest czysto informacyjny (banner), nigdy nie blokuje chatu
- Fetch timeout 30s via `AbortController` — spinner nie kręci się w nieskończoność
- Obsługa HTTP error codes: 400 / 403 (plan limit → lead form) / 429 / 5xx / AbortError — każdy ma osobny komunikat PL
- `suggestedQuestions` z `GET /api/v1/bot/:id/config` — branżowe, nie hardcoded

### Database Schema (Prisma — `apps/api/prisma/schema.prisma`)
Główne modele: `Tenant`, `User`, `Bot`, `KnowledgeChunk` (pgvector), `Lead` (PII encrypted), `Conversation`, `Message`, `Review`, `ProcessedStripeEvent` (idempotency guard webhooków), `BillingEvent` (audit trail: ACTIVATED/DEACTIVATED/PLAN_CHANGED/TRIAL_EXPIRED)

Enums: `Industry` (BEAUTY/HEALTH/FOOD/AUTO/OTHER), `Plan` (STARTER/PRO/PREMIUM — w MVP używamy tylko STARTER), `LeadStatus` (NEW/CONTACTED/CONVERTED/LOST), `MsgRole` (USER/ASSISTANT), `UserRole` (OWNER/MEMBER)

**Industry templates:** BEAUTY/HEALTH/FOOD/AUTO mają własne pliki w `apps/api/src/brand-templates/`. `OTHER` korzysta z generycznego szablonu — obsługuje każdą branżę usługową bez dedykowanego prompta.

### Moduły API (`apps/api/src/modules/`)
| Moduł | Endpointy | Auth |
|---|---|---|
| `auth` | `/api/v1/auth/*` | publiczne |
| `bot` | `/api/v1/bot/*` | GET config: publiczny; reszta: AuthGuard+TenantGuard |
| `chat` | `POST /api/v1/chat` | publiczny + DomainWhitelistGuard |
| `lead` | `POST /api/v1/leads` (publiczny), `GET/PATCH` (auth) | DomainWhitelistGuard na POST |
| `knowledge` | `/api/v1/knowledge/*` | AuthGuard+TenantGuard |
| `contact` | `POST /api/v1/contact` | publiczny, rate limit 10/min |
| `billing` | `/api/v1/billing/*` | AuthGuard (checkout/portal/status); webhook publiczny |
| `tenant` | `/api/v1/tenant/*` | AuthGuard+TenantGuard |
| `review` | `/api/v1/reviews/*` | AuthGuard+TenantGuard |
| `ai` | — (wewnętrzny provider OpenAI, bez endpointów publicznych) | — |

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
- `API (lint + test)` — ESLint + Jest (~297 testów jednostkowych + Supertest E2E)
- `Web (lint + type-check)` — ESLint + tsc
- `Widget (build + size check)` — Vite build z limitem <12KB gzip
- `Web E2E (Playwright)` — smoke testy landing pages (24 testy, chromium only)

Merge możliwy tylko gdy wszystkie 4 przechodzą. Claude informuje o statusie CI.

## Brand Colors

```
brand: '#6366F1'    brandDark: '#4338CA'    brandSoft: '#EEF2FF'
accent: '#10B981'   warning: '#F59E0B'
beauty: '#EC4899'   health: '#06B6D4'   food: '#F97316'   auto: '#64748B'
text: '#0F172A'     bg: '#F8FAFC'
```

## Język marketingowy

NIE mów "chatbot AI". Mów **"bot"** — "asystentka" kojarzy się tylko z branżą beauty, a Botiko obsługuje wiele branż. Bot NIE obsługuje rezerwacji — odsyła do Booksy/Calendly.
- Ból: "tracisz klientki o 22:00 bo nie odbierasz"
- ROI: "1 klientka = 150-300 zł. Bot = 99 zł/mies."

## Aktualny stan projektu (2026-05-14)

**Faza:** 1A ukończona — **MVP zdeployowane na produkcji** (`botiko.pl`, zaindeksowane w Google). Wchodzimy w Fazę 2 (piloty, pierwsi klienci).

**Infrastruktura produkcyjna:**
- **Web** (`apps/web`) → Vercel, auto-deploy po merge na `main`
- **API** (`apps/api`) → Railway
- **Widget** (`apps/widget`) → Vercel
- Pełna instrukcja env vars + DNS: `docs/PRODUCTION_ENV.md`

**Co działa na produkcji:**
- Core bot (RAG + OpenAI) z pełnym pre-processingiem wiadomości
- Widget embedded (<12KB, Shadow DOM, natywnie zoptymalizowany pod WordPress; działa też na dowolnej innej stronie WWW)
- Dashboard (10 stron: overview, leads, conversations, knowledge, knowledge-base, settings, embed, billing, help + strony onboardingu)
- Onboarding wizard 5-krokowy (`/onboarding/step-1` … `/step-5`) — branża → dane firmy → wiedza → embed (WordPress-first) → finish
- Embed installer (`apps/web/app/dashboard/embed/EmbedCode.tsx`) — 2 ścieżki: WordPress (przez wtyczkę WPCode) + Inna strona (uniwersalny skrypt HTML)
- 5 landing pages branżowych (`/dla/salon-beauty`, `/dla/gabinet-spa`, `/dla/restauracja`, `/dla/warsztat-mechaniczny`, `/dla/inna`) — każda z wzmianką WordPress-first
- Stripe billing (STARTER 99 zł/mies., 14 dni trial, webhooks, idempotency guard, audit trail BillingEvent)
- System emailowy (Resend) — szablony, drip scheduler onboardingowy, powiadomienia o leadach, billing webhooks
- System recenzji (`Review` model + moduł API)
- Landing page marketingowy + blog SEO + formularz kontaktowy
- Finalny brand kit (`apps/web/public/botiko-*.svg` — wordmark + znak, warianty light/dark/white)
- Security hardening (CORS, UUID validation, HTML escaping, HTTP error handling, walidacja hasła: 12 znaków + cyfra + znak specjalny)
- Pokrycie testami: 297+ testów jednostkowych (Jest) + 24 E2E landing pages (Playwright) + E2E API (Supertest); 4-jobowy CI zielony

### Blog — content runway

- **32 posty MDX** w `apps/web/content/blog/`, w tym 5 pillar per branża + pillar „Botiko dla WordPress" (`botiko-dla-wordpress-przewodnik-2026.mdx`)
- **Daty 2026-03-28 → 2026-07-28** — `apps/web/lib/blog.ts` filtruje posty z datą przyszłą (`date <= dziś`), więc posty **auto-publikują się w dniu z frontmatter**. Mamy zaplanowaną treść do końca lipca 2026.
- Każdy post ma 3 grafiki w `apps/web/public/blog/`: `{slug}-hero.jpg` + `{slug}-1.jpg` + `{slug}-2.jpg`. Fallback: `default-hero.jpg`. Grafiki generowane ręcznie, nie ma automatu — dodając post trzeba dorzucić obrazy.
- Komponenty MDX (FAQ, ROICalculator, ComparisonTable, CTABlock, Callout, InfoBox, ImageGallery, VideoEmbed, CallToAction) w `apps/web/components/blog/mdx/`

**Backlog (drobne poprawki — nie blokują):**
- Uzupełnić brakujące testy jednostkowe (chat-message.dto, create-contact.dto, auth.guard) — szczegóły w `TASK.md §1A.7`
- Monitoring produkcyjny: Sentry + UptimeRobot (`TASK.md §2.4`)
- Weryfikacja crona `trial-notifications` na produkcji (`TASK.md §1A.8`)

**W roadmapie (Faza 2+):**
- Piloty: cold outreach, 3 darmowe piloty 30-dniowe, case studies
- Dedykowana wtyczka Botiko do katalogu WordPress.org — kanał akwizycji bez udziału supportu
