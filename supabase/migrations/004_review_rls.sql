-- ============================================================
-- Botiko.pl — RLS dla tabeli Review
-- Review była dodana po initial migration 001 i nie miała RLS.
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- Owner widzi tylko własne recenzje (Review.tenantId = JWT tenant_id)
CREATE POLICY "review_select_own_tenant"
  ON "Review" FOR SELECT
  USING ("tenantId" = get_tenant_id());

CREATE POLICY "review_insert_own_tenant"
  ON "Review" FOR INSERT
  WITH CHECK ("tenantId" = get_tenant_id());

CREATE POLICY "review_update_own_tenant"
  ON "Review" FOR UPDATE
  USING ("tenantId" = get_tenant_id());
