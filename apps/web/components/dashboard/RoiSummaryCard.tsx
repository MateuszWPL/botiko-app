import { Moon, TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  /** Leads captured this calendar month. */
  leadsThisMonth: number;
  /** Conversations handled outside typical working hours (evenings/weekends). */
  afterHoursConvs: number;
}

// Value-of-a-customer range from the Botiko ROI narrative (1 klient = 150-300 zł).
const VALUE_PER_LEAD_MIN = 150;
const VALUE_PER_LEAD_MAX = 300;
const PLAN_COST = 99;

function fmt(n: number): string {
  return n.toLocaleString('pl-PL');
}

/**
 * Translates raw counters into the money/ROI language the buyer cares about:
 * leads captured become a złoty range, after-hours conversations become
 * "calls you would otherwise have missed".
 */
export function RoiSummaryCard({ leadsThisMonth, afterHoursConvs }: Props) {
  const valueMin = leadsThisMonth * VALUE_PER_LEAD_MIN;
  const valueMax = leadsThisMonth * VALUE_PER_LEAD_MAX;
  const hasValue = leadsThisMonth > 0;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 sm:p-6 shadow-sm text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-indigo-200" />
        <h2 className="text-sm font-semibold">Co bot zarobił dla Ciebie w tym miesiącu</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Estimated value of captured leads */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <p className="text-xs text-indigo-100 font-medium">Wartość złapanych leadów</p>
          </div>
          {hasValue ? (
            <>
              <p className="text-2xl font-bold">
                {fmt(valueMin)}-{fmt(valueMax)} zł
              </p>
              <p className="text-xs text-indigo-200 mt-1">
                {leadsThisMonth} {leadsThisMonth === 1 ? 'lead' : 'leadów'} × 150-300 zł na
                kliencie
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-indigo-200">—</p>
              <p className="text-xs text-indigo-200 mt-1">
                Bot jeszcze nie złapał leada w tym miesiącu
              </p>
            </>
          )}
        </div>

        {/* After-hours conversations */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-amber-300" />
            <p className="text-xs text-indigo-100 font-medium">Rozmowy po godzinach</p>
          </div>
          <p className="text-2xl font-bold">{afterHoursConvs}</p>
          <p className="text-xs text-indigo-200 mt-1">
            {afterHoursConvs > 0
              ? 'rozmów wieczorami i w weekendy, gdy normalnie nikt by nie odebrał'
              : 'na razie brak, bot czeka na klientów wieczorami i w weekendy'}
          </p>
        </div>
      </div>

      {hasValue && (
        <p className="text-xs text-indigo-200 mt-4">
          Bot kosztuje {PLAN_COST} zł/mies., wystarczy{' '}
          <span className="font-semibold text-white">jeden klient</span>, żeby się zwrócił.
        </p>
      )}
    </div>
  );
}
