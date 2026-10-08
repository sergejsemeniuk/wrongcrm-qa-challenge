# Bug-14 — [Deals] Expected close date can be set in the past

- **Severity:** Low
- **Area:** Deal create page, Deal edit page

## Steps to reproduce
1. Login as manager/salesperson
2. Create/edit a deal
3. Set Expected close date to a date in past
4. Save changes

## Expected result
An expected close date (future) should not accept the past date, or at least warn about it.

## Actual result
A date in the past for expected close date is accpedted on both create and edit.

## Confidence
Reproduced on deals creation and edit
