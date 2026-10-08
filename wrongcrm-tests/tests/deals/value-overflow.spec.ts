import { test, expect } from '../../fixtures/auth';
import { getAll, apiUpdate } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-04 (High): an oversized deal value causes an unhandled 500 with a full
// Laravel debug stack trace (APP_DEBUG on in production).
// Correct behaviour: the value is rejected with a 422, and no debug/SQL content
// leaks into the response.

test('BUG-04 oversized deal value is rejected, not a 500 with a debug trace', async ({ sales }) => {
  const deals = await getAll(sales, '/deals', 'deals');
  const deal = deals.find((d) => d.assigned_to === ERWIN_ID);
  test.skip(!deal, 'no own deal to edit');

  const original = deal.value;
  const expectedDate = deal.expected_close_date?.slice(0, 10) ?? '2027-01-01';

  const res = await apiUpdate(sales, `/deals/${deal.id}`, {
    title: deal.title,
    value: '1e22', // exceeds numeric(12,2)
    stage: deal.stage,
    company_id: deal.company_id,
    contact_id: deal.contact_id,
    assigned_to: deal.assigned_to,
    expected_close_date: expectedDate,
  });

  try {
    expect(res.status(), 'should be a validation error, not a server crash').not.toBe(500);
    const body = await res.text();
    expect(body, 'response must not leak a debug stack trace').not.toContain('SQLSTATE');
    expect(body).not.toContain('vendor/laravel');
  } finally {
    // Restore the original value (the 500 likely left it unchanged, but be safe).
    await apiUpdate(sales, `/deals/${deal.id}`, {
      title: deal.title,
      value: original,
      stage: deal.stage,
      company_id: deal.company_id,
      contact_id: deal.contact_id,
      assigned_to: deal.assigned_to,
      expected_close_date: expectedDate,
    });
  }
});
