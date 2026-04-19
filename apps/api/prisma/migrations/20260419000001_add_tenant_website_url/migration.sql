-- Add websiteUrl column to Tenant (nullable for existing rows).
-- Registration now collects the tenant's site URL instead of a free-form
-- company name so the same URL can prefill Bot.allowedDomains in setup.
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
