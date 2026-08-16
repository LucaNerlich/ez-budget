import {describe, expect, it} from 'vitest';
import {Budget} from '../entities/raw/Budget';
import {getSumForYearMonth, getSumMapForYear, getTrendArray} from './statistics';

const budget: Budget = {
    years: [
        {
            year: 2024,
            months: [
                {month: 1, entries: [
                    {category: 'Gehalt', value: 1000, date: '2024-01-01'},
                    {category: 'Miete', value: -400, date: '2024-01-15'},
                    {category: 'Abo', value: -50}, // recurring-derived: no date
                ]},
                {month: 2, entries: [
                    {category: 'Gehalt', value: 1200, date: '2024-02-01'},
                ]},
            ],
        },
        {
            year: 2025,
            months: [
                {month: 1, entries: [
                    {category: 'Gehalt', value: 900, date: '2025-01-01'},
                ]},
            ],
        },
    ],
};

describe('getSumMapForYear', () => {
    it('sums per category including recurring-derived entries without a date', () => {
        const map = getSumMapForYear(budget, 2024);
        expect(map.get('Gehalt')).toBe(2200);
        expect(map.get('Miete')).toBe(-400);
        expect(map.get('Abo')).toBe(-50);
    });

    it('only counts entries of the requested year', () => {
        const map = getSumMapForYear(budget, 2025);
        expect(map.get('Gehalt')).toBe(900);
        expect(map.has('Miete')).toBe(false);
    });

    it('returns an empty map for an unknown year', () => {
        expect(getSumMapForYear(budget, 1999).size).toBe(0);
    });
});

describe('getSumForYearMonth', () => {
    it('sums the requested month including date-less recurring entries', () => {
        expect(getSumForYearMonth(budget, 2024, 1)).toBe(550);
        expect(getSumForYearMonth(budget, 2024, 2)).toBe(1200);
    });

    it('returns 0 for an unknown year or month', () => {
        expect(getSumForYearMonth(budget, 2024, 12)).toBe(0);
        expect(getSumForYearMonth(budget, 1999, 1)).toBe(0);
    });
});

describe('getTrendArray', () => {
    it('fits a known linear series (y = 2x + 1)', () => {
        const x = [1, 2, 3, 4];
        const y = [3, 5, 7, 9];
        const trend = getTrendArray(x, y);
        expect(trend).toEqual([3, 5, 7, 9]);
    });

    it('handles a flat series', () => {
        const trend = getTrendArray([1, 2, 3], [4, 4, 4]);
        expect(trend).toEqual([4, 4, 4]);
    });

    it('does not return NaN for a single-point series', () => {
        expect(getTrendArray([1], [5])).toEqual([]);
    });

    it('ignores undefined y values instead of corrupting the sums', () => {
        const trend = getTrendArray([1, 2, 3], [2, undefined, 6]);
        expect(trend.length).toBe(3);
        expect(trend.every((v) => Number.isFinite(v))).toBe(true);
    });
});
