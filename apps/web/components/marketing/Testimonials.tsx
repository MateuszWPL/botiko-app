'use client';

import ScrollReveal from './ScrollReveal';

type Scenario = {
  situation: string;
  customer: string;
  bot: string;
  outcome: string;
  industry: string;
  color: string;
  bg: string;
};

const SCENARIOS: Scenario[] = [
  {
    situation: 'Piątek, 22:15 — salon zamknięty od 2 godzin.',
    customer: 'Ile kosztuje manicure hybrydowy i czy macie jeszcze wolne w sobotę?',
    bot: 'Manicure hybrydowy to 90 zł, czas ok. 75 min. W soboty pracujemy 9:00–17:00. Zostaw imię i telefon — rano sprawdzimy wolne godziny i oddzwonimy z propozycją.',
    outcome: 'Lead zebrany o 22:17. Rano oddzwaniasz do klientki, która czeka.',
    industry: 'Salon beauty',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    situation: 'Wtorek, 14:00 — gabinet fizjo, terapeuta na zabiegu.',
    customer: 'Czy przyjmujecie bez skierowania i ile to kosztuje?',
    bot: 'Tak, bez skierowania. Pierwsza konsultacja 60 min to 150 zł. Zostaw imię, telefon i krótki opis problemu — terapeuta oddzwoni po zabiegu.',
    outcome: 'Pacjent opisał problem. Terapeuta oddzwonił z gotowym kontekstem.',
    industry: 'Gabinet / SPA',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    situation: 'Sobota, 19:45 — restauracja w szczycie obsługi.',
    customer: 'Czy są dania bez glutenu w dzisiejszym menu?',
    bot: 'Tak — risotto z warzywami i grillowany łosoś są bez glutenu. Jeśli chcesz rezerwację stolika, podaj imię, liczbę osób i godzinę — obsługa oddzwoni z potwierdzeniem.',
    outcome: 'Kelnerzy nie przerywają obsługi, gość dostaje konkretną odpowiedź.',
    industry: 'Restauracja',
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    situation: 'Niedziela wieczorem — warsztat zamknięty.',
    customer: 'Ile kosztuje wymiana rozrządu w Passacie B6 2.0 TDI?',
    bot: 'Wymiana rozrządu w B6 2.0 TDI to orientacyjnie 1200–1600 zł (robocizna + części). Zostaw numer i rok produkcji — w poniedziałek rano zadzwonimy z dokładną wyceną i wolnym terminem.',
    outcome: 'Klient zaczął tydzień z gotową ofertą zamiast „oddzwonimy w tygodniu”.',
    industry: 'Warsztat',
    color: '#64748B',
    bg: '#F1F5F9',
  },
];

// 3× duplication + translateX(-33.33%) in globals.css → seamless loop wider than viewport
const ROW1 = [...SCENARIOS, ...SCENARIOS, ...SCENARIOS];
const ROW2_BASE = [...SCENARIOS.slice(2), ...SCENARIOS.slice(0, 2)];
const ROW2 = [...ROW2_BASE, ...ROW2_BASE, ...ROW2_BASE];

function ScenarioCard({ s }: { s: Scenario }) {
  return (
    <div
      className="flex-shrink-0 w-[340px] flex flex-col rounded-2xl p-5 mx-3"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Industry badge + situation */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
          style={{ background: `${s.color}25`, color: s.color, border: `1px solid ${s.color}40` }}
        >
          {s.industry}
        </span>
        <span className="text-[11px] text-indigo-300 leading-snug">{s.situation}</span>
      </div>

      {/* Chat messages */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        {/* Customer */}
        <div className="flex justify-end">
          <div
            className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed text-white"
            style={{ background: s.color, borderBottomRightRadius: 4 }}
          >
            {s.customer}
          </div>
        </div>
        {/* Bot */}
        <div className="flex justify-start">
          <div
            className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed text-slate-100"
            style={{ background: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4 }}
          >
            {s.bot}
          </div>
        </div>
      </div>

      {/* Outcome */}
      <div
        className="pt-3 flex items-start gap-2 text-[11px] leading-relaxed text-emerald-300"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{s.outcome}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338CA 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-14">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#a5b4fc' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
            4 scenariusze · nie referencje
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Typowe sytuacje, w których
            <br />
            <span style={{ color: '#a5b4fc' }}>Botiko ratuje klienta</span>
          </h2>
          <p className="text-indigo-200 text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
            Nie mamy jeszcze cytatów od klientów (jesteśmy na etapie pilota).
            Zamiast tego pokazujemy realne scenariusze z firm usługowych — bot odpowiada z Twojej bazy wiedzy i zbiera kontakt, Ty oddzwaniasz.
          </p>
        </ScrollReveal>
      </div>

      {/* Marquee rows */}
      <div
        className="flex flex-col gap-5 mb-16"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div
          className="flex marquee-left"
          style={{ animationDuration: '60s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {ROW1.map((s, i) => <ScenarioCard key={i} s={s} />)}
        </div>

        <div
          className="flex marquee-right"
          style={{ animationDuration: '66s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {ROW2.map((s, i) => <ScenarioCard key={i} s={s} />)}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="grid sm:grid-cols-3 gap-6 text-center pt-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {[
            { value: '14 dni', label: 'darmowych testów bez karty' },
            { value: '24/7', label: 'bot odpowiada także po godzinach' },
            { value: '~ 15 min', label: 'średnia konfiguracja bota' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-indigo-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
