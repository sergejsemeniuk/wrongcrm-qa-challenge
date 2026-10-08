import { test, expect } from '../../fixtures/auth';
import { getAll, apiUpdate } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-01 (Critical): a salesperson can read and edit other users' leads (IDOR).
// Correct behaviour: the lead list is owner-scoped, and the detail/update of a
// foreign lead is forbidden (as Deals already do with 403).

test.describe('BUG-01 Leads access control', () => {
  test('the leads list is scoped to the current salesperson', async ({ sales }) => {
    const leads = await getAll(sales, '/leads', 'leads');
    const foreign = leads.filter((l) => l.assigned_to !== ERWIN_ID);
    expect(foreign, 'salesperson should not see leads owned by other users').toEqual([]);
  });

  test('a salesperson cannot open a foreign lead', async ({ sales, manager }) => {
    // Discover a lead owned by someone other than the salesperson.
    const all = await getAll(manager, '/leads', 'leads');
    const foreign = all.find((l) => l.assigned_to !== ERWIN_ID);
    test.skip(!foreign, 'no foreign lead available to test');

    const res = await sales.request.get(`/leads/${foreign.id}`, {
      headers: { Accept: 'text/html' },
    });
    expect(res.status(), 'opening a foreign lead should be forbidden').toBe(403);
  });

  test('a salesperson cannot edit a foreign lead', async ({ sales, manager }) => {
    const all = await getAll(manager, '/leads', 'leads');
    const foreign = all.find((l) => l.assigned_to !== ERWIN_ID);
    test.skip(!foreign, 'no foreign lead available to test');

    // Send the SAME data back so nothing is mutated even if the write succeeds.
    const res = await apiUpdate(sales, `/leads/${foreign.id}`, {
      name: foreign.name,
      email: foreign.email,
      source: foreign.source,
      status: foreign.status,
      assigned_to: foreign.assigned_to,
      company_id: foreign.company_id,
      contact_id: foreign.contact_id,
    });
    expect([403, 422]).toContain(res.status());
  });
});
