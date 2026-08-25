/**
 * Single source for month formatting: zero-padding, German names, and YYYY-MM keys.
 * Replaces the scattered 12-case switches, INDEX_MONTH_MAP, and inline ternaries.
 */
const MONTH_NAMES_DE: Record<number, string> = {
    1: 'Januar',
    2: 'Februar',
    3: 'März',
    4: 'April',
    5: 'Mai',
    6: 'Juni',
    7: 'Juli',
    8: 'August',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'Dezember',
};

/**
 * Zero-pad a 1..12 month to two digits ("01".."12"). Out-of-range input is
 * returned as-is (preserves the previous getValidMonthString fallback).
 */
export function pad(month: number): string {
    if (Number.isInteger(month) && month >= 1 && month <= 12) {
        return String(month).padStart(2, '0');
    }
    return String(month);
}

/**
 * German month name for 1..12, or "ERROR" for anything else.
 */
export function monthName(month: number): string {
    return MONTH_NAMES_DE[month] ?? 'ERROR';
}

/**
 * "YYYY-MM" key for a (year, month) pair.
 */
export function monthKey(year: number, month: number): string {
    return `${year}-${pad(month)}`;
}
