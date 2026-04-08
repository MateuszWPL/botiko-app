import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Botiko.pl — Asystentka AI dla Twojej firmy',
    template: '%s | Botiko.pl',
  },
  description:
    'Botiko to asystentka AI, która odpowiada na pytania Twoich klientów 24/7. Zbiera leady, zanim zdążysz odebrać telefon. Dla salonów urody, gabinetów, restauracji i więcej.',
  keywords: [
    'chatbot AI',
    'asystentka AI',
    'bot dla salonu',
    'automatyzacja obsługi klienta',
    'chatbot Polska',
    'lead generation',
    'Botiko',
  ],
  authors: [{ name: 'Botiko.pl' }],
  creator: 'Botiko.pl',
  publisher: 'Botiko.pl',
  metadataBase: new URL(process.env.APP_URL ?? 'https://botiko.pl'),
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/',
    siteName: 'Botiko.pl',
    title: 'Botiko.pl — Asystentka AI dla Twojej firmy',
    description:
      'Asystentka która odpowiada za Ciebie gdy robisz zabieg. 1 klientka = 150-300 zł. Bot = 149 zł/mies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Botiko.pl — Asystentka AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botiko.pl — Asystentka AI dla Twojej firmy',
    description:
      'Asystentka która odpowiada za Ciebie gdy robisz zabieg. Nie tracisz klientek o 22:00.',
    images: ['/og-image.png'],
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
