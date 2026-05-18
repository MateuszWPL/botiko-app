# Pilot Infra Setup — Checklist krok po kroku

> **Cel:** zamknąć 3 krytyczne luki przed startem cold outreach (cron, monitoring, weryfikacja RLS).
>
> Kod w branchu `chore/pilot-readiness-infra` (PR: utwórz na GitHubie). Ten dokument opisuje WYŁĄCZNIE akcje w panelach zewnętrznych usług.

---

## 1. Sentry (error tracking) — ~10 min

### 1.1. Konto + projekty

1. Otwórz https://sentry.io/signup/ — zarejestruj się **na region EU** (Frankfurt) emailem `mateworo@gmail.com`. Plan **Developer (Free)** — 5k events/mies, 1 user, wystarczy na pilot.
2. Po rejestracji "Create Organization" — nazwa: `botiko` (slug `botiko`).
3. **Pierwszy projekt — API:**
   - Platform → **Node.js → NestJS**
   - Project name: `api-botiko`
   - Team: default
   - Klik "Create Project" → **skopiuj DSN** ze strony "Configure SDK" (format: `https://xxx@oXXXX.ingest.de.sentry.io/YYYY`)
4. **Drugi projekt — Web:**
   - Lewy sidebar → **Projects → Create Project**
   - Platform → **Next.js**
   - Project name: `web-botiko`
   - Klik "Create Project" → **skopiuj DSN**

### 1.2. Wpisz DSN do env

**Railway → API service → Variables:**
```
SENTRY_DSN=<DSN z api-botiko>
```

**Vercel → web project → Settings → Environment Variables:**
| Key | Value | Environment |
|---|---|---|
| `SENTRY_DSN` | `<DSN z web-botiko>` | Production |
| `NEXT_PUBLIC_SENTRY_DSN` | `<ten sam DSN>` | Production |

Redeploy oba (Railway: automatycznie po zmianie env, Vercel: "Redeploy" w panelu).

### 1.3. Test capture (5 min po redeployu)

**API:**
```powershell
curl -X POST https://api.botiko.pl/api/v1/billing/cron/trial-notifications -H "Authorization: Bearer wrong"
```
Powinno zwrócić 401. Sentry **nie** powinien zareagować (to expected HttpException).

Wymuś prawdziwy error: tymczasowo wywołaj nieistniejący endpoint:
```powershell
curl https://api.botiko.pl/api/v1/__test_sentry
```
Zwróci 404 — Sentry nie zareaguje (to też HttpException). **Realny test:** poczekaj na pierwszy unhandled error w produkcji, lub dodaj endpoint testowy z `throw new Error('sentry test')` (tymczasowo).

**Web:** otwórz https://botiko.pl, w DevTools Console:
```js
throw new Error('sentry test from browser')
```
Po ~30s w Sentry → Issues powinieneś widzieć wpis.

### 1.4. (Opcjonalnie) Source-maps upload przy build

W Sentry → Settings → Auth Tokens → "Create New Token" → scope `project:releases` + `project:write`. Skopiuj `sntrys_...`.

**Vercel env vars (Production):**
```
SENTRY_ORG=botiko
SENTRY_PROJECT=web-botiko
SENTRY_AUTH_TOKEN=sntrys_xxx
```

Bez tego stack traces w Sentry pokazują zminifikowany kod — z tym pokazują oryginalne pliki TSX.

---

## 2. Cron `trial-notifications` na Railway — ~5 min

> Endpoint: `POST https://api.botiko.pl/api/v1/billing/cron/trial-notifications`
> Auth: header `Authorization: Bearer $CRON_SECRET`
> Częstotliwość: codziennie 09:00 UTC (10:00/11:00 PL)

### 2.1. Wygeneruj CRON_SECRET (jeśli jeszcze nie ma)

W PowerShellu:
```powershell
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```
Skopiuj output.

### 2.2. Wpisz do Railway → API service → Variables

```
CRON_SECRET=<wygenerowany hex>
```
(Pomiń jeśli już jest — sprawdź `railway variables` w CLI lub w panelu.)

### 2.3. Utwórz osobny Railway service "cron"

1. Railway dashboard → projekt `botiko` → **New → Empty Service** → nazwa `cron-trial-notifications`.
2. Service Settings → **Source: brak** (puste, bez repo).
3. Settings → **Cron Schedule** → wpisz: `0 9 * * *` (codziennie 09:00 UTC).
4. Settings → **Start Command** — wklej (zmień `<CRON_SECRET>` na realną wartość):
   ```sh
   curl -X POST https://api.botiko.pl/api/v1/billing/cron/trial-notifications -H "Authorization: Bearer $CRON_SECRET" -f
   ```
5. **Variables** dla tego service → dodaj `CRON_SECRET=<ten sam co w API>`.
6. **Image** w Settings — jeśli Railway wymaga obrazu, wybierz `curlimages/curl:latest` (Docker Hub).

### 2.4. Test ręczny (od razu)

W Railway service `cron-trial-notifications` → "Run Now" (lub odpal lokalnie):
```powershell
curl -X POST https://api.botiko.pl/api/v1/billing/cron/trial-notifications -H "Authorization: Bearer <CRON_SECRET>"
```
Spodziewany response:
```json
{ "processed": N, "emails": M }
```
Gdzie `N` = liczba sprawdzonych tenantów, `M` = liczba wysłanych przypomnień.

### 2.5. Weryfikacja po 24h

Następnego dnia ~09:30 UTC sprawdź w Railway → cron service → **Deployments → Logs** czy curl odpalił się i zwrócił 200.

---

## 3. UptimeRobot — ~5 min

### 3.1. Konto

1. https://uptimerobot.com → Sign Up Free. Email: `mateworo@gmail.com`.
2. Po loginu → **My Settings** → confirm `mateworo@gmail.com` jako alert contact (powinien być domyślnie).

### 3.2. Monitor 1 — API health

1. Dashboard → **+ Add New Monitor**.
2. Settings:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** `Botiko API /health`
   - **URL:** `https://api.botiko.pl/health`
   - **Monitoring Interval:** 5 minutes
   - **Monitor Timeout:** 30 seconds
3. Alert Contacts → wybierz `mateworo@gmail.com`.
4. Create Monitor.

### 3.3. Monitor 2 — Web

Powtórz dla:
- **Friendly Name:** `Botiko Web`
- **URL:** `https://botiko.pl`
- reszta jak wyżej.

### 3.4. Test

W Railway → API service → "Pause" na 2 minuty. UptimeRobot powinien wysłać email "Down" w ciągu ~5 min. Włącz z powrotem — przyjdzie "Up".

(Można pominąć ten test jeśli nie chcesz przerywać prod. Zamiast tego: pierwszy realny downtime się ujawni naturalnie.)

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

## 5. Webhook Stripe — weryfikacja na prod — ~5 min

### 5.1. Sprawdź konfigurację

Stripe Dashboard → **Developers → Webhooks**:
- Endpoint URL: `https://api.botiko.pl/api/v1/billing/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Status: **Enabled**

Klik w endpoint → "Signing secret" → **Reveal** → porównaj z `STRIPE_WEBHOOK_SECRET` w Railway. Jeśli różne — zaktualizuj w Railway.

### 5.2. Test wysyłki

W Stripe Dashboard → kliknij w webhook → **Send test webhook** → wybierz `checkout.session.completed` → Send.

W Railway → API service → **Deployments → Logs** sprawdź czy nie ma błędu `400` lub `Signature verification failed`. Powinno przyjść `200 OK`.

(Jeśli korzystasz z `stripe trigger` w CLI: `stripe trigger checkout.session.completed --api-key sk_test_...` — wystrzeli prawdziwy event z test mode.)

---

## Checklist końcowy (oznacz po zrobieniu)

- [ ] Sentry konto + 2 projekty utworzone, DSN-y wpisane do Railway/Vercel
- [ ] Sentry test event widoczny w Issues
- [ ] `CRON_SECRET` w Railway env
- [ ] Cron service `cron-trial-notifications` utworzony, harmonogram `0 9 * * *`
- [ ] Test ręczny crona zwraca `{"processed": N, "emails": M}`
- [ ] UptimeRobot — 2 monitory aktywne (API + Web), alert na `mateworo@gmail.com`
- [ ] RLS na prod: wszystkie tabele mają `rowsecurity = true`
- [ ] RLS test izolacji tenant A vs B przeszedł
- [ ] Stripe webhook: signing secret zgodny, test event zwraca 200

---

## Po wszystkim

Zmerguj branch `chore/pilot-readiness-infra` → `main`. Vercel autoredeploy. Railway autoredeploy.

Daj znać Claude'owi → przechodzimy do **A.2 (pending unit testy)** + **A.3-A.6 (polish widget/dashboard/onboarding/blog)**.
