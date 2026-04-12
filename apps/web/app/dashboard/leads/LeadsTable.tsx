'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, ChevronDown } from 'lucide-react';
import { createClient } from '../../../lib/supabase';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  createdAt: string;
}

const STATUS_KEYS = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function StatusDropdown({
  leadId,
  current,
  onUpdate,
  updating,
}: {
  leadId: string;
  current: string;
  onUpdate: (id: string, status: string) => void;
  updating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => !updating && setOpen((o) => !o)}
        disabled={updating}
        className="inline-flex items-center gap-1.5 group disabled:opacity-60"
        aria-label="Zmień status"
      >
        {updating ? (
          <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
        ) : (
          <>
            <StatusBadge status={current} />
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/60 p-1.5 min-w-[170px] animate-fade-in">
          {STATUS_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => {
                setOpen(false);
                if (key !== current) onUpdate(leadId, key);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors hover:bg-slate-50 ${key === current ? 'bg-slate-50' : ''}`}
            >
              <StatusBadge status={key} />
              {key === current && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (leadId: string, status: string) => {
    setUpdating(leadId);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(`${API_URL}/api/v1/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
        toast.success('Status zaktualizowany');
      } else {
        toast.error('Nie udało się zaktualizować statusu');
      }
    } catch {
      toast.error('Błąd połączenia');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 border-b border-slate-200/60">
          <tr>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Kontakt
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Telefon
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
              Wiadomość
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Status
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
              Data
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {leads.map((lead, idx) => (
            <tr
              key={lead.id}
              className="hover:bg-indigo-50/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <td className="px-5 py-4 font-semibold text-slate-800">{lead.name}</td>
              <td className="px-5 py-4 text-slate-600 font-mono text-xs">{lead.phone}</td>
              <td className="px-5 py-4 text-slate-500 max-w-48 truncate hidden md:table-cell">
                {lead.message ?? <span className="text-slate-300">—</span>}
              </td>
              <td className="px-5 py-4">
                <StatusDropdown
                  leadId={lead.id}
                  current={lead.status}
                  onUpdate={(id, status) => void updateStatus(id, status)}
                  updating={updating === lead.id}
                />
              </td>
              <td className="px-5 py-4 text-slate-400 text-xs hidden sm:table-cell">
                {new Date(lead.createdAt).toLocaleDateString('pl-PL')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
