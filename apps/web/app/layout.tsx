import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Botiko.pl — Bot obsługi klienta 24/7',
    template: '%s | Botiko.pl',
  },
  description:
    'Botiko to bot obsługi klienta, który odpowiada na pytania 24/7, zbiera leady i odsyła do rezerwacji. Dla firm usługowych w Polsce — z gotowymi szablonami branżowymi.',
  keywords: [
    'bot obsługi klienta',
    'bot na stronę internetową',
    'automatyzacja obsługi klienta',
    'bot dla małej firmy',
    'bot Polska',
    'lead generation',
    'Botiko',
  ],
  authors: [{ name: 'Botiko.pl' }],
  creator: 'Botiko.pl',
  publisher: 'Botiko.pl',
  metadataBase: new URL(process.env.APP_URL ?? 'https://botiko.pl'),
  manifest: '/manifest.json',
  appleWebApp: {
    statusBarStyle: 'default',
    title: 'Botiko',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/',
    siteName: 'Botiko.pl',
    title: 'Botiko.pl — Bot obsługi klienta 24/7',
    description:
      'Klienci piszą po godzinach. Bot odpowiada za Ciebie. 1 klient = 150–300 zł. Bot = 99 zł/mies.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Botiko.pl — Bot obsługi klienta 24/7',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botiko.pl — Bot obsługi klienta 24/7',
    description:
      'Klienci piszą o 22:00. Bot odpowiada za Ciebie.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
