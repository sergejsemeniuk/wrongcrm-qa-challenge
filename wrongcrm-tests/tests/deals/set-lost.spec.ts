import { test, expect } from '../../fixtures/auth';
import { getAll } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-09 (Medium): a deal can never be moved to the Lost stage via the UI — no
// "Move to Lost" control and the Edit stage selector omits it, even though
// `lost` is a valid stage used by seeded deals.
// Correct behaviour: the deal page exposes a way to set the Lost stage.
//
// NOTE: selectors are best-effort — verify the "Move to" control / stage select.

test('BUG-09 a deal can be moved to the Lost stage from the UI', async ({ sales }) => {
  const deals = await getAll(sales, '/deals', 'deals');
  const openDeal = deals.find(
    (d) => d.assigned_to === ERWIN_ID && !['won', 'lost'].includes(d.stage),
  );
  test.skip(!openDeal, 'no open deal to test');

  const page = await sales.newPage();
  await page.goto(`/deals/${openDeal.id}/edit`);

  // Correct behaviour: the stage control offers "lost".
  const lostOption = page.locator('option', { hasText: /lost/i });
  await expect(lostOption, 'the stage selector should offer Lost').toHaveCount(1);

  await page.close();
});
