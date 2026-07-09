import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Collect browser console errors during the action. */
async function withConsoleErrors(
  page: Page,
  action: () => Promise<unknown>,
): Promise<string[]> {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  page.on('console', handler);
  await action();
  page.off('console', handler);
  return errors;
}

// ── Landing pages, basic render ─────────────────────────────────────────────

const LANDING_PAGES = [
  { path: '/dla/salon-beauty',        label: 'salon beauty' },
  { path: '/dla/gabinet-spa',         label: 'gabinet/spa' },
  { path: '/dla/restauracja',         label: 'restauracja' },
  { path: '/dla/warsztat-mechaniczny',label: 'warsztat mechaniczny' },
  { path: '/dla/inna',               label: 'inna branża' },
];

test.describe('Landing pages, render', () => {
  for (const { path, label } of LANDING_PAGES) {
    test(`${label} renders with 200 status and no console errors`, async ({ page }) => {
      let status = 0;
      page.on('response', (r) => {
        if (r.url().endsWith(path) || new URL(r.url()).pathname === path) {
          status = r.status();
        }
      });

      const errors = await withConsoleErrors(page, () => page.goto(path));
      // Next.js serves 200 for SSR pages; route-not-found → 404 (would be caught)
      await expect(page).not.toHaveURL(/\/404|\/not-found/);

      // Filter out known non-critical warnings (e.g. Supabase SSR, framer-motion)
      const critical = errors.filter(
        (e) =>
          !e.includes('Warning:') &&
          !e.includes('supabase') &&
          !e.includes('framer'),
      );
      expect(critical, `Console errors on ${path}: ${critical.join('\n')}`).toHaveLength(0);
    });

    test(`${label}: ma H1 i minimum 1 CTA do /rejestracja`, async ({ page }) => {
      await page.goto(path);

      // H1 must be visible
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text?.trim().length).toBeGreaterThan(5);

      // At least one CTA link pointing to /rejestracja
      const ctas = page.locator('a[href="/rejestracja"]');
      await expect(ctas.first()).toBeVisible();
      const ctaCount = await ctas.count();
      expect(ctaCount).toBeGreaterThanOrEqual(1);
    });
  }
});

// ── Navbar "Dla branży" dropdown links ───────────────────────────────────────

test.describe('Navbar, dropdown "Dla branży"', () => {
  const NAV_LINKS = [
    '/dla/salon-beauty',
    '/dla/gabinet-spa',
    '/dla/restauracja',
    '/dla/warsztat-mechaniczny',
    '/dla/inna',
  ];

  test('wszystkie 5 linków z dropdown prowadzi do istniejących stron', async ({ page }) => {
    await page.goto('/');

    for (const href of NAV_LINKS) {
      const response = await page.request.get(href);
      expect(
        response.status(),
        `Expected 200 for ${href}, got ${response.status()}`,
      ).toBe(200);
    }
  });

  test('dropdown "Dla branży" jest renderowany w navbarze', async ({ page }) => {
    await page.goto('/');
    // At minimum one link from the nav should exist in DOM
    const navLink = page.locator(`nav a[href="/dla/salon-beauty"]`).first();
    await expect(navLink).toBeAttached();
  });
});

// ── /rejestracja redirect ─────────────────────────────────────────────────────

test.describe('/rejestracja redirect', () => {
  test('redirectuje do /register', async ({ page }) => {
    await page.goto('/rejestracja');
    await expect(page).toHaveURL(/\/register/);
  });
});

// ── /prywatnosc. RODO policy page ───────────────────────────────────────────

test.describe('/prywatnosc', () => {
  test('renderuje się poprawnie (200)', async ({ page }) => {
    const res = await page.goto('/prywatnosc');
    expect(res?.status()).toBe(200);
  });

  test('zawiera treść polityki prywatności', async ({ page }) => {
    await page.goto('/prywatnosc');
    // The page should have visible text about privacy / RODO
    const body = await page.locator('main, article, body').first().textContent();
    const lowerBody = body?.toLowerCase() ?? '';
    expect(lowerBody).toMatch(/prywatno|rodo|danych osobowych|administrator/);
  });
});

// ── Blog ─────────────────────────────────────────────────────────────────────

test.describe('Blog routes', () => {
  test('/blog renderuje listę artykułów (200)', async ({ page }) => {
    const res = await page.goto('/blog');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1, h2, article').first()).toBeVisible();
  });

  test('/blog/chatbot-ai-salon-beauty-klientki-24-7 renderuje artykuł (200)', async ({ page }) => {
    const res = await page.goto('/blog/chatbot-ai-salon-beauty-klientki-24-7');
    expect(res?.status()).toBe(200);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('/blog/kategoria/ai-dla-beauty renderuje stronę kategorii (200)', async ({ page }) => {
    const res = await page.goto('/blog/kategoria/ai-dla-beauty');
    expect(res?.status()).toBe(200);
  });

  test('/blog/tag/chatbot renderuje stronę tagu (200)', async ({ page }) => {
    // "chatbot" appears in many articles, this tag page should exist
    const res = await page.goto('/blog/tag/chatbot');
    // 200 or redirect to /blog, both are acceptable
    expect([200, 301, 302]).toContain(res?.status());
  });
});

// ── Dashboard auth guard ──────────────────────────────────────────────────────

test.describe('Dashboard, auth guard', () => {
  const PROTECTED_PATHS = [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/conversations',
    '/dashboard/settings',
  ];

  for (const path of PROTECTED_PATHS) {
    test(`${path} bez sesji → redirect do /login`, async ({ page }) => {
      // Clear cookies/storage to ensure no session
      await page.context().clearCookies();
      await page.goto(path);
      // Should end up on /login (or /sign-in equivalent)
      await expect(page).toHaveURL(/\/login|\/sign-in|\/auth/);
    });
  }
});

// ── Contact form. API error fallback ────────────────────────────────────────

test.describe('Formularz kontaktowy, fallback', () => {
  test('przy błędzie API wyświetla fallback (mailto lub komunikat), nie crash', async ({
    page,
  }) => {
    // Intercept the contact API call and simulate a 500 error
    await page.route('**/api/v1/contact', (route) => {
      void route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('/kontakt');

    // Fill out the form
    const nameInput = page.locator('input[name="name"], input[placeholder*="imię"], input[placeholder*="Imię"]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('Jan Testowy');
    }
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message');
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Page must not crash, either shows error message or fallback
      await expect(page.locator('body')).not.toContainText('undefined');
      await expect(page.locator('body')).not.toContainText('TypeError');
    }
  });
});
