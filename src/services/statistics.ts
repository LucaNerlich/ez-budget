import * as _ from "lodash";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Budget} from "../entities/raw/Budget";
import {MonthStats} from "../entities/stats/MonthStats";
import {Category} from "../entities/stats/Category";
import {YearStats} from "../entities/stats/YearStats";
import {sortMapByNumberValue} from "../Util";
import {findYear, getEntriesForMonth} from "./budget";
import {leastSquaresFit} from "./regression";

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

    _.forEach(entries, function (entry) {
        if (predicate && !predicate(entry)) {
            return;
        }
        const category = entry.category;
        const value = entry.value;
        sums.set(category, sums.has(category) ? round(sums.get(category) + value) : value);
    });

    return sums;
}

/**
 * Income/expense sum for the given year.
 */
function getSumForYear(yearData: Year): number {
    return sumEntryValues(_.flatMap(yearData.months, 'entries'));
}

function getCategorySums(monthData: Array<Month>): Map<string, number> {
    return sumByCategory(_.flatMap(monthData, 'entries'));
}

function getMonthStats(monthsData: Array<Month>): Array<MonthStats> {
    return monthsData.map(function (monthData): MonthStats {
        return {month: monthData.month, sum: round(sumEntryValues(monthData.entries))};
    });
}

/**
 * Map of yearly sum per category, over the resolved Budget (entries are attributed
 * by month membership, so recurring-derived entries without a `date` are included).
 */
export function getSumMapForYear(budget: Budget, year: number | string): Map<string, number> {
    const yearData = findYear(budget, year);
    if (!yearData) return new Map();

    return sumByCategory(_.flatMap(yearData.months, 'entries'));
}

/**
 * Income/expense sum for the given year and month of the resolved Budget.
 */
export function getSumForYearMonth(budget: Budget, year: number | string, month: number | string): number {
    return getSum(getEntriesForMonth(budget, year, month));
}

function getSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumByCategory(entries);
}

export function getExpenseSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value < 0);
}

export function getIncomeSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value > 0);
}

/**
 * Linear trend y-values for the given x/y series.
 * https://math.stackexchange.com/questions/204020
 */
export function getTrendArray(xArray: number[], yArray: Array<number | undefined>): number[] {
    const xs: number[] = [];
    const ys: number[] = [];
    _.forEach(xArray, function (x, i) {
        const y = yArray[i];
        if (typeof y !== 'undefined') {
            xs.push(x);
            ys.push(y);
        }
    });

    const fit = leastSquaresFit(xs, ys);
    if (!fit) return [];

    return xArray.map(function (x) {
        return round(fit.a * x + fit.b);
    });
}

function getSum(entries: Entry[]): number {
    return round(_.sum(entries.map((item) => {
        return Number(item.value);
    })));
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
