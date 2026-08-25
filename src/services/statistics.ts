import * as _ from "lodash";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Budget} from "../entities/raw/Budget";
import {CategorySum, YearStats} from "../entities/stats/YearStats";
import {MonthStats} from "../entities/stats/MonthStats";
import {sortMapByNumberValue} from "../Util";
import {getEntriesForMonth} from "./budget";

/**
 * Budget statistics. Plain functions — the test surface.
 */

export function round(float: number): number {
    return Math.round((float + Number.EPSILON) * 100) / 100;
}

/**
 * Income/expense sum for the given year.
 */
export function getSumForYear(yearData: Year): number {
    let sum = 0;
    const months: Array<Month> = yearData.months;

    for (let i = 0; i < months.length; i++) {
        const entries = months[i].entries;
        for (let j = 0; j < entries.length; j++) {
            sum = sum + entries[j].value;
        }
    }

    return sum;
}

export function getCategorySums(monthData: Array<Month>): Map<string, number> {
    let allEntries: Entry[] = [];

    for (let i = 0; i < monthData.length; i++) {
        allEntries = allEntries.concat(monthData[i].entries);
    }

    return getSumPerCategoryFromEntries(allEntries);
}

export function getMonthStats(monthsData: Array<Month>): Array<MonthStats> {
    const monthStats: Array<MonthStats> = [];

    for (let i = 0; i < monthsData.length; i++) {
        let sum = 0;
        const entries: Array<Entry> = monthsData[i].entries;

        for (let j = 0; j < entries.length; j++) {
            sum = sum + entries[j].value;
        }

        monthStats.push({month: monthsData[i].month, sum: round(sum)});
    }

    return monthStats;
}

/**
 * Map of yearly sum per category, over the resolved Budget (entries are attributed
 * by month membership, so recurring-derived entries without a `date` are included).
 */
export function getSumMapForYear(budget: Budget, year: number | string): Map<string, number> {
    const yearSumMap = new Map<string, number>();
    const target = Number(year);
    const yearData = budget && budget.years ? budget.years.find((y) => y.year === target) : undefined;
    if (!yearData) return yearSumMap;

    _.forEach(yearData.months, function (monthData) {
        _.forEach(monthData.entries, function (entry) {
            const category = (entry.category);
            const value = (entry.value);
            if (typeof category === 'undefined' || typeof value === 'undefined') {
                return;
            }
            if (yearSumMap.has(category)) {
                const newSum = round((yearSumMap.get(category) ?? 0) + value);
                yearSumMap.set(category, newSum)
            } else {
                yearSumMap.set(category, value)
            }
        });
    });

    return yearSumMap;
}

/**
 * Income/expense sum for the given year and month of the resolved Budget.
 */
export function getSumForYearMonth(budget: Budget, year: number | string, month: number | string): number {
    return getSum(getEntriesForMonth(budget, year, month));
}

function sumPerCategory(entries: Entry[], keepValue: (value: number) => boolean): Map<string, number> {
    const sums = new Map<string, number>();

    _.forEach(entries, function (entry) {
        const category = entry.category;
        const entryAmount = entry.value;
        if (!keepValue(entryAmount)) {
            return;
        }
        if (sums.has(category)) {
            const newSum = round((sums.get(category) ?? 0) + entryAmount);
            sums.set(category, newSum)
        } else {
            sums.set(category, entryAmount)
        }
    });

    return sums;
}

export function getSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumPerCategory(entries, () => true);
}

export function getExpenseSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumPerCategory(entries, (entryAmount) => entryAmount < 0);
}

export function getIncomeSumPerCategoryFromEntries(entries: Entry[]): Map<string, number> {
    return sumPerCategory(entries, (entryAmount) => entryAmount > 0);
}

/**
 * Linear trend y-values for the given x/y series.
 * https://math.stackexchange.com/questions/204020
 */
export function getTrendArray(xArray: number[], yArray: Array<number | undefined>): number[] {
    const yTrends: number[] = [];
    const n = xArray.length;

    const sumXY: number[] = [];
    _.forEach(xArray, function (x, i) {
        const y = yArray[i];
        if (typeof y !== 'undefined') {
            sumXY.push(x * y)
        }
    });

    const dividend = (n * _.sum(sumXY)) - (_.sum(xArray) * _.sum(yArray));
    const quotient1 = _.sumBy(xArray, function (x) {
        return Math.pow(x, 2);
    });
    const quotient2 = Math.pow(_.sum(xArray), 2)
    const quotient = (n * quotient1) - quotient2;
    if (quotient === 0) return yTrends;

    const a = dividend / quotient;
    const b = (_.sum(yArray) - (a * _.sum(xArray))) / n;

    _.forEach(xArray, function (value) {
        const y = a * value + b;
        yTrends.push(round(y));
    });

    return yTrends;
}

export function getSum(entries: Entry[]): number {
    return round(_.sum(entries.map((item) => {
        return Number(item.value);
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

        const categorySums: CategorySum[] = [];
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
 * YearStats for a given year from precomputed stats; null when absent.
 */
export function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats | null {
    return statsData.find((candidate) => candidate.year === year) ?? null;
}
