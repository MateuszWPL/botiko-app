export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  BookOpen,
  Users,
  Bot,
  Zap,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { OpenWizardButton } from './OpenWizardButton';
import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { OverviewCharts } from '../../../components/dashboard/OverviewCharts';
import { ConversationsAreaChart } from '../../../components/dashboard/ConversationsAreaChart';
import type { ChartPoint } from '../../../components/dashboard/ConversationsAreaChart';
import { KnowledgeHealthCard } from '../../../components/dashboard/KnowledgeHealthCard';
import type { KnowledgeHealth } from '../../../components/dashboard/KnowledgeHealthCard';
import { RoiSummaryCard } from '../../../components/dashboard/RoiSummaryCard';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  messageCount: number;
  firstMessage: string | null;
  createdAt: string;
}

interface BotData {
  id: string;
  name: string;
  isActive: boolean;
}

interface BillingStatus {
  isActive: boolean;
  hasSubscription: boolean;
  trialEndsAt: string | null;
}

async function getStats() {
  try {
    const [leads, conversations, bots, billing, knowledgeHealth] = await Promise.all([
      fetchWithAuth<Lead[]>('/api/v1/leads'),
      fetchWithAuth<Conversation[]>('/api/v1/conversations'),
      fetchWithAuth<BotData[]>('/api/v1/bot'),
      fetchWithAuth<BillingStatus>('/api/v1/billing/status').catch(() => null),
      fetchWithAuth<KnowledgeHealth>('/api/v1/conversations/knowledge-health').catch(
        () => null,
      ),
    ]);
    return { leads, conversations, bots, billing, knowledgeHealth };
  } catch {
    return {
      leads: [],
      conversations: [],
      bots: [],
      billing: null,
      knowledgeHealth: null,
    };
  }
}

// --- Helpers ---

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#06B6D4', '#10B981', '#F97316', '#8B5CF6'];

function avatarColor(name: string): string {
  const code = (name.charCodeAt(0) ?? 0) + (name.charCodeAt(1) ?? 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length] ?? '#6366F1';
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/[\s\-()]/g, '');
  if (clean.length < 6) return phone;
  const last3 = clean.slice(-3);
  const prefix = clean.startsWith('+') ? clean.slice(0, 3) : clean.slice(0, 2);
  return `${prefix} ••• ••• ${last3}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date().toISOString().slice(0, 10);
  if (iso.slice(0, 10) === today) {
    return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

const LEAD_STATUS: Record<string, { label: string; cls: string }> = {
  NEW:       { label: 'Nowy',          cls: 'bg-indigo-50 text-indigo-600' },
  CONTACTED: { label: 'Skontaktowany', cls: 'bg-amber-50 text-amber-600' },
  CONVERTED: { label: 'Skonwertowany', cls: 'bg-emerald-50 text-emerald-600' },
  LOST:      { label: 'Utracony',      cls: 'bg-slate-100 text-slate-500' },
};

// --- Area chart data ---

function buildAreaData(conversations: Conversation[], days: number): ChartPoint[] {
  const result: ChartPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label =
      days <= 7
        ? d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' })
        : d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    result.push({
      day: label,
      konwersacje: conversations.filter((c) => c.createdAt.slice(0, 10) === key).length,
    });
  }
  return result;
}

// --- Stat badge ---

function StatBadge({ value }: { value: number }) {
  if (value > 0)
    return (
      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        +{value}%
      </span>
    );
  if (value < 0)
    return (
      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
        {value}%
      </span>
    );
  return (
    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
      —
    </span>
  );
}

export default async function OverviewPage() {
  const { leads, conversations, bots, billing, knowledgeHealth } = await getStats();

  // --- Monthly stats ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthConvs = conversations.filter((c) => new Date(c.createdAt) >= startOfMonth);
  const lastMonthConvs = conversations.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= startOfLastMonth && d < startOfMonth;
  });
  const thisMonthLeads = leads.filter((l) => new Date(l.createdAt) >= startOfMonth);
  const lastMonthLeads = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d >= startOfLastMonth && d < startOfMonth;
  });

  const pctChange = (curr: number, prev: number) =>
    prev > 0 ? Math.round(((curr - prev) / prev) * 100) : curr > 0 ? 100 : 0;

  const convChange = pctChange(thisMonthConvs.length, lastMonthConvs.length);
  const leadsChange = pctChange(thisMonthLeads.length, lastMonthLeads.length);

  // Answer rate (conv where bot replied = messageCount >= 2)
  const answeredThis = thisMonthConvs.filter((c) => c.messageCount >= 2).length;
  const answerRate = thisMonthConvs.length > 0
    ? Math.round((answeredThis / thisMonthConvs.length) * 100)
    : 0;
  const escalatedRate = 100 - answerRate;
  const answeredLast = lastMonthConvs.filter((c) => c.messageCount >= 2).length;
  const lastAnswerRate = lastMonthConvs.length > 0
    ? Math.round((answeredLast / lastMonthConvs.length) * 100)
    : 0;
  const answerChange = lastMonthConvs.length > 0 ? answerRate - lastAnswerRate : 0;

  // Plan usage (STARTER = 1000 conv/month)
  const PLAN_LIMIT = 1000;
  const usageCount = thisMonthConvs.length;
  const usagePct = Math.min(100, Math.round((usageCount / PLAN_LIMIT) * 100));
  const remaining = Math.max(0, PLAN_LIMIT - usageCount);

  // Conversations handled outside typical working hours (evenings + weekends).
  // Heuristic, shift UTC by +2h to approximate Polish local time (CEST).
  const afterHoursConvs = thisMonthConvs.filter((c) => {
    const d = new Date(new Date(c.createdAt).getTime() + 2 * 60 * 60 * 1000);
    const day = d.getUTCDay();
    const hour = d.getUTCHours();
    return day === 0 || day === 6 || hour < 8 || hour >= 18;
  }).length;

  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;
  const contactedCount = leads.filter((l) => l.status === 'CONTACTED').length;

  // --- Chart data ---
  const { conversationsByDay, leadsByStatus } = buildChartData(conversations, leads);
  const data7d = buildAreaData(conversations, 7);
  const data30d = buildAreaData(conversations, 30);
  const data90d = buildAreaData(conversations, 90);

  // --- Recent items (last 3) ---
  const recentConvs = [...conversations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // --- Billing ---
  const showBillingCard = billing && !billing.hasSubscription;
  const trialDaysLeft = billing?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / 864e5))
    : 0;
  // Derive from date. DB isActive may still be true if daily cron hasn't fired.
  const trialExpired =
    !!showBillingCard &&
    !!billing?.trialEndsAt &&
    new Date(billing.trialEndsAt).getTime() <= Date.now();

  // --- Quick actions ---
  const quickActions = [
    {
      href: '/dashboard/embed',
      label: 'Zainstaluj widget',
      description: 'Skopiuj kod i wklej na swoją stronę',
      Icon: Code2,
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      href: '/dashboard/knowledge',
      label: 'Dodaj wiedzę',
      description: 'Naucz bota swoich usług i cen',
      Icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      href: '/dashboard/leads',
      label: 'Sprawdź leady',
      description: 'Zobacz klientów zainteresowanych usługami',
      Icon: Users,
      gradient: 'from-sky-500 to-cyan-600',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Przegląd" description="Statystyki Twojego bota w pigułce" />

      {/* Billing banner */}
      {showBillingCard && (trialExpired || trialDaysLeft <= 5) && (
        <div
          className={`rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap ${
            trialExpired
              ? 'bg-red-50 border border-red-200'
              : trialDaysLeft <= 2
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                trialExpired ? 'bg-red-100' : trialDaysLeft <= 2 ? 'bg-orange-100' : 'bg-amber-100'
              }`}
            >
              {trialExpired ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${trialExpired ? 'text-red-900' : 'text-amber-900'}`}>
                {trialExpired
                  ? 'Trial wygasł, bot jest nieaktywny'
                  : `Zostało ${trialDaysLeft} ${trialDaysLeft === 1 ? 'dzień' : 'dni'} trialu`}
              </p>
              <p className={`text-xs mt-0.5 ${trialExpired ? 'text-red-700' : 'text-amber-700'}`}>
                {trialExpired
                  ? 'Aktywuj plan aby bot zaczął odpowiadać klientom'
                  : 'Po zakończeniu trialu bot przestanie odpowiadać'}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className={`flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              trialExpired
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Aktywuj plan
          </Link>
        </div>
      )}

      {/* ── ROI summary ── */}
      {bots.length > 0 && (
        <RoiSummaryCard
          leadsThisMonth={thisMonthLeads.length}
          afterHoursConvs={afterHoursConvs}
        />
      )}

      {/* ── 1. Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Konwersacje */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">Konwersacje (ten mies.)</p>
            <StatBadge value={convChange} />
          </div>
          <p className="text-3xl font-bold text-slate-900">{thisMonthConvs.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            vs {lastMonthConvs.length} poprzedni mies.
          </p>
        </div>

        {/* Leady */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">Kontakty zebrane</p>
            <StatBadge value={leadsChange} />
          </div>
          <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {newLeadsCount} nowych, {contactedCount} skontaktowanych
          </p>
        </div>

        {/* Odpowiedzi bota */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">Odpowiedzi bota</p>
            <StatBadge value={answerChange} />
          </div>
          <p className="text-3xl font-bold text-slate-900">{answerRate}%</p>
          <p className="text-xs text-slate-400 mt-1">{escalatedRate}% eskalowanych do Ciebie</p>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">
              Plan: {usageCount} / {PLAN_LIMIT} rozmów
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{usagePct}%</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-amber-400' : 'bg-amber-400'
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{remaining} rozmów do końca mies.</p>
        </div>
      </div>

      {/* Knowledge base health */}
      {bots.length > 0 && knowledgeHealth && (
        <KnowledgeHealthCard health={knowledgeHealth} />
      )}

      {/* No bots empty state */}
      {bots.length === 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/60 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <p className="text-slate-800 font-semibold text-lg mb-1">Nie masz jeszcze bota</p>
          <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
            Utwórz swojego pierwszego bota i zacznij obsługiwać klientów 24/7
          </p>
          <OpenWizardButton />
        </div>
      )}

      {/* ── 2. Charts ── */}
      <ConversationsAreaChart data7d={data7d} data30d={data30d} data90d={data90d} />

      <OverviewCharts conversationsByDay={conversationsByDay} leadsByStatus={leadsByStatus} />

      {/* ── 3. Quick actions ── */}
      {bots.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Szybkie akcje</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-start gap-4"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm`}
                >
                  <action.Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0 self-center" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Recent activity ── */}
      {(recentConvs.length > 0 || recentLeads.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Ostatnie rozmowy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Ostatnie rozmowy</h3>
              <Link
                href="/dashboard/conversations"
                className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                Wszystkie →
              </Link>
            </div>
            {recentConvs.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Brak rozmów</p>
            ) : (
              <div className="space-y-1">
                {recentConvs.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/conversations/${conv.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#94a3b8' }}
                    >
                      G
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700">Gość</p>
                      <p className="text-xs text-slate-400 truncate">
                        {conv.firstMessage ?? '—'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-400">{formatTime(conv.createdAt)}</p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {conv.messageCount} wiad.
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Ostatnie kontakty */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Ostatnie kontakty</h3>
              <Link
                href="/dashboard/leads"
                className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                Wszystkie →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Brak kontaktów</p>
            ) : (
              <div className="space-y-1">
                {recentLeads.map((lead) => {
                  const status = LEAD_STATUS[lead.status] ?? LEAD_STATUS['NEW']!;
                  return (
                    <div
                      key={lead.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: avatarColor(lead.name) }}
                      >
                        {initials(lead.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700">{lead.name}</p>
                        <p className="text-xs text-slate-400">{maskPhone(lead.phone)}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-slate-400 mb-1">{formatTime(lead.createdAt)}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.cls}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- legacy chart data (kept for OverviewCharts) ----
function buildChartData(conversations: Conversation[], leads: Lead[]) {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' }),
    });
  }

  const conversationsByDay = days.map(({ key, label }) => {
    const dayConvs = conversations.filter((c) => c.createdAt.slice(0, 10) === key);
    return {
      day: label,
      rozmowy: dayConvs.length,
      wiadomosci: dayConvs.reduce((s, c) => s + c.messageCount, 0),
    };
  });

  const statusColors: Record<string, string> = {
    NEW: '#6366f1',
    CONTACTED: '#f59e0b',
    CONVERTED: '#10b981',
    LOST: '#94a3b8',
  };
  const statusLabels: Record<string, string> = {
    NEW: 'Nowi',
    CONTACTED: 'Skontaktowani',
    CONVERTED: 'Klienci',
    LOST: 'Utraceni',
  };
  const leadsByStatus = Object.entries(statusLabels).map(([key, name]) => ({
    name,
    value: leads.filter((l) => l.status === key).length,
    color: statusColors[key] ?? '#6366f1',
  }));

  return { conversationsByDay, leadsByStatus };
}
