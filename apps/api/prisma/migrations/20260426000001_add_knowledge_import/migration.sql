-- AddColumn: source tracking for KnowledgeChunk
ALTER TABLE "KnowledgeChunk" ADD COLUMN "source" TEXT DEFAULT 'manual';

-- Backfill existing chunks as 'manual'
UPDATE "KnowledgeChunk" SET "source" = 'manual' WHERE "source" IS NULL;

-- Index for efficient re-import queries (DELETE WHERE source LIKE 'web:%')
CREATE INDEX IF NOT EXISTS "KnowledgeChunk_botId_source_idx" ON "KnowledgeChunk"("botId", "source");

-- Enum for import job status
CREATE TYPE "ImportJobStatus" AS ENUM (
  'PENDING',
  'SCRAPING',
  'EXTRACTING',
  'READY_FOR_REVIEW',
  'CONFIRMING',
  'CONFIRMED',
  'FAILED',
  'CANCELLED'
);

-- KnowledgeImportJob table
CREATE TABLE "KnowledgeImportJob" (
    "id"               TEXT NOT NULL,
    "tenantId"         TEXT NOT NULL,
    "botId"            TEXT NOT NULL,
    "status"           "ImportJobStatus" NOT NULL DEFAULT 'PENDING',
    "sourceUrl"        TEXT NOT NULL,
    "scrapedPages"     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "failedPages"      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "extractedPayload" JSONB,
    "chunksCreated"    INTEGER NOT NULL DEFAULT 0,
    "errorCode"        TEXT,
    "errorMessage"     TEXT,
    "tokenUsage"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"      TIMESTAMP(3),

    CONSTRAINT "KnowledgeImportJob_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "KnowledgeImportJob_tenantId_createdAt_idx" ON "KnowledgeImportJob"("tenantId", "createdAt");
CREATE INDEX "KnowledgeImportJob_botId_status_idx" ON "KnowledgeImportJob"("botId", "status");

-- Foreign key: cascade on bot delete
ALTER TABLE "KnowledgeImportJob"
    ADD CONSTRAINT "KnowledgeImportJob_botId_fkey"
    FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
