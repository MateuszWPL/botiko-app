import Link from 'next/link';
import { BookOpen, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export interface KnowledgeHealth {
  totalAnswers: number;
  fallbackAnswers: number;
  fallbackRate: number;
  chunkCount: number;
}

interface Props {
  health: KnowledgeHealth;
}

/**
 * Knowledge base health indicator. Score = 100 - fallbackRate, so the more
 * often the bot hits "I don't know", the lower the bar. Surfaces a direct
 * call-to-action when the base is empty or too sparse to answer well.
 */
export function KnowledgeHealthCard({ health }: Props) {
  const { totalAnswers, fallbackAnswers, fallbackRate, chunkCount } = health;

  const hasData = totalAnswers > 0;
  const score = hasData ? 100 - fallbackRate : chunkCount > 0 ? 100 : 0;

  // Tier: good ≥ 70, warn 40-69, bad < 40
  const tier = chunkCount === 0 ? 'empty' : score >= 70 ? 'good' : score >= 40 ? 'warn' : 'bad';

  const barColor =
    tier === 'good'
      ? 'bg-emerald-500'
      : tier === 'warn'
        ? 'bg-amber-400'
        : 'bg-red-500';

  const showAlert = tier === 'empty' || tier === 'bad' || (tier === 'warn' && hasData);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Zdrowie bazy wiedzy</p>
            <p className="text-xs text-slate-400">
              {hasData
                ? `${totalAnswers} odpowiedzi w ostatnich 30 dniach`
                : `${chunkCount} ${chunkCount === 1 ? 'element' : 'elementów'} wiedzy`}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            tier === 'good'
              ? 'bg-emerald-50 text-emerald-600'
              : tier === 'warn'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-red-50 text-red-600'
          }`}
        >
          {tier === 'empty' ? 'Pusta' : `${score}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.max(score, 4)}%` }}
        />
      </div>

      {hasData && (
        <p className="text-xs text-slate-400 mt-2">
          {fallbackAnswers > 0
            ? `Bot ${fallbackAnswers} ${fallbackAnswers === 1 ? 'raz nie znalazł' : 'razy nie znalazł'} odpowiedzi w bazie (${fallbackRate}%)`
            : 'Bot odpowiedział na każde pytanie z bazy wiedzy'}
        </p>
      )}

      {showAlert ? (
        <Link
          href="/dashboard/knowledge"
          className="group mt-3 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100/70 transition-colors"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-amber-900">
              {tier === 'empty'
                ? 'Baza wiedzy jest pusta'
                : 'Baza wiedzy jest zbyt uboga'}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {tier === 'empty'
                ? 'Bot nie ma z czego odpowiadać, dodaj usługi, ceny i godziny pracy.'
                : 'Bot za często nie zna odpowiedzi i odsyła klientów do Ciebie. Uzupełnij wiedzę, żeby obsługiwał więcej pytań sam.'}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0 self-center" />
        </Link>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Baza wiedzy działa dobrze, bot radzi sobie z większością pytań.</span>
        </div>
      )}
    </div>
  );
}
