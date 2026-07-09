# Supabase migrations

**Źródło prawdy dla schematu = Prisma** (`apps/api/prisma/migrations/`).
Railway uruchamia `prisma migrate deploy` przy starcie API i to one tworzą tabele, kolumny, indeksy.

Ten katalog trzyma **wyłącznie** rzeczy, których Prisma nie umie wygenerować:

- **RLS policies** (`ENABLE ROW LEVEL SECURITY`, `CREATE POLICY ...`), multi-tenant izolacja
- Rozszerzenia Postgres (`CREATE EXTENSION ...`) jeśli nie zarządzane przez Supabase UI
- GRANT-y dla ról Supabase (`anon`, `authenticated`, `service_role`)

## Czego TU NIE robić

- ❌ `CREATE TABLE`, `ALTER TABLE ADD COLUMN`, `CREATE INDEX` → to idzie do Prismy (`pnpm prisma migrate dev --name <opis>`)
- ❌ Duplikowanie zmian Prismy "na wszelki wypadek": to powoduje drift (zob. incydent z `Message.wasFallback`, PR #50 → hotfix PR #52)

## Jak aplikować

Pliki w tym katalogu **nie są aplikowane automatycznie**. Wklejasz je ręcznie w Supabase Studio → SQL Editor po pierwszej konfiguracji projektu lub gdy dodajesz nowe policy.

## Pliki

- `001_rls_policies.sql`: bazowe RLS dla wszystkich tabel multi-tenant
- `003_remove_public_insert_policies.sql`: utwardzenie: tylko service_role może INSERT bezpośrednio
