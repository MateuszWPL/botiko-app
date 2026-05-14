-- Track which ASSISTANT messages came from the RAG fallback path (no relevant
-- knowledge found). Powers the "knowledge base health" indicator on the dashboard.
ALTER TABLE "Message"
  ADD COLUMN IF NOT EXISTS "wasFallback" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Message_conversationId_role_idx"
  ON "Message" ("conversationId", "role");
