/**
 * Industry-specific service templates for the SetupWizard (step 3 — knowledge prefill).
 * Duplicated from apps/api/src/brand-templates — intentionally, per project conventions
 * (no shared packages between apps).
 */

export type Industry = 'BEAUTY' | 'HEALTH' | 'FOOD' | 'AUTO' | 'OTHER';

interface ServiceTemplate {
  label: string;
  content: string;
}

export const INDUSTRY_SERVICE_TEMPLATES: Record<Industry, ServiceTemplate[]> = {
  BEAUTY: [
    {
      label: 'Manicure / paznokcie',
      content:
        'Manicure klasyczny — 60 zł, 45 min\nManicure hybrydowy — 90 zł, 75 min\nManicure japoński — 110 zł, 90 min\nZdjęcie hybrydy — 30 zł',
    },
    {
      label: 'Pedicure',
      content:
        'Pedicure klasyczny — 70 zł, 60 min\nPedicure SPA — 100 zł, 90 min\nPedicure hybrydowy — 110 zł, 90 min',
    },
    {
      label: 'Rzęsy i brwi',
      content:
        'Stylizacja rzęs 1:1 — 200 zł, 120 min\nVolume 2D-3D — 250 zł, 150 min\nLaminacja brwi — 80 zł, 60 min\nHenna brwi — 50 zł, 30 min',
    },
    {
      label: 'Zabiegi na twarz',
      content:
        'Oczyszczanie manualne — 150 zł, 60 min\nMikrodermabrazja — 180 zł, 60 min\nPeeling chemiczny — 200 zł, 60 min',
    },
    {
      label: 'Depilacja',
      content:
        'Depilacja woskiem: nogi całe — 80 zł\nDepilacja woskiem: bikini — 60 zł\nDepilacja laserowa — wycena indywidualna',
    },
  ],
  HEALTH: [
    {
      label: 'Fizjoterapia',
      content:
        'Konsultacja fizjoterapeutyczna — 150 zł, 60 min\nMasaż leczniczy — 120 zł, 60 min\nRehabilitacja kręgosłupa — 130 zł, 60 min\nDrenaż limfatyczny — 140 zł, 60 min',
    },
    {
      label: 'Masaże',
      content:
        'Masaż klasyczny całego ciała — 130 zł, 60 min\nMasaż relaksacyjny — 110 zł, 60 min\nMasaż gorącymi kamieniami — 160 zł, 90 min\nMasaż sportowy — 140 zł, 60 min',
    },
    {
      label: 'Zabiegi SPA',
      content:
        'Aromaterapia — 120 zł, 60 min\nOkład algowy — 150 zł, 60 min\nRytualny masaż Tajski — 180 zł, 90 min',
    },
    {
      label: 'Konsultacje',
      content:
        'Konsultacja dietetyczna — 130 zł, 60 min\nKonsultacja ortopedyczna — 200 zł, 45 min\nPsychoterapeuta — 180 zł, 50 min',
    },
  ],
  FOOD: [
    {
      label: 'Menu obiadowe',
      content:
        'Zupa dnia — 15 zł\nDanie główne z mięsem — 35-55 zł\nDanie wegetariańskie — 28-40 zł\nDeser — 18 zł\nMenu dnia (zupa + danie) — 35 zł',
    },
    {
      label: 'Śniadania',
      content:
        'Jajecznica na bekonie — 22 zł\nOwsianka z owocami — 18 zł\nPancakes — 24 zł\nAvocado toast — 26 zł\nKawa specialty — 14-18 zł',
    },
    {
      label: 'Catering',
      content:
        'Catering firmowy (min. 10 osób) — od 45 zł/os.\nBuffet na imprezę — od 60 zł/os.\nPudelka obiadowe do biura — 28 zł/os. (min. 5 porcji)',
    },
    {
      label: 'Pizza / makarony',
      content:
        'Pizza Margherita 30cm — 28 zł\nPizza z łososiem 30cm — 45 zł\nSpagetti bolognese — 32 zł\nPenne arrabiata — 28 zł',
    },
  ],
  AUTO: [
    {
      label: 'Przeglądy i naprawy',
      content:
        'Przegląd techniczny — od 150 zł\nWymiana oleju + filtr — od 200 zł\nHamulce (klocki + tarcze oś) — od 500 zł\nDiagnostyka komputerowa — 80 zł',
    },
    {
      label: 'Opony i koła',
      content:
        'Wymiana opon (4 szt.) — 80 zł\nWyważanie kół — 60 zł\nNaprawienie przebitki — 30 zł\nPrzechowanie opon (sezon) — 200 zł',
    },
    {
      label: 'Klimatyzacja',
      content:
        'Uzupełnienie czynnika klimatyzacji — 180 zł\nOzonowanie wnętrza — 100 zł\nCzyszczenie układu klimatyzacji — 150 zł',
    },
    {
      label: 'Geometria i zawieszenie',
      content:
        'Ustawienie geometrii kół — 150 zł\nAmortyzatory (para) — od 600 zł\nWahacze — od 400 zł/szt.',
    },
  ],
  OTHER: [
    {
      label: 'Podstawowa oferta',
      content:
        'Usługa podstawowa — [cena] zł, [czas]\nUsługa rozszerzona — [cena] zł, [czas]\nKonsultacja — [cena] zł, [czas]',
    },
  ],
};
