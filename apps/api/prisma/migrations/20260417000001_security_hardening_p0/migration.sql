-- Security hardening P0 — Stripe webhook idempotency + trial cron idempotency
-- Migration created manually to match schema.prisma changes
-- (ProcessedStripeEvent + Tenant.lastTrialEmailSentAt).

-- ─── 1. Idempotency store for Stripe webhooks (audit A1) ─────────────────
CREATE TABLE "ProcessedStripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedStripeEvent_pkey" PRIMARY KEY ("id")
);

-- Auto-cleanup hint: older rows can be pruned manually via
--   DELETE FROM "ProcessedStripeEvent" WHERE "createdAt" < NOW() - INTERVAL '90 days';
-- We keep 90 days by convention — Stripe retries webhooks for up to 3 days.

CREATE INDEX "ProcessedStripeEvent_createdAt_idx"
    ON "ProcessedStripeEvent"("createdAt");

-- ─── 2. Trial notification cron idempotency (audit A7) ────────────────────
-- Tracks the last day on which a trial reminder email was sent to this
-- tenant. Cron checks this before sending to ensure at most one email
-- per tenant per calendar day, even if the cron fires multiple times.
ALTER TABLE "Tenant"
    ADD COLUMN "lastTrialEmailSentAt" TIMESTAMP(3);
