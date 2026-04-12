import Link from 'next/link';
import { Bot, Users, MessageSquare, Mail, ArrowRight, Code2, BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { fetchWithAuth } from '../../../lib/api';
import { PageHeader } from '../../../components/ui/PageHeader';
import { OverviewCharts } from '../../../components/dashboard/OverviewCharts';

interface Lead {
  id: string;
  status: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  messageCount: number;
  createdAt: string;
}

interface BotData {
  id: string;
  name: string;
  isActive: boolean;
}

async function getStats() {
  try {
    const [leads, conversations, bots] = await Promise.all([
      fetchWithAuth<Lead[]>('/api/v1/leads'),
      fetchWithAuth<Conversation[]>('/api/v1/conversations'),
      fetchWithAuth<BotData[]>('/api/v1/bot'),
    ]);
    return { leads, conversations, bots };
  } catch {
    return { leads: [], conversations: [], bots: [] };
  }
}

function buildChartData(conversations: Conversation[], leads: Lead[]) {
  // Last 7 days labels
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
    color: statusColors[key],
  }));

  return { conversationsByDay, leadsByStatus };
}

export default async function OverviewPage() {
  const { leads, conversations, bots } = await getStats();
  const { conversationsByDay, leadsByStatus } = buildChartData(conversations, leads);

  const newLeads = leads.filter((l) => l.status === 'NEW').length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
  const activeBots = bots.filter((b) => b.isActive).length;

  // Trend: today vs yesterday
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const todayConvs = conversations.filter((c) => c.createdAt.slice(0, 10) === today).length;
  const yestConvs = conversations.filter((c) => c.createdAt.slice(0, 10) === yesterday).length;
  const todayLeads = leads.filter((l) => l.createdAt.slice(0, 10) === today).length;
  const yestLeads = leads.filter((l) => l.createdAt.slice(0, 10) === yesterday).length;
  const todayMsgs = conversations
    .filter((c) => c.createdAt.slice(0, 10) === today)
    .reduce((s, c) => s + c.messageCount, 0);
  const yestMsgs = conversations
    .filter((c) => c.createdAt.slice(0, 10) === yesterday)
    .reduce((s, c) => s + c.messageCount, 0);

  type Trend = 'up' | 'down' | 'neutral';
  const trend = (a: number, b: number): Trend =>
    a > b ? 'up' : a < b ? 'down' : 'neutral';

  const stats = [
    {
      label: 'Aktywne boty',
      value: activeBots,
      Icon: Bot,
      gradient: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-200/60',
      trend: 'neutral' as const,
    },
    {
      label: 'Nowe leady',
      value: newLeads,
      Icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-200/60',
      trend: trend(todayLeads, yestLeads),
    },
    {
      label: 'Rozmowy',
      value: conversations.length,
      Icon: MessageSquare,
      gradient: 'from-sky-500 to-cyan-600',
      shadow: 'shadow-sky-200/60',
      trend: trend(todayConvs, yestConvs),
    },
    {
      label: 'Wiadomości',
      value: totalMessages,
      Icon: Mail,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-200/60',
      trend: trend(todayMsgs, yestMsgs),
    },
  ];

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
    <div>
      <PageHeader
        title="Przegląd"
        description="Statystyki Twojego bota w pigułce"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} shadow-md ${s.shadow}`}>
                <s.Icon className="w-5 h-5 text-white" />
              </div>
              {s.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
              {s.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {s.trend === 'neutral' && <Minus className="w-4 h-4 text-slate-300" />}
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {bots.length === 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/60 rounded-2xl p-8 text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <p className="text-slate-800 font-semibold text-lg mb-1">Nie masz jeszcze bota</p>
          <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
            Utwórz swojego pierwszego bota i zacznij obsługiwać klientów 24/7
          </p>
          <Link
            href="/onboarding/step-1"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
          >
            Utwórz bota
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Szybkie akcje</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-start gap-4"
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

      <OverviewCharts
        conversationsByDay={conversationsByDay}
        leadsByStatus={leadsByStatus}
      />
    </div>
  );
}
