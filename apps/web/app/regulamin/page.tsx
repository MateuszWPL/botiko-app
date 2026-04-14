import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Regulamin — Botiko.pl',
  description: 'Regulamin świadczenia usług Botiko.pl — platforma AI chatbot dla firm usługowych.',
  alternates: { canonical: 'https://botiko.pl/regulamin' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const updated = '14 kwietnia 2026';

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-sm text-slate-500 hover:text-brand transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Wróć do strony głównej
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Regulamin</h1>
          <p className="text-slate-500 mt-2 text-sm">Ostatnia aktualizacja: {updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 prose prose-slate max-w-none">

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§1. Postanowienia ogólne</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Niniejszy Regulamin określa zasady korzystania z platformy <strong>Botiko.pl</strong> — usługi
                oprogramowania jako usługi (SaaS) umożliwiającej tworzenie i osadzanie asystenta AI na stronie
                internetowej firmy.
              </li>
              <li>
                Usługodawcą jest <strong>[IMIĘ NAZWISKO]</strong>, prowadzący działalność pod adresem{' '}
                <strong>[ADRES]</strong>, kontakt:{' '}
                <a href="mailto:kontakt@botiko.pl" className="text-brand hover:underline">kontakt@botiko.pl</a>{' '}
                (dalej: <strong>Botiko.pl</strong> lub <strong>Usługodawca</strong>).
              </li>
              <li>
                Korzystanie z Botiko.pl oznacza akceptację niniejszego Regulaminu. Jeśli nie akceptujesz
                Regulaminu — nie korzystaj z usługi.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§2. Definicje</h2>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-2">
              <li><strong>Platforma</strong> — oprogramowanie SaaS dostępne pod adresem botiko.pl, umożliwiające zarządzanie botem AI i leadami.</li>
              <li><strong>Użytkownik</strong> — osoba lub firma, która zarejestrowała konto w Botiko.pl i korzysta z usługi (właściciel firmy usługowej).</li>
              <li><strong>Klient końcowy</strong> — osoba odwiedzająca stronę Użytkownika i rozmawiająca z botem AI.</li>
              <li><strong>Bot</strong> — asystent AI skonfigurowany przez Użytkownika i osadzony na jego stronie internetowej za pomocą widgetu Botiko.pl.</li>
              <li><strong>Lead</strong> — dane kontaktowe Klienta końcowego (imię, numer telefonu) pozostawione dobrowolnie w widgecie bota.</li>
              <li><strong>Plan</strong> — wybrany pakiet subskrypcyjny określający limit funkcji i cenę miesięczną.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§3. Rejestracja i konto</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>Rejestracja wymaga podania adresu e-mail, nazwy firmy i wybrania branży.</li>
              <li>
                Użytkownik jest odpowiedzialny za bezpieczeństwo swoich danych dostępowych. W przypadku
                podejrzenia nieuprawnionego dostępu należy niezwłocznie skontaktować się z Usługodawcą.
              </li>
              <li>Konto jest niezbywalne — nie można go odsprzedawać ani przenosić na inne podmioty bez zgody Usługodawcy.</li>
              <li>
                Do rejestracji nie jest wymagane podanie danych karty płatniczej — karta jest pobierana
                dopiero po zakończeniu okresu próbnego (trial) i potwierdzeniu aktywacji subskrypcji.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§4. Plany i płatności</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Botiko.pl oferuje plan <strong>Starter: 149 zł brutto/miesiąc</strong> z limitem 1000 konwersacji
                miesięcznie. Aktualna oferta dostępna jest na stronie głównej botiko.pl.
              </li>
              <li>
                Nowe konta otrzymują <strong>14-dniowy okres próbny (trial)</strong> bez opłat i bez wymogu
                podania karty płatniczej.
              </li>
              <li>
                Płatności obsługiwane są przez <strong>Stripe</strong>. Botiko.pl nie przechowuje danych kart
                płatniczych — trafiają one wyłącznie do Stripe zgodnie z ich polityką prywatności.
              </li>
              <li>
                Subskrypcja odnawia się automatycznie. Użytkownik może anulować subskrypcję w dowolnym momencie
                przez panel Botiko.pl — dostęp pozostaje aktywny do końca opłaconego okresu.
              </li>
              <li>
                Usługodawca zastrzega sobie prawo do zmiany cennika z <strong>30-dniowym wyprzedzeniem</strong>.
                O zmianie ceny Użytkownik zostanie poinformowany drogą e-mailową.
              </li>
              <li>
                Zwroty są możliwe w ciągu <strong>14 dni od pierwszej płatności</strong> (po zakończeniu trialu),
                jeśli Bot nie działał zgodnie z opisem. Prośby o zwrot należy kierować na kontakt@botiko.pl.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§5. Zakres usługi i ograniczenia</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Bot Botiko.pl odpowiada na pytania Klientów końcowych na podstawie wiedzy dostarczonej przez
                Użytkownika (baza wiedzy) i szablonu branżowego. Bot <strong>nie jest systemem rezerwacji</strong> —
                może odsyłać do zewnętrznych systemów (Booksy, Calendly itp.).
              </li>
              <li>
                Bot działa <strong>24 godziny na dobę, 7 dni w tygodniu</strong>. Konfiguracja godzin pracy jest
                wyłącznie informacyjna i nie blokuje działania chatu.
              </li>
              <li>
                Botiko.pl <strong>nie gwarantuje</strong>, że odpowiedzi bota będą w 100% dokładne. Bot jest
                asystentem AI, który może się mylić. Użytkownik jest odpowiedzialny za weryfikację informacji,
                które zamieszcza w bazie wiedzy.
              </li>
              <li>
                Miesięczny limit konwersacji dotyczy unikalnych sesji czatu. Po przekroczeniu limitu bot
                informuje Klientów końcowych o braku dostępności i pokazuje formularz kontaktowy (lead form).
              </li>
              <li>
                Usługodawca zapewnia dostępność platformy na poziomie <strong>99% w skali miesiąca</strong>.
                Planowane przerwy konserwacyjne będą ogłaszane z wyprzedzeniem.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§6. Obowiązki Użytkownika</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Użytkownik jest odpowiedzialny za treść bazy wiedzy dostarczonej do bota. Zabronione jest
                zamieszczanie treści niezgodnych z prawem, wprowadzających w błąd lub naruszających prawa
                osób trzecich.
              </li>
              <li>
                Użytkownik jest odpowiedzialny za poinformowanie swoich Klientów końcowych o tym, że na jego
                stronie działa bot AI. Zalecane jest umieszczenie informacji w polityce prywatności własnej strony.
              </li>
              <li>
                Użytkownik jest administratorem danych osobowych Klientów końcowych (leadów) zebranych
                przez bota i zobowiązany jest do przetwarzania ich zgodnie z RODO. Botiko.pl jest
                podmiotem przetwarzającym w rozumieniu art. 28 RODO. Na wniosek możemy podpisać
                umowę powierzenia (DPA) — pisz na rodo@botiko.pl.
              </li>
              <li>
                Zabronione jest używanie Botiko.pl do świadczenia usług niezgodnych z prawem,
                phishingu, spamu lub innych działań szkodliwych.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§7. Odpowiedzialność</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Usługodawca nie ponosi odpowiedzialności za szkody wynikające z nieprawidłowej lub
                niepełnej bazy wiedzy dostarczonej przez Użytkownika.
              </li>
              <li>
                Usługodawca nie ponosi odpowiedzialności za szkody wynikające z przerw technicznych
                dostawców infrastruktury (Supabase, OpenAI, Stripe, Vercel/Railway).
              </li>
              <li>
                Łączna odpowiedzialność Usługodawcy wobec Użytkownika, niezależnie od podstawy prawnej,
                jest ograniczona do kwoty opłat uiszczonych przez Użytkownika w ciągu ostatnich
                <strong> 3 miesięcy</strong> przed zdarzeniem powodującym szkodę.
              </li>
              <li>
                Botiko.pl nie odpowiada za decyzje biznesowe podjęte na podstawie danych dostarczonych
                przez bota.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§8. Własność intelektualna</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Kod źródłowy, interfejs i marka Botiko.pl są własnością Usługodawcy. Regulamin nie
                przyznaje Użytkownikowi żadnych praw własności intelektualnej do oprogramowania.
              </li>
              <li>
                Użytkownik zachowuje pełne prawa do treści wgranych do bazy wiedzy i danych leadów
                zebranych przez bota.
              </li>
              <li>
                Usługodawca może anonimowo (bez danych identyfikujących) wykorzystywać zagregowane
                statystyki użytkowania do ulepszania produktu.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§9. Rozwiązanie umowy i usunięcie konta</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Użytkownik może usunąć konto w dowolnym momencie z poziomu panelu Botiko.pl
                (Ustawienia → Usuń konto). Usunięcie konta jest nieodwracalne.
              </li>
              <li>
                Po usunięciu konta wszystkie dane Użytkownika (baza wiedzy, leady, historia rozmów)
                są trwale usuwane z systemów Botiko.pl w ciągu <strong>30 dni</strong>.
              </li>
              <li>
                Usługodawca może zawiesić lub usunąć konto w przypadku naruszenia Regulaminu,
                braku płatności po okresie grace (7 dni od daty płatności) lub na żądanie organów
                ścigania. O zawieszeniu Użytkownik zostanie poinformowany e-mailem.
              </li>
              <li>
                Anulowanie subskrypcji bez usunięcia konta powoduje przejście do stanu nieaktywnego
                — bot przestaje odpowiadać, ale dane są zachowane przez <strong>30 dni</strong>,
                co umożliwia reaktywację.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§10. Ochrona danych osobowych</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Zasady przetwarzania danych osobowych przez Botiko.pl opisane są w{' '}
              <Link href="/prywatnosc" className="text-brand hover:underline">
                Polityce Prywatności
              </Link>
              . Użytkownik jako administrator danych osobowych klientów końcowych (leadów) powinien
              we własnej polityce prywatności poinformować o korzystaniu z bota AI i przetwarzaniu
              danych przez Botiko.pl jako podmiot przetwarzający.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">§11. Zmiany Regulaminu</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Usługodawca zastrzega prawo do zmiany Regulaminu. O istotnych zmianach Użytkownik
                zostanie poinformowany e-mailem co najmniej <strong>14 dni przed</strong> datą
                ich wejścia w życie.
              </li>
              <li>
                Dalsze korzystanie z Botiko.pl po wejściu w życie zmian oznacza ich akceptację.
                W przypadku braku akceptacji Użytkownik może usunąć konto przed datą zmian.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§12. Postanowienia końcowe</h2>
            <ol className="text-slate-600 text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>
                Regulamin podlega prawu polskiemu. W sprawach nieuregulowanych stosuje się przepisy
                Kodeksu cywilnego i ustawy o świadczeniu usług drogą elektroniczną.
              </li>
              <li>
                Wszelkie spory strony będą starały się rozwiązać polubownie. W przypadku braku
                porozumienia właściwym sądem jest sąd właściwy dla siedziby Usługodawcy.
              </li>
              <li>
                Nieważność poszczególnych postanowień Regulaminu nie wpływa na ważność pozostałych.
              </li>
              <li>
                Kontakt w sprawach związanych z Regulaminem:{' '}
                <a href="mailto:kontakt@botiko.pl" className="text-brand hover:underline">
                  kontakt@botiko.pl
                </a>
              </li>
            </ol>
          </section>

        </div>
      </div>
    </main>
  );
}
