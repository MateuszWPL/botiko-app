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
    'bot do rezerwacji (link)',
    'bot dla firmy usługowej',
    'Botiko',
  ],
  openGraph: {
    title: 'Botiko.pl — Bot obsługi klienta 24/7 dla firm usługowych',
    description:
      'Klienci piszą o 22:00. Bot odpowiada za Ciebie. 149 zł/mies. 14 dni za darmo.',
    url: 'https://botiko.pl',
    siteName: 'Botiko.pl',
    images: [
      {
        url: 'https://botiko.pl/opengraph-image',
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
      'Klienci piszą o 22:00. Bot odpowiada za Ciebie. 149 zł/mies. 14 dni za darmo.',
    images: ['https://botiko.pl/twitter-image'],
  },
  alternates: {
    canonical: 'https://botiko.pl',
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
    email: 'kontakt@botiko.pl',
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
  offers: {
    '@type': 'Offer',
    name: 'Botiko',
    price: '149',
    priceCurrency: 'PLN',
    description: '14 dni za darmo, bez karty kredytowej',
  },
  description:
    'Bot obsługi klienta dla polskich firm usługowych. Odpowiada na pytania klientów 24/7, zbiera leady i odsyła do rezerwacji.',
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
        text: 'W wielu przypadkach da się uruchomić bota w 15–20 minut: wybierasz branżę, uzupełniasz dane o firmie i gotowe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ile kosztuje Botiko?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Botiko kosztuje 149 zł miesięcznie. Każde konto ma 14 dni za darmo bez karty kredytowej. Brak umowy długoterminowej — możesz anulować kiedy chcesz.',
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
