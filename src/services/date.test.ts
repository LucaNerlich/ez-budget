import {describe, expect, it} from 'vitest';
import {isInYear, isInYearMonth} from './date';

describe('isInYearMonth', () => {
    it('attributes date-only strings by their calendar date', () => {
        expect(isInYearMonth('2024-01-15', 2024, 1)).toBe(true);
        expect(isInYearMonth('2024-01-15', 2024, 2)).toBe(false);
    });

    it('attributes full timestamps by their date portion, not the local instant', () => {
        expect(isInYearMonth('2024-01-01T00:30:00Z', 2024, 1)).toBe(true);
        expect(isInYearMonth('2024-01-01T00:30:00Z', 2023, 12)).toBe(false);
    });

    it('excludes the last day of the previous month', () => {
        expect(isInYearMonth('2024-01-31T23:59:00Z', 2024, 2)).toBe(false);
        expect(isInYearMonth('2024-01-31T23:59:00Z', 2024, 1)).toBe(true);
    });
});

describe('isInYear', () => {
    it('covers the whole year', () => {
        expect(isInYear('2024-06-15', 2024)).toBe(true);
        expect(isInYear('2023-12-31', 2024)).toBe(false);
        expect(isInYear('2024-01-01', 2024)).toBe(true);
    });

    it('attributes full timestamps by their date portion, not the local instant', () => {
        expect(isInYear('2024-01-01T00:30:00Z', 2024)).toBe(true);
        expect(isInYear('2024-01-01T00:30:00Z', 2023)).toBe(false);
    });
});
