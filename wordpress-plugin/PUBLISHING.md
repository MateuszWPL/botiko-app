# Publikacja wtyczki Botiko w katalogu WordPress.org

Dwie ścieżki dystrybucji:

- **A. Ręczny ZIP (działa od razu)** — `build.sh` produkuje `dist/botiko.zip`, który wgrywasz w WordPressie (Wtyczki → Dodaj nową → Wyślij wtyczkę). Używamy tego na testy i piloty, zanim wtyczka przejdzie review.
- **B. Katalog WordPress.org** — oficjalna dystrybucja + auto-aktualizacje dla użytkowników. Proces poniżej.

---

## Budowa paczki

```bash
./wordpress-plugin/build.sh          # → wordpress-plugin/dist/botiko.zip
```

CI (`.github/workflows/ci.yml`, job „WordPress plugin") buduje identyczny artefakt na każdym PR — możesz go też pobrać z zakładki Actions.

Paczka zawiera **tylko** pliki runtime z `wordpress-plugin/botiko/` (bez `composer.json`, `phpcs.xml.dist`, `.wordpress-org/`).

### Aktualizacja pliku do pobrania z panelu

Dashboard udostępnia wtyczkę zalogowanym użytkownikom przez chroniony route
`apps/web/app/dashboard/embed/plugin-download/route.ts`. ZIP jest **osadzony jako
base64** w module `botiko-plugin-base64.ts` (nie zależy od file-tracingu Vercela,
który zawodził — download zwracał błąd `plugin-download.txt`). Po każdym wydaniu
wtyczki odśwież ZIP, base64 i wersję:

```bash
./wordpress-plugin/build.sh
cp wordpress-plugin/dist/botiko.zip apps/web/app/dashboard/embed/plugin-download/botiko-plugin.zip
cd apps/web/app/dashboard/embed/plugin-download
printf "/* eslint-disable */\nexport const PLUGIN_ZIP_BASE64 =\n  '%s';\n" "$(base64 -w0 botiko-plugin.zip)" > botiko-plugin-base64.ts
```

Następnie zbumpuj `PLUGIN_VERSION` w `route.ts` do wersji z `botiko.php`
(napędza nazwę pobieranego pliku `botiko-ai-customer-service-bot-<wersja>.zip`)
oraz numer wersji w kopii „Pobierz wtyczkę" w `EmbedCode.tsx`.

---

## B. Zgłoszenie do WordPress.org (jednorazowo)

1. **Konto** na https://wordpress.org (login = przyszły „Contributor" wtyczki).
2. **Zgłoś wtyczkę**: https://wordpress.org/plugins/developers/add/ → wgraj `botiko.zip`.
3. **Plugin Check + review** — automat (Plugin Check) + człowiek z zespołu Plugins. Trwa zwykle od kilku dni do ~2 tygodni. Na maile z `plugins@wordpress.org` odpowiadaj szybko i konkretnie.
   - Częste uwagi: escapowanie/sanityzacja (mamy), deklaracja „External services" w `readme.txt` (mamy — sekcja o `widget.botiko.pl` i `api.botiko.pl`), brak śledzenia bez zgody (mamy), prefiksy `botiko_`/`Botiko_` (mamy).
   - Nazwa/slug: slug wynika z „Plugin Name" (`Botiko — AI Customer Service Bot`) → **`botiko-ai-customer-service-bot`**. Tagi w `readme.txt` **nie** mogą zawierać „WordPress".
4. **Po akceptacji** dostajesz repozytorium **SVN**: `https://plugins.svn.wordpress.org/botiko-ai-customer-service-bot/` ze strukturą:
   ```
   /trunk         → aktualny kod wtyczki (zawartość botiko/)
   /tags/1.0.4    → zamrożone wydanie (== Stable tag w readme.txt)
   /assets        → icon-*.png, icon.svg, banner-*.png, screenshot-*.png
   ```
   `Stable tag: 1.0.4` w `readme.txt` wskazuje, które wydanie jest „live".

---

## Wydania — automatyzacja (po uzyskaniu dostępu SVN)

`.github/workflows/wp-deploy.yml` wgrywa kod + assety do SVN przy pushu taga będącego **czystym numerem wersji** (`[0-9]+.[0-9]+.[0-9]+`, np. `1.0.6` — **bez** prefiksu `v`; tag `v1.0.6` NIE odpali workflow), akcja `10up/action-wordpress-plugin-deploy`. Wymaga sekretów w repo:

- `SVN_USERNAME`, `SVN_PASSWORD` — Twoje dane wordpress.org.

Wydanie:

```bash
# 1. podbij wersję w botiko.php (Version + BOTIKO_VERSION) i readme.txt (Stable tag + changelog)
# 2. tag = czysta wersja (musi = Stable tag; SVN tag = nazwa git taga)
git tag 1.0.5 && git push origin 1.0.5
# 3. workflow zbuduje i wypchnie /trunk + /tags/1.0.5 + /assets
```

Bez sekretów/dostępu workflow jest nieaktywny (nie zaszkodzi).

---

## Assety katalogu (`wordpress-plugin/.wordpress-org/`)

| Plik | Rozmiar | Status |
|---|---|---|
| `icon.svg` | wektor | ✅ |
| `icon-256x256.png` | 256×256 | ✅ |
| `icon-128x128.png` | 128×128 | ✅ |
| `banner-772x250.png` | 772×250 | ✅ |
| `banner-1544x500.png` | 1544×500 | ✅ |
| `screenshot-1.png` … | dowolny | ⏳ do zrobienia — patrz niżej |

**Screenshoty** (opcjonalne do akceptacji, ale podnoszą konwersję): zrób 3–4 czyste zrzuty panelu wtyczki (v1.0.4) i zapisz jako `screenshot-1.png`…`screenshot-4.png` w `.wordpress-org/`. Kolejność i opisy są już w `readme.txt` → sekcja `== Screenshots ==`:
1. Połączenie strony jednym kodem
2. Status na żywo (połączono, domena autoryzowana, online)
3. Reguły wyświetlania i tryb testowy
4. Bot na froncie strony

---

## PO publikacji (dopiero wtedy!)

Gdy wtyczka jest **realnie w katalogu** (`https://wordpress.org/plugins/botiko-ai-customer-service-bot/`):

1. `apps/web/app/integracje/wordpress/page.tsx` — z „pracujemy nad" na „zainstaluj oficjalną wtyczkę z katalogu WordPress.org" + link.
2. `apps/web/app/dashboard/embed/EmbedCode.tsx` — dodaj ścieżkę „Zainstaluj wtyczkę Botiko z katalogu".
3. `components/dashboard/SetupWizard.tsx` — usuń przestarzałą instrukcję `footer.php`, wskaż wtyczkę.

⚠️ **Nie** twierdź, że wtyczka jest „dostępna w katalogu", zanim faktycznie przejdzie review i będzie publiczna. Do tego czasu obowiązuje ścieżka A (ręczny ZIP).
