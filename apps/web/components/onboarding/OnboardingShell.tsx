'use client';

import { type ReactNode } from 'react';

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const STEP_LABELS = ['Branża', 'Firma', 'Oferta', 'Personalizacja', 'Gotowe'];

export function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={
                i + 1 <= step
                  ? 'text-indigo-600 font-medium'
                  : 'text-slate-400'
              }
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-slate-400 mt-1">
          Krok {step} z {totalSteps}
        </p>
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-1">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}

      {children}
    </div>
  );
}
