-- Security hardening P2 — billing audit log + user role
-- Migration: 20260417000003_billing_audit_and_user_role
-- (combines UserRole enum + BillingEvent table in one migration)

-- ─── 1. UserRole enum (audit A10) ────────────────────────────────────────
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MEMBER');

-- Existing users become OWNER — they are the account founders with full access.
-- Future team-member invites will default to MEMBER.
ALTER TABLE "User"
    ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'OWNER';

-- ─── 2. BillingEvent audit log (audit A13) ───────────────────────────────
-- Immutable, append-only table. Never updated, never deleted (retain indefinitely
-- for dispute resolution and GDPR access requests).
CREATE TABLE "BillingEvent" (
    "id"        TEXT NOT NULL,
    "tenantId"  TEXT NOT NULL,
    "event"     TEXT NOT NULL,
    "meta"      TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BillingEvent_tenantId_createdAt_idx"
    ON "BillingEvent"("tenantId", "createdAt");
