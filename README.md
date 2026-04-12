# Botiko.pl

Polska SaaS platforma AI chatbot B2B dla mikro i małych firm usługowych.

## Struktura

```
apps/web/     — Next.js 14 + Tailwind v4 (Frontend + Dashboard)
apps/api/     — NestJS + Prisma (Backend REST API)
apps/widget/  — Preact + Vite (Embed script <12KB)
```

## Local development

Wymagania: Node.js 20+, `pnpm`

Zmienne środowiskowe bazują na `.env.example` w root.

### API
```bash
cd apps/api
pnpm install
cp ../../.env.example .env
# Uzupełnij DATABASE_URL, SUPABASE_*, OPENAI_API_KEY, JWT_SECRET, ENCRYPTION_KEY
pnpm start:dev
```

### Web
```bash
cd apps/web
pnpm install
cp ../../.env.example .env.local
# Uzupełnij NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev
```

### Widget
```bash
cd apps/widget
pnpm install
pnpm dev
pnpm build   # Sprawdza limit <12KB gzip
```

## Supabase

RLS policies uruchamiasz przez SQL Editor: `supabase/migrations/001_rls_policies.sql`

Uwaga: host `db.<ref>.supabase.co` może być IPv6-only — do narzędzi lokalnych używaj poolera (`*.pooler.supabase.com`).

## Context dla AI

Szczegółowy kontekst projektu (architektura, konwencje, roadmapa) w `CLAUDE.md` i `Task.md`.
