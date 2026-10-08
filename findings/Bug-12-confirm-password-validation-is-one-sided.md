# Bug-12 — [Users] Confirm-password validation is one sided

- **Severity:** Medium
- **Area:** Edit user page

## Steps to reproduce
1. Login as manager
2. Proceed to users
3. Edit a user
4. Fill only "confirm password" field, and leave "new passowrd" field empty
5. Save changes

## Expected result
Error should be displayed saying that both fields should be filled in.

## Actual result
No error is displayed, the form silently proceeds back to user page and the password is not changed.

## Confidence
Tested both directions. New password filled and confirm password not filled - error displayed.
