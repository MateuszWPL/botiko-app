'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../../../components/onboarding/OnboardingShell';
import { loadOnboarding, saveOnboarding } from '../../../lib/onboarding-store';

const COLORS = [
  { value: '#6366F1', label: 'Indygo' },
  { value: '#EC4899', label: 'Różowy' },
  { value: '#10B981', label: 'Zielony' },
  { value: '#F59E0B', label: 'Złoty' },
  { value: '#06B6D4', label: 'Błękitny' },
  { value: '#8B5CF6', label: 'Fioletowy' },
];

export default function Step4Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    botName: 'Asystentka',
    primaryColor: '#6366F1',
    welcomeMsg: 'Dzień dobry! W czym mogę pomóc?',
  });

  useEffect(() => {
    const data = loadOnboarding();
    setForm({
      botName: data.botName || 'Asystentka',
      primaryColor: data.primaryColor || '#6366F1',
      welcomeMsg: data.welcomeMsg || 'Dzień dobry! W czym mogę pomóc?',
    });
  }, []);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleNext = () => {
    saveOnboarding(form);
    router.push('/onboarding/step-5');
  };

  return (
    <OnboardingShell
      step={4}
      totalSteps={5}
      title="Personalizacja asystentki"
      subtitle="Nadaj jej imię i wybierz kolory pasujące do Twojej marki"
    >
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imię asystentki
          </label>
          <input
            type="text"
            value={form.botName}
            onChange={update('botName')}
            maxLength={30}
            placeholder="Asystentka, Ania, Pomocnik..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Kolor główny
          </label>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setForm((f) => ({ ...f, primaryColor: c.value }))}
                title={c.label}
                className={`w-10 h-10 rounded-full border-4 transition-all ${
                  form.primaryColor === c.value
                    ? 'border-slate-800 scale-110'
                    : 'border-white shadow-md hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              title="Własny kolor"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Wiadomość powitalna
          </label>
          <input
            type="text"
            value={form.welcomeMsg}
            onChange={update('welcomeMsg')}
            maxLength={200}
            placeholder="Dzień dobry! W czym mogę pomóc?"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Live preview */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div
            className="px-4 py-3 text-white text-sm font-medium flex items-center gap-2"
            style={{ backgroundColor: form.primaryColor }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            {form.botName || 'Asystentka'}
          </div>
          <div className="p-4 bg-slate-50">
            <div className="inline-block bg-white rounded-xl rounded-bl-sm px-4 py-2 text-sm text-slate-800 shadow-sm max-w-xs">
              {form.welcomeMsg || '...'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/onboarding/step-3')}
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
