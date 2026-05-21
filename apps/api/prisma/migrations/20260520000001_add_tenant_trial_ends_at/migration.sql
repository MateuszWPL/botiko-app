-- Adds an explicit trial end timestamp to Tenant.
-- Previously the trial end was computed everywhere as createdAt + 14 days,
-- which made it impossible to grant longer trials / free pilot periods
-- without polluting createdAt. trialEndsAt is now the single source of truth.
--
-- Backfill: every existing tenant keeps its current effective trial end
-- (createdAt + 14 days). IF NOT EXISTS keeps this safe to re-run.

ALTER TABLE "Tenant"
  ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);

UPDATE "Tenant"
SET "trialEndsAt" = "createdAt" + INTERVAL '14 days'
WHERE "trialEndsAt" IS NULL;
