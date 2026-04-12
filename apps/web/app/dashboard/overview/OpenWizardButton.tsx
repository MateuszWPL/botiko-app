'use client';

import { ArrowRight } from 'lucide-react';

export function OpenWizardButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('botiko:open-wizard'))}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
    >
      Utwórz bota
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
