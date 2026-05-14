# Botiko.pl — Architecture & Codemap Index

**Last Updated:** 2026-05-14  
**Project Status:** Phase 1A complete — **MVP live in production** (`botiko.pl`). Web → Vercel, API → Railway, Widget → Vercel. Now in Phase 2 (pilots).

---

## Overview

Botiko.pl is a B2B SaaS AI chatbot platform for Polish micro and small service businesses (beauty salons, healthcare clinics, restaurants, auto shops). The platform consists of three separate applications with independent deployments and development cycles.

**Core Value Proposition:**  
24/7 AI bot on customer websites → answers inquiries + collects leads → ROI = 1 lead (150-300 PLN) vs bot cost (149 PLN/month).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Customer Website                        │
│  (WordPress primary, generic HTML fallback)                  │
│                                                              │
│  ┌─────────────────────────────────────┐                    │
│  │  <script src="botiko.pl/embed.js">  │                    │
│  │      data-bot-id="abc123"           │                    │
│  │  Botiko Widget                      │                    │
│  │  (Preact + Shadow DOM, <12KB)       │                    │
│  └──────────────┬──────────────────────┘                    │
└─────────────────┼──────────────────────────────────────────┘
                  │ chat POST /api/v1/chat
                  │ leads POST /api/v1/leads
                  │ config GET  /api/v1/bot/{id}/config
                  │ (DomainWhitelistGuard + Rate Limits)
                  ▼
     ┌────────────────────────────────┐
     │   NestJS API (apps/api)         │
     │   ────────────────────────────  │
     │ • RAG Pipeline (embeddings)    │
     │ • OpenAI Integration (GPT4o)   │
     │ • Multi-tenant Auth (JWT)      │
     │ • Stripe Billing               │
     │                                │
     │  ┌──────────────────────────┐ │
     │  │  PostgreSQL + pgvector   │ │
     │  │  (Supabase)              │ │
     │  │  ┌────────────────────┐  │ │
     │  │  │ Tenants (isolated) │  │ │
     │  │  │ Bots               │  │ │
     │  │  │ KnowledgeChunks    │  │ │
     │  │  │ Conversations      │  │ │
     │  │  │ Leads (encrypted)  │  │ │
     │  │  └────────────────────┘  │ │
     │  └──────────────────────────┘ │
     └────────────────────────────────┘
                  ▲
          Authenticated via JWT
          (Supabase Auth)
                  │
     ┌────────────▼──────────────┐
     │   Next.js Web App         │
     │   (apps/web)              │
     │   ────────────────────    │
     │ • Dashboard (8 pages)     │
     │ • Bot Management          │
     │ • Lead Management         │
     │ • Knowledge Base Editor   │
     │ • Billing Portal          │
     │ • Landing Page + Blog     │
     │ (Tailwind v4)             │
     └───────────────────────────┘
```

---

## Applications at a Glance

| App | Purpose | Tech Stack | Entry Point | Port |
|-----|---------|-----------|-------------|------|
| **api** | Backend REST API | NestJS 9, Prisma, PostgreSQL | `apps/api/src/main.ts` | 3001 |
| **web** | Dashboard + Landing | Next.js 14, Tailwind v4, Supabase Auth | `apps/web/app` | 3000 |
| **widget** | Embed Script | Preact + Vite (hard limit <12KB gzip) | `apps/widget/src/index.ts` | 5173 |

---

## Codemaps by Area

### 1. **Backend API** (`apps/api`)
→ [Read Full API Codemap](./backend.md)

**Modules:**
- `auth` — User registration, login, refresh tokens
- `bot` — Bot CRUD, configuration, allowed domains
- `chat` — Message processing, RAG pipeline, OpenAI integration
- `knowledge` — Knowledge base management, embeddings
- `lead` — Lead capture, management, encryption
- `billing` — Stripe integration, plan enforcement
- `tenant` — Account management, organization isolation
- `contact` — Landing page contact form

**Key Security Guards:**
- `AuthGuard` — JWT verification (Bearer token)
- `TenantGuard` — Multi-tenant data isolation
- `DomainWhitelistGuard` — Widget domain validation
- `OwnerGuard` — Tenant ownership verification

**Middleware Stack (Order Matters):**
```
Helmet (security headers) → CORS (open for widget) → Throttler (rate limits) 
→ GlobalExceptionFilter (error handling) → ZodValidationPipe (input validation) 
→ AuthGuard (optional, per route) → TenantGuard (optional, per route)
```

---

### 2. **Frontend Web App** (`apps/web`)
→ [Read Full Web Codemap](./frontend.md)

**Key Pages:**
- `(auth)` — Login, register, password reset
- `(marketing)` — Landing page, blog, contact form
- `dashboard` — Account overview, leads, conversations, knowledge, settings, embed, billing
- `onboarding` — Bot creation wizard (industry selection, templates, first config)

**Features:**
- Supabase Auth SSR (`@supabase/ssr`)
- Stripe billing integration (checkout & customer portal)
- Recharts-based analytics
- Lucide icons
- Responsive design (mobile-first)

---

### 3. **Embed Widget** (`apps/widget`)
→ [Read Full Widget Codemap](./widget.md)

**Constraints:**
- Hard size limit: **<12KB gzip** (enforced by Vite plugin, build fails if exceeded)
- Framework: **Preact** (not React) — 10KB smaller
- Isolation: **Shadow DOM** (CSS + DOM isolation from host page)
- Session persistence: **sessionStorage** per `botiko_{botId}` (privacy: cleared on tab close)
- Timeout: **30s AbortController** (prevents infinite spinners)

**Entry point:** `<script src="botiko.pl/embed.js" data-bot-id="uuid"></script>`

---

### 4. **Database Schema**
→ [Read Full Database Codemap](./database.md)

**Core Models:**
- `Tenant` — Account (industry, plan, billing info)
- `User` — Team member (email, role)
- `Bot` — AI bot instance (config, domains, personality)
- `KnowledgeChunk` — Vector embeddings (pgvector, 1536-dim)
- `Lead` — Contact info (PII encrypted AES-256-GCM)
- `Conversation` — Chat session (per bot, per tenant)
- `Message` — Individual messages (history for context window)

**Enums:**
- `Industry`: BEAUTY, HEALTH, FOOD, AUTO, OTHER
- `Plan`: STARTER (149 PLN/mies, 14d trial), PRO, PREMIUM
- `LeadStatus`: NEW, CONTACTED, CONVERTED, LOST
- `MsgRole`: USER, ASSISTANT

---

### 5. **External Integrations**
→ [Read Full Integrations Codemap](./integrations.md)

- **OpenAI** — `gpt-4o-mini` (chat), `text-embedding-3-small` (embeddings)
- **Supabase** — PostgreSQL + Auth + RLS policies
- **Stripe** — Billing, checkout, webhooks
- **Resend** — Email notifications (trial expiry warnings)

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **CORS Open** | Widget must work on any customer domain; DomainWhitelistGuard is the real security layer |
| **Bot answering 24/7** | Core value prop; `businessHours` is informational only, never blocks chat |
| **sessionStorage (not localStorage)** | Privacy by default: history lost when tab closes |
| **30s timeout + AbortController** | OpenAI can hang; spinner can't spin forever |
| **JWT (not cookies)** | CORS-friendly, stateless, works across domains |
| **Zod (not class-validator)** | Cleaner API validation, type-safe at compile time |
| **pgvector (not ES vector DB)** | Lower infrastructure cost, one database, embeddings co-located with data |
| **AES-256-GCM (not hashing)** | PII must be decryptable for customer export; hashing is one-way |
| **Preact (not React)** | Bundle size: 10KB difference = 83% of our widget budget |

---

## Development Workflow

### Local Setup (3 separate `pnpm install`)

```bash
# API
cd apps/api
pnpm install
cp ../../.env.example .env
# Add: DATABASE_URL, SUPABASE_*, OPENAI_API_KEY, JWT_SECRET, ENCRYPTION_KEY
pnpm start:dev

# Web (in separate terminal)
cd apps/web
pnpm install
cp ../../.env.example .env.local
# Add: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev

# Widget (in separate terminal)
cd apps/widget
pnpm install
pnpm dev
```

### Testing

```bash
# API unit tests
cd apps/api && pnpm test

# API e2e tests
cd apps/api && pnpm test:e2e

# Web type check
cd apps/web && pnpm tsc --noEmit

# Widget bundle size
cd apps/widget && pnpm build  # Fails if >12KB gzip
```

### Git Workflow (Conventional Commits)

```bash
git checkout main
git pull origin main
git checkout -b feat/feature-name

# ... make changes ...

git add apps/api/src/modules/...
git commit -m "feat(api): add endpoint for something"
git push -u origin feat/feature-name
gh pr create  # Agent does this automatically
```

---

## Security Model

### Authentication
1. **Web Dashboard:** Supabase Auth SSR (email/password or OAuth)
   - User → JWT stored in secure cookie
   - Every request: `@supabase/ssr` refreshes token if needed

2. **Widget:** No auth — uses `botId` + domain whitelist
   - Public bot config endpoint: `/api/v1/bot/{id}/config` (no Bearer token needed)
   - Chat & leads: `DomainWhitelistGuard` checks `Origin` header vs `bot.allowedDomains`

3. **API Routes:** Bearer token (JWT) in Authorization header
   - `AuthGuard` verifies token via `supabase.auth.getUser(token)` (service role)
   - Extracts `user_id`, `email`, `tenant_id` from JWT claims

### Multi-Tenancy (Data Isolation)

**Every table has `tenant_id`.** Supabase RLS policies enforce row-level security:

```sql
-- Example: Leads table
CREATE POLICY leads_tenant_isolation
  ON leads FOR ALL
  USING (tenant_id = auth.jwt() -> 'user_metadata' -> 'tenant_id');
```

In NestJS:
- `TenantGuard` extracts `tenant_id` from JWT claims
- `@CurrentTenant()` decorator injects it into route handlers
- All queries filtered by `tenant_id` before execution

### Rate Limiting (Per-IP, Not Per-User)

```
Default: 100 req/min
Auth endpoints: 10 req/min (anti-brute-force)
Chat: 20 req/min (generous for multi-message convos)
Leads: 5 req/min (spam protection)
Contact form: 10 req/min
```

### PII Encryption

**Lead form fields** (first name, phone) are encrypted at-rest:
- Algorithm: **AES-256-GCM**
- Format: `{iv}:{authTag}:{ciphertext}` (hex)
- Service: `EncryptionService` (`apps/api/src/common/services/encryption.service.ts`)
- Key: `ENCRYPTION_KEY` env var (64 char hex)

Decryption only happens when:
- Customer views leads in dashboard
- Exporting leads as CSV
- API returns lead data

---

## What's Working (live in production)

✅ RAG pipeline (embeddings → pgvector → GPT-4o-mini + sanitization)  
✅ Widget embed (<12KB, Shadow DOM, sessionStorage, GTM-safe)  
✅ Dashboard (10 pages + Stripe billing)  
✅ Email system (Resend — onboarding drip, lead notifications, billing webhooks)  
✅ Landing page + blog (32 MDX posts, content runway to July 2026, date-gated auto-publish)  
✅ Security (CORS strategy, UUID validation, HTML escaping, error handling)  
✅ Deployed: Web/Widget on Vercel (auto-deploy from `main`), API on Railway  

---

## Roadmap (Not in MVP)

❌ Booking system (bot odsyła to Booksy/Calendly — we don't build it)  
❌ Customer payment processing (SaaS only, no payment for customer's customers)  
❌ Separate domains per industry (one Botiko.pl for all)  
❌ Native mobile app (web PWA is responsive enough)  
❌ Corporate plans (SMB focus only)  
❌ Multi-tenant workspaces (each company = 1 tenant, 1+ users)  

---

## How to Use These Codemaps

1. **New team member?** Start here, then read `backend.md` + `frontend.md`
2. **Debugging a bug?** Find the module in the relevant codemap, then read the source
3. **Adding a feature?** Check the module's "Data Flow" section to see what to touch
4. **Scaling concerns?** See `database.md` for query patterns and indexes
5. **Security review?** See "Security Model" section above + each module's guards

---

## Files Referenced

- API source: `apps/api/src/modules/{module}/*`
- Web source: `apps/web/app/{route}/*`
- Widget source: `apps/widget/src/*`
- Database: `apps/api/prisma/schema.prisma`
- RLS policies: `supabase/migrations/001_rls_policies.sql`
- Config: `CLAUDE.md` (full context), `.cursorrules` (conventions)

---

**Next:** Read the module-specific codemaps for deeper dives into each area.
