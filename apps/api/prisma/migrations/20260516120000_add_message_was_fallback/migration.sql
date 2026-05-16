-- Hotfix: Message.wasFallback was added to schema.prisma in the knowledge-health
-- indicator feature (commit dd208bc) but no Prisma migration was generated.
-- The accompanying supabase/migrations/004_message_was_fallback.sql was also
-- never applied to production, so every query touching Message via Prisma's
-- include {} (relation loading) failed with "column does not exist".
--
-- IF NOT EXISTS makes this safe to run regardless of whether the Supabase SQL
-- was applied manually on some environment.

ALTER TABLE "Message"
  ADD COLUMN IF NOT EXISTS "wasFallback" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Message_conversationId_role_idx"
  ON "Message" ("conversationId", "role");
