import { test, expect } from '../../fixtures/auth';
import { getAll, apiUpdate } from '../../fixtures/helpers';
import { ERWIN_ID } from '../../fixtures/data';

// BUG-15 (Low-Medium): malformed emails like "s@" are accepted.
// Correct behaviour: a filled email is validated for format (empty is fine).
//
// Tested via editing an own lead and restoring the original email afterwards,
// so no junk data is created.

test('BUG-15 a malformed email is rejected on a lead', async ({ sales }) => {
  const leads = await getAll(sales, '/leads', 'leads');
  const lead = leads.find((l) => l.assigned_to === ERWIN_ID);
  test.skip(!lead, 'no own lead to edit');

  const original = lead.email;

  const res = await apiUpdate(sales, `/leads/${lead.id}`, {
    name: lead.name,
    email: 's@', // malformed
    source: lead.source,
    status: lead.status,
    assigned_to: lead.assigned_to,
    company_id: lead.company_id,
    contact_id: lead.contact_id,
  });

  try {
    expect(res.status(), 'a malformed email should fail validation').toBe(422);
  } finally {
    if (res.ok()) {
      await apiUpdate(sales, `/leads/${lead.id}`, {
        name: lead.name,
        email: original,
        source: lead.source,
        status: lead.status,
        assigned_to: lead.assigned_to,
        company_id: lead.company_id,
        contact_id: lead.contact_id,
      });
    }
  }
});
