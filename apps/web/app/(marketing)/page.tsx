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
  title: 'Botiko.pl — Asystentka AI dla salonu, gabinetu i restauracji',
  description:
    'Bot który odpowiada na pytania klientów 24/7. Gotowy szablon dla beauty, health, food i auto. Zbiera leady, odsyła do rezerwacji. 14 dni za darmo, bez umowy.',
  keywords: [
    'chatbot dla salonu beauty',
    'asystentka AI dla gabinetu',
    'bot do odpowiadania na wiadomości',
    'automatyczne odpowiedzi klientom',
    'chatbot dla małej firmy Polska',
    'bot rezerwacje salon',
    'asystentka AI restauracja',
    'Botiko',
  ],
  openGraph: {
    title: 'Botiko.pl — Asystentka AI dla salonu, gabinetu i restauracji',
    description:
      'Klientki piszą o 22:00. Asystentka odpowiada za Ciebie. 14 dni za darmo.',
  },
};

const JSON_LD_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Botiko.pl',
  url: 'https://botiko.pl',
  logo: 'https://botiko.pl/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@botiko.pl',
    contactType: 'customer service',
    availableLanguage: 'Polish',
  },
  sameAs: [
    'https://facebook.com/botiko',
    'https://instagram.com/botiko.pl',
    'https://linkedin.com/company/botiko',
  ],
};

const JSON_LD_SOFTWARE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Botiko',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '79',
      priceCurrency: 'PLN',
      billingPeriod: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '149',
      priceCurrency: 'PLN',
      billingPeriod: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'Premium',
      price: '299',
      priceCurrency: 'PLN',
      billingPeriod: 'P1M',
    },
  ],
  description:
    'Asystentka AI dla polskich firm usługowych — salonów beauty, gabinetów, restauracji i warsztatów. Odpowiada na pytania klientów 24/7, zbiera leady i odsyła do rezerwacji.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '47',
    bestRating: '5',
  },
};

const JSON_LD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Czy muszę umieć programować żeby używać Botiko?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nie. Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel — wklejasz cennik, godziny pracy, FAQ. Na koniec dostajesz jeden fragment kodu HTML.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak długo trwa wdrożenie Botiko?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Większość klientów ma gotowego bota w 15–20 minut. Wybierasz branżę, uzupełniasz dane o firmie i gotowe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ile kosztuje Botiko?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Botiko oferuje trzy plany: Starter (79 zł/mies.), Pro (149 zł/mies.) i Premium (299 zł/mies.). Każdy plan ma 14 dni za darmo bez karty kredytowej.',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy dane klientów są bezpieczne zgodnie z RODO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tak. Dane przechowujemy na serwerach w UE. Imię i telefon klienta są szyfrowane (AES-256). Możemy podpisać umowę powierzenia danych (DPA).',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy mogę zrezygnować z Botiko w każdej chwili?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tak. Subskrypcja jest miesięczna i możesz anulować kiedy chcesz. Brak umów długoterminowych.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORGANIZATION) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SOFTWARE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FAQ) }}
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
