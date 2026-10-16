// https://stackoverflow.com/a/61957932/4034811
export function sortMapByNumberValue<TKey>(map: Map<TKey, number>): Map<TKey, number> {
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

/**
 * Random item of a non-empty array; undefined for missing/empty input.
 */
export function getRandomItemFromArray<TItem>(array: Array<TItem> | undefined): TItem | undefined {
    if (array && array.length > 0) {
        return array[Math.floor(Math.random() * array.length)];
    }
    return undefined;
}

export function getDateString(year: number, month: number, day: number): string {
    return year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0')
}

/**
 * Pretty-print JSON for display: 4-space indent.
 */
export function jsFriendlyJSONStringify<S>(s: S): string {
    return JSON.stringify(s, null, 4);
}
