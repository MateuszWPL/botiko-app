'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Loader2,
  ChevronDown,
  Search,
  Download,
  Plus,
  Eye,
  EyeOff,
  Copy,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { createClient } from '../../../lib/supabase';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { LeadSidebar } from '../../../components/leads/LeadSidebar';

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  sessionId: string | null;
  createdAt: string;
}

const STATUS_KEYS = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'] as const;
type StatusKey = (typeof STATUS_KEYS)[number];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const MONTH_PL = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${d.getDate()} ${MONTH_PL[d.getMonth()]} ${h}:${m}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

function getAvatarColor(name: string): string {
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function maskPhone(phone: string): string {
  if (phone.length <= 3) return '***';
  return '*'.repeat(Math.max(0, phone.length - 3)) + phone.slice(-3);
}

function exportCSV(leads: Lead[]) {
  const rows = [
    ['Imię i nazwisko', 'Telefon', 'Status', 'Wiadomość', 'Data'],
    ...leads.map((l) => [l.name, l.phone, l.status, l.message ?? '', formatDate(l.createdAt)]),
  ];
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leady-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const STAT_CARDS: { key: StatusKey; label: string; dot: string; num: string; pill: string }[] = [
  { key: 'NEW', label: 'Nowe', dot: 'bg-indigo-500', num: 'text-indigo-600', pill: 'bg-indigo-50 text-indigo-600' },
  { key: 'CONTACTED', label: 'Skontaktowane', dot: 'bg-amber-500', num: 'text-amber-600', pill: 'bg-amber-50 text-amber-600' },
  { key: 'CONVERTED', label: 'Skonwertowane', dot: 'bg-emerald-500', num: 'text-emerald-600', pill: 'bg-emerald-50 text-emerald-600' },
  { key: 'LOST', label: 'Utracone', dot: 'bg-rose-500', num: 'text-rose-600', pill: 'bg-rose-50 text-rose-600' },
];

const FILTER_LABELS: Record<string, string> = {
  ALL: 'Wszystkie',
  NEW: 'Nowe',
  CONTACTED: 'Skontaktowane',
  CONVERTED: 'Skonwertowane',
  LOST: 'Utracone',
};

function StatusDropdown({
  leadId,
  current,
  onUpdate,
  updating,
  isOpen,
  onToggle,
}: {
  leadId: string;
  current: string;
  onUpdate: (id: string, status: string) => void;
  updating: boolean;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) {
  return (
    <div className="relative inline-block">
      {/* Backdrop: catches any click outside the dropdown, z-20 below the dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={(e) => { e.stopPropagation(); onToggle(false); }}
        />
      )}

      <button
        onClick={(e) => { e.stopPropagation(); if (!updating) onToggle(!isOpen); }}
        disabled={updating}
        className="relative z-30 inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
      >
        {updating ? (
          <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
        ) : (
          <>
            <StatusBadge status={current} />
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 min-w-[170px]">
          {STATUS_KEYS.map((key) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(false);
                if (key !== current) onUpdate(leadId, key);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-50 cursor-pointer ${key === current ? 'bg-slate-50' : ''}`}
            >
              <StatusBadge status={key} />
              {key === current && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    try {
      const res = await fetch(`${API_URL}/api/v1/leads/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || undefined,
        }),
      });
      if (res.ok) {
        const { id } = (await res.json()) as { id: string };
        onAdd({
          id,
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          status: 'NEW',
          botId: '',
          sessionId: null,
          createdAt: new Date().toISOString(),
        });
        toast.success('Lead dodany');
        onClose();
      } else {
        toast.error('Nie udało się dodać leada');
      }
    } catch {
      toast.error('Błąd połączenia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">Dodaj lead ręcznie</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Imię i nazwisko *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anna Kowalska"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Telefon *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48 600 123 456"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notatka (opcjonalnie)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Np. skąd klient, o co pytał..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !phone.trim()}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Dodaj lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [revealedPhones, setRevealedPhones] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filterOpen]);

  const stats = {
    NEW: leads.filter((l) => l.status === 'NEW').length,
    CONTACTED: leads.filter((l) => l.status === 'CONTACTED').length,
    CONVERTED: leads.filter((l) => l.status === 'CONVERTED').length,
    LOST: leads.filter((l) => l.status === 'LOST').length,
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q);
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

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

  const togglePhone = (id: string) => {
    setRevealedPhones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyPhone = async (phone: string) => {
    await navigator.clipboard.writeText(phone);
    toast.success('Skopiowano do schowka');
  };

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {STAT_CARDS.map(({ key, label, dot, num, pill }) => (
          <div key={key} className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${num}`}>{stats[key]}</p>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{stats[key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Row 1: search + filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po nazwie lub telefonie..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>

          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{FILTER_LABELS[statusFilter]}</span>
              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-20 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 min-w-[180px]">
                {(['ALL', ...STATUS_KEYS] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setStatusFilter(key); setFilterOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-slate-50 cursor-pointer ${statusFilter === key ? 'bg-slate-50 font-medium' : ''}`}
                  >
                    {key === 'ALL' ? (
                      <span className="text-slate-600">Wszystkie statusy</span>
                    ) : (
                      <StatusBadge status={key} />
                    )}
                    {statusFilter === key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">Eksportuj</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Dodaj ręcznie</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-40 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-400 text-center px-4">
            {leads.length === 0
              ? 'Leady pojawią się gdy klienci zostawią kontakt przez bota'
              : 'Brak wyników dla wybranych filtrów'}
          </p>
        </div>
      ) : (
        <>
          {/* ── Mobile: card list (hidden md+) ── */}
          <div className="md:hidden space-y-3">
            {filtered.map((lead) => {
              const revealed = revealedPhones.has(lead.id);
              const dropdownOpen = openDropdownId === lead.id;
              return (
                <div
                  key={lead.id}
                  className={`relative ${dropdownOpen ? 'z-50' : 'z-0'}`}
                >
                  <div
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(lead.name)}`}>
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{lead.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="font-mono text-xs text-slate-500">
                              {revealed ? lead.phone : maskPhone(lead.phone)}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePhone(lead.id); }}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            {revealed && (
                              <button
                                onClick={(e) => { e.stopPropagation(); void copyPhone(lead.phone); }}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          leadId={lead.id}
                          current={lead.status}
                          onUpdate={(id, status) => void updateStatus(id, status)}
                          updating={updating === lead.id}
                          isOpen={dropdownOpen}
                          onToggle={(open) => setOpenDropdownId(open ? lead.id : null)}
                        />
                      </div>
                    </div>
                    {lead.message && (
                      <p className="text-xs text-slate-500 italic mt-3 line-clamp-2">{lead.message}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop: table (hidden below md) ── */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-visible shadow-sm">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead className="bg-slate-50 [&_th:first-child]:rounded-tl-2xl [&_th:last-child]:rounded-tr-2xl">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                    Kontakt
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                    Telefon
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 hidden lg:table-cell">
                    Wiadomość
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead, idx) => {
                  const revealed = revealedPhones.has(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-indigo-50/30 transition-colors relative cursor-pointer ${openDropdownId === lead.id ? 'z-50' : 'z-0'}`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                          >
                            {getInitials(lead.name)}
                          </div>
                          <span className="font-semibold text-slate-800 truncate max-w-[160px]">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 font-mono text-xs whitespace-nowrap">
                            {revealed ? lead.phone : maskPhone(lead.phone)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); togglePhone(lead.id); }}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0"
                            aria-label={revealed ? 'Ukryj telefon' : 'Pokaż telefon'}
                          >
                            {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {revealed && (
                            <button
                              onClick={(e) => { e.stopPropagation(); void copyPhone(lead.phone); }}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0"
                              aria-label="Kopiuj telefon"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell max-w-[220px]">
                        {lead.message ? (
                          <span className="text-xs text-slate-500 italic block overflow-hidden text-ellipsis whitespace-nowrap">
                            {lead.message}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          leadId={lead.id}
                          current={lead.status}
                          onUpdate={(id, status) => void updateStatus(id, status)}
                          updating={updating === lead.id}
                          isOpen={openDropdownId === lead.id}
                          onToggle={(open) => setOpenDropdownId(open ? lead.id : null)}
                        />
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {addModalOpen && (
        <AddLeadModal
          onClose={() => setAddModalOpen(false)}
          onAdd={(lead) => setLeads((prev) => [lead, ...prev])}
        />
      )}

      <LeadSidebar
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={(id, status) => {
          setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
          void updateStatus(id, status);
        }}
      />
    </>
  );
}
