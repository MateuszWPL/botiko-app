-- ============================================================
-- DEV ONLY — Full database reset
-- Czyści zarówno tabele public (Prisma) jak i Supabase auth.users
--
-- Użycie: Supabase Dashboard → SQL Editor → wklej i uruchom
-- Potem: pnpm prisma migrate reset (w apps/api)
-- ============================================================

-- 1. Wyczyść tabele public (kolejność ważna — foreign keys)
DELETE FROM "Message";
DELETE FROM "Conversation";
DELETE FROM "Lead";
DELETE FROM "KnowledgeChunk";
DELETE FROM "Bot";
DELETE FROM "User";
DELETE FROM "Tenant";

-- 2. Wyczyść Supabase Auth (niezależny schemat, Prisma tego nie dotyka)
DELETE FROM auth.users;
