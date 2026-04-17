-- ============================================================
-- Botiko.pl — Security hardening: remove public INSERT policies
-- Migration 003 — 2026-04-17
--
-- Problem (HIGH severity, audit finding B4):
-- Policies `lead_insert_any`, `conversation_insert_any` and
-- `message_insert_any` allowed ANY caller holding the public
-- SUPABASE_ANON_KEY to insert rows directly into our tables,
-- bypassing:
--   * PII encryption at the application layer (leads stored as plaintext)
--   * DomainWhitelistGuard (the bot could be targeted from any origin)
--   * Rate limits on /leads, /chat
--   * Message sanitization pipeline
--
-- All widget inserts go through the NestJS API using
-- SUPABASE_SERVICE_ROLE_KEY (which bypasses RLS by design), so
-- removing these public policies does NOT break any legitimate
-- traffic. Direct Supabase JS access from the widget is not used.
-- ============================================================

DROP POLICY IF EXISTS "lead_insert_any" ON "Lead";
DROP POLICY IF EXISTS "conversation_insert_any" ON "Conversation";
DROP POLICY IF EXISTS "message_insert_any" ON "Message";

-- Explicit tenant-scoped INSERT for Lead (covers any future authenticated
-- dashboard write — e.g. manual lead add). Anon key cannot satisfy this
-- check because it has no tenant_id in its JWT.
CREATE POLICY "lead_insert_own_tenant" ON "Lead"
  FOR INSERT WITH CHECK ("tenantId" = get_tenant_id());

-- Conversations / Messages: no public INSERT path — only service_role
-- (API) inserts these during chat. Service_role bypasses RLS so no policy
-- is needed. Authenticated users never write to these tables directly.

-- ============================================================
-- NOTE: service_role bypass is unchanged. All legitimate inserts
-- from the NestJS API (/api/v1/leads, /api/v1/chat) still work,
-- because the API uses SUPABASE_SERVICE_ROLE_KEY / PrismaClient.
-- ============================================================
