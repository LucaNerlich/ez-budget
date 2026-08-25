/**
 * Single source for month formatting: zero-padding, German names, and YYYY-MM keys.
 * Replaces the scattered 12-case switches, INDEX_MONTH_MAP, and inline ternaries.
 */
export const MONTH_NAMES_DE: Record<number, string> = {
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
 * Zero-pad a month to two digits ("01".."12").
 */
export function pad(month: number | string): string {
    return String(month).padStart(2, '0');
}

/**
 * German month name for 1..12. Anything else is an invariant violation and
 * fails loudly instead of rendering a placeholder.
 */
export function monthName(month: number | string): string {
    const name = MONTH_NAMES_DE[Number(month)];
    if (!name) throw new Error(`Unknown month: ${month}`);
    return name;
}

/**
 * "YYYY-MM" key for a (year, month) pair.
 */
export function monthKey(year: number | string, month: number | string): string {
    return `${year}-${pad(month)}`;
}
