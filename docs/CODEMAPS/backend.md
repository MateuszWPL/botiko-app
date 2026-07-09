# Backend API Codemap. NestJS + Prisma

**Last Updated:** 2026-04-18  
**Location:** `apps/api/`  
**Entry Point:** `apps/api/src/main.ts`  
**Port:** 3001 (dev), 3001 (prod)

---

## Quick Overview

NestJS application with 9 modules (auth, bot, chat, knowledge, lead, billing, tenant, contact, ai). Each module has:
- `*.controller.ts`: HTTP routes
- `*.service.ts`: Business logic
- `*.dto.ts`: Request/response shapes (Zod-validated)
- `*.module.ts`: Module definition

**Tech Stack:**
- Framework: NestJS 9
- Database: PostgreSQL (Supabase) + Prisma ORM
- Validation: Zod (custom pipe)
- Auth: Supabase JWT + custom guards
- Vector DB: pgvector (1536-dim embeddings)
- AI: OpenAI (gpt-4o-mini, text-embedding-3-small)
- Billing: Stripe (webhooks, checkout, portal)
- Email: Resend (trial expiry notifications)
- Throttling: @nestjs/throttler (per-endpoint rate limits)

---

## Directory Structure

```
apps/api/src/
├── brand-templates/          # Industry templates (beauty, health, food, auto)
│   ├── auto.ts              # Auto shop system prompt template
│   ├── beauty.ts            # Beauty salon system prompt template
│   ├── food.ts              # Restaurant system prompt template
│   ├── health.ts            # Healthcare clinic system prompt template
│   └── index.ts             # Export by industry enum
│
├── common/                   # Shared utilities
│   ├── decorators/
│   │   ├── current-tenant.decorator.ts    # @CurrentTenant() → tenant_id from JWT
│   │   └── current-user.decorator.ts      # @CurrentUser() → user object from JWT
│   │
│   ├── filters/
│   │   └── http-exception.filter.ts       # Global error handler (formats error responses)
│   │
│   ├── guards/
│   │   ├── auth.guard.ts                  # Verifies JWT via Supabase
│   │   ├── tenant.guard.ts                # Checks tenant_id claim from JWT
│   │   ├── owner.guard.ts                 # Verifies user owns the tenant
│   │   ├── domain-whitelist.guard.ts      # Validates Origin header vs bot.allowedDomains
│   │   └── bot-throttle.guard.ts          # Per-endpoint rate limits (configurable)
│   │
│   ├── pipes/
│   │   └── zod-validation.pipe.ts         # Converts Zod schemas to NestJS validation pipe
│   │
│   ├── services/
│   │   ├── encryption.service.ts          # AES-256-GCM for PII (leads: name, phone)
│   │   └── notification.service.ts        # Sends emails via Resend (trial warnings)
│   │
│   └── types/                             # Shared TypeScript types (if any)
│
├── config/
│   └── env.ts                # Environment validation (Zod) — process.exit() on error
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.ts             # POST /api/v1/auth/{register|login|refresh}
│   │   ├── auth.service.ts                # JWT creation, credential validation
│   │   ├── auth.module.ts                 # Module definition
│   │   └── dto/
│   │       ├── login.dto.ts               # Email, password → JWT
│   │       ├── register.dto.ts            # Email, password, tenant name, industry
│   │       └── refresh.dto.ts             # Refresh token → new JWT
│   │
│   ├── bot/
│   │   ├── bot.controller.ts              # GET/POST/PATCH /api/v1/bot/*
│   │   ├── bot.service.ts                 # CRUD, domain validation
│   │   ├── bot.module.ts                  # Module definition
│   │   └── dto/
│   │       ├── create-bot.dto.ts          # Name, industry, welcomeMsg, etc.
│   │       └── update-bot.dto.ts          # Partial bot fields update
│   │
│   ├── chat/
│   │   ├── chat.controller.ts             # POST /api/v1/chat
│   │   ├── chat.service.ts                # RAG pipeline orchestration
│   │   ├── message-sanitizer.ts           # Input validation (injection, profanity)
│   │   ├── chat.module.ts                 # Module definition
│   │   └── dto/
│   │       └── chat-message.dto.ts        # Message text, botId, conversationId
│   │
│   ├── conversation/
│   │   ├── conversation.controller.ts     # GET /api/v1/conversations
│   │   ├── conversation.service.ts        # Fetch conversation history
│   │   └── conversation.module.ts         # Module definition
│   │
│   ├── knowledge/
│   │   ├── knowledge.controller.ts        # GET/POST/PATCH/DELETE /api/v1/knowledge/*
│   │   ├── knowledge.service.ts           # Manage knowledge chunks
│   │   ├── embedding.service.ts           # Generate embeddings via OpenAI
│   │   ├── knowledge.module.ts            # Module definition
│   │   └── dto/
│   │       ├── add-chunk.dto.ts           # Content, category, botId
│   │       └── update-chunk.dto.ts        # Partial update
│   │
│   ├── lead/
│   │   ├── lead.controller.ts             # GET/POST/PATCH /api/v1/leads
│   │   ├── lead.service.ts                # CRUD (with encryption)
│   │   ├── lead.module.ts                 # Module definition
│   │   └── dto/
│   │       ├── create-lead.dto.ts         # From widget: firstName (encrypted), phone, botId
│   │       ├── create-lead-manual.dto.ts  # From dashboard: firstName, phone, email, status
│   │       └── update-lead-status.dto.ts  # Change leadStatus (NEW→CONTACTED, etc)
│   │
│   ├── billing/
│   │   ├── billing.controller.ts          # POST /api/v1/billing/{checkout|portal|status}
│   │   ├── billing.service.ts             # Stripe integration, subscription state
│   │   ├── billing.module.ts              # Module definition
│   │   └── webhook handler (Stripe)       # Automatically updates tenant isActive
│   │
│   ├── tenant/
│   │   ├── tenant.controller.ts           # GET/PATCH /api/v1/tenant
│   │   ├── tenant.service.ts              # Fetch tenant info, update settings
│   │   └── tenant.module.ts               # Module definition
│   │
│   ├── contact/
│   │   ├── contact.controller.ts          # POST /api/v1/contact
│   │   ├── contact.service.ts             # Email contact form via Resend
│   │   ├── contact.module.ts              # Module definition
│   │   └── dto/
│   │       └── create-contact.dto.ts      # Name, email, message
│   │
│   └── ai/
│       ├── ai.module.ts                   # Module definition
│       ├── ai.service.interface.ts        # Abstract service interface
│       ├── providers/
│       │   └── openai.provider.ts         # OpenAI API wrapper (chat, embeddings)
│
├── app.module.ts                           # Root module (imports all others)
├── app.controller.ts                       # GET / (health check)
├── app.service.ts                          # Health check logic
│
└── main.ts                                 # Bootstrap + middleware setup

prisma/
├── schema.prisma                           # Data models, migrations
└── migrations/                             # SQL migration files
```

---

## Modules at a Glance

### 1. `auth`. Authentication

**Purpose:** User registration, login, JWT issuance, refresh tokens

**Routes:**
```
POST /api/v1/auth/register
  Input: { email, password, tenantName, industry }
  Output: { jwt, user: { id, email, tenantId, role } }
  
POST /api/v1/auth/login
  Input: { email, password }
  Output: { jwt, user: { id, email, tenantId, role } }
  
POST /api/v1/auth/refresh
  Input: { token (refresh token) }
  Output: { jwt }
```

**Key Logic:**
- Supabase Auth: creates user in `auth.users` (email, password hashed)
- Prisma `User` model: tracks `tenantId`, `role`, `email`
- JWT Claims: includes `sub` (user_id), `email`, `tenant_id` (from `user_metadata`)
- Every login creates new tenant if first-time signup

**Guards:** None (public endpoints)

**Rate Limit:** 10 req/min per IP

---

### 2. `bot`. Bot Management

**Purpose:** Create/read/update/delete bot instances; configure personality, domains, welcome message

**Routes:**
```
GET /api/v1/bot/:id/config
  Query: ?botId=uuid
  Output: { name, welcomeMsg, primaryColor, suggestedQuestions, ... }
  Auth: None (public, but DomainWhitelistGuard)
  
GET /api/v1/bots
  Output: Bot[] (all bots for current tenant)
  Auth: AuthGuard, TenantGuard
  
POST /api/v1/bot
  Input: { name, industry, welcomeMsg, personality, ... }
  Output: { id, ... }
  Auth: AuthGuard, TenantGuard
  
PATCH /api/v1/bot/:id
  Input: { name?, welcomeMsg?, primaryColor?, allowedDomains?, ... }
  Output: Updated bot object
  Auth: AuthGuard, TenantGuard, OwnerGuard
```

**Key Logic:**
- `allowedDomains` stored as `String[]` (JSON in DB)
- `isActive` flag controls whether bot accepts chat requests
- Each bot has unique `id` (CUID)
- Tenant isolation: can only view/update own bots

**Guards:** AuthGuard, TenantGuard (except GET config)

---

### 3. `chat`. RAG Pipeline & Chat Processing

**Purpose:** Core chat logic: embeddings, similarity search, OpenAI, context injection, message sanitization

**Routes:**
```
POST /api/v1/chat
  Input: {
    botId: string (uuid),
    message: string (user input),
    conversationId?: string (if existing conversation),
    sessionId: string (widget session ID for tracking)
  }
  Output: {
    botMessage: string,
    conversationId: string,
    action: "rag" | "no-rag" | "escalation" | "limit-reached",
    showLeadForm: boolean,
    suggestedQuestions?: string[]
  }
  Auth: None (public, but DomainWhitelistGuard)
  
GET /api/v1/conversations/:id/messages
  Output: Message[] (conversation history)
  Auth: AuthGuard, TenantGuard
```

**Data Flow (Critical):**

```
1. Input Validation (message-sanitizer.ts)
   - Script/HTML injection? → canned response ("I don't understand that")
   - Prompt injection (PL+EN patterns)? → canned response
   - Profanity (PL+EN)? → canned response
   - Gibberish (<25% letters)? → canned response
   - Farewell ("bye", "do widzenia")? → canned response
   
2. Authorization Checks
   - Tenant isActive? If not → 403 (show lead form: "Your plan expired")
   - Plan limit reached? (STARTER: 1000 convos/month) → escalate + lead form
   
3. Escalation Detection
   - User asking for human? → Skip RAG, send to lead form
   - Greeting/acknowledgment? → Skip RAG, AI in-character only
   
4. Embedding & Similarity Search
   - Embed user message via OpenAI text-embedding-3-small (1536-dim)
   - pgvector similarity search on KnowledgeChunk table
   - Threshold: 0.3 (cosine similarity)
   - Max results: 5 chunks
   
5. Fallback Handling
   - No relevant context? → canned escalation response + lead form
   - OpenAI not called if context missing
   
6. System Prompt Construction
   - Load brand template (industry-specific)
   - Inject retrieved knowledge chunks
   - Inject hard-coded guardrails (timezone, phone format, etc)
   - Inject conversation history (max 10 messages)
   
7. OpenAI Chat Completion
   - Model: gpt-4o-mini (cheapest, fast, good quality)
   - Temperature: 0.7 (balanced creativity)
   - Max tokens: 500
   
8. Response & Persistence
   - Save user message + bot response to Message table
   - Associate with Conversation (creates if new)
   - Return response + suggested follow-up questions (from config)
```

**Key Services:**
- `ChatService`: orchestrates pipeline
- `MessageSanitizer`: injection/profanity/gibberish detection
- `AiService` (OpenAI provider): embeddings + chat completion
- `EmbeddingService`: pgvector storage & similarity search

**Guards:** DomainWhitelistGuard (validates Origin vs bot.allowedDomains), BotThrottleGuard (20 req/min per IP)

---

### 4. `knowledge`. Knowledge Base Management

**Purpose:** Store, retrieve, embed company-specific information for RAG

**Routes:**
```
GET /api/v1/knowledge/:botId
  Output: KnowledgeChunk[] (paginated)
  Auth: AuthGuard, TenantGuard
  
POST /api/v1/knowledge/:botId/chunks
  Input: { content: string, category?: string }
  Output: { id, embedding: vector(1536), ... }
  Auth: AuthGuard, TenantGuard
  
PATCH /api/v1/knowledge/:id
  Input: { content: string, category: string }
  Output: Updated chunk (re-embedded)
  Auth: AuthGuard, TenantGuard
  
DELETE /api/v1/knowledge/:id
  Auth: AuthGuard, TenantGuard
```

**Key Logic:**
- Every chunk is embedded via OpenAI when created/updated
- pgvector column: `embedding` (vector(1536))
- Chunks tied to bot, not tenant (one bot can have hundreds of chunks)
- Re-embedding is expensive: cache when possible (but MVP doesn't cache)

**Services:**
- `KnowledgeService`: CRUD
- `EmbeddingService`: OpenAI integration + pgvector queries

---

### 5. `lead`. Lead Capture & Management

**Purpose:** Collect leads via widget form; manage status; export

**Routes:**
```
POST /api/v1/leads
  Input: { firstName (encrypted), phone (encrypted), email, botId }
  Output: { id, createdAt, ... }
  Auth: None (public, but DomainWhitelistGuard, rate limit 5 req/min)
  
GET /api/v1/leads?botId=uuid&status=NEW
  Output: Lead[] (tenant's leads, paginated)
  Auth: AuthGuard, TenantGuard
  
PATCH /api/v1/leads/:id
  Input: { status: "CONTACTED" | "CONVERTED" | "LOST" }
  Output: Updated lead
  Auth: AuthGuard, TenantGuard
  
DELETE /api/v1/leads/:id
  Auth: AuthGuard, TenantGuard
```

**Data Model:**
```prisma
model Lead {
  id        String
  botId     String
  tenantId  String
  firstName String      // @encrypted AES-256-GCM
  phone     String      // @encrypted AES-256-GCM
  email     String?
  status    LeadStatus  // NEW | CONTACTED | CONVERTED | LOST
  createdAt DateTime
}
```

**PII Encryption:**
- Fields: `firstName`, `phone`
- Format: `{iv}:{authTag}:{ciphertext}` (hex string)
- Service: `EncryptionService.encrypt()` / `.decrypt()`
- Key: `ENCRYPTION_KEY` env var (64 char hex)

**Guards:** DomainWhitelistGuard (public POST), AuthGuard + TenantGuard (GET/PATCH/DELETE)

---

### 6. `billing`. Stripe Integration

**Purpose:** Handle subscriptions, trial logic, plan enforcement

**Routes:**
```
POST /api/v1/billing/checkout
  Input: { planId: "STARTER" }
  Output: { sessionUrl: "https://checkout.stripe.com/..." }
  Auth: AuthGuard, TenantGuard
  
POST /api/v1/billing/portal
  Output: { portalUrl: "https://billing.stripe.com/..." }
  Auth: AuthGuard, TenantGuard
  
GET /api/v1/billing/status
  Output: {
    tenantId, 
    plan: "STARTER",
    isActive: true,
    stripeSubscriptionId: "sub_...",
    trialEndsAt: "2026-04-28"
  }
  Auth: AuthGuard, TenantGuard
  
POST /api/v1/billing/webhook (Stripe)
  Headers: stripe-signature
  Processes: customer.subscription.created, customer.subscription.updated, invoice.paid
  Updates: Tenant.isActive, Tenant.stripeSubscriptionId
  Sends: Email if trial expiring (via Resend)
```

**Key Logic:**
- Trial: 14 days automatically enabled on signup
- Plan enforcement: chat endpoint checks `tenant.isActive` (403 if false)
- Webhook idempotency: `ProcessedStripeEvent` table prevents duplicates
- Audit trail: `BillingEvent` table logs state changes (ACTIVATED, DEACTIVATED, PLAN_CHANGED)

**Services:**
- `BillingService`: Stripe integration, plan state
- `NotificationService`: Sends trial warning emails

---

### 7. `tenant`. Account Management

**Purpose:** Account settings, team member management (future), tenant info

**Routes:**
```
GET /api/v1/tenant
  Output: { id, name, industry, plan, isActive, createdAt, ... }
  Auth: AuthGuard, TenantGuard
  
PATCH /api/v1/tenant
  Input: { name?, industry?, ... }
  Output: Updated tenant
  Auth: AuthGuard, TenantGuard
```

**Key Logic:**
- Read-only tenant info (most changes happen via Stripe webhooks)
- Future: team management endpoints (invite, remove users)

---

### 8. `contact`. Landing Page Contact Form

**Purpose:** Collect inquiries from landing page

**Routes:**
```
POST /api/v1/contact
  Input: { name, email, message }
  Output: { success: true }
  Auth: None (public, rate limit 10 req/min)
  Sends: Email via Resend to support inbox
```

**Guards:** GlobalThrottleGuard (10 req/min per IP)

---

### 9. `ai`. AI Provider Interface

**Purpose:** Abstract OpenAI integration (future: support Claude, other models)

**Services:**
- `AiServiceInterface`: Abstract interface
- `OpenAiProvider`: Concrete implementation
  - `chat(messages, model, temp)` → string response
  - `embed(text)` → number[] (1536-dim)

---

## Global Middleware & Error Handling

### Middleware Stack (Order Matters)

```typescript
// main.ts

app.use(helmet());  // Security headers
app.use(cors({ origin: '*' }));  // Open CORS (DomainWhitelistGuard is real gate)
app.use(new ThrottlerGuard());  // Rate limiting
app.useGlobalFilters(new HttpExceptionFilter());  // Error formatting
app.useGlobalPipes(new ZodValidationPipe());  // Zod validation
app.use(AuthGuard);  // Optional per route
app.use(TenantGuard);  // Optional per route
```

### HTTP Exception Filter

All errors formatted as:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "First name is required"
}
```

### Zod Validation Pipe

Every DTO must be Zod schema:

```typescript
export class CreateBotDto {
  name = z.string().min(1);
  industry = z.enum(['BEAUTY', 'HEALTH', 'FOOD', 'AUTO', 'OTHER']);
  welcomeMsg = z.string().min(10);
}
```

---

## Database Schema (Prisma)

See `CODEMAPS/database.md` for full schema details.

Key tables:
- `Tenant`: Account
- `User`: Team member
- `Bot`: AI bot instance
- `KnowledgeChunk`: Embeddings (pgvector)
- `Lead`: Leads (PII encrypted)
- `Conversation`: Chat session
- `Message`: Individual messages
- `ProcessedStripeEvent`: Webhook idempotency
- `BillingEvent`: Audit trail

---

## Security Model

### Guards

| Guard | Purpose | Routes |
|-------|---------|--------|
| `AuthGuard` | Verify JWT via Supabase | Most /api/v1/* routes |
| `TenantGuard` | Extract + verify tenant_id from JWT | Most protected routes |
| `OwnerGuard` | Verify user owns the tenant | PATCH/DELETE operations |
| `DomainWhitelistGuard` | Validate Origin header vs bot.allowedDomains | Chat, leads (public) |
| `BotThrottleGuard` | Per-endpoint rate limits | Chat (20 req/min) |

### CORS Strategy

**CORS is OPEN** (`origin: '*'`) because:
- Widget must work on any customer domain
- JWT Bearer tokens are stateless, not vulnerable to CSRF
- `DomainWhitelistGuard` is the real security layer for public endpoints

### Rate Limiting

```typescript
@Controller('api/v1/chat')
@UseGuards(BotThrottleGuard)  // 20 req/min per IP
export class ChatController { ... }
```

### PII Encryption

- **At-rest:** AES-256-GCM
- **In-transit:** HTTPS only
- **Decryption:** Only in dashboard, exports, or API responses to authenticated users
- **Key rotation:** Not implemented (MVP scope)

---

## Environment Variables

Required in `apps/api/.env`:

```env
DATABASE_URL=postgresql://user:pass@pooler.supabase.com:6543/postgres?sslmode=require
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ0...
SUPABASE_SERVICE_ROLE_KEY=eyJ0... (for Supabase Auth JWT verification)
OPENAI_API_KEY=sk-...
JWT_SECRET=<64-char hex, min> (for custom tokens if needed)
ENCRYPTION_KEY=<64-char hex> (for PII encryption)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NODE_ENV=development
```

**Validation:** `apps/api/src/config/env.ts` (Zod), process exits if any var is missing or invalid.

---

## Testing

### Unit Tests (Jest)

```bash
cd apps/api
pnpm test                        # All tests
pnpm test:watch                  # Watch mode
pnpm test -- --coverage          # Coverage report
pnpm test -- --testPathPattern=chat.service  # Single file
```

Test files: `src/**/*.spec.ts`

### E2E Tests (Supertest)

```bash
pnpm test:e2e                    # E2E suite
pnpm test:e2e -- --watch        # Watch mode
```

Test files: `test/**/*.e2e-spec.ts`

---

## Common Development Tasks

### Add a new endpoint

1. Create DTO in `modules/*/dto/`
2. Add method to `*.controller.ts`
3. Add method to `*.service.ts`
4. Define route decorators (`@Post`, `@Get`, etc)
5. Add guards if needed (`@UseGuards(AuthGuard, TenantGuard)`)
6. Run `pnpm start:dev` (HMR reloads)

### Add a new Prisma model

1. Add to `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name add_new_table`
3. Prisma generates types automatically
4. Use in service: `this.prisma.newTable.create({ data: ... })`

### Debug a chat request

1. Add `console.log` in `ChatService`
2. Open browser DevTools → Network tab
3. Check POST `/api/v1/chat` response
4. Read logs in terminal running `pnpm start:dev`

### Check bundle size

Not applicable to API (compiled to JavaScript), but check:
- `dist/` folder after `pnpm build`
- Size is typically 2-3MB (not critical)

---

## Related Codemaps

- [Frontend (Next.js)](./frontend.md)
- [Widget (Preact)](./widget.md)
- [Database Schema](./database.md)
- [Integrations](./integrations.md)

---

**Last Updated:** 2026-04-18
