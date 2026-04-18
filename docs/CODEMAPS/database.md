# Database Schema Codemap

**Last Updated:** 2026-04-18  
**Location:** `apps/api/prisma/schema.prisma`  
**Database:** PostgreSQL (Supabase)  
**ORM:** Prisma

---

## Overview

Multi-tenant PostgreSQL database with:
- **Row-level security (RLS)** via Supabase policies
- **Vector embeddings** via pgvector extension (1536-dim)
- **Encrypted PII** (AES-256-GCM at rest in DB)
- **Audit trail** for billing events
- **Webhook idempotency** for Stripe events

All tables have `tenant_id` to enforce multi-tenancy isolation.

---

## Core Models

### Tenant

Account (SaaS customer):

```prisma
model Tenant {
  id                     String    @id @default(cuid())
  name                   String           // Company name
  industry               Industry         // BEAUTY | HEALTH | FOOD | AUTO | OTHER
  plan                   Plan      @default(STARTER)  // Subscription tier
  isActive               Boolean   @default(false)   // Subscription active?
  
  // Billing
  stripeCustomerId       String?   @unique          // Stripe customer ID
  stripeSubscriptionId   String?                     // Stripe subscription ID
  tokenUsage             Int       @default(0)       // OpenAI token counter (for analytics)
  lastTrialEmailSentAt   DateTime?                   // Last trial warning email
  
  // Relations
  createdAt              DateTime  @default(now())
  bots                   Bot[]
  users                  User[]
  leads                  Lead[]
  billingEvents          BillingEvent[]
  
  @@index([plan, isActive])
}

enum Industry {
  BEAUTY
  HEALTH
  FOOD
  AUTO
  OTHER
}

enum Plan {
  STARTER    // 149 PLN/mies, 1000 convos/month
  PRO        // Future
  PREMIUM    // Future
}
```

**Key Insights:**
- `isActive`: Controlled by Stripe webhooks (when payment succeeds)
- `plan`: Changed by Stripe checkout flow
- `tokenUsage`: Tracked for analytics (not enforced in MVP)
- All queries for this tenant filtered by `tenant_id` (Supabase RLS)

---

### User

Team member (Supabase Auth user + our tracking):

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  tenantId  String
  role      UserRole @default(MEMBER)
  
  // Relations
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@index([tenantId, email])
}

enum UserRole {
  OWNER      // Can delete bots, manage billing
  MEMBER     // Can view/edit bots, view leads
  VIEWER     // Read-only (future)
}
```

**Key Insights:**
- User created in Supabase Auth (`auth.users`)
- We track in Prisma for multi-tenancy
- Future: team collaboration (invite more users)
- MVP: one user per tenant (OWNER role)

---

### Bot

AI bot instance (one per bot, many per tenant):

```prisma
model Bot {
  id                    String         @id @default(cuid())
  tenantId              String
  tenant                Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Basic Config
  name                  String         // Display name
  welcomeMsg            String         // First message shown in widget
  primaryColor          String         @default("#6366F1")  // Brand color (hex)
  avatarEmoji           String         @default("")         // Emoji avatar
  isActive              Boolean        @default(true)       // Can chat?
  
  // Domain Whitelist
  allowedDomains        String[]       @default([])         // Domains widget can load on
  
  // Offline Mode
  offlineMessage        String?        // Message shown if bot offline
  
  // Business Hours (Informational only, bot always responds)
  businessHoursStart    Int?           // Hour (0-23)
  businessHoursEnd      Int?           // Hour (0-23)
  businessDays          Int[]          @default([])         // Days (0=Mon, 6=Sun)
  businessSchedule      Json?          // Per-day schedule (future)
  
  // Personality & Company Info
  personality           String?        // System prompt customization
  companyName           String?        // Shown in messages
  companyPhone          String?        // Shown in fallback
  companyAddress        String?        // Shown in fallback
  suggestedQuestions    String[]       @default([])         // Starter questions
  leadFormAfterMessages Int            @default(3)          // Show lead form after N messages
  
  // Relations
  conversations         Conversation[]
  knowledge             KnowledgeChunk[]
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  
  @@index([tenantId])
  @@index([isActive])
}
```

**Key Insights:**
- Each tenant can have multiple bots (one per industry, or multiple chatbots)
- `allowedDomains` is JSON array: `["example.com", "www.example.com"]`
- `businessHours` is informational only (doesn't block chat, just shows banner)
- `suggestedQuestions` pre-populated by onboarding (can be customized)
- `personality` can override system prompt (experimental)

---

### KnowledgeChunk

Vector-embedded knowledge (for RAG):

```prisma
model KnowledgeChunk {
  id        String                 @id @default(cuid())
  botId     String
  bot       Bot                    @relation(fields: [botId], references: [id], onDelete: Cascade)
  
  // Content
  content   String                 // Text to embed
  category  String?                // "hours", "menu", "faq", etc
  
  // Vector
  embedding Unsupported("vector(1536)")   // pgvector column (1536-dim, OpenAI embeddings)
  
  createdAt DateTime               @default(now())
  updatedAt DateTime               @updatedAt
  
  @@index([botId])
}
```

**Key Insights:**
- `embedding`: pgvector(1536) — one embedding per chunk
- pgvector enables cosine similarity search: `embedding <-> query_vector`
- When chunk is created/updated, we embed via OpenAI API
- RAG queries: `SELECT * FROM KnowledgeChunk WHERE bot_id = ? ORDER BY embedding <-> embedding_vector LIMIT 5`
- Typical chunk: 200-500 words (company hours, menu items, FAQ, policies)

---

### Lead

Captured contact information (with encrypted PII):

```prisma
model Lead {
  id        String     @id @default(cuid())
  tenantId  String
  tenant    Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  botId     String     // Which bot captured this lead
  
  // PII (Encrypted at-rest: AES-256-GCM format "{iv}:{authTag}:{ciphertext}")
  // @encrypted annotation is for documentation; actual encryption in service
  firstName String     // @encrypted AES-256-GCM
  phone     String     // @encrypted AES-256-GCM
  
  // Non-PII
  email     String?    // Not encrypted (optional, not always captured)
  status    LeadStatus @default(NEW)  // NEW | CONTACTED | CONVERTED | LOST
  source    String?    // Widget, manual, import, etc.
  ipAddress String?    // For context
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([tenantId, status])
  @@index([botId, createdAt])
}

enum LeadStatus {
  NEW        // Just captured
  CONTACTED  // Called/emailed
  CONVERTED  // Became customer
  LOST       // Not interested
}
```

**Key Insights:**
- `firstName`, `phone` are encrypted in DB
- Format: `{iv}:{authTag}:{ciphertext}` (hex) — all 3 parts hex-encoded
- Encryption happens in `EncryptionService` before saving to DB
- Decryption only in dashboard, exports, or when returning to authenticated users
- `email` is NOT encrypted (optional, not always captured)
- Single table: web dashboard + widget create leads → same table

---

### Conversation & Message

Chat history:

```prisma
model Conversation {
  id        String     @id @default(cuid())
  botId     String
  bot       Bot        @relation(fields: [botId], references: [id], onDelete: Cascade)
  tenantId  String     // Denormalized for query performance
  
  // Session tracking
  sessionId String?    // From widget (for tracking visitor across chats)
  
  // Relations
  messages  Message[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([botId, createdAt])
  @@index([tenantId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  // Content
  role           MsgRole      // USER | ASSISTANT
  content        String
  
  // Metadata
  tokenCount     Int?         // OpenAI token estimate (for usage tracking)
  
  createdAt      DateTime     @default(now())
  
  @@index([conversationId, createdAt])
}

enum MsgRole {
  USER
  ASSISTANT
}
```

**Key Insights:**
- Conversation: one per unique chat session
- Message: immutable once created
- sessionId: tracked from widget for analytics
- Max messages per API call: 10 (for context window)
- Old messages archived after 90 days (future optimization)

---

### ProcessedStripeEvent

Webhook idempotency (Stripe events are retried):

```prisma
model ProcessedStripeEvent {
  id        String   @id  // Stripe event ID (guaranteed unique by Stripe)
  type      String        // "charge.succeeded", "customer.subscription.deleted", etc
  createdAt DateTime @default(now())
  
  @@index([createdAt])
}
```

**Key Insights:**
- Before processing any Stripe webhook, we INSERT event id
- If INSERT fails (unique constraint), we silently return (already processed)
- Prevents duplicate subscription activations, duplicate emails, etc.

---

### BillingEvent

Audit trail for subscription state changes:

```prisma
model BillingEvent {
  id        String   @id @default(cuid())
  tenantId  String
  
  // Event Type & Details
  event     String   // "ACTIVATED", "DEACTIVATED", "PLAN_CHANGED", "TRIAL_EXPIRED"
  meta      String?  // JSON: { "stripeEventId": "evt_...", "plan": "STARTER", "nextBillingDate": "2026-05-18" }
  
  createdAt DateTime @default(now())
  
  @@index([tenantId, createdAt])
}
```

**Key Insights:**
- Immutable log of all state changes
- Used for customer support disputes ("when was I charged?")
- Useful for debugging webhook ordering issues
- Future: revenue analytics dashboard

---

## Enums (Shared Types)

### Industry

Bot's vertical (selected during onboarding):

```prisma
enum Industry {
  BEAUTY   // Salons, spas
  HEALTH   // Clinics, dental, psychology
  FOOD     // Restaurants, cafes
  AUTO     // Car repairs, detailing
  OTHER    // Everything else
}
```

Determines system prompt template + UI styling.

### Plan

Subscription tier:

```prisma
enum Plan {
  STARTER    // 149 PLN/month, 1000 conversations/month, basic features
  PRO        // Future (300 PLN/month, 10k conversations, more features)
  PREMIUM    // Future (1000 PLN/month, unlimited, white-label)
}
```

MVP uses only STARTER.

### MsgRole & LeadStatus

See models above.

---

## Indexes (Query Performance)

Strategic indexes for common queries:

```prisma
// Tenant lookups
model Tenant {
  @@index([plan, isActive])
}

// User lookups
model User {
  @@index([tenantId, email])
}

// Bot lookups
model Bot {
  @@index([tenantId])
  @@index([isActive])
}

// Knowledge search (RAG)
model KnowledgeChunk {
  @@index([botId])
  // pgvector similarity search uses the embedding index automatically
}

// Lead queries
model Lead {
  @@index([tenantId, status])  // Dashboard: filter leads by status
  @@index([botId, createdAt])  // Widget: check lead quota per bot
}

// Conversation queries
model Conversation {
  @@index([botId, createdAt])  // Dashboard: show recent chats
  @@index([tenantId])          // Tenant isolation
}

// Message queries (usually via conversation_id)
model Message {
  @@index([conversationId, createdAt])  // Fetch conversation history
}

// Webhook processing
model ProcessedStripeEvent {
  @@index([createdAt])  // Cleanup old events
}

// Audit log queries
model BillingEvent {
  @@index([tenantId, createdAt])  // Customer support lookups
}
```

---

## Constraints & Validations

### Unique Constraints

```prisma
model Tenant {
  stripeCustomerId String? @unique  // One tenant per Stripe customer
}

model User {
  email String @unique              // One user per email
}
```

### Foreign Keys & Cascades

- `User.tenantId` → `Tenant.id` (onDelete: Cascade) — delete tenant = delete users
- `Bot.tenantId` → `Tenant.id` (onDelete: Cascade) — delete tenant = delete bots
- `KnowledgeChunk.botId` → `Bot.id` (onDelete: Cascade) — delete bot = delete chunks
- `Lead.tenantId` → `Tenant.id` (onDelete: Cascade) — delete tenant = delete leads
- `Lead.botId` is not FK (can be non-existent, for deleted bots)
- `Conversation.botId` → `Bot.id` (onDelete: Cascade) — delete bot = delete chats
- `Message.conversationId` → `Conversation.id` (onDelete: Cascade) — delete conv = delete msgs

---

## Multi-Tenancy Strategy

### Row-Level Security (RLS) Policies

In Supabase, SQL policies enforce isolation:

```sql
-- Example: Leads table
CREATE POLICY leads_tenant_isolation ON leads
  FOR ALL
  USING (tenant_id = auth.jwt() -> 'user_metadata' ->> 'tenant_id');

CREATE POLICY leads_select ON leads FOR SELECT
  USING (tenant_id = auth.jwt() -> 'user_metadata' ->> 'tenant_id');

-- Similar policies for all tables with tenant_id
```

### In NestJS Code

Every query is manually filtered:

```typescript
// Get all leads for a tenant
const leads = await prisma.lead.findMany({
  where: {
    tenantId: tenantId,  // Always include this filter
    status: 'NEW',
  },
});

// Can't query leads from other tenants even if you try
// (RLS policies would block at DB level anyway)
```

### Enforcement

1. **RLS Policies:** Database-level (Supabase enforces)
2. **TenantGuard:** NestJS middleware (extract tenant_id from JWT)
3. **Manual filters:** Every Prisma query includes `tenantId`
4. **Defense in depth:** Multiple layers = extra safety

---

## PII Encryption Strategy

### At-Rest Encryption

Fields: `Lead.firstName`, `Lead.phone`

**Format:** `{iv}:{authTag}:{ciphertext}` (all hex-encoded)

**Algorithm:** AES-256-GCM (authenticated encryption)

**Example:**
```
Original: "John"
Encrypted: "a1b2c3d4e5f6g7h8:i9j0k1l2m3n4o5p6:q7r8s9t0u1v2w3x4y5z6"
```

**Service:** `apps/api/src/common/services/encryption.service.ts`

```typescript
export class EncryptionService {
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    // ... encryption logic
    return `${iv.hex}:${authTag.hex}:${encrypted.hex}`;
  }
  
  decrypt(ciphertext: string): string {
    const [iv, authTag, encrypted] = ciphertext.split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(iv, 'hex'));
    // ... decryption logic
    return plaintext;
  }
}
```

### When Encrypted

- On POST `/api/v1/leads` (widget submits lead)
- Before saving to DB
- Stored as string in `Lead.firstName`, `Lead.phone`

### When Decrypted

- GET `/api/v1/leads` (dashboard fetches leads)
- Export to CSV
- Returned in API responses (only to authenticated users)

### Why Not Just Hashing?

Hashing (bcrypt, SHA) is one-way — we need to decrypt for customer export. AES-256-GCM is reversible + authenticated (can't forge).

---

## Migrations

Prisma migrations live in `apps/api/prisma/migrations/`:

```bash
# Create a new migration after schema changes
pnpm prisma migrate dev --name add_new_field

# Generates SQL + Prisma types
```

Example migration:
```sql
-- prisma/migrations/20260418_add_personality/migration.sql

ALTER TABLE "Bot" ADD COLUMN "personality" TEXT;

-- RLS: This column doesn't need new policies (bot is already scoped to tenant)
```

---

## Data Retention & Cleanup

### Not Implemented (MVP Scope)

These would be future optimizations:

- Archive old conversations after 90 days
- Hard-delete soft-deleted leads after 30 days
- Compress message history (keep recent, archive old)
- Batch export of old leads to S3

### Manual Cleanup (If Needed)

```sql
-- Delete leads older than 30 days
DELETE FROM "Lead" WHERE "createdAt" < NOW() - INTERVAL '30 days';

-- Archive conversations
ALTER TABLE "Conversation" ADD COLUMN "archived" BOOLEAN DEFAULT FALSE;
UPDATE "Conversation" SET "archived" = TRUE WHERE "createdAt" < NOW() - INTERVAL '90 days';
```

---

## Query Examples

### Get All Bots for Tenant

```typescript
const bots = await prisma.bot.findMany({
  where: { tenantId },
  orderBy: { createdAt: 'desc' },
});
```

### Get Recent Conversations

```typescript
const conversations = await prisma.conversation.findMany({
  where: { tenantId },
  include: {
    messages: { take: 3 }  // Last 3 messages
  },
  orderBy: { createdAt: 'desc' },
  take: 10,  // Paginate
});
```

### Search Knowledge (RAG)

```sql
-- SQL (using pgvector similarity)
SELECT id, content, category, 1 - (embedding <-> query_vector) AS similarity
FROM "KnowledgeChunk"
WHERE "botId" = $1
ORDER BY embedding <-> query_vector
LIMIT 5;
```

### Export Leads

```typescript
const leads = await prisma.lead.findMany({
  where: { tenantId },
});

// Decrypt firstName & phone
const decrypted = leads.map(lead => ({
  ...lead,
  firstName: encryptionService.decrypt(lead.firstName),
  phone: encryptionService.decrypt(lead.phone),
}));

// Convert to CSV
const csv = Papa.unparse(decrypted);
```

---

## Performance Considerations

### Slow Queries to Avoid

```typescript
// ❌ DON'T: Join all tables
const allData = await prisma.tenant.findMany({ include: { users: true, bots: { include: { knowledge: true } } } });

// ✅ DO: Query what you need
const tenant = await prisma.tenant.findUnique({ where: { id } });
const bots = await prisma.bot.findMany({ where: { tenantId } });
```

### Pagination

```typescript
// ✅ DO: Paginate large result sets
const leads = await prisma.lead.findMany({
  where: { tenantId },
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
```

### Batch Operations

```typescript
// ✅ DO: Batch inserts
await prisma.message.createMany({
  data: messages,  // Array of message objects
});
```

---

## Related Codemaps

- [Backend API](./backend.md)
- [Frontend Web](./frontend.md)
- [Widget](./widget.md)
- [Integrations](./integrations.md)

---

**Last Updated:** 2026-04-18
