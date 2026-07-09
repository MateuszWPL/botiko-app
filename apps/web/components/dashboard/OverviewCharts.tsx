'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DayData {
  day: string;
  rozmowy: number;
  wiadomosci: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  conversationsByDay: DayData[];
  leadsByStatus: StatusData[];
}

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  labelStyle: { color: '#64748b', fontWeight: 600 },
  cursor: { fill: '#f1f5f9' },
};

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export function OverviewCharts({ conversationsByDay, leadsByStatus }: Props) {
  const hasConversations = conversationsByDay.some((d) => d.rozmowy > 0);
  const hasLeads = leadsByStatus.some((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Bar chart, conversations per day */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Aktywność (ostatnie 7 dni)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Rozmowy i wiadomości dziennie</p>
        </div>
        {hasConversations ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={conversationsByDay} barGap={4}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={28}
                allowDecimals={false}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => [value ?? 0]}
              />
              <Bar dataKey="rozmowy" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="wiadomosci" fill="#a5b4fc" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label="Brak rozmów w ostatnich 7 dniach" />
        )}
      </div>

      {/* Pie chart, leads by status */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Leady wg statusu</h3>
          <p className="text-xs text-slate-400 mt-0.5">Podział aktualnych leadów</p>
        </div>
        {hasLeads ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={leadsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE.contentStyle}
                formatter={(value) => [value ?? 0]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label="Brak leadów do wyświetlenia" />
        )}
      </div>
    </div>
  );
}
