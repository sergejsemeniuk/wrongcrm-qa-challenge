# Bug-06 — [Users] Space-only password is accepted

- **Severity:** Medium
- **Area:** Edit user page

## Steps to reproduce
1. Login as Manager
2. Click on Users > Edit user
3. Set New password and Confirm password both to a single space ' '
4. Click on Save changes
5. Try to log in with that password

## Expected result
Server rejects space-only password and error is displayed

## Actual result
Password is saved without an error, but the user cannot login with it.

## Confidence
User can lock account by setting space-only password
