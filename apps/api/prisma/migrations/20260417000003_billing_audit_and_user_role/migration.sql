-- Security hardening P2 — billing audit log
-- Migration: 20260417000003_billing_audit_and_user_role
-- Note: UserRole enum + User.role column already applied in migration 20260417000002.

-- ─── BillingEvent audit log (audit A13) ──────────────────────────────────
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
