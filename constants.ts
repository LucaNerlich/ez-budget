// Colors
export const RGBA_GREEN = 'rgba(46,199,14,0.9)';
export const RGBA_RED = 'rgba(239,51,18,0.9)';
export const RGBA_WHITE = 'rgba(255,255,255,0.9)';

// Cookies
export const COOKIE_LOAD_VIA_URL: string = 'loadViaUrl'
export const COOKIE_REMOTE_FILE_URL: string = 'remoteFileUrl'

// Months
export const JANUARY: string = "Januar";
export const FEBRUARY: string = "Februar";
export const MARCH: string = "Maerz";
export const APRIL: string = "April";
export const MAY: string = "Mai";
export const JUNE: string = "Juni";
export const JULY: string = "Juli";
export const AUGUST: string = "August";
export const SEPTEMBER: string = "September";
export const OCTOBER: string = "Oktober";
export const NOVEMBER: string = "November";
export const DECEMBER: string = "Dezember";

export const INDEX_MONTH_MAP: Map<number, string> = new Map([
    [1, JANUARY],
    [2, FEBRUARY],
    [3, MARCH],
    [4, APRIL],
    [5, MAY],
    [6, JUNE],
    [7, JULY],
    [8, AUGUST],
    [9, SEPTEMBER],
    [10, OCTOBER],
    [11, NOVEMBER],
    [12, DECEMBER],
]);

export const TEST_CATEGORIES: Array<string> = [
    "Lebensmittel",
    "Shopping",
    "Restaurants",
    "Warmmiete",
    "Transport",
    "Unterhaltung",
    "Versicherungen",
    "Abonnements",
    "Gehalt",
    "Sonstiges"
];

// getRandomFloat(1.5, 3.5, 2); // 👉️ 2.18
export function getRandomFloat(min: number, max: number, decimals: number): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
}
