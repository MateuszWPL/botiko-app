import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  Code2,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

export interface TopBarMeta {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ROUTES: Array<[RegExp, TopBarMeta]> = [
  [/^\/dashboard\/overview/,       { title: 'Przegląd',      description: 'Statystyki Twojego bota w pigułce', icon: LayoutDashboard }],
  [/^\/dashboard\/leads/,          { title: 'Leady',         description: 'Kontakty zebrane przez bota',        icon: Users }],
  [/^\/dashboard\/conversations/,  { title: 'Rozmowy',       description: 'Historia konwersacji z klientami',   icon: MessageSquare }],
  [/^\/dashboard\/knowledge/,      { title: 'Baza wiedzy',   description: 'Informacje z których korzysta bot',  icon: BookOpen }],
  [/^\/dashboard\/settings/,       { title: 'Ustawienia',    description: 'Zarządzaj konfiguracją bota',        icon: Settings }],
  [/^\/dashboard\/embed/,          { title: 'Instalacja',    description: 'Wklej widget na swoją stronę',       icon: Code2 }],
  [/^\/dashboard\/billing/,        { title: 'Płatności',     description: 'Zarządzaj subskrypcją Botiko',       icon: CreditCard }],
  [/^\/dashboard\/help/,           { title: 'Pomoc',         description: 'Jesteśmy tutaj aby pomóc',           icon: HelpCircle }],
];

const DEFAULT_META: TopBarMeta = {
  title: 'Dashboard',
  description: 'Panel zarządzania Botiko',
  icon: LayoutDashboard,
};

export function getTopBarMeta(pathname: string): TopBarMeta {
  for (const [pattern, meta] of ROUTES) {
    if (pattern.test(pathname)) return meta;
  }
  return DEFAULT_META;
}
