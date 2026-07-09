/**
 * Single source of truth for the founder/author identity.
 *
 * Named, real-person authorship is the strongest E-E-A-T signal we have: a solo
 * founder with verifiable background (education, experience, portfolio, public
 * profiles). Used for blog author display, Article `author` (Person) markup and
 * the Organization `founder` link, keep the facts here consistent everywhere.
 */

import { SITE_URL, FOUNDER_PERSON_ID } from './seo';

export const AUTHOR = {
  name: 'Mateusz Woronowicz',
  /** Shown under "Redakcja Botiko.pl" historically, now a real role. */
  role: 'Twórca Botiko',
  /** Avatar fallback (brak zdjęcia, inicjały). */
  initials: 'MW',
  /** Krótkie bio do boxa „o autorze" pod wpisem. */
  bio:
    'Inżynier oprogramowania i student Politechniki Białostockiej. Od 3 lat ' +
    'w software developmencie, z 40+ zbudowanymi stronami i aplikacjami na ' +
    'koncie. Botiko rozwija samodzielnie, od kodu i modeli AI po rozmowy ' +
    'z właścicielami firm usługowych.',
  /** Strona „o autorze" w obrębie serwisu. */
  url: `${SITE_URL}/o-nas`,
  /** Profile zewnętrzne (sameAs), wzmacniają tożsamość encji dla Google i AI. */
  sameAs: [
    'https://www.linkedin.com/in/mateusz-woronowicz-3876ab304/',
    'https://github.com/MateuszWPL',
    'https://mateuszworonowicz.pl',
  ],
} as const;

/** Person JSON-LD, emitowany w pełni na /o-nas, referowany przez @id gdzie indziej. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': FOUNDER_PERSON_ID,
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.role,
    description: AUTHOR.bio,
    knowsAbout: [
      'chatboty AI',
      'automatyzacja obsługi klienta',
      'software development',
      'tworzenie stron i aplikacji',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Politechnika Białostocka',
    },
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: [...AUTHOR.sameAs],
  };
}
