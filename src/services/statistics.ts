import * as _ from "lodash";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Budget} from "../entities/raw/Budget";
import {MonthStats} from "../entities/stats/MonthStats";
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
        const monthStat = {} as MonthStats;
        monthStat.month = monthData.month;
        monthStat.sum = round(sumEntryValues(monthData.entries));
        return monthStat;
    });
}

/**
 * Map of yearly sum per category, over the resolved Budget (entries are attributed
 * by month membership, so recurring-derived entries without a `date` are included).
 */
export function getSumMapForYear(budget: Budget, year: number | string): Map<string, number> {
    const yearData = findYear(budget, year);
    if (!yearData) return new Map();

    return sumByCategory(
        _.flatMap(yearData.months, 'entries'),
        (entry) => typeof entry.category !== 'undefined' && typeof entry.value !== 'undefined',
    );
}

/**
 * Income/expense sum for the given year and month of the resolved Budget.
 */
export function getSumForYearMonth(budget: Budget, year: number | string, month: number | string): number {
    return getSum(getEntriesForMonth(budget, year, month));
}

function getSumPerCategoryFromEntries(entries): Map<string, number> {
    return sumByCategory(entries);
}

export function getExpenseSumPerCategoryFromEntries(entries): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value < 0);
}

export function getIncomeSumPerCategoryFromEntries(entries): Map<string, number> {
    return sumByCategory(entries, (entry) => entry.value > 0);
}

/**
 * Linear trend y-values for the given x/y series.
 * https://math.stackexchange.com/questions/204020
 */
export function getTrendArray(xArray, yArray): number[] {
    const xs = [];
    const ys = [];
    _.forEach(xArray, function (x, i) {
        if (typeof yArray[i] !== 'undefined') {
            xs.push(x);
            ys.push(yArray[i]);
        }
    });

    const fit = leastSquaresFit(xs, ys);
    if (!fit) return [];

    return xArray.map(function (x) {
        return round(fit.a * x + fit.b);
    });
}

function getSum(entries): number {
    return round(_.sum(entries.map((item) => {
        return parseFloat(item.value);
    })));
}

/**
 * Per-year statistics for an entire resolved Budget.
 */
export function computeStatsData(budget: Budget): YearStats[] {
    const statsData: YearStats[] = [];
    const years = budget && budget.years ? budget.years : [];

    for (let i = 0; i < years.length; i++) {
        const yearData: Year = years[i];

        const sumForYear = getSumForYear(yearData);
        const monthStats: Array<MonthStats> = getMonthStats(yearData.months);
        const categorySumsMap = getCategorySums(yearData.months);
        const sortedCategorySumsMap = sortMapByNumberValue(categorySumsMap);

        const categorySums = [];
        sortedCategorySumsMap.forEach((value, key) => {
            categorySums.push({category: key, sum: value})
        })

        const yearStatsData: YearStats = {} as YearStats;
        yearStatsData.year = yearData.year;
        yearStatsData.sum = round(sumForYear);
        yearStatsData.months = monthStats;
        yearStatsData.categories = categorySums;

        statsData.push(yearStatsData);
    }

    return statsData;
}

/**
 * MonthStats for a given year and month from precomputed stats.
 */
export function getStatsForYearMonth(statsData: Array<YearStats>, year: number, month: number): MonthStats {
    let monthStat: MonthStats = undefined;

    _.filter(statsData, function (yearStats: YearStats) {
        if (yearStats.year == year) {
            const months: Array<MonthStats> = yearStats.months;
            for (let i = 0; i < months.length; i++) {
                if (months[i].month == month) {
                    monthStat = months[i];
                    return;
                }
            }
        }
    });

    return monthStat ? monthStat : {} as MonthStats;
}

/**
 * YearStats for a given year from precomputed stats.
 */
export function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats {
    const filteredEntries = _.filter(statsData, function (yearStats: YearStats) {
        return yearStats.year === year;
    });

    if (filteredEntries && filteredEntries.length > 0) {
        return filteredEntries[0];
    }

    return {} as YearStats;
}
