# Voice Context. Botiko.pl

> Plik auto-ładowany przez wszystkie sub-skille `claude-blog`. Ostatnia aktualizacja: 2026-07-07.
> Język treści: **polski**. Ton: rzeczowy, bezpośredni, „na Ty", bez korpo-mowy i bez AI-slop.

## Pronoun stance
- **Do czytelnika (właściciela firmy): druga osoba: „Ty / Twój"** („tracisz klientki", „Twój cennik").
- **O produkcie: „Botiko" / „my"** („Botiko odpowiada", „przechowujemy dane w UE").
- **Build in public: pierwsza osoba founderа** („zbudowałem", „nauczyło mnie"), tylko w tej serii.

## Lexical rules
- **Contractions**: n/d dla polskiego; zamiast tego ton bezpośredni i potoczny-ale-fachowy (bez żargonu technicznego).
- **Sentence ceiling**: ~30 słów (twardy sufit). Krótkie, konkretne zdania.
- **Paragraph ceiling**: ~150 słów; częściej 2-4 zdania.
- **Summary label**: **„W skrócie"** (polski odpowiednik Key Takeaways), box zaraz po wstępie.
- Prosty język: pisz tak, żeby zrozumiał nietechniczny właściciel salonu. Terminy (RAG, RODO) tłumacz w jednym zdaniu.

## Headline patterns
- **Favor**:
  - Pytanie: „Ile kosztuje bot dla restauracji w 2026?"
  - Ból/obietnica: „Klienci piszą o 22:00. Bot odpowiada za Ciebie."
  - Liczba: „7 pytań, które klientki zadają o 22:00".
  - Per-branża: „Bot dla korepetytora: ...".
- **Avoid**: clickbait („nie uwierzysz", „ten trik"), „rewolucja/przełom", puste superlatywy, tytuły z „chatbot AI" jako marką.

## Voice fingerprint
- Funny vs serious: **0.2** (rzeczowo, z lekkim luzem: nie sztywno, nie żartobliwie)
- Formal vs casual: **0.35** (casual, „na Ty", ale wiarygodnie)
- Respectful vs irreverent: **0.2** (uprzejmie, bez ironii wobec czytelnika)
- Enthusiastic vs matter-of-fact: **0.4** (konkret i dowody > entuzjazm)

## Readability target
- Audience tier: **consumer / professional** (nietechniczny właściciel małej firmy).
- Flesch Grade: **7-9** (prosto, przystępnie).
- Cel: każdy akapit zrozumiały bez czytania poprzedniego; kluczowa odpowiedź na górze sekcji.

## MDX / format projektu (WAŻNE, nadpisuje domyślne pluginu)
- Platforma: **Next.js MDX**, posty w `apps/web/content/blog/{slug}.mdx`.
- **Frontmatter: wymagane:** `title`, `excerpt` (nie `description`), `date` ("YYYY-MM-DD"), `category`, `categorySlug`, `tags` (array), `author: "Mateusz Woronowicz"`, `authorTitle: "Twórca Botiko"`.
- **Frontmatter: opcjonalne:** `image: "/blog/{slug}-hero.jpg"`, `imageAlt`, `updatedAt`, `readingTime`, `featured` (domyślnie pomijane), `draft` (ukrywa post z listingu i sitemap, do etapu roboczego).
- **Komponenty MDX (używaj TYCH, nie domyślnych pluginu):** `<FAQ items={[{q,a}]} />` (NIE `<FAQSchema faqs>`), `<CTABlock title description cta href />`, `<Callout type title>`, `<InfoBox type>`, `<ComparisonTable title headers rows />`, `<CallToAction title description href buttonText />`, `<ImageGallery>`, `<VideoEmbed>`, `<ROICalculator>`.
- **Grafiki: ręcznie.** Każdy post = 3 pliki w `apps/web/public/blog/`: `{slug}-hero.jpg`, `{slug}-1.jpg`, `{slug}-2.jpg`. Do czasu ich dodania dozwolony fallback `image: "/blog/default-hero.jpg"`. Nie generuj obrazków przez Gemini (płatne), sourcing/produkcja po stronie foundera.
- **Auto-publikacja:** `lib/blog.ts` publikuje post gdy `date <= dziś`. Nowe posty datuj w przyszłość (bufor na grafiki), wg kalendarza `docs/content/blog-kalendarz.md`.
