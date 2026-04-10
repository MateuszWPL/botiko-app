-- Change default value of isActive to false
-- New tenants must complete Stripe checkout to become active
ALTER TABLE "Tenant" ALTER COLUMN "isActive" SET DEFAULT false;
