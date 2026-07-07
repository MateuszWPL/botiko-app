/**
 * Centralised structured-data (JSON-LD) builders and SEO constants.
 *
 * Schema serves two audiences: classic search (Google rich results) and
 * generative engines (ChatGPT/Gemini/Perplexity) that lean on explicit entity
 * markup to decide who to cite. Keep the entity facts (name, URL, price, email)
 * consistent across every builder so the engines resolve one "Botiko" entity.
 */

export const SITE_URL = 'https://botiko.pl';
export const SITE_NAME = 'Botiko.pl';
export const CONTACT_EMAIL = 'kontakt@botiko.pl';
export const MONTHLY_PRICE_PLN = '99';

/** @id of the founder Person entity (defined in full by lib/author.ts on /o-nas). */
export const FOUNDER_PERSON_ID = `${SITE_URL}/#person`;

/** Official WordPress plugin — slug + canonical listing in the wp.org directory. */
export const WORDPRESS_PLUGIN_SLUG = 'botiko-ai-customer-service-bot';
export const WORDPRESS_PLUGIN_URL = `https://wordpress.org/plugins/${WORDPRESS_PLUGIN_SLUG}/`;

/** Absolute URL helper — accepts a leading-slash path or a full URL. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * The canonical brand entity, referenced by other schemas via @id.
 *
 * Emitted site-wide from the root layout. Typed as both Organization AND
 * LocalBusiness so there is exactly ONE "Botiko.pl" node (`#organization`) for
 * Google/LLMs to resolve — the homepage no longer emits a separate
 * `#business` LocalBusiness (that caused two competing entities). LocalBusiness
 * facts (address, priceRange, image) live here so every page carries the local
 * signal and stays consistent.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/botiko-logo-full.svg`,
    image: `${SITE_URL}/opengraph-image.png`,
    email: CONTACT_EMAIL,
    description:
      'Bot obsługi klienta 24/7 dla firm usługowych — salony, gabinety, restauracje, warsztaty.',
    priceRange: `${MONTHLY_PRICE_PLN} PLN`,
    founder: { '@id': FOUNDER_PERSON_ID },
    foundingLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'Białystok', addressCountry: 'PL' },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Białystok',
      addressRegion: 'Podlaskie',
      addressCountry: 'PL',
    },
    areaServed: [
      { '@type': 'Country', name: 'Polska' },
      { '@type': 'City', name: 'Białystok' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      areaServed: 'PL',
      availableLanguage: ['Polish'],
    },
    // Brand-owned external listing — the official plugin in the wordpress.org
    // directory. Add social profiles here as they come online.
    sameAs: [WORDPRESS_PLUGIN_URL],
  };
}

/** WebSite entity + SearchAction so engines map queries to the on-site search. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'pl-PL',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?kategoria={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type BreadcrumbEntry = { label: string; href?: string };

/**
 * BreadcrumbList for any page. Every ListItem gets `item` (an absolute URL)
 * EXCEPT the last one — Google allows omitting `item` only on the final crumb
 * (the current page). Therefore every NON-last entry MUST pass `href`; a middle
 * crumb without `href` produces a ListItem missing `item`, which Google rejects
 * as a critical error ("Missing field 'item' in itemListElement").
 */
export function breadcrumbListSchema(items: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/**
 * SoftwareApplication entity for the official WordPress plugin. `sameAs` +
 * `downloadUrl` point at the wordpress.org listing so classic search and
 * generative engines resolve the plugin to our single "Botiko" entity and can
 * surface the official install source. No `aggregateRating`/`softwareVersion`:
 * the plugin has no reviews yet (fabricated ratings risk penalties) and a
 * hardcoded version would drift out of sync with each release.
 */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Botiko — wtyczka WordPress',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'WordPress',
    url: `${SITE_URL}/integracje/wordpress`,
    downloadUrl: WORDPRESS_PLUGIN_URL,
    installUrl: WORDPRESS_PLUGIN_URL,
    sameAs: [WORDPRESS_PLUGIN_URL],
    inLanguage: 'pl-PL',
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      price: MONTHLY_PRICE_PLN,
      priceCurrency: 'PLN',
      description: '14 dni za darmo, bez karty kredytowej',
    },
    description:
      'Oficjalna wtyczka Botiko do WordPress — osadza bota obsługi klienta bez edycji motywu i łączy stronę jednym kodem. Bot odpowiada na pytania 24/7 i zbiera leady.',
  };
}

export type FaqEntry = { q: string; a: string };

/** FAQPage schema — primary lever for AI citations (Q&A is highly quotable). */
export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
