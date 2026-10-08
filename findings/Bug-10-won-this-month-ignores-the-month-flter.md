# Bug-10 — [Dashboard] "Won this month" ignores the month flter

- **Severity:** Medium
- **Area:** Dashboard

## Steps to reproduce
1. Login as manager
2. Click on Dashboard
3. Compare Won this month with won in total by pipeline by stage

## Expected result
Only deals whose won_at fall in the current month are summed

## Actual result
Won this month equals to the sum of all won deals

## Confidence
Prior month deal 2026-09-30 is included in current-month total
