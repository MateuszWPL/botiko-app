# External Integrations Codemap

**Last Updated:** 2026-04-18

---

## Overview

Botiko integrates with 5 external services:

1. **OpenAI**: Chat completion, embeddings
2. **Supabase**: Database, Auth, RLS policies
3. **Stripe**: Billing, subscriptions, checkout
4. **Resend**: Email notifications (trial warnings)
5. **CDN/Hosting**: Deployment (Vercel, Railway)

---

## 1. OpenAI Integration

### Purpose

- **Chat Completion:** `gpt-4o-mini` for bot responses
- **Embeddings:** `text-embedding-3-small` for RAG

### Location

`apps/api/src/modules/ai/providers/openai.provider.ts`

### API Credentials

```env
OPENAI_API_KEY=sk-...  (in apps/api/.env)
```

### Usage: Chat Completion

```typescript
const response = await openai.createChatCompletion({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 500,
  messages: [
    {
      role: 'system',
      content: systemPrompt,  // Industry template + knowledge + guardrails
    },
    ...conversationHistory,  // Last 10 messages
  ],
});

// Returns: { choices: [{ message: { content: "Bot response..." } }] }
```

**Cost per request:**
- Input: ~$0.00015 per 1K tokens (typical request: 500-2000 tokens)
- Output: ~$0.0006 per 1K tokens (typical response: 200-500 tokens)
- **Total per chat:** ~$0.0003-0.0006

**Rate limit:** 20 req/min per API key (not an issue for MVP)

### Usage: Embeddings

```typescript
const embedding = await openai.createEmbedding({
  model: 'text-embedding-3-small',
  input: 'User message or knowledge chunk',
});

// Returns: { data: [{ embedding: [0.123, 0.456, ..., 0.789] }] }
// Vector: 1536 dimensions
```

**Cost per request:**
- ~$0.00002 per 1K tokens (typical chunk: 100-300 tokens)
- **Total per embedding:** ~$0.000002-0.000006

**When used:**
- Every chat message (search related knowledge)
- Creating/updating knowledge chunks
- Could add caching to reduce calls (future optimization)

### Error Handling

```typescript
try {
  const response = await openai.chat(...);
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Retry with exponential backoff
    return await retryWithBackoff(() => openai.chat(...));
  } else if (error.code === 'invalid_api_key') {
    // Crash: misconfigured
    process.exit(1);
  } else if (error.status === 500) {
    // Temporary outage: return canned response
    return "Sorry, I'm having trouble right now. Please try again in a moment.";
  }
}
```

### Testing

Use OpenAI's mock in tests (or skip real API calls):

```typescript
// In test
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: jest.fn().mockResolvedValue({
      choices: [{ message: { content: 'Mock response' } }],
    }),
  })),
}));
```

---

## 2. Supabase Integration

### Purpose

- **Database:** PostgreSQL with pgvector
- **Auth:** User registration, login, JWT
- **RLS Policies:** Row-level security (multi-tenancy)

### Location

- Database setup: Project created at supabase.com
- Auth config: `apps/api/src/config/env.ts`, `apps/web/lib/auth.ts`
- Policies: `supabase/migrations/001_rls_policies.sql`

### API Credentials

```env
# API
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ0...  (public, safe in code)
SUPABASE_SERVICE_ROLE_KEY=eyJ0...  (secret, keep in .env)

# Web
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0...  (public)
```

### Database Connection

```typescript
// NestJS: Use Prisma (not Supabase client directly)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Web: Use Supabase client for auth + realtime (not data queries)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

**Connection string:**
```
postgresql://user:pass@pooler.supabase.com:6543/postgres?sslmode=require
```

**Note:** Use pooler (`:pooler.supabase.com`) for connection pooling, not direct host (`:db.supabase.co`).

### Auth Flow

```typescript
// 1. Web → Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// 2. Supabase sends confirmation email (or auto-confirms if configured)

// 3. User clicks link → Web redirects to callback handler → JWT stored

// 4. Every API request: JWT in Authorization header
// API verifies with: supabase.auth.getUser(token, { serviceRole: true })

// 5. JWT claims include user_id, email, custom user_metadata (tenant_id)
```

### JWT Claims

```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "email_verified": true,
  "aud": "authenticated",
  "user_metadata": {
    "tenant_id": "tenant-id-uuid"
  },
  "iat": 1681234567,
  "exp": 1681238167
}
```

**Extracting in NestJS:**
```typescript
const token = req.headers.authorization.replace('Bearer ', '');
const { data: { user }, error } = await supabase.auth.getUser(token);
const userId = user.id;
const tenantId = user.user_metadata.tenant_id;
```

### RLS Policies

All tables have policies (in `supabase/migrations/001_rls_policies.sql`):

```sql
-- Example: Bots table
CREATE POLICY "Users can see own tenant's bots"
  ON bots FOR SELECT
  USING (tenant_id = auth.jwt() -> 'user_metadata' ->> 'tenant_id');

CREATE POLICY "Users can insert bots for own tenant"
  ON bots FOR INSERT
  WITH CHECK (tenant_id = auth.jwt() -> 'user_metadata' ->> 'tenant_id');
```

Policies are enforced at the database level, even if NestJS forgets to filter, DB still blocks.

### Webhook: Stripe Events

Supabase can trigger webhooks on table changes (database webhooks). For MVP, we don't use this, instead, Stripe sends webhooks directly to NestJS.

---

## 3. Stripe Integration

### Purpose

- Subscription billing (STARTER: 99 PLN/month)
- 14-day free trial
- Checkout flow (password → payment)
- Customer portal (manage subscription)
- Webhooks (subscription state changes)

### Location

- Service: `apps/api/src/modules/billing/billing.service.ts`
- Webhooks: `apps/api/src/modules/billing/billing.webhook.handler.ts`
- Web: `/dashboard/billing` page

### API Credentials

```env
STRIPE_SECRET_KEY=sk_test_...  (in apps/api/.env)
STRIPE_WEBHOOK_SECRET=whsec_...  (in apps/api/.env)
```

### Products & Prices

In Stripe dashboard (manual setup):

```
Product: "Botiko STARTER"
  Price: "99 PLN"
  Billing cycle: Monthly
  Trial: 14 days (automatic)
```

### Subscription Flow

```
1. User signs up → Tenant created with isActive=false, trial start
2. Dashboard → Billing page → "Upgrade" button
3. Click upgrade → POST /api/v1/billing/checkout { planId: "STARTER" }
4. API creates Stripe checkout session
5. Returns: { sessionUrl: "https://checkout.stripe.com/..." }
6. Web redirects to Stripe checkout
7. User enters payment info
8. Stripe charges (14-day trial waived)
9. Stripe webhook: charge.succeeded → NestJS endpoint
10. Webhook handler: Tenant.isActive = true, save stripeCustomerId + stripeSubscriptionId
11. Email sent: "You're all set! Your bot is now active."
```

### Webhook Events Handled

```typescript
const webhookHandler = async (event) => {
  switch (event.type) {
    case 'customer.subscription.created':
      // Subscription active → set isActive = true
      break;
      
    case 'customer.subscription.updated':
      // Plan changed → update Tenant.plan
      break;
      
    case 'customer.subscription.deleted':
      // Subscription cancelled → set isActive = false
      break;
      
    case 'invoice.payment_succeeded':
      // Payment received (recurring charge) → log event
      break;
      
    case 'invoice.payment_failed':
      // Payment failed → send email, set isActive = false if not retrying
      break;
  }
};
```

### Webhook Signature Verification

```typescript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,  // Raw body (not JSON.parse'd)
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);

// Only process if signature valid
```

### Idempotency

Stripe may retry webhooks. We prevent duplicate processing:

```typescript
// ProcessedStripeEvent table: prevent duplicates
const { id: eventId, type } = event;

const existing = await prisma.processedStripeEvent.findUnique({
  where: { id: eventId },
});

if (existing) {
  console.log('Already processed event:', eventId);
  return;
}

// Insert to mark as processed
await prisma.processedStripeEvent.create({
  data: { id: eventId, type },
});

// Now process the event
// (Safe to process because we have a lock)
```

### Customer Portal

```typescript
// POST /api/v1/billing/portal
const session = await stripe.billingPortal.sessions.create({
  customer: tenant.stripeCustomerId,
  return_url: process.env.WEB_URL + '/dashboard/billing',
});

// Returns: { url: "https://billing.stripe.com/..." }
// Web redirects to portal (allows customer to cancel, update card, etc)
```

### Trial Logic

Handled by Stripe (configured in product):

```
14-day trial = Stripe charges 0 for first 14 days
After 14 days = Stripe charges 99 PLN
If customer cancels during trial = No charge
```

**Email reminder:** Before trial expires (3 days before):
```typescript
// In NestJS background job (or webhook handler):
const trialsEnding = await prisma.tenant.findMany({
  where: {
    isActive: false,  // Not yet charged
    createdAt: { gte: 14 - 3 },  // Created 11+ days ago
  },
});

for (const tenant of trialsEnding) {
  if (!tenant.lastTrialEmailSentAt || daysSince(tenant.lastTrialEmailSentAt) > 7) {
    // Send email via Resend
    await resend.emails.send({
      from: 'billing@botiko.pl',
      to: tenant.users[0].email,
      subject: 'Your Botiko trial expires in 3 days',
      html: `...`,
    });
    
    // Update flag
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { lastTrialEmailSentAt: new Date() },
    });
  }
}
```

---

## 4. Resend Integration

### Purpose

Send email notifications (trial warnings, contact form submissions).

### Location

`apps/api/src/common/services/notification.service.ts`

### API Credentials

```env
RESEND_API_KEY=re_...  (in apps/api/.env)
```

### Usage

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send trial warning email
await resend.emails.send({
  from: 'noreply@botiko.pl',
  to: 'customer@example.com',
  subject: 'Your Botiko trial ends in 3 days',
  html: '<h1>Your trial ends in 3 days!</h1><p>Upgrade now to keep your bot active.</p>',
});
```

### Email Addresses

- `noreply@botiko.pl`: Automated alerts (trial, billing)
- `support@botiko.pl`: Manual support
- `hello@botiko.pl`: Contact form submissions

---

## 5. CDN & Hosting

### Widget CDN

Widget script (`embed.js`) served from CDN for fast loading:

**Option 1: Vercel**
```
Build: pnpm build in apps/widget
Deploy: Automatically via GitHub Actions
CDN: https://botiko.pl/embed.js (Vercel's CDN)
```

**Option 2: CloudFront + S3**
```
Build: pnpm build in apps/widget
Upload: dist/embed.js to S3
CDN: CloudFront points to S3 bucket
```

**Cache headers:**
```
Cache-Control: public, max-age=3600  (1 hour)
```

Low TTL because we may push updates, but 1 hour avoids cache-busting every deploy.

### API Hosting

**Option 1: Railway**
```
Build: pnpm build in apps/api
Deploy: Railway pulls from GitHub, runs pnpm build && pnpm start
Port: 3001
Database: Supabase PostgreSQL (external, not managed by Railway)
```

**Option 2: Vercel**
```
API Routes: Not ideal (serverless has cold starts, Stripe webhooks timeout)
Better: Dedicated server (Railway, Render, DigitalOcean)
```

### Web Hosting

**Vercel** (recommended for Next.js):
```
Build: pnpm build in apps/web
Deploy: Vercel CI/CD from GitHub
URL: botiko.pl (custom domain)
Port: 443 (HTTPS)
```

### Environment Variables

Each app has `.env` file (never committed):

```
# apps/api/.env
DATABASE_URL=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
# etc.

# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# apps/widget/.env (usually empty, everything in vite config)
```

In production, set via hosting provider's dashboard (Vercel env vars, Railway variables).

---

## Integration Flow Diagram

```
Customer Website
    ↓
[Widget] — JavaScript loaded from CDN (botiko.pl/embed.js)
    ↓
POST /api/v1/chat
    ↓
[NestJS API] (Railway or Vercel serverless)
    ├→ Supabase JWT verification
    ├→ pgvector similarity search (knowledge)
    └→ OpenAI chat completion (gpt-4o-mini)
    ↓
Response: bot message + suggested questions
    ↓
Widget displays response, saves to sessionStorage


Dashboard User
    ↓
[Next.js Web] (Vercel)
    ↓
Supabase Auth (login)
    ↓
JWT stored in secure cookie
    ↓
GET /api/v1/bots, /api/v1/leads, etc.
    ↓
[NestJS API]
    ├→ Verify JWT via Supabase
    ├→ Query Prisma (PostgreSQL)
    └→ Return data (filtered by tenant_id)
    ↓
Web displays dashboard


Billing Flow
    ↓
User clicks "Upgrade" → Stripe checkout
    ↓
Stripe charges 99 PLN (or waives trial)
    ↓
Stripe webhook → NestJS endpoint
    ↓
[BillingService]
    ├→ Check idempotency (ProcessedStripeEvent)
    ├→ Update Tenant.isActive = true
    ├→ Send confirmation email (Resend)
    └→ Log event (BillingEvent)
    ↓
Chat API checks isActive → allows/blocks requests
```

---

## Error Handling & Retries

### OpenAI Timeouts

```typescript
const timeout = setTimeout(() => controller.abort(), 30000);
try {
  const response = await fetch('https://api.openai.com/...', {
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === 'AbortError') {
    // Timeout: return canned response
    return "Sorry, I'm taking longer than usual. Please try again.";
  }
}
```

### Stripe Webhook Retries

Stripe retries webhooks on HTTP 500. We handle with idempotency:

```typescript
try {
  await processWebhook(event);
  return { received: true };  // HTTP 200 = "got it"
} catch (error) {
  console.error('Webhook processing failed:', error);
  return { received: false };  // HTTP 500 = "retry later"
}
```

### Rate Limiting

OpenAI rate limit: 20 req/min (not an issue for MVP).

If exceeded:
```typescript
if (error.status === 429) {
  // Retry with exponential backoff
  await sleep(2000);
  return await openai.chat(...);
}
```

---

## Monitoring & Observability

### OpenAI Usage

Track in `Tenant.tokenUsage`:

```typescript
// After API response
const tokenCount = response.usage.total_tokens;
await prisma.tenant.update({
  where: { id: tenantId },
  data: { tokenUsage: { increment: tokenCount } },
});
```

### Stripe Events

All events logged in `BillingEvent` table (audit trail for support).

### Email Tracking

Resend provides click/open rates in dashboard. Useful for monitoring trial warning effectiveness.

---

## Cost Estimation (MVP)

### OpenAI
- Chat: 1000 chats/month × $0.0005/chat = $0.50/month
- Embeddings: 100 chunks × $0.000003/chunk = $0.0003/month
- **Total: ~$0.50/month**

### Stripe
- Processing fee: 2.9% + $0.30 per transaction
- 15 customers × 99 PLN × 2.9% + $0.30 = ~50 PLN/month (~$13)

### Supabase
- Database: PostgreSQL included, pgvector included
- Free tier: 500 MB storage, sufficient for MVP
- Beyond: $25/month for 8GB storage

### Resend
- 100 emails/day free
- Beyond: $0.0001 per email

### CDN (Vercel/CloudFront)
- Vercel: included in Vercel deployment
- CloudFront: ~$0.085 per GB (low traffic)

### Hosting (Railway/Vercel)
- Railway: ~$5-10/month for starter tier
- Vercel: free tier (may hit serverless limits for API)

**Total: ~$50-100/month** (before customer revenue)

---

## Related Codemaps

- [Backend API](./backend.md)
- [Frontend Web](./frontend.md)
- [Widget](./widget.md)
- [Database Schema](./database.md)

---

**Last Updated:** 2026-04-18
