# Bug-03 — [Activities] Activity can be assigned to the deal the user cannot access

- **Severity:** High
- **Area:** Log activity form

## Steps to reproduce
1. Log in as the salesperson A
2. Click on Activities > Log activity
3. In the Deal dropdown select a deal owned by another user e.g. deal "id": 218 (est voluptatem recusandae)
4. Click on Save activity
5. Log in as a manager or salesperson B and check the deal "id" 218

## Expected result
The deals in dropdown should be limited to deals only assigned current user can access.
The action for linking an activity to deal that user cannot open should be rejected by server.

## Actual result
- The foreign deal is selectable from the deals dropdown.
- The activity can be saved and it appears on other user's deal
- A salesperson A can write a data on a deal they cannot read (when trying to read it 403 appears)

## Confidence
The activity is displayed on foreign user's deal when viewed as a manager or deal's owner. Also, deal_id point to a deal owned by another user (assigned_to=Meghan)
