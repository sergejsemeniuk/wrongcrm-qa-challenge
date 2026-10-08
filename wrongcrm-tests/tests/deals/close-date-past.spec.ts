import { test, expect } from '../../fixtures/auth';
import { getAll, apiUpdate } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-16 (Low): the Expected close date can be set in the past.
// Correct behaviour: a past expected close date is rejected.

test('BUG-16 a past expected close date is rejected', async ({ sales }) => {
  const deals = await getAll(sales, '/deals', 'deals');
  const deal = deals.find((d) => d.assigned_to === ERWIN_ID);
  test.skip(!deal, 'no own deal to edit');

  const original = deal.expected_close_date?.slice(0, 10) ?? '2027-01-01';

  const res = await apiUpdate(sales, `/deals/${deal.id}`, {
    title: deal.title,
    value: deal.value,
    stage: deal.stage,
    company_id: deal.company_id,
    contact_id: deal.contact_id,
    assigned_to: deal.assigned_to,
    expected_close_date: '2020-01-01', // clearly in the past
  });

  try {
    expect(res.status(), 'a past close date should be a validation error').toBe(422);
  } finally {
    await apiUpdate(sales, `/deals/${deal.id}`, {
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      company_id: deal.company_id,
      contact_id: deal.contact_id,
      assigned_to: deal.assigned_to,
      expected_close_date: original,
    });
  }
});
