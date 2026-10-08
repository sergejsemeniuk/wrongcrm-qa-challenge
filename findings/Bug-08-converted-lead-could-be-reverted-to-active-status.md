# Bug-08 — [Leads] Converted lead could be reverted to active status

- **Severity:** Medium
- **Area:** Lead edit page

## Steps to reproduce
1. Login as Salesperson A
2. Click on Leads
3.Create a new lead or take already existing new lead and convert it to a deal. Leads status becomes Converted and a deal is created (e.g. lead 246 > deal 279)
4. Open the lead's Edit form, change status back to New and save changes
5.Open Users page as Manager

## Expected result
The converted lead cannot return to an active status while it's deal exist

## Actual result
The status reverts to New, the lead goes to active pool and number in active leads on Users page increases even though the created deal still exists. The same record is now counted as an ctive lead and has an existing deal.

## Confidence
The counter moved from 4>5 on revert and back on re-convert
