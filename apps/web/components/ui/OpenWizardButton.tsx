'use client';

export function OpenWizardButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('botiko:open-wizard'))}
      className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm shadow-indigo-200 cursor-pointer"
    >
      {label}
    </button>
  );
}

