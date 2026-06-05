import {describe, expect, it} from 'vitest';
import {Budget} from '../entities/raw/Budget';
import {cumulativeByYear, linearRegression, monthlyCashflow, rollingAverage} from './cashflow';

const budget: Budget = {
    years: [
        {
            year: 2023,
            months: [
                {month: 2, entries: [{category: 'Gehalt', value: 1000}, {category: 'Miete', value: -400}]},
                {month: 1, entries: [{category: 'Gehalt', value: 1000}, {category: 'Essen', value: -250}, {category: 'Bonus', value: 0}]},
            ],
        },
        {
            year: 2024,
            months: [
                {month: 1, entries: [{category: 'Gehalt', value: 1200}, {category: 'Miete', value: -500}]},
            ],
        },
    ],
};

describe('monthlyCashflow', () => {
    it('splits entries by sign and computes net per month', () => {
        const rows = monthlyCashflow(budget);
        expect(rows.map(r => r.key)).toEqual(['2023-01', '2023-02', '2024-01']);

        const jan23 = rows.find(r => r.key === '2023-01')!;
        // value 0 counts as income (>= 0)
        expect(jan23.income).toBe(1000);
        expect(jan23.expense).toBe(-250);
        expect(jan23.net).toBe(750);
    });

    it('sorts ascending by YYYY-MM key across years', () => {
        const rows = monthlyCashflow(budget);
        const keys = rows.map(r => r.key);
        expect(keys).toEqual([...keys].sort((a, b) => a.localeCompare(b)));
    });

    it('returns [] for an empty budget', () => {
        expect(monthlyCashflow({years: []})).toEqual([]);
    });
});

describe('cumulativeByYear', () => {
    it('accumulates net within each year, resetting per year', () => {
        const rows = monthlyCashflow(budget);
        const byYear = cumulativeByYear(rows);

        const y2023 = byYear.get(2023)!;
        expect(y2023.map(p => p.cum)).toEqual([750, 1350]); // 750, then +600

        const y2024 = byYear.get(2024)!;
        expect(y2024.map(p => p.cum)).toEqual([700]);
    });
});

describe('rollingAverage', () => {
    it.each([
        {values: [2, 4, 6], window: 2, expected: [2, 3, 5]},
        {values: [1, 2, 3, 4], window: 12, expected: [1, 1.5, 2, 2.5]},
        {values: [], window: 3, expected: []},
    ])('window $window over $values', ({values, window, expected}) => {
        expect(rollingAverage(values, window)).toEqual(expected);
    });
});

describe('linearRegression', () => {
    it('fits a perfect line (y = 2x)', () => {
        const {a, b} = linearRegression([2, 4, 6, 8]); // x = 1..4
        expect(a).toBeCloseTo(2, 10);
        expect(b).toBeCloseTo(0, 10);
    });

    it('returns zero slope/intercept for a single point (denominator 0)', () => {
        expect(linearRegression([42])).toEqual({a: 0, b: 0});
    });
});
