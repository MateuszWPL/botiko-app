-- ============================================================
-- Botiko.pl — RLS Policies (Row Level Security)
-- Run this SQL in Supabase Dashboard > SQL Editor
-- after the Prisma migration creates the tables.
-- ============================================================

-- Enable pgvector extension (required for KnowledgeChunk.embedding)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KnowledgeChunk" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: get current user's tenant_id from JWT
-- ============================================================
CREATE OR REPLACE FUNCTION get_tenant_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'tenant_id',
    ''
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- Tenant — only own tenant visible
-- ============================================================
CREATE POLICY "tenant_select_own" ON "Tenant"
  FOR SELECT USING (id = get_tenant_id());

CREATE POLICY "tenant_update_own" ON "Tenant"
  FOR UPDATE USING (id = get_tenant_id());

-- ============================================================
-- User — only users of same tenant
-- ============================================================
CREATE POLICY "user_select_own_tenant" ON "User"
  FOR SELECT USING ("tenantId" = get_tenant_id());

CREATE POLICY "user_insert_own_tenant" ON "User"
  FOR INSERT WITH CHECK ("tenantId" = get_tenant_id());

CREATE POLICY "user_update_own_tenant" ON "User"
  FOR UPDATE USING ("tenantId" = get_tenant_id());

-- ============================================================
-- Bot — only bots of own tenant
-- ============================================================
CREATE POLICY "bot_select_own_tenant" ON "Bot"
  FOR SELECT USING ("tenantId" = get_tenant_id());

CREATE POLICY "bot_insert_own_tenant" ON "Bot"
  FOR INSERT WITH CHECK ("tenantId" = get_tenant_id());

CREATE POLICY "bot_update_own_tenant" ON "Bot"
  FOR UPDATE USING ("tenantId" = get_tenant_id());

CREATE POLICY "bot_delete_own_tenant" ON "Bot"
  FOR DELETE USING ("tenantId" = get_tenant_id());

-- Public read for widget (needs bot config by bot_id)
CREATE POLICY "bot_public_read_active" ON "Bot"
  FOR SELECT USING ("isActive" = true);

-- ============================================================
-- KnowledgeChunk — scoped via bot → tenant
-- ============================================================
CREATE POLICY "knowledge_select_own_tenant" ON "KnowledgeChunk"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Bot"
      WHERE "Bot".id = "KnowledgeChunk"."botId"
        AND "Bot"."tenantId" = get_tenant_id()
    )
  );

CREATE POLICY "knowledge_insert_own_tenant" ON "KnowledgeChunk"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Bot"
      WHERE "Bot".id = "KnowledgeChunk"."botId"
        AND "Bot"."tenantId" = get_tenant_id()
    )
  );

CREATE POLICY "knowledge_delete_own_tenant" ON "KnowledgeChunk"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "Bot"
      WHERE "Bot".id = "KnowledgeChunk"."botId"
        AND "Bot"."tenantId" = get_tenant_id()
    )
  );

-- ============================================================
-- Lead — scoped to tenant
-- ============================================================
CREATE POLICY "lead_select_own_tenant" ON "Lead"
  FOR SELECT USING ("tenantId" = get_tenant_id());

CREATE POLICY "lead_insert_any" ON "Lead"
  FOR INSERT WITH CHECK (true);  -- widget inserts leads (no auth)

CREATE POLICY "lead_update_own_tenant" ON "Lead"
  FOR UPDATE USING ("tenantId" = get_tenant_id());

-- ============================================================
-- Conversation — scoped via bot → tenant
-- ============================================================
CREATE POLICY "conversation_select_own_tenant" ON "Conversation"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Bot"
      WHERE "Bot".id = "Conversation"."botId"
        AND "Bot"."tenantId" = get_tenant_id()
    )
  );

CREATE POLICY "conversation_insert_any" ON "Conversation"
  FOR INSERT WITH CHECK (true);  -- widget starts conversations

-- ============================================================
-- Message — scoped via conversation → bot → tenant
-- ============================================================
CREATE POLICY "message_select_own_tenant" ON "Message"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Conversation"
      JOIN "Bot" ON "Bot".id = "Conversation"."botId"
      WHERE "Conversation".id = "Message"."conversationId"
        AND "Bot"."tenantId" = get_tenant_id()
    )
  );

CREATE POLICY "message_insert_any" ON "Message"
  FOR INSERT WITH CHECK (true);  -- API inserts messages during chat

-- ============================================================
-- Service role bypass (used by API server — service_role key)
-- ============================================================
-- The service_role key bypasses RLS by default in Supabase.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in frontend/widget.
