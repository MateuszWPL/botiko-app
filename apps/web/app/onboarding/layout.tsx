import { type ReactNode } from 'react';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-xl font-bold text-indigo-600">Botiko.pl</span>
          <p className="text-sm text-slate-500 mt-1">Konfiguracja asystentki</p>
        </div>
        {children}
      </div>
    </div>
  );
}
