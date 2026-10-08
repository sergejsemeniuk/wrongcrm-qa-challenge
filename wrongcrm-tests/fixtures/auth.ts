import { test as base, BrowserContext } from '@playwright/test';
import { ROLES } from './data';

type Creds = { email: string; password: string };

/**
 * UI login. The app renders the login form client-side (Inertia), so we drive
 * it through a real page: fill #email and #password, submit, and wait to land
 * on an authenticated route. Session/cookies live on the BrowserContext, so the
 * login page is closed afterwards and tests open their own page(s).
 *
 * Selectors are based on the live login page:
 *   input#email, input#password, a remember checkbox, button[type=submit].
 */
async function login(ctx: BrowserContext, creds: Creds): Promise<void> {
  const page = await ctx.newPage();
  try {
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.locator('#email').fill(creds.email);
    await page.locator('#password').fill(creds.password);
    await page.locator('button[type=submit]').click();

    // Success = we navigate away from /login to an app route.
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15000 });
    // Let the authenticated page settle so the session cookie is fully set.
    await page.waitForLoadState('networkidle').catch(() => {});
  } catch {
    throw new Error(
      `Login did not complete for ${creds.email} - still on /login after submit. ` +
        `Check the credentials in .env.`,
    );
  } finally {
    await page.close();
  }
}

async function makeContext(browser: any, creds: Creds): Promise<BrowserContext> {
  const ctx = await browser.newContext();
  await login(ctx, creds);
  return ctx;
}

export const test = base.extend<{
  manager: BrowserContext;
  sales: BrowserContext;
  sales2: BrowserContext;
}>({
  manager: async ({ browser }, use) => {
    const ctx = await makeContext(browser, ROLES.manager);
    await use(ctx);
    await ctx.close();
  },
  sales: async ({ browser }, use) => {
    const ctx = await makeContext(browser, ROLES.sales);
    await use(ctx);
    await ctx.close();
  },
  sales2: async ({ browser }, use) => {
    const ctx = await makeContext(browser, ROLES.sales2);
    await use(ctx);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';
