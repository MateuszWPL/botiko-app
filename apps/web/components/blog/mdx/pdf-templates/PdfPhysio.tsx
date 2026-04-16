/** Szablon PDF: Gabinet Fizjoterapii — rozbudowana baza wiedzy dla bota */
export function PdfPhysio({ title }: { title: string }) {
  return (
    <div style={{ minHeight: '1123px', backgroundColor: '#ffffff', color: '#1e293b' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 100%)', padding: '36px', color: '#ffffff' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
          BOTIKO.PL › BAZA WIEDZY
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>{title}</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#ccfbf1' }}>Gotowe wpisy do panelu Botiko dla gabinetu fizjoterapii / rehabilitacji. Wszystkie zmienne w nawiasach [KWADRATOWYCH].</p>
      </div>

      {/* LEGENDE PILL */}
      <div style={{ backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1', padding: '12px 36px', display: 'flex', gap: '24px', fontSize: '11px', fontWeight: 600, color: '#0f766e' }}>
        <span>🟩 = Odpowiedź bota (kopiuj)</span>
        <span>🔲 = Etykiety/tagi wyszukiwania</span>
        <span style={{ color: '#dc2626' }}>🔴 = Zasady bezwzględne</span>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '36px', backgroundColor: '#f8fafc' }}>

        {/* ── 1. Prompt systemowy ── */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #a7f3d0', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ backgroundColor: '#ecfdf5', borderBottom: '1px solid #a7f3d0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🤖</span>
            <strong style={{ fontSize: '15px', color: '#064e3b' }}>1. Instrukcja Systemowa — Główny Prompt</strong>
          </div>
          <div style={{ padding: '24px', fontSize: '13.5px', lineHeight: 1.8, color: '#334155' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontStyle: 'italic', color: '#64748b' }}>Wklej w panelu: Konfiguracja › Zachowanie asystenta › Prompt systemowy</p>
            <div style={{ borderLeft: '4px solid #0d9488', paddingLeft: '16px' }}>
              Jesteś wirtualnym asystentem recepcji w gabinecie fizjoterapii <strong style={{ color: '#000' }}>[NAZWA_GABINETU]</strong> w <strong style={{ color: '#000' }}>[MIASTO, ULICA]</strong>, prowadzonym przez <strong style={{ color: '#000' }}>[IMIĘ FIZJOTERAPEUTY]</strong>.<br /><br />
              Twoim celem jest odpowiadanie na pytania pacjentów o dostępne terapie, ceny, zasady i przygotowanie do wizyt. Zawsze dbasz o spokojny, profesjonalny i empatyczny ton — Twoi rozmówcy często cierpią z powodu bólu.<br /><br />
              <span style={{ color: '#dc2626', fontWeight: 700 }}>🔴 ZASADY BEZWZGLĘDNE:</span><br />
              1. Nigdy nie stawiasz diagnozy ani nie doradzasz w kwestiach stricte medycznych. Odsyłasz do fizjoterapeuty lub lekarza.<br />
              2. Nigdy nie potwierdzasz konkretnych wolnych terminów — nie masz dostępu do kalendarza. Zawsze zbierasz numer telefonu i imię pacjenta, aby recepcja oddzwoniła.<br />
              3. Nie obiecujesz skuteczności konkretnych terapii — używasz sformułowań "może pomóc", "warto omówić z terapeutą".<br /><br />
              Gdy pytanie wykracza poza Twoją wiedzę — zbierz dane kontaktowe i poinformuj, że terapeuta osobiście odpowie.
            </div>
          </div>
        </div>

        {/* ── 2. FAQ heading ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', paddingBottom: '14px', borderBottom: '2px solid #e2e8f0' }}>
          <span style={{ fontSize: '20px' }}>📋</span>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>2. Wpisy Bazy Wiedzy — Kopiuj-Wklej (FAQ)</h2>
        </div>
        <p style={{ margin: '0 0 22px 0', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
          Poniżej 8 rozbudowanych wpisów FAQ. Każdy wpis to osobna "karta wiedzy" do dodania w sekcji Botiko. Zastąp <strong>[ZMIENNE]</strong> własnymi danymi przed wklejeniem.
        </p>

        <PhysioFaqCard number="FAQ 1" title="Rezerwacja — zbieranie leada (priorytetowe)">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Chcę umówić wizytę. Czy jest wolne w piątek? Jak zapisać się do fizjoterapeuty? Chcę zarezerwować termin.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            Chętnie pomożemy Ci zarezerwować wizytę! 📅 Ponieważ nasz grafik zmienia się dynamicznie, terminy ustala recepcja bezpośrednio.<br />
            Zostaw proszę swoje <strong>[imię i numer telefonu]</strong>, a oddzwonimy w ciągu <strong>[X godzin]</strong> w dni robocze, by dobrać termin dopasowany do Ciebie. Możesz też napisać, czy preferujesz godziny porane czy popołudniowe 🙂
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 2" title="Cennik i czas trwania wizyt">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Ile kosztuje fizjoterapia? Cena wizyty, czy jest drogo, ile trwa sesja, koszt rehabilitacji kręgosłupa.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            Oto nasz aktualny cennik usług:<br /><br />
            🔹 <strong>Konsultacja wstępna (wywiad + badanie)</strong> — <strong>[CENA]</strong> zł / ok. <strong>[CZAS]</strong> min<br />
            🔹 <strong>Sesja terapii manualnej</strong> — <strong>[CENA]</strong> zł / ok. <strong>[CZAS]</strong> min<br />
            🔹 <strong>Masaż leczniczy (całe plecy)</strong> — <strong>[CENA]</strong> zł / ok. <strong>[CZAS]</strong> min<br />
            🔹 <strong>Fizjoterapia sportowa</strong> — <strong>[CENA]</strong> zł / ok. <strong>[CZAS]</strong> min<br />
            🔹 <strong>Kinesiotaping</strong> — <strong>[CENA]</strong> zł<br />
            🔹 <strong>Pakiet rehabilitacyjny (X sesji)</strong> — <strong>[CENA_PAKIETU]</strong> zł (oszczędzasz [PROCENT]%)<br /><br />
            <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>(Instrukcja dla bota: Przy pytaniu o NFZ lub ubezpieczenie — zbierz numer i zaproponuj rozmowę telefoniczną z recepcją.)</span>
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 3" title="Pierwsza wizyta — jak się przygotować">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Co zabrać na pierwszą wizytę? Jak się przygotować do fizjoterapii? Czy przynieść wyniki badań, RTG, MRI?
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            Na pierwszą wizytę warto przygotować się w kilku punktach 📋<br /><br />
            ✅ <strong>Dokumentacja medyczna</strong> — jeśli posiadasz RTG, MRI, wyniki badań krwi lub skierowanie od lekarza, zabierz je ze sobą. To przyspieszy diagnozę.<br />
            ✅ <strong>Ubranie</strong> — wygodne i przewiewne. Sesja może wymagać dostępu do pleców, bioder lub nóg.<br />
            ✅ <strong>Lista leków</strong> — jeśli przyjmujesz leki na stałe, poinformuj terapeutę (szczególnie leki na krzepliwość krwi).<br />
            ✅ <strong>Czas</strong> — pierwsza wizyta trwa ok. <strong>[CZAS]</strong> minut i obejmuje wywiad, pomiary i plan terapii.<br /><br />
            Masz pytanie o konkretny problem zdrowotny przed wizytą? Zostaw numer — terapeuta chętnie odpowie telefonicznie.
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 4" title="Specjalizacje i metody terapii">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Czy leczycie rwę kulszową? Rehabilitacja po operacji kolana, fizjoterapia kręgosłupa, PNF, terapia manualna, suche igłowanie.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            W naszym gabinecie specjalizujemy się w następujących obszarach 🏥<br /><br />
            🔸 <strong>Dolegliwości kręgosłupa</strong> — bóle szyi, odcinek lędźwiowy, rwa kulszowa, dyskopatia<br />
            🔸 <strong>Rehabilitacja pooperacyjna</strong> — po operacjach stawu kolanowego, biodrowego, barku<br />
            🔸 <strong>Fizjoterapia sportowa</strong> — urazy, przeciążenia, przygotowanie motoryczne<br />
            🔸 <strong>Terapia manualna</strong> — mobilizacje stawów, techniki tkanek miękkich<br />
            🔸 <strong>[INNE_SPECJALIZACJE]</strong><br /><br />
            Nie jestem w stanie ocenić, czy konkretna metoda będzie dla Ciebie odpowiednia — to zależy od badania. Umów się na konsultację — terapeuta dobierze plan indywidualnie.<br /><br />
            <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>(Instrukcja: Nie diagnozuj, nie obiecuj skuteczności. Przy pytaniach o diagnozy — zawsze odsyłaj do terapeuty.)</span>
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 5" title="Odwołanie i zmiana terminu">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Chcę odwołać wizytę, spóźnię się, zmiana terminu rehabilitacji, zasady anulacji.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            Zdarzają się niespodziewane sytuacje — rozumiemy! 🤝<br /><br />
            ⏱ <strong>Spóźnienie:</strong> Tolerujemy spóźnienia do <strong>[X] minut</strong>. Prosimy jednak o informację — wyślij tu swoje imię i szacowany czas przybycia, przekażemy to terapeucie.<br /><br />
            ❌ <strong>Odwołanie / zmiana:</strong> Prosimy odwołać wizytę najpóźniej <strong>[X godzin]</strong> przed terminem. Zostaw tu imię, nazwisko i datę wizyty — skreślimy Cię z grafiku bez opłat.<br /><br />
            ⚠️ Odwołanie w krótszym czasie niż <strong>[X]</strong> może skutkować opłatą za zarezerwowany czas terapeuty w wysokości <strong>[KWOTA]</strong> zł.
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 6" title="Parking, dojazd i lokalizacja">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Gdzie jesteście? Adres gabinetu, parking, dojazd komunikacją miejską, jak dojechać.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            📍 Gabinet mieści się pod adresem: <strong>[ULICA, NUMER, MIASTO]</strong>, <strong>[NUMER_KONDYGNACJI]</strong> piętro / lokal <strong>[X]</strong>.<br /><br />
            🚗 <strong>Parkowanie:</strong> [OPIS PARKINGU — np. "Darmowy parking na tyłach budynku od ul. X" lub "Płatna strefa, miejsca przy wejściu"]<br /><br />
            🚌 <strong>Komunikacja miejska:</strong> Autobus/tramwaj nr <strong>[NUMER]</strong>, przystanek <strong>[NAZWA]</strong> — ok. <strong>[X]</strong> minut piechotą.<br /><br />
            Masz problem z dojazdem? Napisz tu swój numer — recepcja zadzwoni i naprowadzi Cię osobiście 🗺️
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 7" title="NFZ i ubezpieczenia prywatne">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Czy przyjmujecie NFZ? Ubezpieczenie Medicover, Lux Med, PZU Zdrowie, prywatna rehabilitacja.
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            Gabinet działa w systemie <strong>komercyjnym (prywatnym)</strong> — nie realizujemy wizyt w ramach NFZ.<br /><br />
            🔹 <strong>Pakiety prywatne:</strong> Akceptujemy ubezpieczenia: <strong>[WPISZ: np. Medicover, Lux Med, PZU Zdrowie]</strong>. Przy umawianiu wizyty poinformuj recepcję o posiadanym pakiecie.<br />
            🔹 <strong>Faktury VAT:</strong> Wystawiamy faktury na firmy i osoby fizyczne — można odliczyć w ramach ulgi rehabilitacyjnej.<br /><br />
            Chcesz potwierdzić, czy Twój pakiet jest obsługiwany? Zostaw numer — recepcja sprawdzi i oddzwoni.
          </PhysioRow>
        </PhysioFaqCard>

        <PhysioFaqCard number="FAQ 8" title="Pytania medyczne poza kompetencją bota">
          <PhysioRow icon="🔲" label="Tagi / zamiary użytkownika">
            Czy ćwiczenia pomogą na moją chorobę? Mam cukrzycę, czy mogę? Ile sesji potrzebuję na wyzdrowienie?
          </PhysioRow>
          <PhysioRow icon="🟩" label="Odpowiedź bota (kopiuj)">
            To pytanie wymaga indywidualnej oceny terapeuty — nie chcę odpowiadać ogólnikami w tak ważnej sprawie 🙏<br /><br />
            Zostaw proszę swoje imię i numer telefonu. <strong>[IMIĘ FIZJOTERAPEUTY]</strong> zadzwoni osobiście w godzinach <strong>[X–Y]</strong> i odpowie na Twoje pytania przed umówieniem wizyty. To sposób, by mieć pewność, że trafiasz na właściwe ręce.
          </PhysioRow>
        </PhysioFaqCard>

        {/* ── 3. Tipy konfiguracyjne ── */}
        <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '20px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <strong style={{ fontSize: '13px', color: '#92400e' }}>3. Dodatkowe tipy konfiguracji bota dla fizjo</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.8, color: '#78350f' }}>
            <li>Ustaw empatyczny, spokojny ton — pacjenci często są w bólu lub zestresowani.</li>
            <li>Słowa-klucze do wychwycenia intencji rezerwacyjnej: "termin", "zapisać", "umówić", "wolne", "kiedy".</li>
            <li>Po zebraniu numeru — dodaj etykietę "FIZJO_LEAD" w panelu, by odróżnić od innych zapytań.</li>
            <li>Ogranicz bota do max 3 zdań na wiadomość — długie odpowiedzi zniechęcają pacjentów mobilnych.</li>
            <li>Jeśli ktoś opisuje ostry ból / nagły uraz — bot powinien zaproponować kontakt telefoniczny NATYCHMIAST.</li>
          </ul>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>botiko.pl — Asystenci AI dla gabinetów</span>
          <span style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>8 wpisów FAQ · Placeholder gotowy · v1.0</span>
        </div>
      </div>
    </div>
  );
}

function PhysioFaqCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1', padding: '10px 20px', display: 'flex', gap: '10px', fontSize: '13px', fontWeight: 700 }}>
        <span style={{ color: '#0f766e' }}>{number} //</span>
        <span style={{ color: '#134e4a' }}>{title}</span>
      </div>
      <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
        {children}
      </div>
    </div>
  );
}

function PhysioRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const isAnswer = icon === '🟩';
  return (
    <div>
      <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isAnswer ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{icon}</span> {label}:
      </p>
      <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.75, color: '#1e293b', fontStyle: isAnswer ? 'normal' : 'italic', fontWeight: isAnswer ? 'normal' : 600 }}>
        {children}
      </p>
    </div>
  );
}
