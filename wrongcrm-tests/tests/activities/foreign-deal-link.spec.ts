import { test, expect } from '../../fixtures/auth';
import { getAll, apiCreate, apiDelete } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-03 (High): a salesperson can attach an activity to a deal they cannot
// access (write-side IDOR). Opening that deal returns 403, but linking an
// activity to it succeeds.
// Correct behaviour: the server rejects linking to an inaccessible deal.

const MARKER = 'qa-authz-foreign-deal-link';

test('BUG-03 activity cannot be linked to a deal the user cannot access', async ({ sales, manager }) => {
  // Find a deal owned by another user.
  const deals = await getAll(manager, '/deals', 'deals');
  const foreign = deals.find((d) => d.assigned_to !== ERWIN_ID);
  test.skip(!foreign, 'no foreign deal available to test');

  const res = await apiCreate(sales, '/activities', {
    type: 'call',
    description: MARKER,
    deal_id: foreign.id,
    company_id: null,
    contact_id: null,
    due_at: null,
  });

  try {
    expect([403, 422]).toContain(res.status());
  } finally {
    // If it was created (bug present), delete the junk activity.
    if (res.ok()) {
      const acts = await getAll(sales, '/activities', 'activities');
      const created = acts.find((a) => a.description === MARKER);
      if (created) await apiDelete(sales, `/activities/${created.id}`);
    }
  }
});
