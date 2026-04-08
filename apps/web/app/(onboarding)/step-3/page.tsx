'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../../../components/onboarding/OnboardingShell';
import { loadOnboarding, saveOnboarding } from '../../../lib/onboarding-store';

export default function Step3Page() {
  const router = useRouter();
  const [services, setServices] = useState('');

  useEffect(() => {
    const data = loadOnboarding();
    setServices(data.services);
  }, []);

  const handleNext = () => {
    saveOnboarding({ services });
    router.push('/onboarding/step-4');
  };

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      title="Twoja oferta i cennik"
      subtitle="Opisz usługi i ceny — asystentka nauczy się odpowiadać na pytania klientów"
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Lista usług z cenami
        </label>
        <textarea
          value={services}
          onChange={(e) => setServices(e.target.value)}
          rows={10}
          placeholder={`Przykład:\n\nManicure klasyczny — 60 zł, 45 min\nManicure hybrydowy — 90 zł, 75 min\nPedicure klasyczny — 70 zł, 60 min\nStylizacja rzęs (1:1) — 200 zł, 120 min\n\nPromocje:\n- Pakiet bridal: manicure + pedicure za 110 zł\n- Środa dla studentek: -20%`}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          Im więcej szczegółów, tym trafniejsze odpowiedzi asystentki
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/onboarding/step-2')}
          className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Wstecz
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
        >
          Dalej →
        </button>
      </div>
    </OnboardingShell>
  );
}
