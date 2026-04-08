# Botiko.pl — Roadmapa Projektu

> Aktualizuj po każdym ukończonym tasku. `[ ]` = do zrobienia, `[/]` = w trakcie, `[x]` = gotowe.

---

## Faza 0 — Setup Środowiska (Tydzień 1-2)

### 0.1 Infrastruktura i konta
- [x] Kupić domenę Botiko.pl
- [x] Założyć repo na GitHub
- [x] Założyć konto Supabase (EU region!)
- [ ] (później) Hosting/deploy (na razie pomijamy)
- [ ] Założyć konto OpenAI API (ustawić billing alerts)
- [ ] Założyć konto Stripe (test mode)
- [ ] Założyć konto Resend.com
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
- [x] Stworzyć `.botiko-context` (shared context dla obu IDE)
- [x] Zaktualizować `.cursorrules` (kopia/symlink `.botiko-context`)
- [x] Usunąć pliki .docx/.pdf z repozytorium (przeniesione do docs/)

### 0.5 Apps — szkielety
- [x] `apps/web/` — Next.js 14 App Router skeleton
  - [x] Tailwind + TypeScript config
  - [x] Route groups: `(marketing)`, `(auth)`, `(dashboard)`, `(onboarding)`
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
- [ ] CI/CD — wyłączone na ten moment (wrócimy później)

### 0.7 Security baseline
- [x] Supabase RLS policies (SQL w `supabase/migrations/001_rls_policies.sql` — uruchomić po założeniu projektu Supabase)
- [x] JWT verification middleware (Nest.js) — AuthGuard
- [ ] Env variables — trzymamy lokalnie w `.env*` i w Supabase (tam gdzie potrzebne)
- [x] `.env.local` w `.gitignore`

---

## Faza 1 — MVP Build (Tydzień 3-8)

### 1.1 Backend API — Core endpoints
- [ ] `POST /api/v1/auth/register` — rejestracja (Supabase Auth)
- [ ] `POST /api/v1/auth/login` — logowanie
- [ ] `POST /api/v1/auth/logout`
- [ ] `POST /api/v1/auth/refresh`
- [ ] `GET /api/v1/bot/:id/config` — publiczny (widget pobiera config)
- [ ] `POST /api/v1/bot` — tworzenie bota (onboarding)
- [ ] `PATCH /api/v1/bot/:id` — update bota
- [ ] `POST /api/v1/chat` — AI chat (widget → API → OpenAI)
- [ ] `POST /api/v1/leads` — zapis leada z widgetu
- [ ] `GET /api/v1/leads` — lista leadów (dashboard)
- [ ] `PATCH /api/v1/leads/:id` — zmiana statusu leada
- [ ] `GET /api/v1/conversations` — lista rozmów
- [ ] `GET /api/v1/conversations/:id` — szczegóły rozmowy

### 1.2 AI / RAG Pipeline
- [ ] `EmbeddingService` — text-embedding-3-small
- [ ] `KnowledgeService` — CRUD chunków wiedzy
- [ ] Wektoryzacja treści onboardingu → pgvector
- [ ] Cosine similarity search (top 5 chunków)
- [ ] `ChatService` — orchestracja: retrieve context → GPT-4o mini → response
- [ ] System prompt per branża (z brand-templates)
- [ ] `AIService` interface (abstrakcja providera — swap OpenAI/Anthropic)
- [ ] Token usage tracking per tenant
- [ ] Rate limiting per plan (300/2000/unlimited rozmów)

### 1.3 Widget (Preact)
- [ ] Launcher button (floating, bottom-right, customizable color)
- [ ] ChatWindow (360×520px desktop, fullscreen mobile)
- [ ] Message bubbles (user + assistant)
- [ ] Typing indicator
- [ ] LeadForm inline (imię + telefon)
- [ ] RODO consent checkbox
- [ ] "Powered by Botiko" footer
- [ ] CSS variables (`--botiko-primary`)
- [ ] Embed script: `<script src="widget.botiko.pl/embed.js" data-bot-id="xxx">`
- [ ] Smooth open/close animation
- [ ] Mobile responsive (fullscreen)
- [ ] Bundle size check: **< 12KB gzip**
- [ ] Domain whitelist validation

### 1.4 Onboarding Wizard (Next.js)
- [ ] Step 1: Wybór branży (karty z ikonami)
- [ ] Step 2: Dane firmy (nazwa, adres, telefon, godziny)
- [ ] Step 3: Oferta/cennik (upload PDF/foto + manual input + propozycje z szablonu)
- [ ] Step 4: Personalizacja (imię bota, kolor, tekst powitalny)
- [ ] Step 5: Embed code + instrukcja instalacji WordPress
- [ ] Progress bar
- [ ] Auto-save między krokami
- [ ] Generowanie bazy wiedzy z danych onboardingu → RAG embed

### 1.5 Dashboard (Next.js)
- [ ] Layout: sidebar + main content
- [ ] Overview page: stats (rozmowy, leady, konwersje)
- [ ] Leads page: tabela z leadami + status + filtrowanie
- [ ] Conversations page: lista rozmów + podgląd
- [ ] Knowledge Base page: edytor treści bota (CRUD)
- [ ] Settings page: dane firmy, kolor widgetu, domeny whitelist
- [ ] Embed code page: copy-paste snippet
- [ ] Billing page: aktualny plan, upgrade, faktury
- [ ] Mobile responsive (PWA-ready)

### 1.6 Notyfikacje
- [ ] Email: nowy lead → właściciel (Resend + React Email template)
- [ ] Email: podsumowanie dzienne (opcjonalne)
- [ ] SMS: nowy lead → właściciel (SMSAPI.pl) — tylko Pro/Premium

### 1.7 Landing Page (botiko.pl)
- [ ] Hero section: headline + CTA + widget mockup
- [ ] Branże grid: 6 kart z ikonami
- [ ] "Jak to działa" — 3 kroki
- [ ] Cennik: 3 plany (Starter/Pro/Premium)
- [ ] Social proof / opinie
- [ ] FAQ
- [ ] CTA banner + footer
- [ ] Demo bot na żywo na LP
- [ ] Mobile responsive
- [ ] SEO: meta tags, OG, sitemap

### 1.8 Płatności (Stripe)
- [ ] Setup Fee (jednorazowa opłata)
- [ ] Subscription (miesięczna)
- [ ] Stripe webhook handler
- [ ] Trial 14 dni
- [ ] Upgrade/downgrade plan
- [ ] Billing portal (faktury)

### 1.9 Testy
- [ ] Unit testy: AI service, RAG pipeline, auth
- [ ] Integration testy: API endpoints
- [ ] E2E testy: onboarding flow (Playwright)
- [ ] Widget bundle size < 12KB automated check
- [ ] Security audit: RLS, auth flows, input validation

---

## Faza 2 — Walidacja i Pierwsi Klienci (Miesiąc 2-4)

### 2.1 LP branżowe
- [ ] `botiko.pl/salony` — LP dla salonów urody
- [ ] `botiko.pl/gabinety` — LP dla gabinetów kosmetycznych
- [ ] SEO: zaindeksować w Google, schema markup

### 2.2 Deploy produkcyjny
- [ ] Deploy produkcyjny — na razie pomijamy (wrócimy później)
- [ ] SSL certyfikaty
- [ ] Monitoring: uptime + error tracking (Sentry?)
- [ ] Performance monitoring

### 2.3 Piloty
- [ ] Cold outreach: 50 salonów Białystok
- [ ] 3 darmowe piloty — instalacja osobista
- [ ] Feedback form (Tally.so) po 14 dniach
- [ ] Case studies z pilotów

### 2.4 Iteracje po feedbacku
- [ ] Poprawki UX na podstawie feedbacku pilotów
- [ ] Bug fixes
- [ ] Max 2 tygodnie iteracji — potem stop

### 2.5 Drugi moduł branżowy
- [ ] `brand-templates/health.ts` LUB `brand-templates/food.ts`
- [ ] LP branżowy dla nowego modułu
- [ ] Testowanie szablonu z klientem

### 2.6 Retencja
- [ ] Automatyczny raport miesięczny PDF (Pro/Premium)
- [ ] Email-based onboarding drip (7 dni po rejestracji)
- [ ] Dashboard: wyraźne metryki wartości ("X leadów, Y rozmów")

### 2.7 Dodatkowe
- [ ] Referral program: 100 zł/polecenie, link w dashboardzie
- [ ] PayU integracja (backup polska bramka)

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
| MRR | ~845 zł | ~4 386 zł | ~10 800 zł |
| Widget bundle | <12KB | <12KB | <12KB |
| Onboarding time | <15 min | <10 min | <10 min |
| Churn monthly | <15% | <10% | <7% |

---

> 📅 **Ostatnia aktualizacja:** 2026-04-07
>
> 📊 **Postęp:** Faza 0 prawie ukończona — pozostało: konta zewnętrzne + konfiguracje deploy

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
