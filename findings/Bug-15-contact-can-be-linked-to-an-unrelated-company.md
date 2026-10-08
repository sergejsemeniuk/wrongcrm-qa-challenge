# Bug-15 — [Activity] Contact can be linked to an unrelated company

- **Severity:** Low
- **Area:** Log activity form

## Steps to reproduce
1. Login as manager/salesperson
2. Log activity
3. Select a Company, then select a contact that belongs to a different company
4. Click save activity

## Expected result
When a company is chosen, the contact options should be limited to that company's contact

## Actual result
Any contact can be attached to any company.
The contact dropdown is not filtered by selected company

## Confidence
Data consistency.
Example: acitivity 463 has company_id=152 (Grant and sons) with contac_id=323 (Adrianna Kertmann, who belongs to company_id=151; activity 464 has company_id=160 with the same contact_id=323
