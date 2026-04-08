'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-amber-100 text-amber-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-slate-100 text-slate-600',
};

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
    const { data: { session } } = await supabase.auth.getSession();
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
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status } : l)),
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-3 text-slate-600 font-medium">Kontakt</th>
            <th className="text-left px-4 py-3 text-slate-600 font-medium">Telefon</th>
            <th className="text-left px-4 py-3 text-slate-600 font-medium">Wiadomość</th>
            <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
            <th className="text-left px-4 py-3 text-slate-600 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{lead.name}</td>
              <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
              <td className="px-4 py-3 text-slate-500 max-w-48 truncate">
                {lead.message ?? '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  onChange={(e) => void updateStatus(lead.id, e.target.value)}
                  disabled={updating === lead.id}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs">
                {new Date(lead.createdAt).toLocaleDateString('pl-PL')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
