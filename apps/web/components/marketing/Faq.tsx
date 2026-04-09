'use client';

import { useState, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const FAQS = [
  {
    q: 'Czy muszę umieć programować?',
    a: 'Absolutnie nie. Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel — wklejasz cennik, godziny pracy, FAQ. Na koniec dostajesz jeden fragment kodu HTML, który wklejasz na stronę.',
  },
  {
    q: 'Jak długo trwa wdrożenie?',
    a: 'Większość klientów ma gotowego bota w 15–20 minut. Wybierasz branżę, uzupełniasz dane o firmie, dostosowujesz kolory widgetu i gotowe. Nie potrzebujesz agencji ani programisty.',
  },
  {
    q: 'Czy bot zastąpi mnie lub moich pracowników?',
    a: 'Nie — bot uzupełnia Twoją pracę, nie zastępuje jej. Odpowiada na powtarzające się pytania, zbiera dane od klientów i odsyła do rezerwacji. Ty dostajesz gotowego leada zamiast tracić czas na telefony.',
  },
  {
    q: 'Co z RODO? Czy dane klientów są bezpieczne?',
    a: 'Tak. Dane przechowujemy na serwerach w UE. Imię i telefon klienta są szyfrowane (AES-256). Możemy podpisać umowę powierzenia danych (DPA). Botiko nie udostępnia danych osobom trzecim.',
  },
  {
    q: 'Czy mogę zmieniać treści bota po wdrożeniu?',
    a: 'Tak, w każdej chwili. Panel pozwala edytować cennik, FAQ, godziny pracy i styl komunikacji. Zmiany wchodzą w życie natychmiast — bez żadnego wdrożenia.',
  },
  {
    q: 'Co jeśli bot nie zna odpowiedzi?',
    a: 'Bot informuje klienta, że przekaże pytanie do Ciebie, i zapisuje dane kontaktowe (imię, telefon). Dostajesz powiadomienie — klient jest już "podgrzany" i czeka na Twój kontakt.',
  },
  {
    q: 'Czy mogę zrezygnować w każdej chwili?',
    a: 'Tak. Brak umowy długoterminowej — subskrypcja jest miesięczna i możesz anulować kiedy chcesz. Przy planie rocznym zwracamy proporcjonalną część opłaty za pozostałe miesiące.',
  },
  {
    q: 'Czy bot działa na Facebooku i Instagramie?',
    a: 'Widget embeddujemy na stronie WWW. Integracja z Meta Messengerem jest dostępna w planie Pro i wyższych. Instagram Direct — w roadmapie na Q3 2025.',
  },
];

function FaqItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-brand/20 transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-text text-sm pr-4">{faq.q}</span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 transition-all duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', color: isOpen ? '#6366F1' : undefined, borderColor: isOpen ? '#6366F1' : undefined }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {/* Animated content using max-height */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-350 ease-in-out"
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 500}px` : '0px' }}
      >
        <div className="px-6 pb-5">
          <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
        </ScrollReveal>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <FaqItem
                faq={faq}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Nie znalazłeś odpowiedzi?{' '}
            <a href="mailto:hello@botiko.pl" className="text-brand font-semibold hover:underline cursor-pointer">
              Napisz do nas →
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
