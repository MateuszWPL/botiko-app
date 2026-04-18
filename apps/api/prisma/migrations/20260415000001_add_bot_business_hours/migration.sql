-- Add business hours fields to Bot
ALTER TABLE "Bot" ADD COLUMN "businessHoursStart" INTEGER;
ALTER TABLE "Bot" ADD COLUMN "businessHoursEnd" INTEGER;
ALTER TABLE "Bot" ADD COLUMN "businessDays" INTEGER[] NOT NULL DEFAULT '{}';
ALTER TABLE "Bot" ADD COLUMN "offlineMessage" TEXT;
