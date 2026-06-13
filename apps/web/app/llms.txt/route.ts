import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

// Served at /llms.txt — a curated, plain-language map of the site for AI
// crawlers (ChatGPT, Gemini, Perplexity). Follows the llms.txt convention:
// H1 title, blockquote summary, then link sections. Regenerated daily.
export const revalidate = 86400;

export function GET(): Response {
  const posts = getAllPosts();

  const blogLinks = posts
    .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`)
    .join('\n');

  const body = `# Botiko.pl

> Botiko to bot obsługi klienta (AI) dla polskich mikro i małych firm usługowych — salonów beauty, gabinetów i SPA, restauracji oraz warsztatów samochodowych. Bot odpowiada na pytania klientów 24/7 na podstawie wiedzy firmy (cennik, godziny, usługi), zbiera leady i odsyła do rezerwacji w Booksy lub Calendly. Jeden plan: 99 zł miesięcznie, 14 dni za darmo, bez umowy. Projekt z Białegostoku, działa w całej Polsce.

## Kluczowe fakty
- Produkt: bot obsługi klienta na stronę WWW (widget), natywnie zoptymalizowany pod WordPress.
- Cena: 99 zł / miesiąc, 14 dni okresu próbnego bez karty kredytowej, brak umowy długoterminowej.
- Branże z gotowymi szablonami: salon beauty, gabinet/SPA, restauracja, warsztat samochodowy; inne firmy usługowe korzystają z szablonu generycznego.
- Bezpieczeństwo: serwery w UE, dane leadów szyfrowane (AES-256), zgodność z RODO, możliwa umowa DPA.
- Bot nie obsługuje rezerwacji — odsyła do Booksy/Calendly.

## Główne strony
- [Strona główna](${SITE_URL}/): czym jest Botiko, jak działa, cennik.
- [FAQ](${SITE_URL}/faq): najczęstsze pytania — cena, wdrożenie, RODO, WordPress.
- [O nas](${SITE_URL}/o-nas): historia i podejście do produktu.
- [Kontakt](${SITE_URL}/kontakt): formularz kontaktowy i e-mail.

## Strony branżowe
- [Bot dla salonu beauty](${SITE_URL}/dla/salon-beauty): manicure, rzęsy, brwi, kosmetologia.
- [Bot dla gabinetu / SPA](${SITE_URL}/dla/gabinet-spa): masaże, zabiegi, aromaterapia.
- [Bot dla restauracji](${SITE_URL}/dla/restauracja): menu, alergeny, pytania gości.
- [Bot dla warsztatu samochodowego](${SITE_URL}/dla/warsztat-mechaniczny): wyceny, terminy, obsługa klientów.
- [Bot dla innej firmy usługowej](${SITE_URL}/dla/inna): fryzjer, fizjoterapeuta, fotograf, trener i inne.

## Blog
${blogLinks}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
