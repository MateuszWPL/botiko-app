'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nowy',
  CONTACTED: 'Skontaktowany',
  CONVERTED: 'Klient',
  LOST: 'Utracony',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-5 py-4 font-semibold text-slate-800">{lead.name}</td>
              <td className="px-5 py-4 text-slate-600 font-mono text-xs">{lead.phone}</td>
              <td className="px-5 py-4 text-slate-500 max-w-48 truncate hidden md:table-cell">
                {lead.message ?? <span className="text-slate-300">—</span>}
              </td>
              <td className="px-5 py-4">
                <div className="relative inline-flex items-center gap-2">
                  {updating === lead.id ? (
                    <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                  ) : (
                    <StatusBadge status={lead.status} />
                  )}
                  <select
                    value={lead.status}
                    onChange={(e) => void updateStatus(lead.id, e.target.value)}
                    disabled={updating === lead.id}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full disabled:cursor-not-allowed"
                    aria-label="Zmień status"
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
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
