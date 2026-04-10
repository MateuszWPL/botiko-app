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

## Faza 1 — MVP Build (Tydzień 3-8)

### 1.1 Backend API — Core endpoints
- [x] `POST /api/v1/auth/register` — rejestracja (Supabase Auth)
- [x] `POST /api/v1/auth/login` — logowanie
- [x] `POST /api/v1/auth/logout`
- [x] `POST /api/v1/auth/refresh`
- [x] `GET /api/v1/bot/:id/config` — publiczny (widget pobiera config)
- [x] `POST /api/v1/bot` — tworzenie bota (onboarding)
- [x] `PATCH /api/v1/bot/:id` — update bota
- [x] `POST /api/v1/chat` — AI chat (widget → API → OpenAI)
- [x] `POST /api/v1/leads` — zapis leada z widgetu
- [x] `GET /api/v1/leads` — lista leadów (dashboard)
- [x] `PATCH /api/v1/leads/:id/status` — zmiana statusu leada
- [x] `GET /api/v1/conversations` — lista rozmów
- [x] `GET /api/v1/conversations/:id` — szczegóły rozmowy

### 1.2 AI / RAG Pipeline
- [x] `EmbeddingService` — text-embedding-3-small
- [x] `KnowledgeService` — CRUD chunków wiedzy
- [x] Wektoryzacja treści onboardingu → pgvector
- [x] Cosine similarity search (top 5 chunków, próg 0.3)
- [x] `ChatService` — orchestracja: retrieve context → GPT-4o mini → response
- [x] System prompt per branża (z brand-templates)
- [x] `AIService` interface (abstrakcja providera — swap OpenAI/Anthropic)
- [x] Token usage tracking per tenant
- [x] Rate limiting per plan (300/2000/unlimited rozmów) — `checkPlanLimit()` w ChatService, liczy conversations per miesiąc per tenant

### 1.3 Widget (Preact)
- [x] Launcher button (floating, bottom-right, customizable color)
- [x] ChatWindow (360×520px desktop, fullscreen mobile)
- [x] Message bubbles (user + assistant)
- [x] Typing indicator (animowane dots)
- [x] LeadForm inline (imię + telefon)
- [x] RODO consent checkbox
- [x] "Powered by Botiko" footer
- [x] CSS variables (`--botiko-primary`) — Shadow DOM `:host` + `host.style.setProperty`, komponenty używają `var(--botiko-primary, fallback)`
- [x] Embed script: `<script src="widget.botiko.pl/embed.js" data-bot-id="xxx">`
- [x] Smooth open/close animation (botiko-fadein)
- [x] Mobile responsive (fullscreen)
- [x] Bundle size check: **< 12KB gzip** (wymuszane przez Vite plugin)
- [x] Domain whitelist validation (DomainWhitelistGuard)

### 1.4 Onboarding Wizard (Next.js)
- [x] Step 1: Wybór branży (karty z ikonami)
- [x] Step 2: Dane firmy (nazwa, adres, telefon, godziny)
- [x] Step 3: Oferta/cennik — manual text input + klikalne szablony branżowe (BEAUTY/HEALTH/FOOD/AUTO/OTHER); upload PDF poza scope MVP
- [x] Step 4: Personalizacja (imię bota, kolor, tekst powitalny)
- [x] Step 5: Embed code + instrukcja instalacji WordPress
- [x] Progress bar (OnboardingShell z krokami + pasek %)
- [x] Auto-save między krokami (localStorage via onboarding-store.ts)
- [x] Generowanie bazy wiedzy z danych onboardingu → RAG embed (step-5 tworzy KnowledgeChunks)

### 1.5 Dashboard (Next.js)
- [x] Layout: sidebar + main content (Sidebar component)
- [x] Overview page: stats (rozmowy, leady, konwersje)
- [x] Leads page: tabela z leadami + status (LeadsTable)
- [x] Conversations page: lista rozmów + podgląd
- [x] Knowledge Base page: edytor treści bota (CRUD)
- [x] Settings page: dane firmy, kolor widgetu, domeny whitelist
- [x] Embed code page: copy-paste snippet
- [x] Billing page: aktualny plan (UI — bez integracji Stripe)
- [x] Mobile responsive (PWA-ready) — manifest.json, bottom nav na mobile, pb-safe na dashboard layout

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

### 1.10 Security — do naprawy

#### Naprawione (2026-04-09)
- [x] **Open redirect** — `login/page.tsx` — `?redirect=` walidowany do ścieżek relatywnych
- [x] **Wyciek komunikatów błędów** — `http-exception.filter.ts` — surowy `exception.message` nie jest już zwracany klientowi
- [x] **Ominięcie domain whitelist** — `domain-whitelist.guard.ts` — brak nagłówka `Origin` blokowany na produkcji

- [x] **SQL injection risk** — `embedding.service.ts` — `assertValidEmbedding()` waliduje długość (1536) i `isFinite()` każdej wartości
- [x] **Słabe wymagania hasła** — `register.dto.ts` — min 12 znaków + regex dla wielkiej litery + cyfry
- [x] **`status as any`** — `lead.service.ts` — `status as LeadStatus` z importem `@prisma/client`

### 1.11 Pakiety — Funkcjonalności per Plan

> Analiza rynku (Chatbase, SiteGPT, Tidio, Botpress, Crisp, Dante AI) — co jest gdzie gated i dlaczego.

#### Starter — 149 zł/mies (target: pierwsza firma, micro)
- [ ] 300 rozmów/mies (miesięczny reset, tracking per tenant)
- [ ] 1 bot per konto
- [ ] Baza wiedzy: tekst ręczny (z onboardingu) — maks. 20 wpisów Q&A
- [ ] Lead capture (imię + telefon) + email do właściciela
- [ ] Widget: customizacja koloru i imienia bota
- [ ] Historia rozmów w dashboardzie: 30 dni
- [ ] "Powered by Botiko" badge w widgecie (obowiązkowy)
- [ ] Support: email, odpowiedź do 48h

#### Pro — 249 zł/mies (target: aktywna firma, potrzebuje więcej danych)
- [ ] 2 000 rozmów/mies
- [ ] 3 boty per konto
- [ ] Baza wiedzy: + PDF upload (maks. 5 plików, 5MB każdy), + URL crawl własnej strony www
- [ ] SMS notyfikacje o nowych leadach (SMSAPI.pl)
- [ ] Statystyki: liczba rozmów, leady, godziny szczytu, top pytania
- [ ] Historia rozmów: 90 dni
- [ ] "Powered by Botiko" badge opcjonalny (można wyłączyć)
- [ ] Support: email priorytetowy, odpowiedź do 24h

#### Premium — 449 zł/mies (target: firma z pełną automatyzacją)
- [ ] Unlimited rozmów
- [ ] 10 botów per konto
- [ ] Baza wiedzy: + Google Docs sync, + Notion sync, + webhook do własnych danych
- [ ] API access (klucze w dashboardzie, docs na botiko.pl/api)
- [ ] Full white-label: brak Botiko badge, custom domena dla widgetu
- [ ] Automatyczny raport miesięczny PDF (Resend + React PDF)
- [ ] Webhook: powiadomienie o nowym leadzie do własnego systemu
- [ ] Support: email + video call onboarding (30 min przy zakupie)

### 1.12 Bot Core — Brakujące Funkcje MVP

> Na podstawie analizy rynku: największe powody, dla których boty zawodzą. Te funkcje są must-have przed pilotami.

- [ ] **Fallback answer** — gdy bot nie zna odpowiedzi (similarity score < 0.3 dla wszystkich chunków), wyślij gotową wiadomość z numerem telefonu lub linkiem do kontaktu zamiast hallucynacji
- [ ] **Eskalacja do człowieka** — po 3 nieudanych odpowiedziach lub gdy user pisze "człowiek"/"human"/"rozmów z kimś" → bot pokazuje dane kontaktowe z konfiguracji (telefon, WhatsApp link)
- [ ] **Lead form timing** — formularz pojawia się dopiero po ≥ 2 wymianach wiadomości, nie od razu przy otwarciu widgetu
- [ ] **Conversation continuity** — sessionStorage w widgecie przechowuje historię przez czas wizyty (nie traci przy odświeżeniu strony)
- [ ] **Knowledge staleness indicator** — w dashboardzie: "Baza wiedzy ostatnio zaktualizowana: X dni temu" + przycisk "Odśwież"
- [ ] **Bot confidence display** — gdy bot zwraca odpowiedź z niskim confidence, dodaje automatycznie: "Jeśli masz wątpliwości, zadzwoń: [telefon]"
- [ ] **Quick reply buttons** — 3-4 gotowe przyciski pod pierwszą wiadomością bota (konfigurowalne w dashboardzie: "Cennik", "Godziny otwarcia", "Zapisz się")
- [ ] **PDF upload w onboardingu** — step 3 umożliwia wrzucenie cennika/oferty jako PDF (parsowanie text → chunki) zamiast tylko ręcznego wpisywania

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
> 📊 **Postęp:** Faza 0 ukończona w całości. Faza 1 w dużej mierze gotowa: wszystkie endpointy API, pełny RAG pipeline, widget Preact, onboarding wizard (5 kroków), dashboard (8 stron), landing page (v4). Pozostało: 1.6 notyfikacje, 1.8 Stripe, 1.9 testy, 1.11 pakiety (billing enforcement), 1.12 bot core improvements (fallback, eskalacja, PDF upload).

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
