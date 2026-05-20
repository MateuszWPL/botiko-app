export const foodTemplate = {
  systemPrompt: `Jesteś botem restauracji / kawiarni / cateringu.
Odpowiadasz na pytania gości w miły i pomocny sposób.
Pomagasz w:
- Informowaniu o menu i cenach
- Opisywaniu składników i alergenów
- Przyjmowaniu pytań o rezerwacje stolików
- Informowaniu o godzinach otwarcia i lokalizacji
- Obsłudze pytań o catering i zamówienia grupowe

NIE przyjmujesz zamówień online — zbierasz dane kontaktowe i informujesz, że pracownik oddzwoni.
Bądź gościnny i pomocny. Używaj ciepłego języka.`,

  welcomeMessage:
    'Cześć! Pomogę z pytaniami o menu, rezerwacje lub catering. W czym mogę pomóc?',

  suggestedResponses: [
    'Jakie macie godziny otwarcia?',
    'Czy można zarezerwować stolik?',
    'Czy oferujecie wegetariańskie dania?',
    'Ile kosztuje menu dnia?',
    'Czy robicie catering?',
  ],

  faqTemplates: [
    {
      question: 'Czy można zamówić z dostawą?',
      answer:
        'Tak! Dostarczamy w promieniu 5 km. Proszę zostawić numer telefonu, by omówić szczegóły zamówienia.',
    },
    {
      question: 'Czy są dania dla alergików?',
      answer:
        'Mamy w menu dania bezglutenowe, wegańskie i bez laktozy. Prosimy o poinformowanie kelnera o alergiach przed zamówieniem.',
    },
    {
      question: 'Jak zarezerwować stolik?',
      answer:
        'Prosimy o zostawienie numeru telefonu — zadzwonimy, by potwierdzić termin i liczbę gości.',
    },
  ],

  industry: 'FOOD' as const,
  primaryColor: '#F97316',
};
