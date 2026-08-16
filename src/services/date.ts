import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {pad} from './month';

dayjs.extend(isBetween);

/**
 * Date predicates over the budget data. Plain functions — the test surface.
 */

/**
 * Current moment as a dayjs. A function (not a captured constant) so callers
 * always read a fresh "now" rather than an import-time snapshot.
 */
export function now() {
    return dayjs(new Date());
}

/**
 * Date-only portion of an input: strips time-of-day from strings starting with
 * "YYYY-MM-DD" (e.g. "2024-01-01T00:30:00Z") so month/year attribution does not
 * depend on the viewer's timezone. Other inputs are passed through untouched.
 */
function dateOnly(input: any): any {
    const s = String(input ?? '');
    return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : input;
}

/**
 * Does the input date reside between the start and end of the given year and month?
 */
export function isInYearMonth(input: any, year: number | string, month: number | string): boolean {
    const date = dayjs(dateOnly(input));
    const start = dayjs(`${year}-${pad(month)}-01`);
    const end = start.endOf('month');
    return date.isBetween(start, end, 'month', '[]');
}

/**
 * Is the input date today?
 */
export function isToday(input: any): boolean {
    return dayjs(input).isSame(now(), 'day');
}

/**
 * Does the input date reside between the start and end of the given year?
 */
export function isInYear(input: any, year: number | string): boolean {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    const date = dayjs(dateOnly(input));
    return date.isBetween(dayjs(start), dayjs(end), 'day', '[]');
}
