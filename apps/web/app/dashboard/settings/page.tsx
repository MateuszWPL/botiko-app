import { Settings } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { SettingsForm } from './SettingsForm';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

interface Bot {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
}

export default async function SettingsPage() {
  let bots: Bot[] = [];
  try {
    bots = await fetchWithAuth<Bot[]>('/api/v1/bot');
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
          action={{ label: 'Utwórz bota', href: '/onboarding/step-1' }}
        />
      ) : (
        <SettingsForm bot={bot} />
      )}
    </div>
  );
}
