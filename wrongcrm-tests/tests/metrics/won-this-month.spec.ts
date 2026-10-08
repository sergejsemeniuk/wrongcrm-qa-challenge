import { test, expect } from '../../fixtures/auth';
import { getProps, getAll, isCurrentMonth } from '../../fixtures/helpers';

// BUG-12 (Medium): "Won this month" ignores the month filter and sums all won
// deals (confirmed by a deal with won_at in the previous month being included).
// Correct behaviour: it sums only deals whose won_at is in the current month.

test('BUG-12 "Won this month" only counts deals won in the current month', async ({ manager }) => {
  const dash = await getProps(manager, '/dashboard');
  const reported: number = dash.metrics.won_this_month;

  const deals = await getAll(manager, '/deals', 'deals');
  const expected = deals
    .filter((d) => d.stage === 'won' && isCurrentMonth(d.won_at))
    .reduce((sum, d) => sum + parseFloat(d.value), 0);

  expect(reported, 'should match only current-month won deals').toBeCloseTo(expected, 2);
});
