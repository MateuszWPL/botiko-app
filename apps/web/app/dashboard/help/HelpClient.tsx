'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Mail,
  ChevronDown,
  Copy,
  Check,
  Rocket,
  Zap,
  BookOpen,
  Code2,
  MessagesSquare,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const SUPPORT_EMAIL = 'pomoc@botiko.pl';
const SUPPORT_SUBJECT = 'Botiko — potrzebuję pomocy';

// ── FAQ content ──
interface FaqItem {
  q: string;
  a: string;
}

const FAQ: FaqItem[] = [
  {
    q: 'Jak zainstalować bota na swojej stronie?',
    a: 'Przejdź do zakładki Instalacja, skopiuj kod widgetu i wklej go przed zamykającym tagiem </body> swojej strony. Widget działa na WordPress, Shopify, Wix, Squarespace i każdej stronie HTML.',
  },
  {
    q: 'Czy bot działa po polsku?',
    a: 'Tak — bot jest w pełni spolszczony. Wszystkie teksty, formularze i odpowiedzi są dostosowane do języka polskiego. Pracuje też dobrze na dialektach i skrótach.',
  },
  {
    q: 'Co jeśli przekroczę 1000 rozmów w miesiącu?',
    a: 'W planie Starter masz 1000 rozmów miesięcznie. Po przekroczeniu limitu skontaktuj się z nami — zaproponujemy indywidualną wycenę, nie blokujemy bota z dnia na dzień.',
  },
  {
    q: 'Czy mogę zintegrować z Booksy / Fresha / Calendly?',
    a: 'Tak — dodaj link do rezerwacji w Bazie wiedzy albo w Ustawieniach bota. Gdy klient pyta o termin, bot poda link i przekieruje do Twojego narzędzia rezerwacji.',
  },
  {
    q: 'Jak eksportować leady do CSV?',
    a: 'W zakładce Leady kliknij przycisk "Eksportuj" (po prawej stronie nad tabelą). CSV zawiera imię, telefon, wiadomość, status i datę kontaktu — gotowe do wklejenia w Excel lub CRM.',
  },
  {
    q: 'Jak zablokować spam i niechciane wiadomości?',
    a: 'Bot ma wbudowaną ochronę: filtruje script injection, prompt injection, spam, wulgaryzmy i gibberish. Możesz też ograniczyć domeny na których działa widget w Ustawieniach.',
  },
  {
    q: 'Czy moje dane są bezpieczne?',
    a: 'Tak. Numery telefonów i imiona leadów są szyfrowane AES-256-GCM. Dane hostowane są w Unii Europejskiej. Zgodnie z RODO masz prawo do usunięcia wszystkich danych jednym kliknięciem w Ustawieniach.',
  },
  {
    q: 'Kiedy zobaczę pierwsze leady?',
    a: 'Zazwyczaj w ciągu 2-3 dni od instalacji widgetu, jeśli strona ma ruch. Bot zacznie od razu, ale leady pojawiają się wtedy gdy klienci zostawią kontakt — warto uzupełnić Bazę wiedzy aby bot lepiej odpowiadał.',
  },
];

// ── Quick tips ──
interface Tip {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  gradient: string;
}

const TIPS: Tip[] = [
  {
    icon: BookOpen,
    title: 'Dodaj cennik do Bazy wiedzy',
    body: 'Bot lepiej konwertuje gdy zna Twoje ceny. Dodaj 5-10 wpisów z cenami, ofertami i procedurami.',
    href: '/dashboard/knowledge',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Code2,
    title: 'Zainstaluj widget na stronie',
    body: 'Bez widgetu bot nie obsłuży klientów. Skopiuj kod i wklej go na stronę — zajmie 2 minuty.',
    href: '/dashboard/embed',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: MessagesSquare,
    title: 'Ustaw powitanie i sugerowane pytania',
    body: 'Personalizuj pierwsze wrażenie. Klienci chętniej piszą gdy widzą pytania na start.',
    href: '/dashboard/settings',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'Ogranicz bota do swoich domen',
    body: 'Zabezpieczenie — bot będzie działał tylko na wskazanych domenach, nikt nie ukradnie konfiguracji.',
    href: '/dashboard/settings',
    gradient: 'from-slate-500 to-slate-700',
  },
];

function AccordionItem({ q, a, open, onToggle }: FaqItem & { open: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-indigo-500' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-200 ease-out ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function HelpClient() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      toast.success('Email skopiowany');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Nie udało się skopiować');
    }
  };

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUPPORT_SUBJECT)}`;

  return (
    <div className="space-y-8">
      {/* ── Hero: Contact card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 p-6 md:p-8">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-indigo-100 text-[11px] font-semibold text-indigo-600 mb-3">
              <Sparkles className="w-3 h-3" />
              Wsparcie 1:1
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1.5">
              Napisz do nas na <span className="text-indigo-600">{SUPPORT_EMAIL}</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-lg">
              Odpowiadamy w ciągu 24 godzin w dni robocze. Im więcej kontekstu nam dasz, tym szybciej
              rozwiążemy Twój problem — screenshoty bardzo pomagają.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-5">
              <a
                href={mailto}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Napisz wiadomość
              </a>
              <button
                onClick={() => void copyEmail()}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Skopiowano' : 'Skopiuj email'}
              </button>
            </div>

            <div className="flex items-center gap-4 mt-5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Pon-Pt 9:00-17:00
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Odpowiedź w 24h
              </span>
            </div>
          </div>

          {/* Right decorative icon */}
          <div className="hidden md:flex flex-shrink-0 w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center shadow-xl shadow-indigo-200/50">
            <Mail className="w-14 h-14 text-white" />
          </div>
        </div>
      </div>

      {/* ── Quick tips ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-500" />
              Pierwsze kroki
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Najszybsze sposoby na maksymalny efekt bota</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <Link
                key={tip.href + tip.title}
                href={tip.href}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {tip.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.body}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-indigo-500" />
            Najczęściej zadawane pytania
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kliknij pytanie, aby rozwinąć odpowiedź. Nie znalazłeś? Napisz do nas.
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQ.map((item, idx) => (
            <AccordionItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Nie znalazłeś odpowiedzi?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Napisz bezpośrednio — odpowiemy najszybciej jak się da.
            </p>
          </div>
        </div>
        <a
          href={mailto}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Mail className="w-4 h-4" />
          Skontaktuj się
        </a>
      </div>
    </div>
  );
}
