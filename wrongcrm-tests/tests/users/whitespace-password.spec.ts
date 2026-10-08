import { test, expect } from '../../fixtures/auth';
import { getProps, apiUpdate } from '../../fixtures/helpers';
import { TEST_USER_ID, ROLES } from '../../fixtures/data';

// BUG-07 (Medium): a whitespace-only password is accepted on save but then the
// user cannot log in (trim mismatch).
// Correct behaviour: a whitespace-only password is rejected with a 422.
//
// This operates on the second salesperson (Meghan) and resets her password to
// SALES2_PASSWORD afterwards.

test('BUG-07 a whitespace-only password is rejected', async ({ manager }) => {
  const users = (await getProps(manager, '/users')).users.data as any[];
  const user = users.find((u) => u.id === TEST_USER_ID);
  test.skip(!user, 'target user not found');

  const res = await apiUpdate(manager, `/users/${user.id}`, {
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    password: ' ',
    password_confirmation: ' ',
  });

  try {
    expect(res.status(), 'a whitespace password should fail validation').toBe(422);
  } finally {
    // Always reset to a known password so the account stays usable.
    await apiUpdate(manager, `/users/${user.id}`, {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      password: ROLES.sales2.password,
      password_confirmation: ROLES.sales2.password,
    });
  }
});
