import {describe, expect, it} from 'vitest';
import {getExpenseSumPerCategoryFromEntries, getIncomeSumPerCategoryFromEntries} from './statistics';

describe('sumByCategory rounding', () => {
    it('rounds a single-entry category like any other sum', () => {
        const expense = getExpenseSumPerCategoryFromEntries([{category: 'Single', value: -12.345}]);
        expect(expense.get('Single')).toBe(-12.34);

        const income = getIncomeSumPerCategoryFromEntries([{category: 'Single', value: 12.345}]);
        expect(income.get('Single')).toBe(12.35);
    });

    it('stays consistent across accumulated updates', () => {
        const map = getIncomeSumPerCategoryFromEntries([
            {category: 'Gehalt', value: 1000},
            {category: 'Gehalt', value: 250.5},
        ]);
        expect(map.get('Gehalt')).toBe(1250.5);
    });
});
