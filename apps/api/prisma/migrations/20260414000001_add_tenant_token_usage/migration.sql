-- Add tokenUsage to Tenant (tracks total OpenAI tokens used per tenant)
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "tokenUsage" INTEGER NOT NULL DEFAULT 0;
