'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import { cn } from './cn';

type Industry = 'beauty' | 'auto' | 'food' | 'health' | 'other';

interface IndustryConfig {
  defaultClients: number;
  defaultValue: number;
  clientLabel: string;
  visitLabel: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

const industryConfigs: Record<Industry, IndustryConfig> = {
  beauty: {
    defaultClients: 6,
    defaultValue: 150,
    clientLabel: 'Nowych klientek przez bota / mies.',
    visitLabel: 'Średnia wartość wizyty',
    accent: 'text-beauty',
    accentBg: 'bg-beauty',
    accentBorder: 'border-beauty/30',
  },
  auto: {
    defaultClients: 5,
    defaultValue: 350,
    clientLabel: 'Nowych klientów / mies.',
    visitLabel: 'Średnia wartość zlecenia',
    accent: 'text-auto',
    accentBg: 'bg-auto',
    accentBorder: 'border-auto/30',
  },
  food: {
    defaultClients: 8,
    defaultValue: 180,
    clientLabel: 'Dodatkowych rezerwacji / mies.',
    visitLabel: 'Średni rachunek stolika',
    accent: 'text-food',
    accentBg: 'bg-food',
    accentBorder: 'border-food/30',
  },
  health: {
    defaultClients: 4,
    defaultValue: 800,
    clientLabel: 'Nowych pacjentów / mies.',
    visitLabel: 'Średnia wartość cyklu (6–8 wizyt)',
    accent: 'text-health',
    accentBg: 'bg-health',
    accentBorder: 'border-health/30',
  },
  other: {
    defaultClients: 5,
    defaultValue: 200,
    clientLabel: 'Nowych klientów / mies.',
    visitLabel: 'Średnia wartość transakcji',
    accent: 'text-brand',
    accentBg: 'bg-brand',
    accentBorder: 'border-brand/30',
  },
};

interface ROICalculatorProps {
  industry?: Industry;
  defaults?: { clientsPerMonth?: number; averageVisitValue?: number };
  botPrice?: number;
  city?: string;
  className?: string;
}

const BOT_PRICE_DEFAULT = 99;

export function ROICalculator({
  industry = 'other',
  defaults,
  botPrice = BOT_PRICE_DEFAULT,
  city,
  className,
}: ROICalculatorProps): JSX.Element {
  const config = industryConfigs[industry];

  const [clients, setClients] = useState(defaults?.clientsPerMonth ?? config.defaultClients);
  const [visitValue, setVisitValue] = useState(defaults?.averageVisitValue ?? config.defaultValue);

  const calc = useMemo(() => {
    const revenue = clients * visitValue;
    const profit = revenue - botPrice;
    const roiMultiplier = revenue / botPrice;
    return { revenue, profit, roiMultiplier };
  }, [clients, visitValue, botPrice]);

  return (
    <div
      className={cn(
        'my-10 overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg sm:p-8',
        config.accentBorder,
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={cn('text-xs font-semibold uppercase tracking-wider', config.accent)}>
            Kalkulator ROI{city ? ` (${city})` : ''}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Czy {botPrice} zł / mies. się zwróci?
          </h3>
          <p className="mt-1 text-sm text-slate-600">Przesuń suwaki, sprawdź własny zwrot</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          live
        </div>
      </div>

      <div className="space-y-6">
        <Slider
          label={config.clientLabel}
          value={clients}
          min={1}
          max={20}
          step={1}
          onChange={setClients}
          unit=""
          formatValue={(v) => v.toString()}
          minLabel="1"
          maxLabel="20"
          accent={config.accentBg}
        />
        <Slider
          label={config.visitLabel}
          value={visitValue}
          min={50}
          max={1500}
          step={10}
          onChange={setVisitValue}
          unit="zł"
          formatValue={(v) => v.toLocaleString('pl-PL')}
          minLabel="50 zł"
          maxLabel="1 500 zł"
          accent={config.accentBg}
        />
      </div>

      <div className="relative mt-8 overflow-hidden rounded-xl bg-gradient-to-br from-brand-dark via-brand to-brand/90 p-6 text-white sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Zwrot z inwestycji</p>
          <p className="text-5xl font-bold tracking-tight sm:text-6xl">
            {calc.roiMultiplier.toFixed(1).replace('.', ',')}×
          </p>
          <p className="text-sm text-white/85">w pierwszym miesiącu</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ResultCard label="Przychód / mies." value={`${calc.revenue.toLocaleString('pl-PL')} zł`} tone="positive" />
        <ResultCard label="Koszt Botiko / mies." value={`${botPrice} zł`} tone="neutral" />
        <ResultCard label="Zysk netto / mies." value={`+${calc.profit.toLocaleString('pl-PL')} zł`} tone="highlight" />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        * Szacunki orientacyjne. Rzeczywiste wyniki zależą od branży, lokalizacji i ruchu na stronie.
      </p>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit: string;
  formatValue: (v: number) => string;
  minLabel: string;
  maxLabel: string;
  accent: string;
}

function Slider({ label, value, min, max, step, onChange, unit, formatValue, minLabel, maxLabel, accent }: SliderProps): JSX.Element {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-2xl font-bold text-slate-900 tabular-nums">
          {formatValue(value)}
          {unit ? <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span> : null}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-slate-200" />
        <div
          className={cn('absolute left-0 top-0 h-2 rounded-full', accent)}
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
          className={cn(
            'absolute left-0 top-0 h-2 w-full cursor-pointer appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110',
            accent.replace('bg-', '[&::-webkit-slider-thumb]:bg-'),
            '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md',
            accent.replace('bg-', '[&::-moz-range-thumb]:bg-')
          )}
          aria-label={label}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-slate-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, tone }: { label: string; value: string; tone: 'positive' | 'neutral' | 'highlight' }): JSX.Element {
  const styles = { positive: 'bg-emerald-50 border-emerald-200', neutral: 'bg-slate-50 border-slate-200', highlight: 'bg-emerald-100 border-emerald-300' }[tone];
  const valueColor = { positive: 'text-emerald-700', neutral: 'text-slate-700', highlight: 'text-emerald-800' }[tone];

  return (
    <div className={cn('rounded-xl border px-4 py-3 text-center', styles)}>
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className={cn('mt-1 text-xl font-bold tabular-nums', valueColor)}>{value}</p>
    </div>
  );
}
