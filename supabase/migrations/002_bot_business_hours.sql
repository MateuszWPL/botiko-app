-- Add business hours and offline message to Bot table
ALTER TABLE "Bot"
  ADD COLUMN IF NOT EXISTS "offlineMessage"     TEXT,
  ADD COLUMN IF NOT EXISTS "businessHoursStart" INTEGER,
  ADD COLUMN IF NOT EXISTS "businessHoursEnd"   INTEGER,
  ADD COLUMN IF NOT EXISTS "businessDays"       INTEGER[] NOT NULL DEFAULT '{}';
