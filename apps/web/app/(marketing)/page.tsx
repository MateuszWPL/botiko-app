import type { Metadata } from 'next';
import Hero from '@/components/marketing/Hero';
import Problem from '@/components/marketing/Problem';
import HowItWorks from '@/components/marketing/HowItWorks';
import Demo from '@/components/marketing/Demo';
import Industries from '@/components/marketing/Industries';
import Pricing from '@/components/marketing/Pricing';
import Testimonials from '@/components/marketing/Testimonials';
import Faq from '@/components/marketing/Faq';
import CtaBanner from '@/components/marketing/CtaBanner';

export const metadata: Metadata = {
  title: 'Botiko.pl — Bot obsługi klienta 24/7 dla firm usługowych',
  description:
    'Bot, który odpowiada na pytania klientów 24/7. Gotowe szablony branżowe, baza wiedzy i leady w panelu. Wklejasz kod na stronę i działa. 14 dni za darmo, bez umowy.',
  keywords: [
    'bot obsługi klienta',
    'bot na stronę internetową',
    'bot do odpowiadania na wiadomości',
    'automatyczne odpowiedzi klientom',
    'bot dla małej firmy Polska',
    'bot dla firmy usługowej',
    'chatbot Białystok',
    'bot dla salonu beauty',
    'Botiko',
  ],
  openGraph: {
    title: 'Botiko.pl — Bot obsługi klienta 24/7 dla firm usługowych',
    description:
      'Klienci piszą o 22:00. Bot odpowiada za Ciebie. 99 zł/mies. 14 dni za darmo.',
    url: 'https://botiko.pl',
    siteName: 'Botiko.pl',
    images: [
      {
        url: 'https://botiko.pl/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Botiko.pl — Bot obsługi klienta 24/7',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botiko.pl — Bot obsługi klienta 24/7 dla firm usługowych',
    description:
      'Klienci piszą o 22:00. Bot odpowiada za Ciebie. 99 zł/mies. 14 dni za darmo.',
    images: ['https://botiko.pl/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://botiko.pl',
  },
};

// Organization + WebSite entities are emitted site-wide from app/layout.tsx.
// The homepage keeps the LocalBusiness + SoftwareApplication specifics.
const JSON_LD_LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://botiko.pl/#business',
  name: 'Botiko.pl',
  description:
    'Bot obsługi klienta 24/7 dla firm usługowych — salony, gabinety, restauracje, warsztaty.',
  url: 'https://botiko.pl',
  email: 'kontakt@botiko.pl',
  image: 'https://botiko.pl/opengraph-image.png',
  priceRange: '99 PLN',
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
};

const JSON_LD_SOFTWARE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Botiko',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    name: 'Botiko',
    price: '99',
    priceCurrency: 'PLN',
    description: '14 dni za darmo, bez karty kredytowej',
  },
  description:
    'Bot obsługi klienta dla polskich firm usługowych. Odpowiada na pytania klientów 24/7, zbiera leady i odsyła do rezerwacji.',
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schema (Organization + WebSite come from the root layout) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_LOCAL_BUSINESS) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SOFTWARE) }}
      />

      <Hero />
      <Problem />
      <HowItWorks />
      <Demo />
      <Industries />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
