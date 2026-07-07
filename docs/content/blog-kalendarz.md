# Kalendarz redakcyjny bloga — runway sierpień–wrzesień 2026

> **Po co:** blog auto-publikuje posty w dniu z frontmatter (`lib/blog.ts` filtruje `date <= dziś`). Na 2026-07-07 mamy **34 posty, 4 zaplanowane, runway kończy się 28.07** — potem cisza. Ten plik wydłuża kadencję (~1 post/tydzień) do końca września i pilnuje, żeby nowe tematy **nie kanibalizowały** istniejących (patrz kolumna „Różni się od").
>
> **Wąskie gardło:** każdy post wymaga **3 grafik** (`public/blog/{slug}-hero.jpg`, `-1.jpg`, `-2.jpg`) — robione ręcznie, brak automatu. Bez grafik post nie idzie na produkcję. To realnie ogranicza tempo — planuj produkcję obrazków równolegle.
>
> **Proces per post:** `botiko-content` pisze/recenzuje → grafiki → akceptacja → commit. Nic do repo bez akceptacji.

## Stan na 2026-07-07
- Opublikowane: 30 · Zaplanowane: 4 (`rodo-chatbot-gabinet-checklist` 14.07, `urlop-bez-utraty-klientow-firma-uslugowa` 15.07, `tidio-alternatywa-po-polsku` 21.07, `90-dni-po-launchu-botiko-build-in-public` 28.07).
- Mocne klastry: beauty, zdrowie, food, auto, automatyzacja, RODO, baza wiedzy/RAG.
- **Biała plama: vertical OTHER** (korepetytor, trener, fotograf, usługi lokalne) — zgodnie z CLAUDE.md generyczny szablon obsługuje wiele branż, a blog ich nie dotyka. Najniższa konkurencja, dobra długa fraza.

## Priorytet A — wydłużenie runway (9 postów, tygodniowo)

| Data | Slug (roboczy) | Tytuł roboczy | Intencja / zapytanie | Klaster → linki wewn. | Różni się od (anty-kanibalizacja) |
|---|---|---|---|---|---|
| 2026-08-04 | `bot-dla-korepetytora` | Bot dla korepetytora — jak nie tracić uczniów, którzy piszą wieczorem | „chatbot dla korepetytora / szkoły językowej" | OTHER → `/dla/inna`, `pillar-automatyzacja-obslugi` | Nowy vertical — brak jakiegokolwiek postu OTHER poza 4 głównymi branżami |
| 2026-08-11 | `voicebot-czy-bot-na-stronie` | Recepcjonistka AI (voicebot) czy bot na stronie — co wybrać do obsługi zapytań | „voicebot vs chatbot", „recepcjonistka AI" | porównania → `/porownanie/botiko-vs-recepcjonistka-ai`, `czy-bot-ai-zastapi-recepcjonistke` | Wspiera nową stronę porównania; `czy-bot-ai-zastapi-recepcjonistke` odpowiada „czy zastąpi", ten post „którą kategorię wybrać" (inna intencja) |
| 2026-08-18 | `bot-dla-trenera-personalnego` | Bot dla trenera personalnego i studia fitness — zapisy i pytania 24/7 | „chatbot dla trenera / siłowni" | OTHER → `/dla/inna` | Kolejny vertical OTHER; inna branża niż korepetytor |
| 2026-08-25 | `wtyczka-chatbot-wordpress-problemy` | Wtyczka chatbota na WordPress — najczęstsze problemy i jak je rozwiązać | „wtyczka chatbot WordPress nie działa" (troubleshooting) | WordPress → `/integracje/wordpress`, `botiko-dla-wordpress-przewodnik-2026`, `jak-ustawic-bota-na-wordpress-krok-po-kroku` | Satelita pillara WP o innej intencji (naprawa) niż przewodniki instalacji |
| 2026-09-01 | `bot-dla-fotografa` | Bot dla fotografa — jak obsłużyć zapytania o sesje i terminy | „chatbot dla fotografa" | OTHER → `/dla/inna` | Trzeci vertical OTHER; sezonowość/wyceny sesji jako odrębny kąt |
| 2026-09-08 | `ile-kosztuje-bot-dla-restauracji-2026` | Ile kosztuje bot dla restauracji w 2026 — realne widełki | „ile kosztuje chatbot dla restauracji" (cost-intent) | food/ROI → `/dla/restauracja`, `ile-kosztuje-chatbot-dla-firmy-uslugowej-2026` | Wersja per-branża i per-zapytanie; pillar cost jest ogólny (firma usługowa), ten wchodzi w konkret gastronomii — linkuje do pillara jako źródła |
| 2026-09-15 | `jak-napisac-faq-dla-bota-przyklady` | Jak napisać FAQ dla bota — 20 pytań, które zadają klienci (przykłady per branża) | „przykłady FAQ dla chatbota" | baza wiedzy → `baza-wiedzy`, `schemat-chatbota-*` | `baza-wiedzy` = „jak zbudować bazę/template"; ten = konkretne przykłady pytań FAQ (węższa, przykładowa intencja) |
| 2026-09-22 | `bledy-przy-wdrazaniu-bota-obslugi-klienta` | 5 błędów przy wdrażaniu bota obsługi klienta (i jak ich uniknąć) | „jak wdrożyć chatbota" (evergreen, poradnikowy) | automatyzacja → `pillar-automatyzacja-obslugi`, `chatbot-na-strone-www-mala-firma` | ⚠️ Zaostrzyć kąt na REALNE antywzorce (za mało FAQ przed startem, brak przekazania do człowieka, bot obiecujący rezerwację), NIE parafraza checklisty. `chatbot-na-strone-www-mala-firma` ma już „checklistę wdrożeniową" + „pierwsze 7 dni" → linkować do niej jako źródła, nie powielać |
| 2026-09-29 | `bot-vs-formularz-kontaktowy` | Bot obsługi klienta vs formularz kontaktowy — co zbiera więcej leadów | „formularz kontaktowy vs chatbot" | marketing/porównania → `jak-zbierac-leady-...`, `/porownanie` | ⚠️ Head-to-head z danymi (konwersja %, czas odpowiedzi) w stylu `tidio-alternatywa`; wyraźnie ROZWIJA wątek z `jak-zbierac-leady-...` i `chatbot-na-strone-www-mala-firma` (które tylko wzmiankują formularz) — nie powiela ich tabel |

**Rezerwowe tematy** (swap, gdy któryś powyżej nie zagra lub potrzeba więcej — sugestie z review `botiko-content`):
- `bot-dla-sklepu-lokalnego` — vertical OTHER, inny segment (usługi rzemieślnicze / sklep lokalny) niż usługi osobiste (korepetytor/trener/fotograf).
- `jak-bot-przekazuje-do-rezerwacji-booksy-calendly` — HOW-TO mechaniki przekazania (nie VS-porównanie jak `booksy-vs-bot`); wprost odpowiada „czy bot rezerwuje" i wzmacnia komunikat marki. Uważać na overlap z parą Booksy — kąt musi być czysto „jak wygląda handoff", nie „co wybrać".

**Uwaga do #2 (`voicebot-czy-bot-na-stronie`):** strona docelowa `/porownanie/botiko-vs-recepcjonistka-ai` **już jest live** (PR #116) — link wewnętrzny jest ważny.

## Priorytet B — tanie poprawki treści (bez nowych grafik)
- **Poszerzyć `pytania-nocne` poza beauty** (backlog z `PLAYBOOK.md`): tytuł/excerpt obiecują szerzej niż beauty, a treść jest w 100% beauty. Dodać realne przykłady z restauracji/warsztatu → realnie różnicuje intencję od lokalnego `7-pytan-...-bialystok`.

## Priorytet C — seria „build in public" (luźno, zależne od kamieni milowych)
- Kontynuacja po `90-dni-po-launchu...` — kolejny wpis dopiero **gdy będą realne dane** (pierwsi płacący klienci, wnioski z pilotów). Świetne pod brand + Reddit + backlinki, ale nie fabrykujemy postępów. Nie planujemy sztywnej daty.

## Guardraile (żeby nie wrócić do kanibalizacji z Fazy 1A)
1. Każdy nowy post = **odrębna intencja/zapytanie** vs istniejące 34 (kolumna „Różni się od" musi być wypełniona).
2. Warianty **lokalne (Białystok)** tylko gdy dają realny lokalny kontekst — nie duplikuj ogólnego postu samą zmianą miasta w tytule.
3. Post satelitarny **linkuje do pillara** jako źródła i nie powiela jego zakresu.
4. Review `botiko-content` (język marki, brak obietnic spoza MVP) + w razie potrzeby `botiko-business` — przy każdym drafcie, przed merge.
