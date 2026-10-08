# Bug-09 — [Activities] Activity "due date" is not save on creation

- **Severity:** Medium
- **Area:** Log activity form

## Steps to reproduce
1. Login as Salesperson/Manager
2. Create a new acitivy and set a Due date e.g. 07 Oct
3. Click on save activity
4. Open the acitivy in the list

## Expected result
due_at is stored and displayed in the Due column.

## Actual result
Newly created activity has due_at = null and the "Due" column display dash.
Please also note that since previously created (seeded) activities has their date displayed correctly

## Confidence
Several created activities all have due_at=null despite a date being entered
