import {describe, expect, it} from 'vitest';
import {defaultMonthFor, getAvailableMonths, getAvailableYears, getEntriesForMonth, toBudget} from './budget';

describe('toBudget — input shape', () => {
    it('accepts a bare Year[] array', () => {
        const b = toBudget([{year: 2024, months: [{month: 1, entries: []}]}]);
        expect(getAvailableYears(b)).toEqual([2024]);
    });

    it('accepts { years, recurring } object form', () => {
        const b = toBudget({years: [{year: 2024, months: [{month: 1, entries: []}]}], recurring: []});
        expect(getAvailableYears(b)).toEqual([2024]);
    });

    it('returns an empty budget for junk input', () => {
        expect(toBudget(null).years).toEqual([]);
        expect(toBudget(42).years).toEqual([]);
    });
});

describe('toBudget — recurring expansion', () => {
    const raw = {
        years: [
            {year: 2024, months: [{month: 1, entries: []}, {month: 2, entries: [{category: 'Miete', value: -999, comment: ''}]}]},
        ],
        recurring: [
            {category: 'Miete', value: -500, comment: '', from: '2024-01'},
            {category: 'Gehalt', value: 2000, comment: '', from: '2024-02'},
        ],
    };

    it('injects an active rule into a month that lacks it', () => {
        const b = toBudget(raw);
        const jan = getEntriesForMonth(b, 2024, 1);
        expect(jan).toContainEqual({category: 'Miete', value: -500, comment: ''});
    });

    it('does not override a month-specific entry with the same (category, comment)', () => {
        const b = toBudget(raw);
        const feb = getEntriesForMonth(b, 2024, 2);
        const miete = feb.filter(e => e.category === 'Miete');
        // month-specific -999 wins; recurring -500 is not added
        expect(miete).toEqual([{category: 'Miete', value: -999, comment: ''}]);
    });

    it('respects the rule start month (from)', () => {
        const b = toBudget(raw);
        expect(getEntriesForMonth(b, 2024, 1).some(e => e.category === 'Gehalt')).toBe(false);
        expect(getEntriesForMonth(b, 2024, 2).some(e => e.category === 'Gehalt')).toBe(true);
    });
});

describe('lookups', () => {
    const b = toBudget([
        {year: 2024, months: [{month: 3, entries: [{category: 'B', value: 1}, {category: 'A', value: 2}]}]},
    ]);

    it('coerces string year/month and finds the month', () => {
        expect(getAvailableMonths(b, '2024')).toEqual([3]);
        expect(getEntriesForMonth(b, '2024', '3').map(e => e.category)).toEqual(['A', 'B']); // sorted by category
    });

    it('returns [] for missing year/month', () => {
        expect(getAvailableMonths(b, 1999)).toEqual([]);
        expect(getEntriesForMonth(b, 2024, 12)).toEqual([]);
    });
});

describe('defaultMonthFor', () => {
    const b = toBudget([
        {year: 2023, months: [{month: 5, entries: []}, {month: 7, entries: []}]},
        {year: 2024, months: [{month: 2, entries: []}, {month: 11, entries: []}]},
    ]);

    it('keeps today when the budget covers it', () => {
        expect(defaultMonthFor(b, {year: 2024, month: 2})).toEqual({year: 2024, month: 2});
    });

    it('falls back to the latest available month when today is absent', () => {
        expect(defaultMonthFor(b, {year: 2026, month: 10})).toEqual({year: 2024, month: 11});
        expect(defaultMonthFor(b, {year: 2024, month: 6})).toEqual({year: 2024, month: 11});
    });

    it('passes the neutral pre-hydration value and empty budgets through', () => {
        expect(defaultMonthFor(b, {year: 0, month: 0})).toEqual({year: 0, month: 0});
        expect(defaultMonthFor(toBudget([]), {year: 2026, month: 10})).toEqual({year: 2026, month: 10});
    });

    it('skips a latest year without months and lands on the newest one that has them', () => {
        const b = toBudget([
            {year: 2024, months: [{month: 5, entries: [{category: 'A', value: 10}]}]},
            {year: 2026, months: []},
        ]);
        expect(defaultMonthFor(b, {year: 2026, month: 10})).toEqual({year: 2024, month: 5});
    });
});
