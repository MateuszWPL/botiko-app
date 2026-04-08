# Botiko.pl

Polska SaaS platforma AI chatbot B2B dla mikro i małych firm usługowych.

## Struktura

```
apps/web/     — Next.js 14 + Tailwind v4 (Frontend + Dashboard)
apps/api/     — Nest.js + Prisma (Backend REST API)
apps/widget/  — Preact + Vite (Embed script <12KB)
```

## Local development

Wymagania:
- Node.js 20+
- `pnpm`

Zmiennne środowiskowe:
- Bazujemy na `.env.example` w root.
- **Web** używa `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY` w `apps/web/.env.local`.
- **API** używa `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` w `apps/api/.env`.

### API
```bash
cd apps/api
pnpm install
cp ../../.env.example .env
# Uzupełnij DATABASE_URL (Supabase pooler, sslmode=require)
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
pnpm build
```

## Supabase

- RLS policies uruchamiasz przez SQL Editor: `[supabase/migrations/001_rls_policies.sql](supabase/migrations/001_rls_policies.sql)`
- Uwaga: host `db.<ref>.supabase.co` może być IPv6-only — wtedy do narzędzi lokalnych używaj poolera (`*.pooler.supabase.com`).

## Docs

Dokumentacja projektu (MasterPlan itp.) w folderze `docs/` — gitignored.

## Context dla AI

Pliki `.botiko-context` i `.cursorrules` zawierają pełny kontekst dla agentów AI.
