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
 * Does the input date reside between the start and end of the given year and month?
 */
export function isInYearMonth(input: any, year: number | string, month: number | string): boolean {
    const inputAsString = dayjs(input).format('YYYY-MM-DD');
    const date = dayjs(inputAsString);
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
    const date = dayjs(input);
    return date.isBetween(dayjs(start), dayjs(end), 'day', '[]');
}
