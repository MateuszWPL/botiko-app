-- One-click pairing for the official WordPress plugin.
-- Migration created manually to match schema.prisma changes (BotPairingToken).
-- Short-lived, single-use tokens; only the SHA-256 hash is stored.

CREATE TABLE "BotPairingToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotPairingToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BotPairingToken_tokenHash_key"
    ON "BotPairingToken"("tokenHash");

CREATE INDEX "BotPairingToken_botId_idx"
    ON "BotPairingToken"("botId");

ALTER TABLE "BotPairingToken"
    ADD CONSTRAINT "BotPairingToken_botId_fkey"
    FOREIGN KEY ("botId") REFERENCES "Bot"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Auto-cleanup hint: expired/used rows can be pruned via
--   DELETE FROM "BotPairingToken" WHERE "expiresAt" < NOW() - INTERVAL '1 day';
