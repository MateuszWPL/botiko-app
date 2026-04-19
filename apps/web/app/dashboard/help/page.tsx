import type { Metadata } from 'next';
import { HelpClient } from './HelpClient';

export const metadata: Metadata = {
  title: 'Pomoc · Botiko',
};

export default function HelpPage() {
  return <HelpClient />;
}
