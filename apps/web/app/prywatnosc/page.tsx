import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Polityka Prywatności',
  description:
    'Informacje o przetwarzaniu danych osobowych przez Botiko.pl zgodnie z RODO.',
};

export default function PrywatnoScPage() {
  const updated = '10 kwietnia 2026';

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm text-slate-500 hover:text-brand transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Wróć do strony głównej
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Polityka Prywatności</h1>
          <p className="text-slate-500 mt-2 text-sm">Ostatnia aktualizacja: {updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 prose prose-slate max-w-none">

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Administrator danych osobowych</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Administratorem danych osobowych jest <strong>Botiko.pl</strong> (kontakt: kontakt@botiko.pl).
              W sprawach dotyczących ochrony danych osobowych możesz skontaktować się z nami pod adresem:{' '}
              <a href="mailto:kontakt@botiko.pl" className="text-brand hover:underline">kontakt@botiko.pl</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Jakie dane zbieramy</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              W ramach korzystania z platformy Botiko.pl przetwarzamy następujące dane:
            </p>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Dane rejestracyjne:</strong> adres e-mail, nazwa firmy, wybrana branża — niezbędne do założenia i obsługi konta.</li>
              <li><strong>Dane kontaktowe klientów końcowych (leady):</strong> imię i numer telefonu — zbierane przez widget bota, gdy użytkownik dobrowolnie je poda po wyrażeniu zgody RODO. Dane te są szyfrowane (AES-256) przed zapisem w bazie danych.</li>
              <li><strong>Historia rozmów:</strong> treść wiadomości przesłanych przez widget bota — służy do wyświetlania historii w panelu właściciela i poprawy jakości odpowiedzi.</li>
              <li><strong>Dane płatnicze:</strong> płatności obsługuje Stripe — Botiko.pl nie przechowuje danych kart płatniczych. Stripe przetwarza dane zgodnie z własną polityką prywatności.</li>
              <li><strong>Dane techniczne:</strong> adres IP, logi dostępu — w celach bezpieczeństwa i diagnostycznych.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Podstawa prawna i cel przetwarzania</h2>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-2">
              <li><strong>Wykonanie umowy (art. 6 ust. 1 lit. b RODO):</strong> dane rejestracyjne i płatnicze — przetwarzane w celu świadczenia usługi Botiko.pl.</li>
              <li><strong>Zgoda (art. 6 ust. 1 lit. a RODO):</strong> dane kontaktowe klientów końcowych (imię, telefon) — zbierane wyłącznie po wyrażeniu wyraźnej zgody przez użytkownika widgetu. Zgoda jest dobrowolna i może być wycofana w każdej chwili.</li>
              <li><strong>Uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO):</strong> logi techniczne, bezpieczeństwo systemu, zapobieganie nadużyciom.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Przekazywanie danych podmiotom trzecim</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Twoje dane możemy przekazywać wyłącznie zaufanym podwykonawcom technicznym w celu świadczenia usługi:
            </p>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Supabase Inc.</strong> (infrastruktura bazy danych) — serwery w regionie EU (Frankfurt). Więcej: supabase.com/privacy</li>
              <li><strong>Stripe Inc.</strong> (płatności) — przetwarza dane kart i faktur. Więcej: stripe.com/privacy</li>
              <li><strong>Resend Inc.</strong> (wysyłka powiadomień e-mail) — tylko adres e-mail właściciela konta.</li>
              <li><strong>OpenAI Inc.</strong> (przetwarzanie języka naturalnego) — treść wiadomości jest przekazywana do OpenAI w celu generowania odpowiedzi. OpenAI nie trenuje modeli na Twoich danych na podstawie domyślnej umowy API.</li>
            </ul>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              Botiko.pl nie sprzedaje danych osobowych i nie udostępnia ich reklamodawcom.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Okres przechowywania danych</h2>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Dane konta — przez czas trwania subskrypcji + 30 dni po jej zakończeniu (umożliwia reaktywację).</li>
              <li>Dane leadów — do momentu usunięcia przez właściciela konta lub przez 2 lata od daty zebrania.</li>
              <li>Historia rozmów — 1 rok od daty rozmowy.</li>
              <li>Logi techniczne — do 90 dni.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Twoje prawa</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Zgodnie z RODO przysługują Ci następujące prawa:
            </p>
            <ul className="text-slate-600 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Prawo dostępu do swoich danych i ich kopii.</li>
              <li>Prawo sprostowania nieprawidłowych danych.</li>
              <li>Prawo usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;).</li>
              <li>Prawo ograniczenia przetwarzania.</li>
              <li>Prawo przenoszenia danych.</li>
              <li>Prawo sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie.</li>
              <li>Prawo wycofania zgody — w każdej chwili, bez wpływu na zgodność przetwarzania sprzed wycofania.</li>
            </ul>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              Aby skorzystać z praw, napisz na:{' '}
              <a href="mailto:kontakt@botiko.pl" className="text-brand hover:underline">kontakt@botiko.pl</a>.
              Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Bezpieczeństwo danych</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dane osobowe klientów końcowych (imię, telefon) są szyfrowane algorytmem AES-256-GCM przed zapisem do bazy danych.
              Dostęp do panelu chroniony jest przez uwierzytelnianie Supabase Auth z wymaganiem silnego hasła (min. 12 znaków).
              Komunikacja z serwerem odbywa się wyłącznie przez HTTPS. Stosujemy izolację danych między kontami (multi-tenancy z Row Level Security w Supabase).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Pliki cookies</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Botiko.pl używa cookies niezbędnych do działania sesji użytkownika (autentykacja) oraz technicznych.
              Nie używamy cookies analitycznych ani reklamowych w obecnej wersji produktu.
              Widget embeddowany na stronach klientów Botiko.pl może przechowywać dane sesji rozmowy w sessionStorage
              przeglądarki użytkownika — dane te są usuwane po zamknięciu karty.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Umowa powierzenia przetwarzania danych (DPA)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Jeśli Twoja firma przetwarza dane osobowe przy użyciu Botiko.pl (np. leady od klientów) i jesteś zobowiązany
              do posiadania umowy powierzenia przetwarzania z podwykonawcami — możemy podpisać DPA.
              Napisz na:{' '}
              <a href="mailto:kontakt@botiko.pl" className="text-brand hover:underline">kontakt@botiko.pl</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Zmiany polityki</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Możemy aktualizować niniejszą politykę prywatności. O istotnych zmianach poinformujemy
              drogą e-mailową lub przez komunikat w panelu. Data ostatniej aktualizacji znajduje się na górze strony.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
