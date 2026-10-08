# Bug-01 — [Leads] Salesperson can read and edit other user's leads

- **Severity:** Critical
- **Area:** Leads list page, Lead details page, Lead edit page

## Steps to reproduce
1. Log in as the salesperson A
2. Open the Leads page
3. Open a lead that belongs to another user directly e.g. /lead/197 (belongs to saleperson B)
4. Click Edit
5. Change any data name/status/company/contact/source/email
6. Click Save Changes

## Expected result
Salesperson can only access and edit their own leads. 
Foreign leads (which are not assigned to current user) are not displayed in the leads list.
Notes: the behaviour should be simillar to how the Deals work e.g. GET /deals/{ID} return 403 for another user's deal, the deals list show only deals assigned to current user

## Actual result
-The leads list returns leads for all users (assigned to salesperson A, salesperson B and manager). 
-Salesperson can open foreign lead successefully GET /leads/197
-Saleperson can edit and save foreign lead successefully

## Confidence
This is data disclosure and data modification of foreign user
