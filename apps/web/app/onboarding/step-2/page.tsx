'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../../../components/onboarding/OnboardingShell';
import { loadOnboarding, saveOnboarding } from '../../../lib/onboarding-store';

export default function Step2Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    address: '',
    phone: '',
    hours: '',
  });

  useEffect(() => {
    const data = loadOnboarding();
    setForm({
      companyName: data.companyName,
      address: data.address,
      phone: data.phone,
      hours: data.hours,
    });
  }, []);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleNext = () => {
    saveOnboarding(form);
    router.push('/onboarding/step-3');
  };

  const isValid = form.companyName.trim().length >= 2;

  return (
    <OnboardingShell
      step={2}
      totalSteps={5}
      title="Dane Twojej firmy"
      subtitle="Te informacje asystentka przekaże klientom"
    >
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nazwa firmy <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={update('companyName')}
            placeholder="Salon Piękności Ania"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Adres
          </label>
          <input
            type="text"
            value={form.address}
            onChange={update('address')}
            placeholder="ul. Kwiatowa 5, Białystok"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Telefon kontaktowy
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+48 123 456 789"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Godziny otwarcia
          </label>
          <input
            type="text"
            value={form.hours}
            onChange={update('hours')}
            placeholder="Pon–Pt: 9:00–18:00, Sob: 10:00–15:00"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/onboarding/step-1')}
          className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Wstecz
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
        >
          Dalej →
        </button>
      </div>
    </OnboardingShell>
  );
}
