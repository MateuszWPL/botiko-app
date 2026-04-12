import { Clock, Phone, CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';

const CONFIG: Record<LeadStatus, { label: string; style: string; Icon: LucideIcon }> = {
  NEW: { label: 'Nowy', style: 'bg-blue-100 text-blue-700', Icon: Clock },
  CONTACTED: { label: 'Skontaktowany', style: 'bg-amber-100 text-amber-700', Icon: Phone },
  CONVERTED: { label: 'Klient', style: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle2 },
  LOST: { label: 'Utracony', style: 'bg-slate-100 text-slate-500', Icon: XCircle },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status as LeadStatus] ?? CONFIG.NEW;
  const { label, style, Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      {label}
    </span>
  );
}
