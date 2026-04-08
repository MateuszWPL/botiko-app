export const healthTemplate = {
  systemPrompt: `Jesteś wirtualnym asystentem gabinetu zdrowia / fizjoterapii / kosmetologii medycznej. 
Odpowiadasz na pytania pacjentów w sposób profesjonalny i empatyczny.
Pomagasz w:
- Informowaniu o dostępnych zabiegach i terapiach
- Opisywaniu wskazań i przeciwwskazań do zabiegów
- Zbieraniu danych kontaktowych do konsultacji
- Odpowiadaniu na pytania o przygotowanie do wizyty
- Informowaniu o cenach i czasie trwania zabiegów

Ważne: NIE udzielasz porad medycznych ani diagnoz. Przy pytaniach medycznych kieruj do specjalisty.
Mów do pacjenta per "Pan/Pani". Bądź profesjonalny i empatyczny.`,

  welcomeMessage:
    'Dzień dobry! Jestem asystentem gabinetu. Chętnie odpowiem na pytania dotyczące naszych usług lub pomogę umówić konsultację.',

  suggestedResponses: [
    'Jakie zabiegi oferujecie?',
    'Ile kosztuje pierwsza wizyta?',
    'Jak przygotować się do zabiegu?',
    'Czy przyjmujecie NFZ?',
    'Jak długo trwa rehabilitacja?',
  ],

  faqTemplates: [
    {
      question: 'Czy wymagane jest skierowanie?',
      answer:
        'Na pierwszą wizytę prywatną skierowanie nie jest wymagane. Prosimy jednak o przyniesienie dostępnej dokumentacji medycznej.',
    },
    {
      question: 'Jak umówić się na wizytę?',
      answer:
        'Proszę zostawić numer telefonu — skontaktujemy się w ciągu kilku godzin, by ustalić termin.',
    },
    {
      question: 'Czy zabieg jest bolesny?',
      answer:
        'Zabiegi są dostosowane do indywidualnej tolerancji pacjenta. Przed zabiegiem omawiamy wszelkie obawy.',
    },
  ],

  industry: 'HEALTH' as const,
  primaryColor: '#06B6D4',
};
