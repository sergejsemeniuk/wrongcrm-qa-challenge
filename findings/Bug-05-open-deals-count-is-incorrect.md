# Bug-05 — [Users] open_deals_count is incorrect

- **Severity:** Medium
- **Area:** Users page

## Steps to reproduce
1. Login as Salesperson A
2. Open Deals list for Salesperson A
3. Check open deals for Salesperson A at the time. e.g. 3 won, 3 lost, 1 proposal, 2 new (9 in total). Open deals (not won/lost)=3
4. Login as Manager
5. Open Users page and check open deals for Salesperson A
6. Check number of open deals

## Expected result
Open deals which are not in won/lost status are counted correctly. Moving deal to won/lost should decrese the amount in the column open deals.

## Actual result
The column open deals shows exacly 6 which is a number of closed deals (3 won + 3 lost) instead of open deals.
Moving any open deal to won status increases the number in open deals column

## Confidence
Formula verified on several data sets
