-- Security hardening P2 — UserRole enum + owner guard
-- Migration: 20260417000002_user_role

-- 1. Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MEMBER');

-- 2. Add role column to User — existing users get OWNER so they keep access
--    to billing. When team-member invite is built, new users default to MEMBER.
ALTER TABLE "User"
    ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'OWNER';

-- NOTE: All existing users become OWNER.
-- When future team-invite feature ships, set default to MEMBER in a new migration.
