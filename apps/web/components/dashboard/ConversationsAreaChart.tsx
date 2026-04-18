'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Period = '7d' | '30d' | '90d';

export interface ChartPoint {
  day: string;
  konwersacje: number;
}

interface Props {
  data7d: ChartPoint[];
  data30d: ChartPoint[];
  data90d: ChartPoint[];
}

const PERIOD_DAYS: Record<Period, string> = {
  '7d': '7 dni',
  '30d': '30 dni',
  '90d': '90 dni',
};

export function ConversationsAreaChart({ data7d, data30d, data90d }: Props) {
  const [period, setPeriod] = useState<Period>('30d');

  const data = period === '7d' ? data7d : period === '30d' ? data30d : data90d;
  const hasData = data.some((d) => d.konwersacje > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Konwersacje dziennie</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ostatnie {PERIOD_DAYS[period]}</p>
        </div>
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                period === p
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                fontSize: 12,
                fontFamily: 'inherit',
              }}
              labelStyle={{ color: '#64748b', fontWeight: 600 }}
              formatter={(value) => [value ?? 0, 'Konwersacje']}
            />
            <Area
              type="monotone"
              dataKey="konwersacje"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={{ fill: '#fff', stroke: '#6366F1', strokeWidth: 2, r: 3 }}
              activeDot={{ fill: '#6366F1', stroke: '#fff', strokeWidth: 2, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-60">
          <p className="text-sm text-slate-400">Brak rozmów w tym okresie</p>
        </div>
      )}
    </div>
  );
}
