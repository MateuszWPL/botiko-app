-- Manual override colors for the widget appearance on Bot.
-- Migration created manually to match schema.prisma changes.
-- Both nullable — existing bots keep working. When null, the widget falls back
-- to auto-contrast: textColor derived from primaryColor (YIQ luminance) and a
-- contrast-aware avatar/logo backdrop.

ALTER TABLE "Bot" ADD COLUMN "textColor" TEXT;
ALTER TABLE "Bot" ADD COLUMN "logoBgColor" TEXT;
