import * as _ from "lodash";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Budget} from "../entities/raw/Budget";
import {MonthStats} from "../entities/stats/MonthStats";
import {YearStats} from "../entities/stats/YearStats";
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
    let allEntries = [];

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

        const monthStat: MonthStats = {} as MonthStats;
        monthStat.month = monthsData[i].month;
        monthStat.sum = round(sum);
        monthStats.push(monthStat);
    }

    return monthStats;
}

/**
 * Map of yearly sum per category, over the resolved Budget (entries are attributed
 * by month membership, so recurring-derived entries without a `date` are included).
 */
export function getSumMapForYear(budget: Budget, year: number | string): Map<string, number> {
    const yearSumMap = new Map();
    const target = Number(year);
    const yearData = budget.years.find((y) => y.year === target);
    if (!yearData) return yearSumMap;

    _.forEach(yearData.months, function (monthData) {
        _.forEach(monthData.entries, function (entry) {
            const category = (entry.category);
            const value = (entry.value);
            if (yearSumMap.has(category)) {
                const newSum = round(yearSumMap.get(category) + value);
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

export function getSumPerCategoryFromEntries(entries): Map<string, number> {
    const sums = new Map();

    _.forEach(entries, function (entry) {
        const category = entry.category;
        const entryAmount = entry.value;
        if (sums.has(category)) {
            const newSum = round(sums.get(category) + entryAmount);
            sums.set(category, newSum)
        } else {
            sums.set(category, entryAmount)
        }
    });

    return sums;
}

export function getExpenseSumPerCategoryFromEntries(entries): Map<string, number> {
    const sums = new Map();

    _.forEach(entries, function (entry) {
        const category = entry.category;
        const entryAmount = entry.value;
        if (entryAmount < 0) {
            if (sums.has(category)) {
                const newSum = round(sums.get(category) + entryAmount);
                sums.set(category, newSum)
            } else {
                sums.set(category, entryAmount)
            }
        }
    });

    return sums;
}

export function getIncomeSumPerCategoryFromEntries(entries): Map<string, number> {
    const sums = new Map();

    _.forEach(entries, function (entry) {
        const category = entry.category;
        const entryAmount = entry.value;
        if (entryAmount > 0) {
            if (sums.has(category)) {
                const newSum = round(sums.get(category) + entryAmount);
                sums.set(category, newSum)
            } else {
                sums.set(category, entryAmount)
            }
        }
    });

    return sums;
}

/**
 * Linear trend y-values for the given x/y series.
 * https://math.stackexchange.com/questions/204020
 */
export function getTrendArray(xArray, yArray): number[] {
    const yTrends = [];
    const n = xArray.length;

    const sumXY = [];
    _.forEach(xArray, function (x, i) {
        if (typeof yArray[i] !== 'undefined') {
            sumXY.push(x * yArray[i])
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

export function getSum(entries): number {
    return round(_.sum(entries.map((item) => {
        return parseFloat(item.value);
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
 * Returns an empty stats object when absent — callers legitimately query
 * before a month/year is selected (e.g. the neutral pre-mount state).
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
 * YearStats for a given year from precomputed stats. Every requested year must
 * exist in the stats derived from the same Budget — a miss is an invariant
 * violation and fails loudly instead of returning a hollow default.
 */
export function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats {
    const found = statsData.find((yearStats: YearStats) => yearStats.year === year);
    if (!found) throw new Error(`No stats computed for year ${year}`);
    return found;
}
