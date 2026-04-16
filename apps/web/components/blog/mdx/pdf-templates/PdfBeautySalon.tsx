/** Szablon PDF: Salon Beauty — kopiuj-wklej baza wiedzy */
export function PdfBeautySalon({ title }: { title: string }) {
  return (
    <div style={{ minHeight: '1123px', backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* HEADER */}
      <div style={{ background: '#4f46e5', padding: '32px', color: '#ffffff' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
          BOTIKO.PL › BAZA WIEDZY
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, lineHeight: 1.25, color: '#ffffff' }}>{title}</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#e0e7ff' }}>Gotowe wpisy skupione na zbieraniu leadów przez bota. Bez fikcyjnych kalendarzy.</p>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '40px', backgroundColor: '#f8fafc' }}>

        {/* Prompt główny */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e7ff', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#eef2ff', borderBottom: '1px solid #e0e7ff', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🤖</span>
            <strong style={{ fontSize: '15px', color: '#312e81' }}>1. Instrukcja Systemowa (Główny Prompt)</strong>
          </div>
          <div style={{ padding: '24px', fontSize: '14px', lineHeight: 1.7, color: '#334155' }}>
            <p style={{ margin: '0 0 12px 0', fontStyle: 'italic', color: '#64748b', fontSize: '12px' }}>Wklej w: Konfiguracja › Zachowanie asystenta</p>
            <div style={{ borderLeft: '4px solid #6366f1', paddingLeft: '16px' }}>
              Jesteś wirtualną recepcjonistką w salonie beauty <strong style={{ color: '#000' }}>[NAZWA_SALONU]</strong> w <strong style={{ color: '#000' }}>[MIASTO, ULICA]</strong>. Odpowiadasz klientkom na pytania o cennik i zachęcasz je do zostawienia danych kontaktowych.<br /><br />
              <span style={{ color: '#dc2626', fontWeight: 700 }}>🔴 KLUCZOWA ZASADA:</span> Nigdy nie zgadujesz wolnych terminów. Gdy klientka pyta o termin – prosisz o numer telefonu. Recepcja oddzwoni i ustali termin ręcznie. Twój cel to zebranie leada.<br /><br />
              Pisz ciepło i estetycznie (💅 ✨). Gdy nie potrafisz pomóc, proś o numer dla managera salonu.
            </div>
          </div>
        </div>

        {/* FAQ heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>
          <span style={{ fontSize: '18px' }}>📚</span>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>2. Wpisy Bazy Wiedzy — Kopiuj-Wklej</h2>
        </div>
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b' }}>Dodaj poniższe pary jako osobne wpisy w sekcji "Baza Wiedzy" w panelu Botiko. Zastąp [ZMIENNE] własnymi danymi.</p>

        {/* FAQ 1 */}
        <FaqCard accent="#4f46e5" badge="FAQ 1" badgeTitle="Rezerwacja — zbieranie leada">
          <FaqRow label="Etykiety">Jak umówić się na wizytę? Wolny termin? Rezerwacja spotkania.</FaqRow>
          <FaqRow label="Odpowiedź bota">
            Aby umówić się na wizytę, zostaw tutaj swój <strong>numer telefonu</strong>! 📞 Nasza recepcja oddzwoni i wspólnie dobierzemy termin. Napisz też o jakiej usłudze marzysz!
          </FaqRow>
        </FaqCard>

        {/* FAQ 2 */}
        <FaqCard accent="#4f46e5" badge="FAQ 2" badgeTitle="Cennik usług">
          <FaqRow label="Etykiety">Ile kosztuje manicure? Ceny, koszt zabiegu, czy jest drogo.</FaqRow>
          <FaqRow label="Odpowiedź bota">
            Oto skrócony cennik 💅<br />
            • Manicure hybrydowy – <strong>[CENA]</strong> zł<br />
            • Przedłużanie żelem – od <strong>[CENA_MIN]</strong> do <strong>[CENA_MAX]</strong> zł<br />
            • Zdjęcie + nowa hybryda – <strong>[CENA]</strong> zł<br />
            • Pedicure klasyczny – <strong>[CENA]</strong> zł<br /><br />
            <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>(Instrukcja: Przy pytaniach o usługi spoza listy – zbierz numer i zaoferuj wycenę telefoniczną.)</span>
          </FaqRow>
        </FaqCard>

        {/* FAQ 3 */}
        <FaqCard accent="#4f46e5" badge="FAQ 3" badgeTitle="Odwołanie i spóźnienia">
          <FaqRow label="Etykiety">Chcę odwołać wizytę, spóźnię się, zasady anulacji.</FaqRow>
          <FaqRow label="Odpowiedź bota">
            Rozumiemy! 🤍<br />
            • <strong>Spóźnienie</strong> do <strong>[X] min</strong> – ok, tylko daj nam znać. Zostaw tu imię i godzinę wizyty.<br />
            • <strong>Odwołanie</strong> – podaj imię, nazwisko i cel wizyty w tej wiadomości, a skreślimy Cię z grafiku i zwolnimy miejsce.
          </FaqRow>
        </FaqCard>

        {/* Footer */}
        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>botiko.pl — Asystentki AI dla salonów</span>
          <span style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>Wersja: kopiuj-wklej · Placeholder gotowy</span>
        </div>
      </div>
    </div>
  );
}

/** Shared card component for FAQ entries (inline styles only — no oklch) */
function FaqCard({ accent, badge, badgeTitle, children }: { accent: string; badge: string; badgeTitle: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
      <div style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '10px 20px', display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
        <span style={{ color: accent }}>{badge} //</span>
        <span>{badgeTitle}</span>
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

function FaqRow({ label, children }: { label: string; children: React.ReactNode }) {
  const isAnswer = label === 'Odpowiedź bota';
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isAnswer ? '#059669' : '#94a3b8' }}>{label}:</p>
      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: '#1e293b', fontStyle: isAnswer ? 'normal' : 'italic', fontWeight: isAnswer ? 'normal' : 600 }}>{children}</p>
    </div>
  );
}
