import { test, expect } from '@playwright/test';

// Smoke coverage for the SEO/GEO pages added in the seo/gsc-fixes work:
// standalone FAQ, pricing, tools, programmatic city pages, comparisons,
// WordPress pillar and the llms.txt route.

const PAGES_WITH_H1 = [
  '/faq',
  '/o-nas',
  '/cennik',
  '/narzedzia',
  '/narzedzia/kalkulator-utraconych-klientow',
  '/narzedzia/kalkulator-roi-bota',
  '/integracje/wordpress',
  '/porownanie',
  '/porownanie/bot-vs-reczne-odpowiadanie',
  '/porownanie/bot-vs-chatgpt-na-stronie',
  '/dla/salon-beauty/bialystok',
  '/dla/restauracja/warszawa',
  '/dla/warsztat-mechaniczny/krakow',
];

test.describe('SEO/GEO pages — render', () => {
  for (const path of PAGES_WITH_H1) {
    test(`${path} renderuje się (200) z H1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).not.toHaveURL(/\/404|\/not-found/);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const text = await h1.textContent();
      expect(text?.trim().length).toBeGreaterThan(5);
    });
  }
});

test.describe('SEO/GEO — structured data + tools', () => {
  test('/faq zawiera FAQPage JSON-LD', async ({ page }) => {
    await page.goto('/faq');
    const ld = page.locator('script[type="application/ld+json"]');
    const blobs = await ld.allTextContents();
    expect(blobs.some((b) => b.includes('"FAQPage"'))).toBeTruthy();
  });

  test('/cennik zawiera Offer JSON-LD z ceną 99', async ({ page }) => {
    await page.goto('/cennik');
    const blobs = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blobs.some((b) => b.includes('"Offer"') && b.includes('99'))).toBeTruthy();
  });

  test('strona miejska zawiera Service JSON-LD z areaServed (miasto)', async ({ page }) => {
    await page.goto('/dla/salon-beauty/bialystok');
    const blobs = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blobs.some((b) => b.includes('"Service"') && b.includes('Białystok'))).toBeTruthy();
  });

  test('kalkulator utraconych klientów reaguje na suwak', async ({ page }) => {
    await page.goto('/narzedzia/kalkulator-utraconych-klientow');
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    // No assertion on exact value — just that interaction doesn't crash the page.
    await expect(page.locator('body')).not.toContainText('TypeError');
  });
});

test.describe('llms.txt', () => {
  test('/llms.txt zwraca tekst z opisem Botiko', async ({ page }) => {
    const res = await page.request.get('/llms.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('# Botiko.pl');
    expect(body.toLowerCase()).toContain('bot obsługi klienta');
  });
});
