import { test, expect } from '../../fixtures/auth';
import { getAll, apiCreate, apiDelete, getProps } from '../../fixtures/helpers';

// BUG-17 (Low): an activity can be saved with a contact that does not belong to
// the selected company.
// Correct behaviour: a contact/company mismatch is rejected.

const MARKER = 'qa-contact-company-mismatch';

test('BUG-17 activity rejects a contact that is not in the selected company', async ({ sales }) => {
  const contacts = await getAll(sales, '/contacts', 'contacts');
  const contact = contacts.find((c) => c.company_id != null);
  test.skip(!contact, 'no contact with a company to test');

  // Pick a company different from the contact's own company.
  const props = await getProps(sales, '/activities/create').catch(() => null);
  const companies = (props?.companies as any[]) ?? [];
  const otherCompany = companies.find((c) => c.id !== contact.company_id);
  test.skip(!otherCompany, 'no alternative company available');

  const res = await apiCreate(sales, '/activities', {
    type: 'call',
    description: MARKER,
    company_id: otherCompany.id, // deliberately not the contact's company
    contact_id: contact.id,
    deal_id: null,
    due_at: null,
  });

  try {
    expect([422]).toContain(res.status());
  } finally {
    if (res.ok()) {
      const acts = await getAll(sales, '/activities', 'activities');
      const created = acts.find((a) => a.description === MARKER);
      if (created) await apiDelete(sales, `/activities/${created.id}`);
    }
  }
});
