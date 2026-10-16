import dayjs from 'dayjs';

/**
 * Current moment as a dayjs. A function (not a captured constant) so callers
 * always read a fresh "now" rather than an import-time snapshot.
 */
export function now() {
    return dayjs(new Date());
}
