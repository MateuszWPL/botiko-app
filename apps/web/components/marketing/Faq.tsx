'use client';

import { useState, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const FAQS = [
  {
    q: 'Czy muszę umieć programować?',
    a: 'Absolutnie nie. Botiko nie wymaga żadnej wiedzy technicznej. Konfigurujesz bota przez prosty panel — wklejasz cennik, godziny pracy, FAQ. Na koniec dostajesz jeden fragment kodu HTML, który wklejasz na stronę.',
  },
  {
    q: 'Czy Botiko działa na WordPress?',
    a: 'Tak — Botiko jest natywnie zoptymalizowane pod WordPress (~93% polskiego rynku CMS). Instalacja przez darmową wtyczkę WPCode zajmuje 5 minut, bez edycji motywu ani pomocy programisty. Pracujemy też nad dedykowaną wtyczką Botiko do katalogu WordPress.org — zapisz się na listę oczekujących: kontakt@botiko.pl. Skrypt działa również na każdej innej stronie WWW.',
  },
  {
    q: 'Jak długo trwa wdrożenie?',
    a: 'W wielu przypadkach da się uruchomić bota w 15–20 minut: wybierasz branżę, uzupełniasz dane o firmie, wklejasz cennik/FAQ i gotowe. Nie potrzebujesz agencji ani programisty.',
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
    q: 'Czy bot zastąpi mnie lub moich pracowników?',
    a: 'Nie — bot uzupełnia Twoją pracę, nie zastępuje jej. Odpowiada na powtarzające się pytania, zbiera dane od klientów i odsyła do rezerwacji. Ty dostajesz gotowego leada zamiast tracić czas na telefony.',
  },
  {
    q: 'Co jeśli bot nie zna odpowiedzi?',
    a: 'Bot informuje klienta, że przekaże pytanie do Ciebie, i zapisuje dane kontaktowe (imię, telefon). Dostajesz powiadomienie — klient jest już "podgrzany" i czeka na Twój kontakt.',
  },
  {
    q: 'Czy mogę zrezygnować w każdej chwili?',
    a: 'Tak. Brak umowy długoterminowej — subskrypcja jest miesięczna i możesz anulować kiedy chcesz. Opłata za bieżący miesiąc nie jest zwracana, ale dostęp pozostaje aktywny do końca okresu rozliczeniowego.',
  },
  {
    q: 'Czy bot działa na Facebooku i Instagramie?',
    a: 'Aktualnie widget embeddujemy na stronie WWW klienta. Integracja z Meta Messengerem i Instagram Direct jest w roadmapie — daj znać że jesteś zainteresowany przez kontakt@botiko.pl.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200"
      style={{
        background: isOpen ? '#FAFBFF' : '#fff',
        borderColor: isOpen ? 'rgba(99,102,241,0.25)' : '#F1F5F9',
        boxShadow: isOpen ? '0 2px 16px rgba(99,102,241,0.08)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="flex-1 font-semibold text-text text-sm pr-2">{faq.q}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300"
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            borderColor: isOpen ? '#6366F1' : '#E2E8F0',
            color: isOpen ? '#6366F1' : '#94A3B8',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 400}px` : '0px' }}
      >
        <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  const left = FAQS.slice(0, 4);
  const right = FAQS.slice(4);

  return (
    <section id="faq" className="py-24 bg-bg">
      {/* JSON-LD FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Najczęstsze pytania</h2>
          <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
            Wszystko co musisz wiedzieć przed uruchomieniem bota.
          </p>
        </ScrollReveal>

        {/* 2-column grid */}
        <div className="grid lg:grid-cols-2 gap-3">
          <ScrollReveal className="flex flex-col gap-3">
            {left.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </ScrollReveal>

          <ScrollReveal delay={2} className="flex flex-col gap-3">
            {right.map((faq, i) => (
              <FaqItem
                key={i + 4}
                faq={faq}
                isOpen={open === i + 4}
                onToggle={() => setOpen(open === i + 4 ? null : i + 4)}
              />
            ))}
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Nie znalazłeś odpowiedzi?{' '}
            <a href="mailto:kontakt@botiko.pl" className="text-brand font-semibold hover:underline cursor-pointer">
              Napisz do nas →
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
