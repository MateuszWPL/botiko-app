import { fetchWithAuth } from '../../../lib/api';
import { SettingsForm } from './SettingsForm';

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

  if (!bot) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Ustawienia</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Nie masz jeszcze żadnego bota</p>
          <a
            href="/onboarding/step-1"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            Utwórz asystentkę →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Ustawienia</h1>
      <p className="text-slate-500 text-sm mb-8">Zarządzaj konfiguracją asystentki</p>
      <SettingsForm bot={bot} />
    </div>
  );
}
