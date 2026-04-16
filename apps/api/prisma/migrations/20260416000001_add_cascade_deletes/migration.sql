-- Add ON DELETE CASCADE to all foreign keys so that deleting a Tenant
-- automatically removes all associated Bots, Conversations, Messages,
-- KnowledgeChunks, Leads and Users — no orphaned rows.

-- User → Tenant
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;

-- Bot → Tenant
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_tenantId_fkey";
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;

-- KnowledgeChunk → Bot
ALTER TABLE "KnowledgeChunk" DROP CONSTRAINT "KnowledgeChunk_botId_fkey";
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_botId_fkey"
  FOREIGN KEY ("botId") REFERENCES "Bot"(id) ON DELETE CASCADE;

-- Lead → Tenant
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_tenantId_fkey";
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE;

-- Conversation → Bot
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_botId_fkey";
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_botId_fkey"
  FOREIGN KEY ("botId") REFERENCES "Bot"(id) ON DELETE CASCADE;

-- Message → Conversation
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE;
