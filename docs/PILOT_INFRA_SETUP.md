# Pilot Infra Setup — pozostało do zrobienia

> Wszystkie punkty poza RLS zostały zweryfikowane i działają na produkcji.

---

## 4. Weryfikacja RLS migracji na prod Supabase — ~10 min

### 4.1. Sprawdź czy migracje są zaaplikowane

Supabase dashboard → projekt `botiko` (prod) → **SQL Editor** → New Query:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('Tenant', 'User', 'Bot', 'Lead', 'Conversation', 'Message', 'KnowledgeChunk');
```
Wszystkie powinny mieć `rowsecurity = true`.

Sprawdź policies:
```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
Powinny być policies typu `tenant_isolation` dla każdej tabeli.

### 4.2. Jeśli brak — uruchom migracje

Wklej kolejno zawartość plików z `supabase/migrations/` do SQL Editor i wykonaj:
1. `001_rls_policies.sql`
2. `002_bot_business_hours.sql`
3. `003_remove_public_insert_policies.sql`

### 4.3. Test izolacji tenantów

W SQL Editor:
```sql
-- Wybierz dwa różne tenant_id z bazy
SELECT id, name FROM "Tenant" LIMIT 2;
```

Zanotuj dwa ID. Następnie:
```sql
-- Symuluj request jako tenant A
SET LOCAL request.jwt.claim.sub = '<tenant_A_user_id>';
SELECT id FROM "Lead";  -- powinno zwrócić tylko leady tenanta A

SET LOCAL request.jwt.claim.sub = '<tenant_B_user_id>';
SELECT id FROM "Lead";  -- powinno zwrócić tylko leady tenanta B
```

Jeśli oba zapytania zwracają **te same wiersze** — RLS nie działa, podnieś alarm.

---

## Checklist końcowy

- [x] Sentry konto + 2 projekty utworzone, DSN-y wpisane do Railway/Vercel
- [x] Sentry test event widoczny w Issues
- [x] `CRON_SECRET` w Railway env
- [x] Cron service `cron-trial-notifications` utworzony, harmonogram `0 9 * * *`
- [x] Test ręczny crona zwraca `{"processed": 1, "emails": 0}`
- [x] UptimeRobot — 2 monitory aktywne (API + Web), alert na `mateworo@gmail.com`
- [ ] **RLS na prod: wszystkie tabele mają `rowsecurity = true`**
- [ ] **RLS test izolacji tenant A vs B przeszedł**
- [x] Stripe webhook: signing secret zgodny, test event zwraca 200

---

## Po wszystkim

Zmerguj branch `chore/pilot-readiness-infra` → `main`. Vercel autoredeploy. Railway autoredeploy.
