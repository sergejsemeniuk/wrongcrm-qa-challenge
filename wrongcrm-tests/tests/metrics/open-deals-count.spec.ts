import { test, expect } from '../../fixtures/auth';
import { getProps, getAll } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-05 (Medium-High): the Users-page `open_deals_count` is inverted — it
// counts won+lost (closed) deals instead of open ones.
// Correct behaviour: open_deals_count == number of deals NOT in won/lost.

test('BUG-05 open_deals_count equals the number of open deals', async ({ sales, manager }) => {
  const deals = await getAll(sales, '/deals', 'deals');
  const openDeals = deals.filter((d) => !['won', 'lost'].includes(d.stage)).length;

  const users = (await getProps(manager, '/users')).users.data as any[];
  const erwin = users.find((u) => u.id === ERWIN_ID);
  test.skip(!erwin, 'salesperson not found on Users page');

  expect(erwin.open_deals_count, 'should count open deals, not closed ones').toBe(openDeals);
});
