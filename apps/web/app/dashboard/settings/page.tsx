export const dynamic = 'force-dynamic';

import { Settings } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { SettingsForm } from './SettingsForm';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

export interface DaySchedule {
  enabled: boolean;
  start: number;
  end: number;
}

export interface BotData {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  businessSchedule: DaySchedule[] | null;
  personality: string | null;
  companyName: string | null;
  companyPhone: string | null;
  companyAddress: string | null;
  suggestedQuestions: string[];
  leadFormAfterMessages: number;
  avatarEmoji: string;
  industry?: string;
}

export default async function SettingsPage() {
  let bots: BotData[] = [];
  try {
    bots = await fetchWithAuth<BotData[]>('/api/v1/bot');
  } catch {
    // handled below
  }

  const bot = bots[0];

  return (
    <div>
      <PageHeader title="Ustawienia" description="Zarządzaj konfiguracją bota" />

      {!bot ? (
        <EmptyState
          icon={Settings}
          title="Nie masz jeszcze żadnego bota"
          description="Utwórz bota aby skonfigurować jego ustawienia"
          action={{ label: 'Utwórz bota', openWizard: true }}
        />
      ) : (
        <SettingsForm bot={bot} />
      )}
    </div>
  );
}
