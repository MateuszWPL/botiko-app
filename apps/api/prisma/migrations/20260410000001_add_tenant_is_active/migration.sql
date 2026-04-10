-- AlterTable: add isActive to Tenant (default true — existing tenants stay active)
ALTER TABLE "Tenant" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
