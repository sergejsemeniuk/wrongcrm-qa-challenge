# Bug-07 — [Deals] Cannot move deal to the Lost stage via UI

- **Severity:** Medium
- **Area:** Deal details page

## Steps to reproduce
1. Login as Salesperson A
2. Click on Deals
3. Open any deal with new, qualified, proposal status
4. Check the "Move to" button on each

## Expected result
"Lost" is valid stage and should be selectable.

## Actual result
Move to' only offers the next forward stage and "Won" on proposal, but never "Lost"

## Confidence
Checked on multiple stages and "Lost" exist in stages list, deals filters and some deals already have stage set as lost
