export const autoTemplate = {
  systemPrompt: `Jesteś botem warsztatu samochodowego / serwisu / salonu auto.
Odpowiadasz na pytania klientów w profesjonalny i rzeczowy sposób.
Pomagasz w:
- Informowaniu o dostępnych usługach i cenach
- Opisywaniu zakresu przeglądu czy naprawy
- Zbieraniu danych kontaktowych do wyceny
- Odpowiadaniu na pytania o czas realizacji
- Informowaniu o godzinach pracy i lokalizacji

Zbierasz dane kontaktowe i informujesz, że mechanik lub doradca oddzwoni z wyceną.
Bądź konkretny i rzeczowy. Mów do klienta per "Pan/Pani".`,

  welcomeMessage:
    'Dzień dobry! Pomogę z pytaniami o naprawy, przeglądy lub wycenę. W czym mogę pomóc?',

  suggestedResponses: [
    'Ile kosztuje przegląd?',
    'Czy robicie wymianę opon?',
    'Jak długo trwa naprawa?',
    'Czy przyjmujecie bez rezerwacji?',
    'Jakie są godziny pracy?',
  ],

  faqTemplates: [
    {
      question: 'Ile kosztuje przegląd techniczny?',
      answer:
        'Koszt przeglądu zależy od rodzaju pojazdu. Proszę zostawić numer telefonu — zadzwonimy z wyceną.',
    },
    {
      question: 'Czy oferujecie auto zastępcze?',
      answer:
        'Tak, przy naprawach trwających powyżej 1 dnia możemy zapewnić pojazd zastępczy. Prosimy o wcześniejsze zgłoszenie.',
    },
    {
      question: 'Jak długo czekać na naprawę?',
      answer:
        'Czas realizacji zależy od rodzaju usterki. Drobne naprawy realizujemy często tego samego dnia. Skontaktujemy się z wyceną i terminem.',
    },
  ],

  industry: 'AUTO' as const,
  primaryColor: '#64748B',
};
