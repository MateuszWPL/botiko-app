# Botiko — Web (Next.js 14 + Tailwind v4)

Frontend dashboard + landing page for Botiko platform. Features:
- 📊 Dashboard (8 pages: overview, bots, leads, conversations, knowledge, settings, embed, billing)
- 🔐 Supabase Auth SSR (email/password)
- 💳 Stripe billing integration
- 📱 Responsive design (mobile-first)
- 🎨 Tailwind v4 styling
- 📈 Recharts analytics

---

## Local Development

```bash
pnpm install
cp ../../.env.local NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# Edit .env.local with:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

pnpm dev                    # Dev server (http://localhost:3000)
```

---

## Scripts

```bash
pnpm dev                    # Development (http://localhost:3000)
pnpm build                  # Production build
pnpm start                  # Production server (requires build)
pnpm lint                   # ESLint
pnpm type-check             # TypeScript type checking
pnpm format                 # Prettier
```

---

## Architecture

### App Router Structure

```
app/
├── (auth)/                 # Authentication routes
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
│
├── (marketing)/            # Public landing & blog
│   ├── page.tsx            # Landing page
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   └── [slug]/page.tsx # Blog post (MDX)
│   ├── contact/page.tsx    # Contact form
│   ├── prywatnosc/page.tsx # Privacy policy
│   └── regulamin/page.tsx  # Terms
│
├── dashboard/              # Protected dashboard
│   ├── page.tsx            # Overview
│   ├── bots/               # Bot management
│   ├── leads/              # Lead management
│   ├── conversations/      # Chat history
│   ├── knowledge/          # Knowledge base editor
│   ├── settings/           # Account settings
│   ├── embed/              # Widget embed code
│   └── billing/            # Subscription
│
├── onboarding/             # First-time setup (protected)
│   ├── page.tsx            # Step 1: Industry selection
│   ├── template/page.tsx   # Step 2: Template selection
│   ├── config/page.tsx     # Step 3: Initial config
│   └── success/page.tsx    # Done!
│
├── api/                    # Next.js API routes
│   └── auth/
│       ├── callback/route.ts
│       └── logout/route.ts
│
├── layout.tsx              # Root layout
├── middleware.ts           # Auth middleware
└── not-found.tsx           # 404 page
```

### Components

```
components/
├── layout/
│   ├── Sidebar.tsx         # Dashboard sidebar
│   ├── Header.tsx          # Top header
│   ├── Footer.tsx          # Landing footer
│   └── Navbar.tsx          # Marketing navbar
│
├── forms/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── BotForm.tsx
│   ├── KnowledgeForm.tsx
│   └── ContactForm.tsx
│
├── tables/
│   ├── LeadsTable.tsx
│   ├── BotsTable.tsx
│   └── ConversationsTable.tsx
│
├── charts/
│   ├── MessageChart.tsx    # Recharts
│   ├── LeadsChart.tsx
│   └── ConversionChart.tsx
│
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Select.tsx
    ├── Alert.tsx
    └── Badge.tsx
```

### Hooks

```typescript
// Custom hooks for data fetching
useAuth()              // Current user + tenant
useBots()              // Fetch all bots
useBot(id)             // Fetch single bot
useLeads()             // Fetch leads
useConversations()     // Fetch chats
useKnowledge()         // Fetch knowledge chunks
useTenant()            // Fetch account info
useBilling()           // Fetch billing status
```

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind v4
- **Auth:** Supabase SSR (@supabase/ssr)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **CMS:** MDX (blog posts)
- **Deployment:** Vercel (recommended)

---

## Key Features

### Dashboard Pages (8 pages)

1. **Overview** — Stats, recent activity, quick actions
2. **Bots** — List, create, edit bots
3. **Leads** — View, filter, export, manage leads
4. **Conversations** — Chat history, transcripts
5. **Knowledge** — Add/edit knowledge chunks for RAG
6. **Settings** — Account info, password change
7. **Embed** — Widget installation code
8. **Billing** — Subscription, upgrade, portal

### Authentication Flow

1. User registers → email + password to Supabase Auth
2. Supabase creates `auth.users` entry + JWT
3. Web stores JWT in secure HTTP-only cookie (via @supabase/ssr)
4. Every request: cookie refreshed if needed
5. Protected pages: check `useAuth()` hook, redirect to /login if not authenticated

### Forms & Validation

All forms use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export function MyForm() {
  const { register, handleSubmit, errors } = useForm({
    resolver: zodResolver(schema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

### Stripe Billing

Handles subscription checkout & management:

- Upgrade button → Stripe checkout
- Customer portal for subscription management
- Billing status display
- Trial countdown

```typescript
// Fetch billing status
const { data: status } = await api.get('/billing/status');

// Create checkout session
const { data: { sessionUrl } } = await api.post('/billing/checkout', { planId: 'STARTER' });

// Redirect to checkout
window.location.href = sessionUrl;
```

---

## Styling

### Tailwind v4

Utility-first CSS, no CSS files needed (except globals.css):

```typescript
<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
</div>
```

### Theme Colors

```typescript
// tailwind.config.ts
extend: {
  colors: {
    brand: '#6366F1',
    brandDark: '#4338CA',
    accent: '#10B981',
    beauty: '#EC4899',
    health: '#06B6D4',
    food: '#F97316',
    auto: '#64748B',
  },
}
```

### Global Styles

```css
/* styles/globals.css */
@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-50 text-slate-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700;
  }
}
```

---

## API Client

### lib/api.ts

Fetch wrapper with auth headers:

```typescript
export const api = {
  get: (endpoint) => fetch(endpoint, { headers: authHeaders() }),
  post: (endpoint, data) => fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  }),
  // ...
};
```

Uses NestJS API at `http://localhost:3001/api/v1/*` (dev) or production URL.

---

## Environment Variables

Set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0...
```

Only `NEXT_PUBLIC_*` vars exposed to browser.

---

## Deployment

### Build

```bash
pnpm build              # Creates .next/
```

### Vercel (Recommended)

```bash
# Deploy via Vercel CLI
vercel

# Or push to GitHub → auto-deploys to Vercel
```

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Performance

- **Code splitting:** Automatic per-route
- **Image optimization:** `next/image` component
- **Font optimization:** Preloaded Google Fonts
- **Lazy loading:** `dynamic()` for heavy components
- **Build cache:** `.next/` folder (gitignored)

---

## Testing

Not extensively implemented in MVP, but structure available:

```bash
pnpm test               # Run Jest
pnpm test:watch        # Watch mode
```

---

## Blog & MDX

Blog posts stored in `content/blog/*.mdx`:

```markdown
---
title: "Botiko vs Booksy"
date: "2026-04-18"
summary: "How Botiko differs from Booksy"
---

# Content here

Can use React components directly in MDX.
```

Posts automatically rendered at `/blog/[slug]`.

---

## Related Docs

- **Full Codemap:** `/docs/CODEMAPS/frontend.md`
- **Database:** `/docs/CODEMAPS/database.md`
- **Project Context:** `CLAUDE.md`

---

## Common Tasks

### Add New Dashboard Page

1. Create directory: `app/dashboard/newpage/`
2. Create `page.tsx`
3. Add route to sidebar navigation
4. Use hooks to fetch data

### Add New Form

1. Create component: `components/forms/MyForm.tsx`
2. Define Zod schema
3. Use React Hook Form
4. Call API to submit

### Styling a Component

Use Tailwind classes directly:

```typescript
<button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
  Click me
</button>
```

---

**Last Updated:** 2026-04-18
