import { test, expect } from '../../fixtures/auth';
import { getAll, apiUpdate } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-10 (Medium): a converted lead can be reverted to an active status, so it
// re-enters the active pool while its deal still exists.
// Correct behaviour: a converted lead is terminal; it cannot go back to active.

test('BUG-10 a converted lead cannot be reverted to an active status', async ({ sales }) => {
  const leads = await getAll(sales, '/leads', 'leads');
  const converted = leads.find((l) => l.status === 'converted' && l.assigned_to === ERWIN_ID);
  test.skip(!converted, 'no converted lead owned by the salesperson to test');

  const res = await apiUpdate(sales, `/leads/${converted.id}`, {
    name: converted.name,
    email: converted.email,
    source: converted.source,
    status: 'new', // attempt to revert
    assigned_to: converted.assigned_to,
    company_id: converted.company_id,
    contact_id: converted.contact_id,
  });

  try {
    // Correct behaviour: the revert is rejected.
    expect([403, 422]).toContain(res.status());
  } finally {
    // If it went through (bug present), restore the converted status.
    if (res.ok()) {
      await apiUpdate(sales, `/leads/${converted.id}`, {
        name: converted.name,
        email: converted.email,
        source: converted.source,
        status: 'converted',
        assigned_to: converted.assigned_to,
        company_id: converted.company_id,
        contact_id: converted.contact_id,
      });
    }
  }
});
