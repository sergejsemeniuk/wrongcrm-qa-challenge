import { test, expect } from '../../fixtures/auth';
import { getProps, apiUpdate } from '../../fixtures/helpers';
import { TEST_USER_ID } from '../../fixtures/data';

// BUG-14 (Low-Medium): filling only the Confirm password field passes silently
// (no error, password unchanged). The mirror case (only New password) correctly
// errors. The `confirmed` rule is attached to the New password field only.
// Correct behaviour: filling only one of the paired fields is a validation error.

test('BUG-14 filling only the confirm-password field is a validation error', async ({ manager }) => {
  const users = (await getProps(manager, '/users')).users.data as any[];
  const user = users.find((u) => u.id === TEST_USER_ID);
  test.skip(!user, 'target user not found');

  const res = await apiUpdate(manager, `/users/${user.id}`, {
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    // password intentionally omitted
    password_confirmation: 'Secret123!',
  });

  // No password change persists either way, so no restore is needed.
  expect(res.status(), 'confirm-only should fail validation').toBe(422);
});
