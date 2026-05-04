# Produkcyjne zmienne środowiskowe — Botiko.pl

Instrukcja krok-po-kroku: skąd wziąć każdą wartość i gdzie ją wkleić.  
Hosting: **Railway** (API) · **Vercel** (Web + Widget jako statyczne)

---

## 1. Railway — `apps/api`

Panel: **railway.app → projekt → Variables**

### NODE i App URLs

```
NODE_ENV=production
APP_URL=https://app.botiko.pl
API_URL=https://api.botiko.pl
WIDGET_URL=https://widget.botiko.pl
```

> `NODE_ENV=production` jest krytyczne — bez tego CORS i DomainWhitelistGuard działają w trybie dev (rozluźnionym). API odmówi startu jeśli `NODE_ENV=production` i któryś URL wskazuje `localhost`.

---

### Database — Supabase

Panel: **supabase.com → projekt → Settings → Database → Connection string → URI**  
Wybierz: **Transaction pooler** (port 6543) — Railway używa pooled connections.

```
DATABASE_URL=postgresql://postgres.XXXX:HASLO@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?sslmode=require
```

> Upewnij się że w URL jest port `6543` (pooler), nie `5432` (direct). Direct connection nie działa z Railway.

---

### Supabase Auth

Panel: **supabase.com → projekt → Settings → API**

```
SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
SUPABASE_ANON_KEY=eyJ...                          ← "anon public"
SUPABASE_SERVICE_ROLE_KEY=eyJ...                  ← "service_role" (TYLKO API, nigdy Vercel/web!)
```

---

### OpenAI

Panel: **platform.openai.com → API keys → Create new secret key**

```
OPENAI_API_KEY=sk-proj-...
```

> Ustaw billing limit w OpenAI żeby uniknąć niespodzianek. Zalecane: hard limit 50 USD/mies. na start.

---

### Sekrety bezpieczeństwa — generuj lokalnie

Wygeneruj NOWE wartości dla produkcji (nie kopiuj z `.env`):

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (musi być dokładnie 64 znaki hex = 32 bajty)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
JWT_SECRET=<64-znakowy hex>
ENCRYPTION_KEY=<64-znakowy hex>
```

> `ENCRYPTION_KEY` musi być niezmienny po deploymencie — zmiana go oznacza utratę możliwości odszyfrowania danych PII leadów (imię, telefon).

---

### Rate limiting (opcjonalne, możesz zostawić defaulty)

```
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

### Email — Resend

Panel: **resend.com → API Keys → Create API Key** (uprawnienia: `Sending access`)  
Zweryfikuj domenę: **resend.com → Domains → Add domain** → dodaj DNS TXT record u rejestratora.

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=powiadomienia@botiko.pl
```

> Bez zweryfikowanej domeny Resend odrzuci wysyłkę. Weryfikacja DNS zajmuje do 24h.

---

### Stripe — PRODUKCJA (klucze live, nie test!)

Panel: **dashboard.stripe.com → Developers → API keys**  
Przełącz widok na **Live mode** (toggle w lewym górnym rogu).

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...             ← ID produktu STARTER w live mode
```

Webhook (po deploymencie API):

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. URL: `https://api.botiko.pl/api/v1/billing/webhook`
3. Events: zaznacz wszystkie `customer.subscription.*` i `checkout.session.completed`
4. Skopiuj **Signing secret** (`whsec_...`)

```
STRIPE_WEBHOOK_SECRET=whsec_...       ← z kroku 4 powyżej
```

> Klucze `sk_test_` NIE działają z live webhookami i odwrotnie. Upewnij się że wszystkie trzy (`SK`, `PRICE_ID`, `WEBHOOK_SECRET`) są z tego samego trybu (live).

---

### Cron (opcjonalne, ale zalecane)

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

```
CRON_SECRET=<min 16 znaków>
```

---

### Czego NIE ustawiać na Railway

```
# Te zmienne MUSZĄ być nieobecne na produkcji:
NODE_TLS_REJECT_UNAUTHORIZED    ← bezpieczeństwo SSL
DEV_ALLOW_LOCALHOST             ← ochrona SSRF (API odmówi startu jeśli ustawione)
```

---

## 2. Vercel — `apps/web`

Panel: **vercel.com → projekt → Settings → Environment Variables**  
Ustaw scope: **Production** (nie Preview/Development).

```
NEXT_PUBLIC_API_URL=https://api.botiko.pl
NEXT_PUBLIC_WIDGET_URL=https://widget.botiko.pl
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Demo widget na landing page (opcjonalne — jeśli chcesz live demo):

```
NEXT_PUBLIC_DEMO_BOT_ID=<UUID bota demo z bazy>
```

> Bez `NEXT_PUBLIC_DEMO_BOT_ID` sekcja demo na landing page po prostu się nie renderuje — nie rzuca błędów.

Cloudinary (opcjonalne, jeśli używane do uploadu zdjęć):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

---

## 3. Vercel / Cloudflare Pages — `apps/widget`

Widget to statyczny plik `dist/embed.js` — brak runtime env vars.  
`VITE_API_URL` używane jest tylko w dev (`apps/widget/.env.local`).

Opcje hostingu:
- **Vercel** — subpath lub osobny projekt, serwuj `dist/embed.js` jako `widget.botiko.pl/embed.js`
- **Cloudflare Pages** — darmowy CDN z edge caching, polecany dla statycznych assetów

---

## 4. Supabase — konfiguracja po stronie projektu

### Auth redirect URLs

Panel: **supabase.com → Authentication → URL Configuration**

```
Site URL:           https://app.botiko.pl
Redirect URLs:      https://app.botiko.pl/**
                    https://app.botiko.pl/auth/callback
```

> Bez tego Supabase odmówi przekierowania po logowaniu/rejestracji.

### RLS Policies

Migracje Supabase są w `supabase/` — upewnij się że wszystkie zostały zaaplikowane:

```bash
supabase db push --project-ref TWOJ_REF
```

---

## 5. DNS — przykładowa konfiguracja

| Subdomena | Typ | Wartość |
|---|---|---|
| `app.botiko.pl` | CNAME | `cname.vercel-dns.com` |
| `api.botiko.pl` | CNAME | `[twój projekt].railway.app` |
| `widget.botiko.pl` | CNAME | `cname.vercel-dns.com` lub Cloudflare |

---

## 6. Checklist przed pierwszym deployem

```
Railway (API):
[ ] NODE_ENV=production
[ ] DATABASE_URL (pooler port 6543)
[ ] SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY
[ ] OPENAI_API_KEY
[ ] JWT_SECRET (nowy, 64 hex)
[ ] ENCRYPTION_KEY (nowy, 64 hex — zachowaj kopię!)
[ ] APP_URL / API_URL / WIDGET_URL (prod URLs, nie localhost)
[ ] STRIPE_SECRET_KEY (sk_live_...)
[ ] STRIPE_PRICE_ID (price_ z live mode)
[ ] STRIPE_WEBHOOK_SECRET (po setupie webhooka w Stripe Dashboard)
[ ] RESEND_API_KEY + zweryfikowana domena
[ ] CRON_SECRET

Vercel (Web):
[ ] NEXT_PUBLIC_API_URL
[ ] NEXT_PUBLIC_WIDGET_URL
[ ] NEXT_PUBLIC_SUPABASE_URL
[ ] NEXT_PUBLIC_SUPABASE_ANON_KEY

Supabase:
[ ] Site URL i Redirect URLs zaktualizowane
[ ] Migracje zaaplikowane (supabase db push)

Stripe:
[ ] Webhook endpoint dodany (https://api.botiko.pl/api/v1/billing/webhook)
[ ] Webhook secret wklejony do Railway

DNS:
[ ] app.botiko.pl → Vercel
[ ] api.botiko.pl → Railway
[ ] widget.botiko.pl → Vercel/Cloudflare
```
