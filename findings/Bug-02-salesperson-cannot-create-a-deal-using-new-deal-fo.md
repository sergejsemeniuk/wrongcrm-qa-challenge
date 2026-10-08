# Bug-02 — [Deals] Salesperson cannot create a deal using 'New deal' form

- **Severity:** High
- **Area:** New deal page

## Steps to reproduce
1. Log in as the salesperson
2. Click on Deals > New deal
3. Fill all the visible fields (Title, Company, Value, Stage, Expected close date)
4. Click on Create deal

## Expected result
Assignee field is displayed and deal is created

## Actual result
Salesperson is not able to create a new deal since form has no Assignee field displayed, thus error is displayed when creating the deal: "assigned_to": "The assigned to field is required."

## Confidence
Deal cannot be created from this form. Only workaround is to create a lead and then convert it to deal for the assigned user.
Also, the manager's new deal form has the assignee field.
