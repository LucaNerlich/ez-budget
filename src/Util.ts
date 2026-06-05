// https://stackoverflow.com/a/61957932/4034811
export function sortMapByNumberValue(map) {
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

export function getRandomItemFromArray(array) {
    if (array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export function getDateString(year: number, month: number, day: number): string {
    return year + "-" + month + "-" + day
}

/**
 * Pretty-print JSON for display: 4-space indent, normalized newlines.
 */
export function jsFriendlyJSONStringify(s: any): string {
    const json = JSON.stringify(s, null, 4);
    return json.replace(/\r?\n/g, '\n');
}
