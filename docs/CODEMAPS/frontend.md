# Frontend Web App Codemap. Next.js 14 + Tailwind v4

**Last Updated:** 2026-04-18  
**Location:** `apps/web/`  
**Entry Point:** `apps/web/app/`  
**Port:** 3000 (dev), varies (prod)

---

## Quick Overview

Next.js 14 App Router with 8 main pages + landing/marketing. Uses:
- **Auth:** Supabase SSR (@supabase/ssr): email/password stored in Supabase Auth
- **Styling:** Tailwind v4 (utility-first CSS)
- **Icons:** Lucide React (SVG icons)
- **Charts:** Recharts (analytics visualizations)
- **Forms:** React Hook Form + Zod
- **Billing:** Stripe checkout + customer portal (embedded iframes)
- **CMS:** MDX (blog posts as markdown)

---

## Directory Structure

```
apps/web/
├── app/
│   ├── (auth)/                    # Auth routes (route group, not in URL)
│   │   ├── login/
│   │   │   └── page.tsx           # Login form
│   │   ├── register/
│   │   │   └── page.tsx           # Signup form + tenant setup (name, industry)
│   │   ├── forgot-password/
│   │   │   └── page.tsx           # Password reset flow
│   │   ├── reset-password/
│   │   │   └── page.tsx           # New password submission
│   │   └── layout.tsx             # Shared layout (no sidebar)
│   │
│   ├── (marketing)/                # Landing, blog, contact (public)
│   │   ├── layout.tsx             # Header, footer shared
│   │   ├── page.tsx               # Landing page (hero, features, pricing, CTA)
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Blog post (MDX)
│   │   ├── contact/
│   │   │   └── page.tsx           # Contact form
│   │   ├── prywatnosc/
│   │   │   └── page.tsx           # Privacy policy
│   │   └── regulamin/
│   │       └── page.tsx           # Terms of service
│   │
│   ├── dashboard/                  # Protected dashboard (requires auth)
│   │   ├── layout.tsx             # Sidebar + header shared
│   │   ├── page.tsx               # Overview (stats, recent leads)
│   │   │
│   │   ├── bots/                  # Bot management
│   │   │   ├── page.tsx           # Bot list
│   │   │   ├── [id]/              # Bot detail / edit
│   │   │   │   └── page.tsx       # Bot config form
│   │   │   └── new/
│   │   │       └── page.tsx       # Create new bot (onboarding wizard)
│   │   │
│   │   ├── leads/                 # Lead management
│   │   │   ├── page.tsx           # Leads table (filter by bot, status)
│   │   │   ├── export.tsx         # CSV export button
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Lead detail
│   │   │
│   │   ├── conversations/         # Chat history
│   │   │   ├── page.tsx           # Conversation list
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Conversation transcript
│   │   │
│   │   ├── knowledge/             # Knowledge base editor
│   │   │   ├── page.tsx           # Knowledge chunks list
│   │   │   └── [botId]/
│   │   │       └── page.tsx       # Editor for bot's knowledge
│   │   │
│   │   ├── settings/              # Account settings
│   │   │   ├── page.tsx           # Tenant info, password change
│   │   │   └── team/
│   │   │       └── page.tsx       # Team members (future)
│   │   │
│   │   ├── embed/                 # Widget embed instructions
│   │   │   └── page.tsx           # Copy-paste code snippet
│   │   │
│   │   ├── billing/               # Billing portal
│   │   │   ├── page.tsx           # Subscription status, upgrade button
│   │   │   └── portal.tsx         # Stripe customer portal (iframe)
│   │   │
│   │   └── [botId]/               # Bot routes (if needed)
│   │
│   ├── onboarding/                # Onboarding flow (protected by auth)
│   │   ├── layout.tsx             # Minimal layout (no sidebar)
│   │   ├── page.tsx               # Step 1: Industry selection
│   │   ├── template/
│   │   │   └── page.tsx           # Step 2: Select template (if any)
│   │   ├── config/
│   │   │   └── page.tsx           # Step 3: Bot initial config
│   │   └── success/
│   │       └── page.tsx           # Done! → dashboard
│   │
│   ├── api/                        # Next.js API routes (if needed)
│   │   ├── auth/
│   │   │   ├── callback/route.ts  # Supabase callback (after email link)
│   │   │   └── logout/route.ts    # Clear session
│   │   └── stripe/
│   │       └── webhook/route.ts   # Stripe webhooks (if any)
│   │
│   ├── layout.tsx                 # Root layout (fonts, globals, providers)
│   ├── page.tsx                   # Home page (redirects to /dashboard or /)
│   └── not-found.tsx              # 404 page
│
├── components/                     # Reusable React components
│   ├── layout/
│   │   ├── Sidebar.tsx            # Dashboard sidebar nav
│   │   ├── Header.tsx             # Top header with user menu
│   │   ├── Footer.tsx             # Landing page footer
│   │   └── Navbar.tsx             # Marketing site navbar
│   │
│   ├── forms/
│   │   ├── LoginForm.tsx          # Email + password input
│   │   ├── RegisterForm.tsx       # Signup (email, password, tenant info)
│   │   ├── BotForm.tsx            # Create/edit bot config
│   │   ├── KnowledgeForm.tsx      # Add/edit knowledge chunk
│   │   └── ContactForm.tsx        # Landing page contact
│   │
│   ├── tables/
│   │   ├── LeadsTable.tsx         # Leads list with filtering
│   │   ├── BotsTable.tsx          # Bots list
│   │   └── ConversationsTable.tsx # Chat history table
│   │
│   ├── cards/
│   │   ├── StatCard.tsx           # Dashboard stat box
│   │   ├── BotCard.tsx            # Bot preview card
│   │   └── LeadCard.tsx           # Lead preview card
│   │
│   ├── modals/
│   │   ├── DeleteModal.tsx        # Confirm deletion
│   │   ├── ExportModal.tsx        # CSV export dialog
│   │   └── InviteModal.tsx        # Invite team member (future)
│   │
│   ├── charts/
│   │   ├── MessageChart.tsx       # Messages per day (Recharts)
│   │   ├── LeadsChart.tsx         # Leads per day (Recharts)
│   │   └── ConversionChart.tsx    # Lead conversion rate
│   │
│   └── ui/
│       ├── Button.tsx             # Reusable button
│       ├── Input.tsx              # Form input field
│       ├── Select.tsx             # Dropdown
│       ├── Alert.tsx              # Alert/toast message
│       ├── Spinner.tsx            # Loading indicator
│       └── Badge.tsx              # Status badge
│
├── hooks/
│   ├── useAuth.ts                 # Current user + tenant context
│   ├── useBot.ts                  # Fetch bot by ID
│   ├── useLeads.ts                # Fetch leads for tenant
│   ├── useBots.ts                 # Fetch all bots
│   ├── useConversations.ts        # Fetch conversations
│   ├── useKnowledge.ts            # Fetch knowledge chunks
│   ├── useTenant.ts               # Fetch tenant info
│   ├── useBilling.ts              # Fetch billing status
│   └── useForm.ts                 # React Hook Form wrapper
│
├── lib/
│   ├── api.ts                     # API client (fetch wrapper with auth)
│   ├── auth.ts                    # Supabase auth helpers
│   ├── cn.ts                      # classNames utility
│   ├── formatters.ts              # Date, number formatting
│   ├── validators.ts              # Zod schemas (client-side validation)
│   └── constants.ts               # App-wide constants
│
├── content/
│   ├── blog/
│   │   ├── booksy-vs-bot.mdx      # Blog post (MDX)
│   │   └── ... more posts
│   └── pages/
│       └── ... static content
│
├── styles/
│   ├── globals.css                # Tailwind imports, global styles
│   ├── animations.css             # Custom animations
│   └── variables.css              # CSS custom properties
│
├── middleware.ts                  # Next.js middleware (auth checks)
├── next.config.js                 # Next.js config (MDX, images, etc)
├── tailwind.config.ts             # Tailwind config (theme, extend)
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

---

## Key Routes & Pages

### Public Routes (No Auth Required)

| Route | Purpose |
|-------|---------|
| `/` | Landing page (hero, features, pricing, CTA) |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post (MDX) |
| `/contact` | Contact form |
| `/prywatnosc` | Privacy policy |
| `/regulamin` | Terms of service |
| `/login` | Login form |
| `/register` | Signup form |
| `/forgot-password` | Password reset request |
| `/reset-password?token=...` | New password submission |

### Protected Routes (Auth Required)

| Route | Purpose |
|-------|---------|
| `/dashboard` | Overview (stats, recent leads) |
| `/dashboard/bots` | Bot management (list, create, edit) |
| `/dashboard/leads` | Lead management (list, filter, export) |
| `/dashboard/conversations` | Chat history |
| `/dashboard/knowledge` | Knowledge base editor |
| `/dashboard/settings` | Account settings |
| `/dashboard/embed` | Widget embed code |
| `/dashboard/billing` | Subscription + upgrade |

### Onboarding Routes (Auth Required, First-Time)

| Route | Purpose |
|-------|---------|
| `/onboarding` | Step 1: Select industry |
| `/onboarding/template` | Step 2: Choose template (optional) |
| `/onboarding/config` | Step 3: Initial bot config |
| `/onboarding/success` | Done! Redirects to dashboard |

---

## Authentication Flow

### Signup (Register)

```
1. User fills form: email, password, tenant name, industry
2. Client: POST /api/v1/auth/register (to NestJS API)
3. API: Supabase Auth creates user, returns JWT
4. Web: Stores JWT in secure cookie via @supabase/ssr
5. Redirect to /onboarding
```

### Login

```
1. User fills form: email, password
2. Client: POST /api/v1/auth/login
3. API: Supabase Auth verifies, returns JWT
4. Web: Stores JWT in secure cookie
5. Redirect to /dashboard (or wherever they came from)
```

### Session Persistence

- Supabase SSR middleware in `middleware.ts` refreshes JWT on every request
- Cookie is automatically updated if token was refreshed
- Logout: clear cookie, redirect to /login

### Protected Pages

Using `useAuth()` hook in components:

```typescript
export default function DashboardPage() {
  const { user, tenant, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <Dashboard user={user} tenant={tenant} />;
}
```

---

## Data Fetching & State Management

### API Client (`lib/api.ts`)

```typescript
export const api = {
  // Bots
  getBots: () => fetch('/api/v1/bots', { headers: authHeaders() }),
  getBot: (id) => fetch(`/api/v1/bots/${id}`, { headers: authHeaders() }),
  createBot: (data) => fetch('/api/v1/bot', { method: 'POST', body: JSON.stringify(data), headers: authHeaders() }),
  
  // Leads
  getLeads: (botId, status) => fetch(`/api/v1/leads?botId=${botId}&status=${status}`, { headers: authHeaders() }),
  createLead: (data) => fetch('/api/v1/leads', { method: 'POST', body: JSON.stringify(data) }),
  
  // ... more endpoints
};
```

### Custom Hooks

Each major feature has a hook (using `useQuery` pattern or SWR):

```typescript
export function useBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    api.getBots()
      .then(res => res.json())
      .then(setBots)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { bots, loading, error };
}
```

---

## Key Features

### 1. Bot Management

**Pages:** `/dashboard/bots` (list), `/dashboard/bots/[id]` (edit), `/dashboard/bots/new` (create)

**Features:**
- Create bot (name, welcome message, industry)
- Edit bot config (personality, colors, domains)
- Delete bot
- Test widget (preview)
- Copy embed code

**Components:**
- `BotForm`: Input form (React Hook Form + Zod)
- `BotsTable`: List with filters
- `BotCard`: Preview card

### 2. Lead Management

**Pages:** `/dashboard/leads` (list), `/dashboard/leads/[id]` (detail)

**Features:**
- View all leads (paginated, sortable)
- Filter by bot, status (NEW, CONTACTED, CONVERTED, LOST)
- Update lead status
- Export as CSV
- Delete lead
- View lead source (which bot, when, IP)

**Components:**
- `LeadsTable`: Sortable, filterable table
- `ExportModal`: CSV export dialog
- `LeadCard`: Detailed lead view

**Note:** First name + phone are encrypted in DB, decrypted on dashboard for display.

### 3. Knowledge Base Editor

**Pages:** `/dashboard/knowledge/[botId]`

**Features:**
- Add knowledge chunk (text area)
- Edit chunk (re-embeds automatically)
- Delete chunk
- Category tagging
- Search chunks
- See embedding status (when created)

**Components:**
- `KnowledgeForm`: Add/edit form
- Knowledge table (list all chunks)

### 4. Conversations (Chat History)

**Pages:** `/dashboard/conversations` (list), `/dashboard/conversations/[id]` (transcript)

**Features:**
- View conversation history (paginated)
- See transcript (user message → bot response)
- Filter by bot, date range
- Analytics (messages per day)

**Components:**
- `ConversationsTable`: List
- Message bubble components: Transcript display

### 5. Billing

**Pages:** `/dashboard/billing`

**Features:**
- Show current plan (STARTER)
- Show billing cycle, next renewal date
- Upgrade button (redirects to Stripe checkout)
- Manage subscription (redirects to Stripe customer portal)
- Show trial status (days remaining, etc)

**Components:**
- `BillingStatus`: Current subscription info
- `UpgradeModal`: Plan selection
- Stripe iframe for checkout/portal

**Integration:**
- `useBilling()` hook fetches `/api/v1/billing/status`
- Upgrade button: POST to `/api/v1/billing/checkout` → returns Stripe session URL
- Stripe loads in iframe or full page

### 6. Settings

**Pages:** `/dashboard/settings`

**Features:**
- Tenant name, industry (can be changed)
- Password change
- Delete account (future)
- Team management (future)

**Components:**
- Forms for each section

### 7. Embed Instructions

**Pages:** `/dashboard/embed`

**Features:**
- Display embed code (copy-paste ready)
- Show bot ID (UUID)
- Instructions for WordPress, Shopify, Webflow, GTM
- Test button (shows widget preview)

### 8. Landing Page

**Pages:** `/` (home)

**Sections:**
- Hero (headline, CTA)
- Features (RAG, 24/7, Stripe, multi-industry)
- Pricing (STARTER 99 PLN/mies, 14d trial)
- Brand logos / testimonials
- Call-to-action (Sign up, Contact)
- Footer (links, privacy, terms, contact)

**Components:**
- `Navbar`: Top navigation
- `Hero`: Banner
- `Features`: Feature grid
- `Pricing`: Plan cards
- `CTA`: Call-to-action section
- `Footer`: Footer

### 9. Blog

**Pages:** `/blog` (index), `/blog/[slug]` (post)

**Features:**
- MDX posts (markdown with React components)
- Post list (thumbnail, title, date, excerpt)
- Individual post view (full content)
- SEO optimized (meta tags, og:image, etc)

**Content:** `content/blog/` directory

### 10. Contact Form

**Pages:** `/contact`

**Features:**
- Name, email, message fields
- Submit to API
- Rate limit: 10 req/min per IP
- Sends email via Resend
- Success/error message

---

## Styling & Design System

### Tailwind v4

- Utility-first CSS
- No CSS files (except globals.css)
- Custom theme in `tailwind.config.ts`:
  - Colors: `brand`, `brandDark`, `accent`, `beauty`, `health`, `food`, `auto`
  - Fonts: Inter (system font stack)
  - Spacing, typography, borders

### Global Styles (`styles/globals.css`)

```css
@import "tailwindcss";
@layer base {
  body { @apply bg-slate-50 text-slate-900; }
}
@layer components {
  .btn-primary { @apply px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700; }
}
@layer utilities {
  .text-balance { text-wrap: balance; }
}
```

### Color Palette

| Purpose | Color |
|---------|-------|
| Brand primary | `#6366F1` (indigo-500) |
| Brand dark | `#4338CA` (indigo-700) |
| Accent | `#10B981` (green-500) |
| Beauty | `#EC4899` (pink-500) |
| Health | `#06B6D4` (cyan-500) |
| Food | `#F97316` (orange-500) |
| Auto | `#64748B` (slate-500) |
| Text | `#0F172A` (slate-900) |
| Background | `#F8FAFC` (slate-50) |

---

## Form Handling

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    await api.submitForm(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

---

## Environment Variables

Required in `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0...
```

Only `NEXT_PUBLIC_*` vars are exposed to browser (rest are server-only).

---

## Performance Optimization

- **Code splitting:** Next.js automatic route-based splitting
- **Image optimization:** `next/image` for responsive images
- **Font optimization:** Google Fonts preload in `layout.tsx`
- **Lazy loading:** `dynamic()` for heavy components
- **Build cache:** `.next/` folder (ignored in git)

---

## Testing

Not extensively covered in MVP, but structure in place:

```bash
pnpm test                # Run Jest
pnpm test:watch         # Watch mode
```

Test files: `**/__tests__/**/*.test.ts(x)` or `*.test.ts(x)`

---

## Common Development Tasks

### Add a new page

1. Create `app/dashboard/newpage/page.tsx`
2. Import components
3. Fetch data in component or with hook
4. Add route to sidebar navigation

### Add a new form

1. Create `components/forms/MyForm.tsx`
2. Define Zod schema
3. Use React Hook Form with `zodResolver`
4. Use API client to submit
5. Show success/error messages

### Add a new table

1. Create `components/tables/MyTable.tsx`
2. Use `useMemo` for sorting/filtering logic
3. Use Lucide icons for actions (edit, delete)
4. Use modals for edit/delete confirmations

### Styling a component

1. Use Tailwind classes directly in JSX
2. Use `cn()` utility for conditional classes
3. Create variant helper functions for reusable styles:

```typescript
export const buttonVariants = (variant: 'primary' | 'secondary') => {
  return variant === 'primary'
    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
    : 'bg-gray-200 text-gray-900 hover:bg-gray-300';
};
```

---

## Deployment

- **Vercel:** Recommended (Next.js first-class support)
- **Build:** `pnpm build` → `.next/` folder
- **Start:** `pnpm start` (production server)
- **Environment:** Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard

---

## Related Codemaps

- [Backend API](./backend.md)
- [Widget](./widget.md)
- [Database Schema](./database.md)
- [Integrations](./integrations.md)

---

**Last Updated:** 2026-04-18
