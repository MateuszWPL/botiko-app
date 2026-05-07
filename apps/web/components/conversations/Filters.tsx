'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download } from 'lucide-react';

type ConversationStatus = 'Aktywna' | 'Lead' | 'Zakończona';

interface FiltersProps {
  daysBack: number;
  onDaysBackChange: (days: number) => void;
  status: ConversationStatus | 'Wszystkie';
  onStatusChange: (status: ConversationStatus | 'Wszystkie') => void;
  onExport?: () => void;
  totalCount?: number;
}

const dayOptions = [
  { label: 'Ostatnie 7 dni', value: 7 },
  { label: 'Ostatnie 30 dni', value: 30 },
  { label: 'Ostatnie 90 dni', value: 90 },
  { label: 'Wszystkie', value: 9999 },
];

const statusOptions: Array<{ label: string; value: ConversationStatus | 'Wszystkie' }> = [
  { label: 'Wszystkie', value: 'Wszystkie' },
  { label: 'Aktywna', value: 'Aktywna' },
  { label: 'Lead', value: 'Lead' },
  { label: 'Zakończona', value: 'Zakończona' },
];

interface DropdownProps {
  label: string;
  options: { label: string; value: string | number }[];
  selected: string | number;
  onSelect: (value: string | number) => void;
}

function Dropdown({ label, options, selected, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200/60 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
      >
        {label}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[180px] bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selected === opt.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Filters({ daysBack, onDaysBackChange, status, onStatusChange, onExport, totalCount }: FiltersProps) {
  const daysLabel = dayOptions.find((o) => o.value === daysBack)?.label ?? 'Ostatnie 90 dni';
  const statusLabel = statusOptions.find((o) => o.value === status)?.label ?? 'Wszystkie';

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <Dropdown
          label={daysLabel}
          options={dayOptions}
          selected={daysBack}
          onSelect={(v) => onDaysBackChange(v as number)}
        />
        <Dropdown
          label={statusLabel}
          options={statusOptions}
          selected={status}
          onSelect={(v) => onStatusChange(v as ConversationStatus | 'Wszystkie')}
        />
        {totalCount !== undefined && (
          <span className="text-xs font-medium text-slate-400 ml-1">
            {totalCount} rozmów
          </span>
        )}
      </div>

      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Eksport</span>
        </button>
      )}
    </div>
  );
}
