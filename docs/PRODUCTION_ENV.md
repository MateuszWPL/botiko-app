# Produkcyjne zmienne środowiskowe — Botiko.pl

Instrukcja krok-po-kroku: jak założyć projekty, skąd wziąć każdą wartość i gdzie ją wkleić.  
Hosting: **Railway** (API) · **Vercel** (Web + Widget jako statyczne)

---

## 0. Przed startem — zainstaluj CLI

```bash
# Railway CLI
npm install -g @railway/cli
railway login

# Vercel CLI
npm install -g vercel
vercel login
```

---

## 1. Railway — `apps/api`

### Założenie projektu

1. Wejdź na **https://railway.app** → zaloguj się przez GitHub
2. **New Project → Deploy from GitHub repo** → wybierz `botiko-app`
3. Railway zapyta o katalog — wpisz `apps/api`
4. Kliknij **Add Variables** — tu wkleisz env vars z sekcji poniżej
5. Domena: **Settings → Networking → Generate Domain** → dostaniesz `*.railway.app`  
   Potem: **Settings → Networking → Custom Domain** → wpisz `api.botiko.pl`

Lub przez CLI:

```bash
cd apps/api
railway link          # połącz z istniejącym projektem
# lub
railway init          # utwórz nowy projekt
railway up            # deploy
```

---

### Zmienne środowiskowe — Railway

Panel: **railway.app → projekt → Variables → Raw Editor** (wklej blok naraz)

#### NODE i App URLs

```
NODE_ENV=production
APP_URL=https://app.botiko.pl
API_URL=https://api.botiko.pl
WIDGET_URL=https://widget.botiko.pl
PORT=3001
```

> `NODE_ENV=production` jest krytyczne — bez tego CORS i DomainWhitelistGuard działają w trybie dev (rozluźnionym). API odmówi startu jeśli `NODE_ENV=production` i któryś URL wskazuje `localhost`.

---

#### Database — Supabase

Panel: **https://supabase.com/dashboard → projekt → Settings → Database**  
Zakładka: **Connection string → URI**  
Wybierz: **Transaction pooler** (port 6543)

```
DATABASE_URL=postgresql://postgres.XXXX:HASLO@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?sslmode=require
```

> Port musi być `6543` (pooler), nie `5432` (direct). Direct connection nie działa z Railway (serverless środowisko).

---

#### Supabase Auth

Panel: **https://supabase.com/dashboard → projekt → Settings → API**

```
SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
SUPABASE_ANON_KEY=eyJ...                          ← "anon public"
SUPABASE_SERVICE_ROLE_KEY=eyJ...                  ← "service_role secret" (TYLKO Railway/API!)
```

---

#### OpenAI

Panel: **https://platform.openai.com/api-keys** → Create new secret key

```
OPENAI_API_KEY=sk-proj-...
```

> Ustaw billing limit: **https://platform.openai.com/settings/organization/limits** → Hard limit: 50 USD/mies. na start.

---

#### Sekrety bezpieczeństwa — generuj lokalnie, NOWE dla produkcji

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (musi być dokładnie 64 znaki hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
JWT_SECRET=<wklej wynik pierwszego polecenia>
ENCRYPTION_KEY=<wklej wynik drugiego polecenia>
```

> `ENCRYPTION_KEY` jest niezmienny po deploymencie — zmiana = utrata możliwości odszyfrowania PII leadów. Zapisz go w bezpiecznym miejscu (np. 1Password).

---

#### Rate limiting (możesz zostawić defaulty)

```
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

#### Email — Resend

1. Załóż konto: **https://resend.com**
2. **Domains → Add Domain** → wpisz `botiko.pl` → dodaj podane rekordy DNS u rejestratora (TXT + MX)
3. **API Keys → Create API Key** (uprawnienia: `Sending access`)

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=powiadomienia@botiko.pl
```

> Weryfikacja domeny DNS zajmuje do 24h. Bez niej Resend odrzuci wysyłkę.

---

#### Stripe — klucze LIVE (nie test!)

Panel: **https://dashboard.stripe.com/apikeys**  
Przełącz na **Live mode** (toggle w lewym górnym rogu panelu Stripe).

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
```

Żeby dostać `STRIPE_PRICE_ID`:
- **Stripe Dashboard → Products → Add product**
- Nazwa: `Botiko STARTER`, cena: `99 PLN / miesiąc`, rozliczenie: `recurring monthly`
- Po zapisaniu skopiuj **Price ID** (`price_...`) z zakładki produktu

Webhook — **po tym jak API jest już dostępne pod docelowym URL**:
1. **https://dashboard.stripe.com/webhooks → Add endpoint**
2. URL: `https://api.botiko.pl/api/v1/billing/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Kliknij **Add endpoint** → skopiuj **Signing secret** (`whsec_...`)

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

> Wszystkie trzy klucze (`SK`, `PRICE_ID`, `WEBHOOK_SECRET`) muszą być z tego samego trybu (live). `sk_test_` + live webhook = błąd.

---

#### Cron secret

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

```
CRON_SECRET=<wynik polecenia>
```

---

#### Czego NIE ustawiać na Railway

```
# Muszą być NIEOBECNE na produkcji:
NODE_TLS_REJECT_UNAUTHORIZED    ← SSL security
DEV_ALLOW_LOCALHOST             ← SSRF guard (API odmówi startu jeśli ustawione)
```

---

## 2. Vercel — `apps/web`

### Założenie projektu

1. Wejdź na **https://vercel.com** → zaloguj się przez GitHub
2. **Add New → Project → Import Git Repository** → wybierz `botiko-app`
3. **Root Directory** → zmień na `apps/web`
4. Framework Preset: `Next.js` (auto-detect)
5. Rozwiń **Environment Variables** i wklej zmienne z sekcji poniżej przed pierwszym deployem
6. Kliknij **Deploy**
7. Po deploymencie: **Settings → Domains** → dodaj `app.botiko.pl`

Lub przez CLI:

```bash
cd apps/web
vercel          # pierwsze uruchomienie — przeprowadzi przez setup
vercel --prod   # deploy na produkcję
```

---

### Zmienne środowiskowe — Vercel

Panel: **vercel.com → projekt → Settings → Environment Variables**  
Scope: ustaw **Production** (nie Preview/Development).

```
NEXT_PUBLIC_API_URL=https://api.botiko.pl
NEXT_PUBLIC_WIDGET_URL=https://widget.botiko.pl
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Demo widget na landing page (opcjonalne):

```
NEXT_PUBLIC_DEMO_BOT_ID=<UUID bota demo — weź z bazy po pierwszym deploymencie>
```

> Bez tej zmiennej sekcja demo na landing page się nie renderuje. Ustaw po tym jak założysz konto demo w aplikacji.

Cloudinary (opcjonalne, dla uploadu avatarów botów):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

---

## 3. Vercel — `apps/widget`

### Założenie projektu

1. **Vercel → Add New → Project → Import Git Repository** → `botiko-app`
2. **Root Directory** → zmień na `apps/widget`
3. Framework Preset: `Vite`
4. Build Command: `pnpm build`
5. Output Directory: `dist`
6. Brak env vars — widget nie ma runtime config
7. Po deploymencie: **Settings → Domains** → dodaj `widget.botiko.pl`

> Alternatywa: **Cloudflare Pages** (darmowy CDN, lepsza wydajność dla statycznych assetów)  
> **https://pages.cloudflare.com** → Connect to Git → wybierz repo → Root: `apps/widget`, Build: `pnpm build`, Output: `dist`

---

## 4. Supabase — konfiguracja po stronie projektu

### Auth redirect URLs

Panel: **https://supabase.com/dashboard → projekt → Authentication → URL Configuration**

```
Site URL:      https://app.botiko.pl
Redirect URLs: https://app.botiko.pl/**
```

> Bez tego Supabase odmówi przekierowania po logowaniu i resetowaniu hasła.

### Migracje bazy danych

```bash
# Zainstaluj CLI jeśli nie masz
npm install -g supabase

# Zaloguj się
supabase login

# Wypchnij migracje na projekt produkcyjny
supabase db push --project-ref TWOJ_REF
```

`TWOJ_REF` znajdziesz w **Supabase Dashboard → Settings → General → Reference ID**.

---

## 5. DNS — konfiguracja u rejestratora (np. home.pl, OVH, Cloudflare)

| Subdomena | Typ | Wartość |
|---|---|---|
| `app.botiko.pl` | CNAME | `cname.vercel-dns.com` |
| `api.botiko.pl` | CNAME | `[twój-projekt].railway.app` |
| `widget.botiko.pl` | CNAME | `cname.vercel-dns.com` |

> SSL certyfikaty wystawiają się automatycznie (Railway + Vercel przez Let's Encrypt). Propagacja DNS: do 24h, zwykle kilka minut.

---

## 6. Kolejność działań przy pierwszym deploymencie

```
1. [ ] Supabase — skonfiguruj Auth redirect URLs
2. [ ] Supabase — wypchnij migracje (supabase db push)
3. [ ] Resend — zweryfikuj domenę (DNS TXT) — może trwać do 24h, zrób jako pierwsze
4. [ ] Stripe — utwórz produkt STARTER 99 PLN/mies w live mode, skopiuj PRICE_ID
5. [ ] Generuj JWT_SECRET i ENCRYPTION_KEY lokalnie
6. [ ] Railway — utwórz projekt, ustaw wszystkie Variables, zdeployuj
7. [ ] Vercel (web) — utwórz projekt, ustaw Variables, zdeployuj
8. [ ] Vercel/CF (widget) — utwórz projekt, zdeployuj
9. [ ] DNS — dodaj rekordy CNAME dla wszystkich trzech subdomen
10.[ ] Stripe — po tym jak api.botiko.pl działa: dodaj webhook endpoint, wklej STRIPE_WEBHOOK_SECRET do Railway
11.[ ] Vercel (web) — redeploy jeśli dodałeś NEXT_PUBLIC_DEMO_BOT_ID po pierwszym deploymencie
12.[ ] QA — przejdź TASK.md §1A.6 na produkcji
```

---

## 7. Pełna lista zmiennych — Railway (Raw Editor)

Gotowy blok do wklejenia (uzupełnij wartości):

```
NODE_ENV=production
PORT=3001
APP_URL=https://app.botiko.pl
API_URL=https://api.botiko.pl
WIDGET_URL=https://widget.botiko.pl
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
JWT_SECRET=
ENCRYPTION_KEY=
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
RESEND_API_KEY=
RESEND_FROM_EMAIL=powiadomienia@botiko.pl
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
CRON_SECRET=
```

## 8. Pełna lista zmiennych — Vercel (Production)

```
NEXT_PUBLIC_API_URL=https://api.botiko.pl
NEXT_PUBLIC_WIDGET_URL=https://widget.botiko.pl
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEMO_BOT_ID=
```
