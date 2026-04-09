'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const FAQS = [
  {
    q: 'Czy muszę umieć programować?',
    a: 'Absolutnie nie. Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel — wklejasz cennik, godziny pracy, FAQ. Na koniec dostajesz jeden fragment kodu HTML, który wklejasz na stronę (lub my pomożemy).',
  },
  {
    q: 'Jak długo trwa wdrożenie?',
    a: 'Większość klientów ma gotowego bota w 15–20 minut. Wybierasz branżę, uzupełniasz dane o firmie, dostosowujesz kolory widgetu do swojej strony i gotowe. Nie potrzebujesz agencji.',
  },
  {
    q: 'Czy bot zastąpi mnie lub moich pracowników?',
    a: 'Nie — bot uzupełnia Twoją pracę, nie zastępuje jej. Odpowiada na powtarzające się pytania (cennik, godziny, dostępność), zbiera dane od klientów i odsyła do rezerwacji. Ty dostajesz gotowego leada, zamiast tracić czas na telefony.',
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
    a: 'Bot informuje klienta, że przekaże pytanie do Ciebie, i zapisuje dane kontaktowe (imię, telefon). Dostajesz powiadomienie — klientka jest już "podgrzana" i czeka na Twój kontakt.',
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

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text">
            Najczęstsze pytania
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} delay={(Math.min(i % 4 + 1, 4)) as 1 | 2 | 3 | 4}>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-text text-sm pr-4">{faq.q}</span>
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform text-brand"
                    style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>

                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Nie znalazłeś odpowiedzi?{' '}
            <a href="mailto:hello@botiko.pl" className="text-brand font-semibold hover:underline">
              Napisz do nas →
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
