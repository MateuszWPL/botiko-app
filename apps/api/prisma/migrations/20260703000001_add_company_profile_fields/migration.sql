-- Structured "Informacje o firmie" (company profile) fields on Bot.
-- Migration created manually to match schema.prisma changes.
-- All nullable — existing bots keep working. The chat pipeline injects the
-- present fields into the system prompt (=== DANE FIRMY ===) and the widget
-- renders Google Maps / reservation links as rich cards.

ALTER TABLE "Bot" ADD COLUMN "companyEmail" TEXT;
ALTER TABLE "Bot" ADD COLUMN "nip" TEXT;
ALTER TABLE "Bot" ADD COLUMN "owner" TEXT;
ALTER TABLE "Bot" ADD COLUMN "websiteUrl" TEXT;
ALTER TABLE "Bot" ADD COLUMN "googleMapsUrl" TEXT;
ALTER TABLE "Bot" ADD COLUMN "reservationUrl" TEXT;
