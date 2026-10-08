# Bug-11 — [Deals] Pre-filled "expected close date" is displayed but not submitted

- **Severity:** Medium
- **Area:** Deals create form

## Steps to reproduce
1. Login as manager
2. Click on Deals
3. Click New deal
4. The expected close date is prefilled with todays date, do not touch it
5. Click Create deal

## Expected result
The displayed date is submitted and the deal is created

## Actual result
Servers return an error 'errors.expected_close_date: "The expected close date field is required."'
Pre filled date is displayed but empty value is submitted

## Confidence
Error is displayed in payload while the field is visibly shows a date
