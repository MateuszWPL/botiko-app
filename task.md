# Botiko.pl — Roadmapa Projektu

> Aktualizuj po każdym ukończonym tasku. `[ ]` = do zrobienia, `[/]` = w trakcie, `[x]` = gotowe.

---

## Faza 0 — Setup Środowiska (Tydzień 1-2)

### 0.1 Infrastruktura i konta
- [x] Kupić domenę Botiko.pl
- [x] Założyć repo na GitHub
- [x] Założyć konto Supabase (EU region!)
- [ ] (później) Hosting/deploy (na razie pomijamy)
- [x] Założyć konto OpenAI API (ustawić billing alerts)
- [x] Założyć konto Stripe (test mode)
- [x] Założyć konto Resend.com
- [ ] Założyć konto SMSAPI.pl
- [ ] DNS: skonfigurować subdomeny (app., api., widget.)

### 0.2 Tooling (brak monorepo)
- [x] ESLint configurations
- [x] TypeScript base tsconfigs
- [x] `.gitignore` (node_modules, .env*, .next, dist)
- [x] `.env.example` ze wszystkimi zmiennymi
- [x] Tailwind v4 config dla apps/web

### 0.3 Setup i architektura
- [x] `packages/` -> przeniesione do konkretnych apek
- [x] Szablony branżowe usytuowane w `apps/api/src/brand-templates/`

### 0.4 Context files
- [x] `CLAUDE.md` — pełny kontekst dla Claude Code CLI (tech + biznes)
- [x] `.cursorrules` — skrócony kontekst dla Cursor (produkt, zasady, brand)
- [x] `Task.md` — roadmapa projektu (ten plik)
- [x] Usunąć `.botiko-context` (był duplikatem `.cursorrules`) ✓ usunięty
- [x] Usunąć pliki .docx/.pdf z repozytorium (przeniesione do docs/)

### 0.5 Apps — szkielety
- [x] `apps/web/` — Next.js 14 App Router skeleton
  - [x] Tailwind + TypeScript config
  - [x] Route groups: refaktoryzacja `(dashboard)` → `dashboard/` i `(onboarding)` → `onboarding/`
  - [x] Layout z metadata SEO
  - [x] Middleware auth (redirect unauthenticated)
- [x] `apps/api/` — Nest.js skeleton
  - [x] Moduły: auth, bot, chat, lead, knowledge, tenant, billing
  - [x] Prisma schema
  - [x] Pierwsza migracja Prisma (Supabase pooler + pgvector)
  - [x] `config/env.ts` — Zod-validated env
  - [x] Global exception filter
  - [x] Guards: AuthGuard, TenantGuard
  - [x] ZodValidationPipe
  - [x] Custom decorators: @CurrentTenant, @CurrentUser
  - [x] Helmet + CORS config
  - [x] Rate limiting (@nestjs/throttler)
- [x] `apps/widget/` — Preact skeleton
  - [x] Vite config (IIFE build, target <12KB gzip)
  - [x] Launcher component (chat bubble)
  - [x] ChatWindow component shell
  - [x] embed.ts entry point

### 0.6 CI/CD
- [x] CI/CD — `.github/workflows/ci.yml` (API lint+test, Web lint+typecheck, Widget build+size)

### 0.7 Security baseline
- [x] Supabase RLS policies (SQL w `supabase/migrations/001_rls_policies.sql` — uruchomić po założeniu projektu Supabase)
- [x] JWT verification middleware (Nest.js) — AuthGuard
- [ ] Env variables — lokalnie `.env*`, na prod w hosting env (Railway/Vercel/VPS) i GitHub Secrets dla CI. Supabase NIE przechowuje env aplikacji.
- [x] `.env.local` w `.gitignore`

---

## Faza 1A — Gotowe do Pilotu

> Cel: działający produkt na produkcji, który można pokazać pierwszym 3-5 klientom.
> Jeden plan: **149 zł/mies, 14 dni trial**. Zero feature gating na razie — wszyscy mają to samo.
> Każdy punkt: implementacja → test → zabezpieczenie.

---

### Już zrobione (zbudowane, wymaga weryfikacji)

- [x] `POST /api/v1/auth/register` — rejestracja (Supabase Auth)
- [x] `POST /api/v1/auth/login` / logout / refresh
- [x] `GET /api/v1/bot/:id/config` — publiczny (widget pobiera config)
- [x] `POST /api/v1/bot` / `PATCH /api/v1/bot/:id`
- [x] `POST /api/v1/chat` — AI chat (widget → API → OpenAI)
- [x] `POST /api/v1/leads` / `GET` / `PATCH status`
- [x] `GET /api/v1/conversations` / `/:id`
- [x] RAG Pipeline: embed → pgvector search → GPT-4o mini → response
- [x] System prompt per branża (brand-templates)
- [x] Widget: launcher, ChatWindow, message bubbles, typing indicator, LeadForm, RODO
- [x] Onboarding wizard: 5 kroków + auto-save localStorage + generowanie KnowledgeChunks
- [x] Dashboard: 8 stron (overview, leads, conversations, knowledge base, settings, embed, billing)
- [x] Landing page v4
- [x] Security baseline: open redirect fix, error leak fix, domain whitelist, SQL injection guard, hasło min 12 znaków

---

### 1A.1 — Jakość Bota (krytyczne przed pilotami) ✅

> Zaimplementowane 2026-04-10

#### Implementacja ✅
- [x] **Fallback answer** — `ChatService`: gdy context pusty (wszystkie chunki < 0.3) → early return z predef. odpowiedzią + `showLeadForm: true`, OpenAI nie wywoływane
- [x] **Eskalacja do człowieka** — `ChatService`: przed RAG sprawdź `isEscalationRequest()` (człowiek/human/konsultant/oddzwoń/połącz) → early return + `showLeadForm: true`
- [x] **Lead form timing** — widget: `userMessageCount` state, przycisk 📞 pojawia się dopiero gdy `>= 2`, `showLeadForm` z API automatycznie otwiera formularz
- [x] **Conversation continuity** — widget: `sessionStorage` przechowuje messages, sessionId, userMessageCount, leadSubmitted per `botiko_{botId}`

#### Testowanie (manualne — do zrobienia przed pilotami)
- [x] Ręczny test fallback: zadaj pytanie poza bazą wiedzy → sprawdź odpowiedź bez hallucynacji
- [x] Ręczny test fallback: nowy bot z pustą bazą wiedzy
- [x] Ręczny test eskalacji: napisz "chcę porozmawiać z człowiekiem" → formularz kontaktowy
- [x] Ręczny test lead timing: 1 wiadomość → brak przycisku 📞; 2. wiadomość → pojawia się
- [x] Ręczny test continuity: 3 wiadomości → odśwież → historia zachowana

#### Testy automatyczne ✅
- [x] `chat.service.spec.ts`: 13 testów — fallback (3), eskalacja (8), normal flow (3)

---

### 1A.2 — Email Notyfikacje (Resend) ✅

> Zaimplementowane 2026-04-10

#### Implementacja ✅
- [x] `resend` zainstalowany w `apps/api`
- [x] `NotificationService` (`src/common/services/notification.service.ts`) — `sendNewLeadEmail()` z HTML template
- [x] HTML template: imię, telefon (jako tekst, nie `tel:` link — XSS safe), botName, data, link do dashboardu
- [x] `LeadService.create()`: fire-and-forget `.catch()` — awaria Resend nie propaguje
- [x] Bot query rozszerzony o `bot.name` + `tenant.users[0].email` (adres właściciela z DB)
- [x] env.ts: `RESEND_API_KEY` (optional), `RESEND_FROM_EMAIL` (default: powiadomienia@botiko.pl)
- [x] Brak `RESEND_API_KEY` → notyfikacje wyłączone, warn w logach, brak crasha

#### Testowanie (manualne — po założeniu konta Resend)
- [ ] Ręcznie: wypełnij formularz w widgecie → sprawdź email w skrzynce właściciela
- [ ] Sprawdź że email nie ląduje w spamie (SPF/DKIM dla botiko.pl przez Resend dashboard)

#### Testy automatyczne ✅
- [x] `lead.service.spec.ts`: 6 testów — zapis leada, szyfrowanie PII, email call, brak emaila bez usera, błąd Resend nie propaguje, NotFoundException

---

### 1A.3 — Stripe (jeden plan, działający billing) ✅

> Zaimplementowane 2026-04-10

#### Implementacja ✅
- [x] Zainstalować: `stripe` w `apps/api`
- [x] Stworzyć w Stripe Dashboard: produkt "Botiko MVP" — cena 149 zł/mies PLN, recurring, 14-day trial (`STRIPE_PRICE_ID`)
- [x] `POST /api/v1/billing/checkout` (chroniony AuthGuard) → Stripe Checkout Session (mode: `subscription`, `trial_period_days: 14`, `client_reference_id: tenantId`) → zwraca URL
- [x] Stripe Webhook handler `POST /api/v1/billing/webhook` (publiczny, bez AuthGuard):
  - `checkout.session.completed` → `tenant.stripeCustomerId`, `tenant.stripeSubscriptionId`, `tenant.isActive = true`
  - `customer.subscription.updated` → `tenant.isActive` na podstawie statusu
  - `customer.subscription.deleted` → `tenant.isActive = false`
  - `invoice.payment_failed` → `tenant.isActive = false`
- [x] `isActive`, `stripeCustomerId`, `stripeSubscriptionId` w modelu `Tenant` + migracja Prisma zaaplikowana
- [x] `ChatService`: sprawdza `tenant.isActive` → 403 "Twój plan wygasł"
- [x] `POST /api/v1/billing/portal` → Stripe Customer Portal session
- [x] `GET /api/v1/billing/status` → status subskrypcji dla dashboardu

#### Konfiguracja ✅
- [x] Stripe CLI zainstalowany (winget)
- [x] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` w `.env`
- [x] Raw body (`rawBody: true` w `main.ts`) dla weryfikacji podpisu webhooka
- [x] Webhook signature verification: `stripe.webhooks.constructEvent()` → 400 przy błędzie

#### Testowanie (manualne — do zrobienia)
- [x] Stripe CLI: `stripe listen --api-key sk_test_... --forward-to localhost:3001/api/v1/billing/webhook`
- [x] Test checkout: kliknij "Kup plan" → Stripe test card `4242 4242 4242 4242` → webhook → sprawdź `tenant.isActive = true` w DB
- [x] Test anulowania: usuń subskrypcję w Stripe Dashboard → webhook `subscription.deleted` → bot zwraca 403
- [x] Test payment_failed: karta `4000 0000 0000 0341` → sprawdź dezaktywację

---

### 1A.4 — Dashboard UI/UX Redesign

> Aktualny panel jest niefunkcjonalny wizualnie: emoji zamiast ikon, brak animacji, brak empty states, brak spójności. Cel: profesjonalny SaaS dashboard gotowy do pokazania płacącym klientom.

#### Stack do zainstalowania
- [x] `lucide-react` — ikony SVG (zamiana wszystkich emoji)
- [x] `sonner` — toast notifications (sukces/błąd/info) + `<Toaster />` w layout.tsx
- [ ] `class-variance-authority` + `clsx` — warianty komponentów (opcjonalnie jeśli okaże się potrzebny)

#### Fundament — Design System
- [x] **Paleta kolorów** — indigo-600 brand, slate-900 sidebar, białe karty z subtelnymi borderami
- [x] **Typografia** — jasna hierarchia: `text-2xl font-bold` nagłówki, `text-sm text-slate-500` opisy
- [x] **Glassmorphism** — karty stat na overview: `bg-white/80 backdrop-blur-sm border border-white/20` na gradientowym tle
- [x] **Gradienty** — sidebar: gradient `from-slate-900 to-slate-800`, przyciski akcji: `from-indigo-600 to-indigo-500`, stat cards: per-kolor gradient overlay
- [x] **Animacje CSS** — `transition-all duration-200` na wszystkich przyciskach/linkach, `hover:-translate-y-0.5` na primary buttonach
- [x] **Skeleton loaders** — loading.tsx dla overview, leads, conversations (animate-pulse)

#### Sidebar (components/dashboard/Sidebar.tsx)
- [x] Zamień wszystkie emoji na **Lucide icons**: `LayoutDashboard`, `Users`, `MessageSquare`, `BookOpen`, `Settings`, `Code2`, `CreditCard`, `LogOut`
- [x] Aktywny item: `bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500` (subtelny, nie full-fill)
- [x] Logo: gradient tekst `bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`
- [x] Badge "● Online" przy logo (zielona kropka animowana — `animate-pulse`)
- [x] Mobile bottom nav: ikony z labelami, active state (`text-indigo-400 bg-indigo-500/10`)
- [x] Sidebar desktop: `h-screen sticky top-0` — badge/wyloguj zawsze widoczne na dole
- [x] Tooltips na hover przy zwiniętym sidebarze (CSS group-hover, bez biblioteki)
- [x] Zwijanie/rozwijanie sidebar (PanelLeftClose/Open, stan w localStorage)

#### Overview (dashboard/overview/page.tsx)
- [x] Tło strony: delikatny gradient `from-slate-50 to-indigo-50/30`
- [x] Stat karty: glassmorphism — `bg-white/80 backdrop-blur-sm` z kolorową ikoną w gradient boksie
- [x] Każda karta: ikona Lucide (nie emoji), liczba, label
- [x] Sekcja "Szybkie akcje" pod statystykami: przyciski (Dodaj wiedzę, Testuj bota, Zainstaluj)
- [x] Empty state gdy brak bota: ładna karta z CTA "Utwórz bota"
- [x] Skeleton: loading.tsx z kartami animate-pulse + placeholdery wykresów
- [x] Mini trend-arrow (`TrendingUp`/`TrendingDown`/`Minus`) — dziś vs wczoraj
- [x] **Wykresy**: `recharts` — bar chart (aktywność 7 dni) + donut chart (leady wg statusu)

#### Sidebar Plan Badge
- [x] Przy dole sidebar: badge z aktualnym planem (ikona `Zap` + nazwa planu)
- [x] STARTER: neutralny styl
- [ ] PRO (przyszłość): `bg-gradient-to-r from-blue-600 to-cyan-500`
- [ ] PREMIUM (przyszłość): `bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900` z ikoną `Crown`

#### Leads (dashboard/leads/)
- [x] Empty state z `<EmptyState />` component: ikona `Users` + tytuł + opis + przycisk "Zainstaluj bota"
- [x] Tabela: hover row `hover:bg-indigo-50/50 transition-colors`
- [x] Status badge: kolorowe chipelki (NEW/CONTACTED/CONVERTED/LOST) z tłem i labelami po polsku
- [x] Status badge: ikony Lucide per status — `Clock` (NEW), `Phone` (CONTACTED), `CheckCircle2` (CONVERTED), `XCircle` (LOST)
- [x] Dropdown statusu: custom styled z StatusBadge + ChevronDown, zamknięcie po kliknięciu poza
- [x] Animacja: wiersze tabeli wchodzą z `animate-fade-in` (staggered delay)
- [x] Licznik leadów w nagłówku przez `<PageHeader />`

#### Conversations (dashboard/conversations/)
- [x] Empty state z `<EmptyState />` + `<MessageSquare />` Lucide
- [x] Strzałka → `<ChevronRight />` Lucide z animacją `group-hover:translate-x-0.5`
- [x] Hover: `hover:bg-slate-50 hover:shadow-sm transition-all`
- [x] Każda pozycja na liście: avatar inicjałów z deterministycznym gradientem per sessionId
- [x] Conversation detail: `<Bot />` avatar dla wiadomości bota, `<User />` dla użytkownika
- [x] Breadcrumb: ikona `<ArrowLeft />` zamiast "←"

#### Knowledge Base (dashboard/knowledge/)
- [x] Przycisk "+ Dodaj": spinner `<Loader2 className="animate-spin" />` podczas dodawania
- [x] Delete button: `<Trash2 />` ikona z animacją podczas usuwania
- [x] Empty state: ikona `<BookOpen />` + opis
- [x] Toast (sonner): "Wpis dodany do bazy wiedzy" po sukcesie, "Nie udało się dodać wpisu" po błędzie
- [x] Każdy chunk: confirm() dialog przed usunięciem
- [x] Kategoria badge: 8-kolorowa paleta, kolor ustalony hash-deterministycznie z nazwy kategorii

#### Settings (dashboard/settings/)
- [x] Ikona `<Power />` przy sekcji Aktywność
- [x] Przycisk zapisz: `<Loader2 />` spinner + disabled state podczas zapisywania
- [x] Toast success/error przez sonner
- [x] Section headers z ikonami: `<Bot />` Asystentka, `<Palette />` Wygląd, `<Globe />` Domeny, `<Power />` Aktywność
- [x] Color picker: live preview bąbelka czatu w wybranym kolorze
- [x] Toggle zamiast checkbox dla "Aktywna": custom styled Switch (CSS, już był)

#### Billing (dashboard/billing/)
- [x] Status badge z ikoną: `<CheckCircle2 />` Aktywna, `<AlertCircle />` Wygasła/błąd
- [x] Cechy planu: lista z `<CheckCircle2 />` ikonami
- [x] Przycisk "Kup plan": gradient + `<Zap />` ikona
- [x] Plan card: gradient tło `from-indigo-600 to-purple-600` gdy aktywna subskrypcja
- [x] Trial: licznik dni + pasek postępu (indigo→amber→red), API zwraca `trialEndsAt = createdAt + 14d`
- [x] "Płatności przez Stripe": Stripe SVG logo inline

#### Embed (dashboard/embed/)
- [x] Copy button: `<Copy />` ikona, po kliknięciu → `<Check />` + toast "Kod skopiowany do schowka"
- [x] WordPress/Wix/Squarespace: kolorowe logo-badge (WP/Wix/SS) z tłem per platforma
- [x] Step-by-step wizard: numerowane kroki (1→2→3), krok 1 zamienia się w CheckCircle po skopiowaniu

#### Shared Components
- [x] `components/ui/Spinner.tsx` — `<Loader2 className="animate-spin" />` wrapper
- [x] `components/ui/EmptyState.tsx` — ikona + tytuł + opis + opcjonalny CTA
- [x] `components/ui/PageHeader.tsx` — tytuł + opis + opcjonalny badge/akcja
- [x] `components/ui/StatusBadge.tsx` — lead status z ikoną i kolorem, wydzielony z LeadsTable

#### Testowanie wizualne
- [ ] Sprawdź na 1280px (laptop) — najczęstszy rozmiar u klientów
- [ ] Sprawdź na 375px (iPhone SE) — mobile
- [ ] Dark mode: nie robimy (za wcześnie) — upewnij się że nie ma `dark:` klas które psują wygląd
- [ ] Sprawdź animacje: `prefers-reduced-motion` respektowany (dodaj `motion-safe:` prefix)

---

### 1A.5 — Landing Page — Domknięcie

> LP jest już zbudowana (v4), potrzeba kilku rzeczy żeby była gotowa na prawdziwych użytkowników.

#### Implementacja
- [ ] Sekcja cennik: zaktualizuj do jednego planu "149 zł/mies, 14 dni gratis" — bez Starter/Pro/Premium (za wcześnie na tiers), prosty komunikat
- [ ] Przycisk CTA "Zacznij za darmo" → redirect do `/rejestracja` (onboarding flow)
- [ ] Demo bot na LP: osadź widżet Botiko z prawdziwym botem demonstracyjnym (branża BEAUTY, pre-skonfigurowany) — klucz testowy, nie produkcyjny
- [ ] SEO: `<title>`, `<meta description>`, Open Graph (og:title, og:description, og:image) — dla Twittera i Facebooka
- [ ] `sitemap.xml` — podstawowy, tylko główna strona + `/rejestracja`
- [ ] Polityka prywatności: prosta strona `/prywatnosc` (wystarczy tekst o RODO, zbieraniu danych kontaktowych, Supabase jako host)
- [ ] Link do polityki prywatności w widgecie przy checkboxie RODO i w footerze LP

#### Testowanie
- [ ] Sprawdź LP na mobile (Chrome DevTools → iPhone SE)
- [ ] Sprawdź że przycisk CTA otwiera onboarding rejestrację
- [ ] Sprawdź demo bot — zadaj 3-4 pytania, zrób lead, sprawdź czy email dociera
- [ ] Sprawdź OG preview: wklej URL LP w [opengraph.xyz](https://www.opengraph.xyz/)

---

### 1A.6 — Manualna QA Checklist (przed deploy)

> Kod vibecoded = nie ufamy że działa bez ręcznego przetestowania każdej ścieżki.

#### Auth flow
- [ ] Rejestracja: nowy email + hasło → redirect do onboardingu
- [ ] Rejestracja: słabe hasło (<12 znaków) → błąd walidacji widoczny
- [ ] Rejestracja: istniejący email → czytelny komunikat błędu
- [ ] Login: poprawne dane → dashboard
- [ ] Login: złe hasło → komunikat błędu (bez szczegółów technicznych)
- [ ] Wylogowanie → redirect do login
- [ ] Dostęp do `/dashboard` bez sesji → redirect do `/login`

#### Onboarding flow
- [ ] Przejście przez wszystkie 5 kroków bez błędu
- [ ] Auto-save: wypełnij step 2, odśwież → dane zachowane
- [ ] Step 3 (oferta): wpisz tekst, przejdź do step 4, wróć → tekst zachowany
- [ ] Step 5: kod embed wyświetlony, przycisk "Kopiuj" działa
- [ ] Po ukończeniu onboardingu: bot widoczny w dashboardzie
- [ ] Po ukończeniu onboardingu: KnowledgeChunks istnieją w DB (sprawdź w Supabase Table Editor)

#### Widget flow
- [ ] Widget ładuje się na stronie testowej (`localhost` lub testowa domena)
- [ ] Otwieranie/zamykanie widgetu działa płynnie
- [ ] Wyślij wiadomość → odpowiedź pojawia się po chwili z typing indicator
- [ ] Zadaj pytanie z bazy wiedzy → bot odpowiada trafnie
- [ ] Zadaj pytanie poza bazą → bot zwraca fallback z telefonem (nie hallucynuje)
- [ ] Po 2 wiadomościach: formularz lead pojawia się
- [ ] Wypełnij formularz (imię + telefon) + zaznacz RODO → lead zapisany
- [ ] Email do właściciela dotarł po submicie leada
- [ ] Odśwież stronę po 3 wiadomościach → historia zachowana

#### Dashboard flow
- [ ] Overview: liczby się zgadzają z DB
- [ ] Leads: wszystkie leady widoczne, zmiana statusu działa
- [ ] Conversations: lista rozmów, kliknięcie → pełna historia
- [ ] Knowledge base: dodaj wpis → bot go używa (test w widgecie po dodaniu)
- [ ] Knowledge base: usuń wpis → bot go nie używa
- [ ] Settings: zmień kolor widgetu → kolor zmieniony w widgecie
- [ ] Settings: dodaj domenę do whitelist → widget działa tylko na tej domenie
- [ ] Embed: skopiuj kod → widget działa po wklejeniu na testowej stronie

#### Billing flow
- [ ] Strona billing: wyświetla "Trial" lub status planu
- [ ] Kliknięcie "Kup plan" → Stripe Checkout (test mode)
- [ ] Po udanej płatności: status zmieniony w dashboardzie
- [ ] Stripe Portal: faktury dostępne

---

### 1A.7 — Testy Automatyczne (minimum przed deploy)

> Nie musimy testować wszystkiego — testujemy to co nie ma szans działać jeśli się posypie.

#### Unit testy API (`apps/api`)
- [ ] `ChatService`: test fallback gdy brak chunków
- [ ] `ChatService`: test że `checkPlanLimit()` blokuje gdy `isActive = false`
- [ ] `LeadService`: test że `create()` wywołuje `NotificationService.sendNewLeadEmail()`
- [ ] `NotificationService`: test że błąd Resend nie rzuca wyjątku (graceful error)
- [ ] `BillingWebhookHandler`: test `subscription.deleted` → `isActive = false`
- [ ] `BillingWebhookHandler`: test że błędna sygnatura webhooka → 400

#### Integration testy API
- [ ] `POST /api/v1/chat` bez tokenu → 401
- [ ] `POST /api/v1/chat` z nieaktywnym tenantem (`isActive = false`) → 403
- [ ] `POST /api/v1/leads` bez `Origin` headera na produkcji → 403
- [ ] `POST /api/v1/billing/webhook` z błędną sygnaturą → 400

#### CI check
- [ ] Widget bundle size check działa w CI (już jest w `.github/workflows/ci.yml`)
- [ ] API lint + test przechodzi w CI
- [ ] Web lint + typecheck przechodzi w CI

---

### 1A.8 — Security Final Check (przed deploy na prod)

#### Supabase / baza danych
- [ ] Uruchomić `supabase/migrations/001_rls_policies.sql` na produkcyjnej bazie Supabase
- [ ] Weryfikacja RLS: zaloguj się jako tenant A, sprawdź że nie widzisz danych tenanta B (przez Supabase Table Editor lub test API)
- [ ] pgvector extension włączone na prod Supabase

#### API hardening
- [ ] Throttler rate limits przetestowane: `curl` 21 razy pod rząd na `/api/v1/chat` → 21. powinno zwrócić 429
- [ ] Helmet headers: sprawdź w DevTools → Network → Response Headers że są `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`
- [ ] CORS: sprawdź że API akceptuje tylko requesty z `app.botiko.pl` i `widget.botiko.pl` (nie `*`)
- [ ] Env vars nie są w logach: przejrzyj `console.log` w kodzie — żadnego logowania sekretów

#### Widget / RODO
- [ ] Checkbox RODO widoczny przed submitem formularza — nie można wysłać leada bez zgody
- [ ] Link do polityki prywatności działa
- [ ] PII encryption: sprawdź w DB że `lead.name` i `lead.phone` są zaszyfrowane (format `iv:authTag:ciphertext`)

#### Stripe
- [ ] Webhook secret (`STRIPE_WEBHOOK_SECRET`) w env — nie w kodzie
- [ ] Signature verification działa (test z Stripe CLI)

---

### 1A.8 — Deploy Produkcyjny

> Rekomendacja: Railway dla API (NestJS + Prisma, auto SSL, zmienne env w panelu), Vercel dla Web + Widget.

#### Konta i DNS (ręcznie)
- [ ] Założyć konto Railway → deploy `apps/api` → ustawić env vars
- [ ] Założyć konto Vercel → deploy `apps/web` → ustawić env vars (`NEXT_PUBLIC_*`)
- [ ] Deploy `apps/widget` → Vercel lub Cloudflare Pages
- [ ] DNS: `api.botiko.pl` → Railway, `app.botiko.pl` → Vercel, `widget.botiko.pl` → Vercel/CF
- [ ] SSL certyfikaty: automatyczne (Railway + Vercel)
- [ ] Monitoring uptime: UptimeRobot (darmowy) → monitor `api.botiko.pl/health` co 5 min, alert na email

#### Weryfikacja post-deploy
- [ ] Pełny flow na produkcji: rejestracja → onboarding → widget na testowej stronie → lead → email
- [ ] Stripe webhook URL zaktualizowany do `https://api.botiko.pl/api/v1/billing/webhook`
- [ ] Resend `From` adres zweryfikowany dla domeny `botiko.pl`
- [ ] Test Stripe checkout na produkcji (mode test, karta testowa)

---

## Faza 1B — Wzrost po Pilotach

> Wdrożyć dopiero gdy masz minimum 5 płacących klientów i feedback co faktycznie potrzebują.
> Nie implementować wcześniej — to jest potencjalne marnotrawstwo bez walidacji.

### 1B.1 — Pro Plan (249 zł/mies)

Wdrożyć gdy: klienci pytają o PDF upload, więcej botów lub URL crawl.

- [ ] Drugi produkt w Stripe: "Botiko Pro" 249 zł/mies
- [ ] Upgrade flow w billing page (zmiana subskrypcji przez Stripe Portal)
- [ ] **PDF upload** — `apps/api/src/modules/knowledge/pdf.service.ts`: `pdf-parse` lub `pdfjs-dist` → chunki tekstu → embed → KnowledgeChunks. Limit: 5 plików, 5MB każdy. Storage: Supabase Storage.
- [ ] **URL crawl** — Cheerio/Playwright + cron co 30 dni: pobierz stronę www klienta, wyciągnij tekst, stwórz chunki. Konfigurowany URL w Settings.
- [ ] Plan enforcement: sprawdź `tenant.plan` w API dla upload/crawl endpoints
- [ ] "Powered by Botiko" badge — opcjonalne wyłączenie dla Pro
- [ ] SMS notyfikacje o leadach (SMSAPI.pl) — dodaj do NotificationService

### 1B.2 — Analityka w Dashboardzie

Wdrożyć gdy: klienci pytają "jakie pytania zadają moi klienci?"

- [ ] **Top pytania** — endpoint `GET /api/v1/analytics/top-questions`: grupuj messages po podobieństwie (embedding clustering lub proste keyword count), zwróć top 10
- [ ] **Pytania bez odpowiedzi** — flaga w Message gdy ChatService użył fallback: `message.usedFallback = true`, dashboard filtruje te wiadomości i pokazuje listę
- [ ] **Godziny szczytu** — agregacja `conversations.createdAt` per godzina, heatmap w dashboard
- [ ] Dashboard overview: zaktualizuj stats żeby pokazywały trendy (vs poprzedni miesiąc)

### 1B.3 — Premium Plan (449 zł/mies)

Wdrożyć gdy: klient pyta o Google Docs/Notion sync lub API.

- [ ] Trzeci produkt w Stripe: "Botiko Premium" 449 zł/mies
- [ ] **Google Docs sync** — Google Drive API OAuth: klient autoryzuje dostęp, webhook na zmiany dokumentu → re-embed chunków
- [ ] **Notion sync** — Notion API OAuth + webhook na zmiany strony
- [ ] **API access** — generowanie kluczy API (`apiKey` w Tenant), dokumentacja na `botiko.pl/api`
- [ ] **Raport miesięczny PDF** — cron 1x/mies → React PDF template → Resend attachment
- [ ] White-label: pole `tenant.hideBotikoLabel` → widget ukrywa badge gdy true

### 1B.4 — Quick Reply Buttons

- [ ] Pole w bot config: `quickReplies: string[]` (max 4 opcje, konfigurowane w Settings)
- [ ] Widget: po pierwszej wiadomości bota renderuj przyciski jako clickable chips
- [ ] Kliknięcie chipa → wyślij tekst jako user message

### 1B.5 — Email Daily Digest

- [ ] Cron job: codziennie o 8:00 → dla każdego aktywnego tenanta wyślij podsumowanie (X rozmów, Y leadów)
- [ ] Wersja Pro/Premium tylko

---

---

## Faza 2 — Walidacja i Pierwsi Klienci (Miesiąc 2-4)

> Zaczyna się po deploy produkcyjnym (1A.8) i pierwszych pilotach.

### 2.1 Piloty
- [ ] Cold outreach: 50 salonów Białystok (email + LinkedIn)
- [ ] 3 darmowe piloty 30-dniowe — instalacja osobista + pomoc z onboardingiem
- [ ] Feedback form (Tally.so) po 14 dniach użytkowania
- [ ] Case studies z pilotów (zapis rozmów, liczby leadów, opinie)

### 2.2 Iteracje po feedbacku
- [ ] Poprawki UX na podstawie feedbacku pilotów (bug fixes, ux pain points)
- [ ] Max 2 tygodnie iteracji — potem stop i sprzedaż
- [ ] Zadecyduj które funkcje z Fazy 1B wdrożyć na podstawie feedbacku

### 2.3 SEO i LP branżowe
- [ ] `botiko.pl/salony` — LP dla salonów urody
- [ ] `botiko.pl/gabinety` — LP dla gabinetów kosmetycznych
- [ ] Google Search Console: zaindeksuj botiko.pl, dodaj sitemap
- [ ] Schema markup: LocalBusiness, FAQPage

### 2.4 Monitoring produkcyjny
- [ ] Sentry: error tracking dla API i Web (darmowy plan wystarcza)
- [ ] Railway metrics: CPU/memory alerts
- [ ] UptimeRobot: już skonfigurowany w 1A.8

### 2.5 Drugi moduł branżowy
- [ ] `brand-templates/health.ts` LUB `brand-templates/food.ts` — na podstawie feedbacku z pilotów
- [ ] LP branżowy dla nowego modułu
- [ ] Testowanie szablonu z klientem

### 2.6 Retencja
- [ ] Email-based onboarding drip (Resend): 3 emaile po rejestracji (dzień 1, 3, 7) — wskazówki jak najlepiej skonfigurować bota
- [ ] Dashboard overview: czytelna metryka wartości ("Twój bot oszczędza Ci ~X godzin/mies")

### 2.7 Dodatkowe
- [ ] Referral program: 100 zł zniżki za polecenie, link w dashboardzie
- [ ] PayU integracja (backup polska bramka — gdy Stripe ma problemy z polskimi kartami)

---

## Faza 3 — Skalowanie (Miesiąc 4-7)

### 3.1 SEO
- [ ] Blog: 2 artykuły/tydzień
- [ ] GEO LP: `botiko.pl/salony/bialystok`, `/warszawa`, `/krakow`
- [ ] Comparison pages: `botiko.pl/vs-tidio`, `/vs-chatbase`
- [ ] Content pillars: poradniki branżowe, case studies, definicje

### 3.2 Ads
- [ ] Facebook Ads: target kobiety 28-55, beauty/biznes
- [ ] Google Ads: "chatbot salon urody", "asystent AI fryzjer"
- [ ] Landing pages dedykowane pod ads (UTM tracking)

### 3.3 Partner program
- [ ] `botiko.pl/partnerzy` — agencje webdesign
- [ ] Stripe Connect: 20% prowizji, 12 miesięcy
- [ ] Partner dashboard: lista klientów, prowizje
- [ ] Partner API: embed bot za klienta

### 3.4 Nowe branże
- [ ] 3-4 aktywne moduły branżowe
- [ ] Każdy z LP, szablonem, FAQ

### 3.5 Optymalizacja
- [ ] A/B testy LP (nagłówek, CTA, cennik)
- [ ] Onboarding conversion tracking
- [ ] Churn analysis + retention improvements
- [ ] AI cost optimization (benchmark Mistral vs OpenAI)

---

## Faza 4 — Ekspansja (Miesiąc 7-12+)

### 4.1 Kanały
- [ ] Messenger bot integracja
- [ ] WhatsApp Business integracja
- [ ] Instagram DM integracja

### 4.2 Produkt
- [ ] White-label API dla agencji (B2B2B)
- [ ] Wielojęzyczność: ukraiński, angielski
- [ ] PWA + push notifications
- [ ] Advanced analytics dashboard

### 4.3 Rynki
- [ ] Ekspansja: Czechy, Słowacja
- [ ] LP w języku czeskim/słowackim

### 4.4 Biznes
- [ ] Rejestracja działalności gospodarczej
- [ ] Konsultacja prawna RODO + regulamin
- [ ] NIP na fakturach Stripe

---

## Metryki Sukcesu

| Metryka | Cel M3 | Cel M6 | Cel M12 |
|---------|--------|--------|---------|
| Płacący klienci | 5 | 15-20 | 50+ |
| MRR | ~1 245 zł | ~4 980 zł | ~13 450 zł |
| Widget bundle | <12KB | <12KB | <12KB |
| Onboarding time | <15 min | <10 min | <8 min |
| Churn monthly | <15% | <10% | <7% |
| Bot fallback rate | <20% | <15% | <10% |
| Lead capture rate | >8% rozmów | >12% | >15% |

> Przelicznik MRR: mix 60% Starter (149 zł) + 30% Pro (249 zł) + 10% Premium (449 zł) = ~207 zł ARPU

---

> 📅 **Ostatnia aktualizacja:** 2026-04-10
>
> 📊 **Postęp:** Faza 0 ukończona. Fundamenty Fazy 1A zbudowane (API, RAG, widget, onboarding, dashboard, LP v4). Do zrobienia przed pilotem: 1A.1 jakość bota (fallback, eskalacja), 1A.2 email notyfikacje (Resend), 1A.3 Stripe (jeden plan), 1A.4 LP domknięcie, 1A.5-7 QA + testy + security, 1A.8 deploy.
>
> 🎯 **Aktualny focus:** Faza 1A — gotowość pilotowa. Jeden plan 149 zł/mies. Faza 1B (PDF, Pro/Premium, analityka) — dopiero po 5 płacących klientach.

---

## Do zrobienia ręcznie (konta zewnętrzne)

Poniższe wymagają założenia kont i są poza kodem:

1. **Supabase** — założyć projekt EU region, włączyć `pgvector` (SQL) i skonfigurować RLS (`supabase/migrations/001_rls_policies.sql`)
2. **Supabase connection** — używać poolera (direct host jest IPv6-only w tej konfiguracji)
3. **Hosting/deploy** — na razie pomijamy (wrócimy później)
5. **OpenAI** — założyć konto, ustawić billing alert, skopiować API key do envów
6. **Stripe** — założyć konto (test mode), skopiować klucze do envów
7. **Resend.com** — założyć konto, zweryfikować domenę botiko.pl
8. **SMSAPI.pl** — założyć konto, skopiować token
9. **DNS** — skonfigurować subdomeny: `app.botiko.pl`, `api.botiko.pl`, `widget.botiko.pl`
10. **GitHub** — (opcjonalnie) ustawić branch protection na `main` (Settings > Branches)
11. **Env w hosting** — na razie pomijamy

---

## Pomysły

> Surowe pomysły — nie wchodzą do roadmapy bez weryfikacji z klientami. Źródło: analiza Chatbase, SiteGPT, Tidio, Botpress, Crisp, Voiceflow, Dante AI (kwiecień 2026).

### Baza wiedzy — źródła danych

- **URL crawl strony www** — bot automatycznie pobiera treść ze strony klienta (np. usługi, cennik, godziny z ich własnej strony) i buduje z tego baze wiedzy. Eliminuje ręczne wpisywanie. Największy pain point: dane outdatowane po 30 dniach — potrzebny periodic refresh.
- **Google Docs sync** — klient prowadzi cennik w Google Docs → bot synchronizuje co 24h. Eliminuje PDF upload i ręczną aktualizację.
- **Notion sync** — jak wyżej, ale Notion. Popularny u bardziej tech-savvy właścicieli.
- **Webhook własne dane** — dla Premium: klient podaje endpoint, bot odpytuje go per rozmowa (real-time dane np. z własnego CRM).
- **YouTube transkrypt** — trenerzy, edukacja: bot odpowiada na pytania bazując na treści filmów YouTube.
- **Google Reviews** — bot może cytować opinie klientów przy pytaniach o jakość usług.

### Widget UX

- **Proaktywny trigger** — po X sekundach na stronie bot sam zagaduje ("Cześć! Masz pytanie o [branża]?"). Konfigurowalny delay i tekst.
- **Quick reply buttons** — 3-4 clickable przyciski pod pierwszą wiadomością: "Cennik", "Godziny", "Umów wizytę", "Kontakt". Konfigurowane w dashboardzie.
- **Rich media cards** — bot może zwrócić kartę z zdjęciem usługi, ceną i przyciskiem CTA zamiast czystego tekstu.
- **Custom avatar** — właściciel wrzuca zdjęcie (twarz asystentki) lub wybiera ilustrację z galerii zamiast inicjału.
- **Bot personality presets** — "profesjonalny", "przyjazny", "energetyczny" — zmienia ton systemu prompt bez dotykania konfiguracji.
- **Dark mode widget** — automatyczne dopasowanie do preferencji systemu użytkownika.
- **Voice input** — przycisk mikrofonu → speech-to-text → wysłanie do bota. Użyteczne na mobile.

### Integracje zewnętrzne

- **Calendly/Acuity link** — gdy klient pyta o rezerwację, bot podaje bezpośredni link do konkretnej usługi w Calendly (konfigurowalny URL per usługa). Nie budujemy własnego systemu rezerwacji — tylko smart redirect.
- **Booksy deep link** — dla salonów beauty: bot generuje link `booksy.com/...` do konkretnego saloniku klienta.
- **WhatsApp Business API** — eskalacja z bota wprost do WhatsApp właściciela. Klient klika przycisk → otwiera się WhatsApp z pre-wypełnioną wiadomością.
- **Zapier/Make webhook** — nowy lead → automatycznie trafia do arkusza Google, CRM (Pipedrive, HubSpot), Notion.
- **Google Calendar** — bot sprawdza dostępność w Google Calendar właściciela i informuje "w piątek mamy jeszcze wolne miejsca". Read-only, bez tworzenia eventów.
- **Facebook Messenger** — ten sam bot, inny kanał. Jeden config, wiele miejsc.

### Analityka i AI

- **Top pytania** — dashboard pokazuje najczęściej zadawane pytania. Właściciel od razu widzi co brakuje w bazie wiedzy.
- **Pytania bez odpowiedzi** — osobna zakładka: "Te pytania bot nie umiał odpowiedzieć" → właściciel dodaje Q&A jednym kliknięciem.
- **Sentiment analysis** — wykryj sfrustrowanego klienta (negatywny sentiment po 2+ wiadomościach) → automatyczna eskalacja do właściciela przez SMS.
- **Conversation quality score** — AI ocenia jakość rozmowy 1-5 i flaguje złe rozmowy do review.
- **A/B testing promptów** — porównaj wariant A (obecny system prompt) vs wariant B (nowy) na 50/50 ruchu.
- **AI cost per tenant** — dashboard pokazuje koszt tokenów per klient → podstawa do wyceny planów.
- **Peak hours heatmap** — kiedy użytkownicy piszą najczęściej → właściciel wie kiedy być dostępny na eskalacje.

### Pakiety i monetyzacja

- **Setup fee jednorazowy** — 299 zł setup fee przy pierwszym zakupie (pokrywa koszty konfiguracji i onboardingu osobistego dla Pro/Premium).
- **Conversation packs** — doładowanie rozmów poza planem: 100 rozmów za 29 zł (dla Starter który przekroczył limit zamiast upgrade).
- **Annual discount** — 2 miesiące gratis przy płatności rocznej (12 → 10 płatnych mies.).
- **Agencyjny plan reseller** — agencje webdesign kupują w hurtowo i odsprzedają klientom ze swoją marżą. Dashboard zarządzania wieloma klientami.
- **White-label per agencja** — własna domena widgetu, własne logo w dashboardzie klienta. Docelowo Faza 3-4.
- **Pay-per-lead model** — zamiast subskrypcji: 5 zł per lead zebrany przez bota. Model self-service dla firm które nie wierzą w subskrypcje.

### Branże do ekspansji (po MVP)

- **Gabinety stomatologiczne** — appointment + ubezpieczenie + RODO medyczne. Wysokie ARPU (mogą płacić Premium).
- **Warsztaty samochodowe** — "kiedy auto będzie gotowe?" + wycena usług. Mało konkurencji w AI.
- **Szkoły tańca/jogi** — harmonogram zajęć, zapisy na próbne, cennik karnetów.
- **Prywatne kliniki estetyczne** — podobnie jak beauty, ale wyższe ceny usług → wyższe ARPU.
- **Food delivery lokalne** — menu, godziny, minimalne zamówienie. Alternatywa dla drogich platform.

### Techniczne ulepszenia bota

- **Hybrid search (BM25 + vector)** — dodanie keyword search obok cosine similarity. Poprawia trafność o ~15-20% wg benchmarków. Supabase ma `ts_rank` dla full-text search.
- **Re-ranking** — po pobraniu top-10 chunków, re-ranking przez lekki cross-encoder przed podaniem do LLM. Poprawia jakość odpowiedzi.
- **Streaming odpowiedzi** — SSE (Server-Sent Events) zamiast czekania na pełną odpowiedź. Percepcja szybkości radykalnie lepsza.
- **Conversation memory** — zapamiętanie imienia klienta i poprzednich pytań w trakcie sesji (już częściowo: historia wiadomości w DB). Docelowo: "Jak mówiłem wcześniej, interesuje mnie..."
- **Fine-tuning na danych polskich firm** — po zebraniu ~1000 rozmów: fine-tune GPT-4o-mini na polskich Q&A z branży beauty/health. Obniży koszty i poprawi jakość.
- **Cache popularnych pytań** — Redis cache dla najczęstszych pytań (TTL 1h). Oszczędność na OpenAI API.
- **Multi-modal** — w przyszłości: klient wysyła zdjęcie fryzury → bot rozumie i odpowiada. GPT-4o already supports this.
