'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../../../components/onboarding/OnboardingShell';
import { loadOnboarding, saveOnboarding } from '../../../lib/onboarding-store';

const INDUSTRIES = [
  { value: 'BEAUTY', label: 'Salon urody / kosmetyka', icon: '💄', color: '#EC4899' },
  { value: 'HEALTH', label: 'Gabinet medyczny / SPA', icon: '🏥', color: '#06B6D4' },
  { value: 'FOOD', label: 'Restauracja / catering', icon: '🍽️', color: '#F97316' },
  { value: 'AUTO', label: 'Motoryzacja / warsztat', icon: '🚗', color: '#64748B' },
  { value: 'OTHER', label: 'Inna branża', icon: '🏢', color: '#6366F1' },
];

export default function Step1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState('BEAUTY');

  useEffect(() => {
    const data = loadOnboarding();
    setSelected(data.industry);
  }, []);

  const handleNext = () => {
    saveOnboarding({ industry: selected });
    router.push('/onboarding/step-2');
  };

  return (
    <OnboardingShell
      step={1}
      totalSteps={5}
      title="Wybierz swoją branżę"
      subtitle="Dostosujemy asystentkę do specyfiki Twojej działalności"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.value}
            onClick={() => setSelected(ind.value)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              selected === ind.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-2xl">{ind.icon}</span>
            <span className="text-sm font-medium text-slate-800">
              {ind.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
      >
        Dalej →
      </button>
    </OnboardingShell>
  );
}
