'use client';

import { useState, useMemo, type ChangeEvent } from 'react';

const BOT_PRICE = 99;
const WEEKS_PER_MONTH = 4.33;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  minLabel: string;
  maxLabel: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-2xl font-bold text-slate-900 tabular-nums">{format(value)}</span>
      </div>
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-slate-200" />
        <div className="absolute left-0 top-0 h-2 rounded-full bg-brand" style={{ width: `${percent}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
          className="absolute left-0 top-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand"
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

export default function LostClientsCalculator() {
  const [missedPerWeek, setMissedPerWeek] = useState(10);
  const [clientValue, setClientValue] = useState(200);
  const [conversion, setConversion] = useState(20);

  const calc = useMemo(() => {
    const lostClientsMonth = missedPerWeek * WEEKS_PER_MONTH * (conversion / 100);
    const lostRevenueMonth = lostClientsMonth * clientValue;
    const lostRevenueYear = lostRevenueMonth * 12;
    const multipleOfBot = lostRevenueMonth / BOT_PRICE;
    return { lostClientsMonth, lostRevenueMonth, lostRevenueYear, multipleOfBot };
  }, [missedPerWeek, clientValue, conversion]);

  const pln = (v: number) => Math.round(v).toLocaleString('pl-PL');

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-brand/30 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Kalkulator</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ile klientów tracisz, bo nie odpisujesz na czas?
          </h2>
          <p className="mt-1 text-sm text-slate-600">Przesuń suwaki i sprawdź swoją stratę.</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          live
        </div>
      </div>

      <div className="space-y-6">
        <Slider
          label="Nieodebrane wiadomości / zapytania tygodniowo"
          value={missedPerWeek}
          min={1}
          max={50}
          step={1}
          onChange={setMissedPerWeek}
          format={(v) => v.toString()}
          minLabel="1"
          maxLabel="50"
        />
        <Slider
          label="Średnia wartość klienta"
          value={clientValue}
          min={50}
          max={1500}
          step={10}
          onChange={setClientValue}
          format={(v) => `${v.toLocaleString('pl-PL')} zł`}
          minLabel="50 zł"
          maxLabel="1 500 zł"
        />
        <Slider
          label="Ilu z nich kupiłoby, gdyby ktoś odpisał od razu"
          value={conversion}
          min={5}
          max={60}
          step={5}
          onChange={setConversion}
          format={(v) => `${v}%`}
          minLabel="5%"
          maxLabel="60%"
        />
      </div>

      <div className="relative mt-8 overflow-hidden rounded-xl bg-gradient-to-br from-brand-dark via-brand to-brand/90 p-6 text-white sm:p-8">
        <div className="relative space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Tracisz miesięcznie nawet
          </p>
          <p className="text-5xl font-bold tracking-tight sm:text-6xl">{pln(calc.lostRevenueMonth)} zł</p>
          <p className="text-sm text-white/85">
            ~{calc.lostClientsMonth.toFixed(1).replace('.', ',')} klientów / mies. · {pln(calc.lostRevenueYear)} zł rocznie
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <p className="text-xs font-medium text-slate-600">Koszt Botiko / mies.</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-slate-700">{BOT_PRICE} zł</p>
        </div>
        <div className="rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-center">
          <p className="text-xs font-medium text-slate-600">Twoja strata to</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-800">
            {calc.multipleOfBot.toFixed(0)}× koszt bota
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        * Szacunki orientacyjne. Zakładamy ~4,33 tygodnia w miesiącu. Rzeczywiste wyniki zależą od branży i ruchu.
      </p>
    </div>
  );
}
