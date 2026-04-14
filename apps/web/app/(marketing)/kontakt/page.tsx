import type { Metadata } from 'next';
import ContactPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Masz pytanie o Botiko? Napisz do nas — odpowiemy i podpowiemy, jak wdrożyć bota obsługi klienta na Twojej stronie.',
  alternates: { canonical: 'https://botiko.pl/kontakt' },
};

export default function KontaktPage() {
  return <ContactPageClient />;
}

