import type { ReactNode } from 'react';

type InfoBoxType = 'info' | 'tip' | 'warning' | 'danger' | 'stat';

const STYLES: Record<
  InfoBoxType,
  { bg: string; border: string; icon: string; label: string }
> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'ℹ️',
    label: 'Info',
  },
  tip: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: '💡',
    label: 'Wskazówka',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '⚠️',
    label: 'Uwaga',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '🚫',
    label: 'Ważne',
  },
  stat: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: '📊',
    label: 'Dane',
  },
};

export default function InfoBox({
  type = 'info',
  children,
}: {
  type?: InfoBoxType;
  children: ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div className={`my-6 rounded-xl border ${s.bg} ${s.border} p-5`}>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700">
        <span>{s.icon}</span>
        <span>{s.label}</span>
      </div>
      <div className="text-sm text-slate-700 leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}
