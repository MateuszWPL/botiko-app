# Botiko — API (NestJS + Prisma)

Backend REST API dla platformy Botiko. Obsługuje:
- RAG pipeline (embeddings + OpenAI)
- Multi-tenant auth (Supabase JWT)
- Stripe billing (subscriptions)
- Widget chat (public endpoints)
- Email notifications (Resend)

---

## Local Development

```bash
pnpm install
cp ../../.env.example .env
# Edit .env with:
# - DATABASE_URL (Supabase pooler)
# - SUPABASE_* keys
# - OPENAI_API_KEY
# - JWT_SECRET (64 chars hex)
# - ENCRYPTION_KEY (64 chars hex)
# - STRIPE_* keys
# - RESEND_API_KEY

pnpm start:dev              # Watch mode (HMR)
```

API dostępne na `http://localhost:3001`

---

## Scripts

```bash
pnpm start:dev              # Development (watch mode)
pnpm start:debug            # Debug mode (inspector)
pnpm build                  # Compile to dist/
pnpm start                  # Production (compiled)
pnpm lint                   # ESLint + autofix
pnpm format                 # Prettier
pnpm test                   # Jest unit tests
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage report
pnpm test:e2e               # Supertest e2e
pnpm prisma migrate dev     # Run DB migrations
pnpm prisma generate        # Generate Prisma types
```

---

## Architecture

### Directory Structure

```
src/
├── main.ts                    # Bootstrap + middleware
├── app.module.ts              # Root module
├── config/env.ts              # Environment validation (Zod)
│
├── common/                    # Shared utilities
│   ├── decorators/            # @CurrentTenant, @CurrentUser
│   ├── filters/               # Global exception filter
│   ├── guards/                # Auth, Tenant, DomainWhitelist, etc.
│   ├── pipes/                 # Zod validation
│   └── services/              # Encryption, Notifications
│
└── modules/                   # Feature modules
    ├── auth/                  # Registration, login, JWT
    ├── bot/                   # Bot CRUD
    ├── chat/                  # RAG pipeline, OpenAI
    ├── knowledge/             # Knowledge base, embeddings
    ├── lead/                  # Lead capture, management
    ├── billing/               # Stripe integration
    ├── tenant/                # Account settings
    ├── contact/               # Contact form
    └── ai/                    # AI provider interface
```

### Key Modules

| Module | Endpoints | Purpose |
|--------|-----------|---------|
| `auth` | POST /api/v1/auth/* | User registration, login, refresh tokens |
| `bot` | GET/POST/PATCH /api/v1/bot/* | Bot management, configuration |
| `chat` | POST /api/v1/chat | Message processing, RAG pipeline |
| `knowledge` | GET/POST/PATCH /api/v1/knowledge/* | Knowledge base management, embeddings |
| `lead` | GET/POST/PATCH /api/v1/leads | Lead capture, management |
| `billing` | POST /api/v1/billing/* | Stripe integration, subscriptions |
| `tenant` | GET/PATCH /api/v1/tenant | Account settings |
| `contact` | POST /api/v1/contact | Contact form submission |

---

## Stack

- **Framework:** NestJS 9
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Validation:** Zod (not class-validator)
- **Auth:** Supabase JWT + custom guards
- **Vector DB:** pgvector (1536-dim embeddings)
- **AI:** OpenAI (gpt-4o-mini, text-embedding-3-small)
- **Billing:** Stripe webhooks
- **Email:** Resend
- **Testing:** Jest, Supertest

---

## Database

### Migrations

```bash
# Create migration after schema changes
pnpm prisma migrate dev --name describe_change

# Generate fresh Prisma types
pnpm prisma generate

# Open Prisma Studio (GUI)
pnpm prisma studio
```

### Key Tables

- `Tenant` — SaaS account
- `User` — Team member
- `Bot` — AI bot instance
- `KnowledgeChunk` — Vector embeddings (pgvector)
- `Lead` — Captured leads (PII encrypted)
- `Conversation` → `Message` — Chat history
- `BillingEvent` — Audit trail

See `/docs/CODEMAPS/database.md` for full schema.

---

## Security

### Guards (Order Matters)

```
Helmet → CORS (open) → Throttler → GlobalExceptionFilter 
→ ZodValidationPipe → AuthGuard → TenantGuard → OwnerGuard
```

### Authentication

```typescript
// JWT verification via Supabase
@UseGuards(AuthGuard)
@Get('protected')
async get(@CurrentUser() user, @CurrentTenant() tenant) {
  // user.id, user.email
  // tenant.id, tenant.industry
}
```

### Multi-Tenancy

All tables have `tenant_id`. Every query filtered by tenant:

```typescript
// Automatically scoped to current tenant
const bots = await prisma.bot.findMany({
  where: { tenantId: tenant.id },  // Always included
});
```

### PII Encryption

Lead names & phones encrypted at rest (AES-256-GCM):

```typescript
// Automatic in service
lead.firstName = encryptionService.encrypt(firstName);
await prisma.lead.create({ data: lead });
```

---

## API Endpoints

See module-specific READMEs or `/docs/CODEMAPS/backend.md` for full API spec.

### Example: Chat

```bash
POST /api/v1/chat
Content-Type: application/json

{
  "botId": "uuid",
  "message": "What are your hours?",
  "sessionId": "session-uuid",
  "conversationId": "conv-uuid"  # optional
}

# Response:
{
  "botMessage": "We're open 9AM-6PM, Monday-Friday.",
  "conversationId": "conv-uuid",
  "action": "rag",
  "showLeadForm": false,
  "suggestedQuestions": ["What services do you offer?"]
}
```

---

## Testing

### Unit Tests

```bash
pnpm test                   # Run all tests
pnpm test -- src/modules/chat/chat.service.spec.ts
pnpm test:watch
pnpm test:cov               # Coverage report
```

Test files: `src/**/*.spec.ts`

### E2E Tests

```bash
pnpm test:e2e              # Run e2e suite
```

Test files: `test/**/*.e2e-spec.ts`

---

## Deployment

### Build

```bash
pnpm build                  # Compile to dist/
```

### Environment Variables

Set in hosting provider (Railway, Vercel):

```env
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
JWT_SECRET
ENCRYPTION_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
NODE_ENV=production
```

### Start

```bash
pnpm start                  # Runs compiled dist/
```

---

## Monitoring & Logs

### HMR (Development)

Hot Module Reloading enabled in `pnpm start:dev` — changes auto-reload.

### Debug Mode

```bash
pnpm start:debug            # Opens inspector on port 9229
```

Use Chrome DevTools: `chrome://inspect` → attach.

### Logs

- Development: Console output (colorized)
- Production: Structured logs (JSON, Datadog/Grafana integration optional)

---

## Related Docs

- **Full Codemap:** `/docs/CODEMAPS/backend.md`
- **Database:** `/docs/CODEMAPS/database.md`
- **Integrations:** `/docs/CODEMAPS/integrations.md`
- **Project Context:** `CLAUDE.md`

---

## Common Tasks

### Add New Endpoint

1. Create DTO in `modules/*/dto/`
2. Add method to controller
3. Add method to service
4. Add guards if needed
5. Run `pnpm start:dev` (HMR reloads)

### Add Database Model

1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name describe_change`
3. Update services to use new model

### Test Single Module

```bash
pnpm test -- --testPathPattern=chat
```

### Check Bundle Size

Not critical for API (not frontend), but check `dist/` size after build.

---

**Last Updated:** 2026-04-18
