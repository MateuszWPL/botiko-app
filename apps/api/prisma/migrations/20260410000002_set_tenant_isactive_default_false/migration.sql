-- Change default value of isActive to true
-- New tenants start with active trial (14 days). Auto-deactivates after trial expires if no subscription.
ALTER TABLE "Tenant" ALTER COLUMN "isActive" SET DEFAULT true;
