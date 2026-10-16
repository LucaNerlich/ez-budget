import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Budget} from "../entities/raw/Budget";
import {MonthStats} from "../entities/stats/MonthStats";
import {Category} from "../entities/stats/Category";
import {YearStats} from "../entities/stats/YearStats";
import {sortMapByNumberValue} from "../Util";

/**
 * Budget statistics. Plain functions — the test surface.
 */

export function round(float: number): number {
    return Math.round((float + Number.EPSILON) * 100) / 100;
}

function sumEntryValues(entries: Array<Entry>): number {
    return entries.reduce((sum, entry) => sum + entry.value, 0);
}

function sumByCategory(entries: Array<Entry>, predicate?: (entry: Entry) => boolean): Map<string, number> {
    const sums = new Map<string, number>();

    for (const entry of entries) {
        if (predicate && !predicate(entry)) {
            continue;
        }
        const category = entry.category;
        sums.set(category, round((sums.get(category) ?? 0) + entry.value));
    }

    return sums;
}

/**
 * Income/expense sum for the given year.
 */
function getSumForYear(yearData: Year): number {
    return sumEntryValues(yearData.months.flatMap((month) => month.entries));
}

function getCategorySums(monthData: Array<Month>): Map<string, number> {
    return sumByCategory(monthData.flatMap((month) => month.entries));
}

function getMonthStats(monthsData: Array<Month>): Array<MonthStats> {
    return monthsData.map(function (monthData): MonthStats {
        return {month: monthData.month, sum: round(sumEntryValues(monthData.entries))};
    });
}

export function getExpenseSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value < 0);
}

export function getIncomeSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value > 0);
}

/**
 * Per-year statistics for an entire resolved Budget.
 */
export function computeStatsData(budget: Budget): YearStats[] {
    const statsData: YearStats[] = [];
    const years = budget.years;

    for (let i = 0; i < years.length; i++) {
        const yearData: Year = years[i];

        const sumForYear = getSumForYear(yearData);
        const monthStats: Array<MonthStats> = getMonthStats(yearData.months);
        const categorySumsMap = getCategorySums(yearData.months);
        const sortedCategorySumsMap = sortMapByNumberValue(categorySumsMap);

        const categorySums: Category[] = [];
        sortedCategorySumsMap.forEach((value, key) => {
            categorySums.push({category: key, sum: value})
        })

        statsData.push({
            year: yearData.year,
            sum: round(sumForYear),
            months: monthStats,
            categories: categorySums,
        });
    }

    return statsData;
}

/**
 * MonthStats for a given year and month from precomputed stats; null when absent.
 */
export function getStatsForYearMonth(statsData: Array<YearStats>, year: number, month: number): MonthStats | null {
    const yearStats = statsData.find((candidate) => candidate.year === year);
    return yearStats ? yearStats.months.find((m) => m.month === month) ?? null : null;
}

/**
 * YearStats for a given year from precomputed stats. Every requested year must
 * exist in the stats derived from the same Budget — a miss is an invariant
 * violation and fails loudly instead of returning a hollow default.
 */
export function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats {
    const found = statsData.find((yearStats: YearStats) => yearStats.year === year);
    if (!found) throw new Error(`No stats computed for year ${year}`);
    return found;
}
