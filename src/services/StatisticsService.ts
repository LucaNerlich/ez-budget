import * as _ from "lodash";
import {useDateService} from "./DateService";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {MonthStats} from "../entities/stats/MonthStats";
import {Entry} from "../entities/raw/Entry";

export const useStatisticsService = () => {
    const dateService = useDateService();

    /**
     * Calculates the income/expense sum for the given year.
     * @param yearData
     */
    function getSumForYear(yearData: Year) {
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

    function getCategorySums(monthData: Array<Month>) {
        let allEntries = [];

        for (let i = 0; i < monthData.length; i++) {
            allEntries = allEntries.concat(monthData[i].entries);
        }

        return getSumPerCategoryFromEntries(allEntries);
    }

    function getMonthStats(monthsData: Array<Month>): Array<MonthStats> {
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
     * Returns a Map with the yearly sum per category.
     * @param entries
     * @param year
     * @returns {Map<String, number>}
     */
    function getSumMapForYear(entries, year) {
        const yearSumMap = new Map();

        _.forEach(entries, function (entry) {
            // Support EzBudget entry shape
            const category = (entry.category);
            const value = (entry.value);
            const date = (entry.date);
            if (typeof category === 'undefined' || typeof value === 'undefined' || typeof date === 'undefined') {
                return;
            }
            if (dateService.isInYear(date, year)) {
                if (yearSumMap.has(category)) {
                    const newSum = round(yearSumMap.get(category) + value);
                    yearSumMap.set(category, newSum)
                } else {
                    yearSumMap.set(category, value)
                }
            }
        });

        return yearSumMap;
    }

    /**
     * Calculates the income/expense sum for the given year.
     * @param entries - array of entry objects
     * @param year - js Date
     * @param month - js Date
     */
    function getSumForYearMonth(entries, year, month) {
        const filteredEntries = _.filter(entries, function (entry) {
            const date = entry.date;
            return dateService.isInYearMonth(date, year, month);
        });

        return getSum(filteredEntries);
    }

    /**
     * Returns a Map with categories as strings.
     * @param entries -> Array of 'Entry' objects
     * returns Map(
     * categoryA -> String: sumA -> number,
     * categoryB -> String: sumB -> number,
     * );
     */
    function getSumPerCategoryFromEntries(entries) {
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

    /**
     * Returns a Map with all expense categories as strings.
     * @param entries -> Array of 'Entry' objects
     * returns Map(
     * categoryA -> String: sumA -> number,
     * categoryB -> String: sumB -> number,
     * );
     */
    function getExpenseSumPerCategoryFromEntries(entries) {
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

    /**
     * Returns a Map with all income categories as strings.
     * @param entries -> Array of 'Entry' objects
     * returns Map(
     * categoryA -> String: sumA -> number,
     * categoryB -> String: sumB -> number,
     * );
     */
    function getIncomeSumPerCategoryFromEntries(entries) {
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
     * Returns an Array y values. array[0] -> x0, array[1] -> x1
     * https://math.stackexchange.com/questions/204020/what-is-the-equation-used-to-calculate-a-linear-trendline
     * @param xArray -> corresponding x value -> e.g month as number
     * @param yArray -> original y values -> e.g income per month
     */
    function getTrendArray(xArray, yArray) {
        const yTrends = [];
        const n = xArray.length;

        const sumXY = [];
        _.forEach(xArray, function (x, i) {
            if (typeof yArray[i] === 'undefined') {
                sumXY.push(x);
            } else {
                sumXY.push(x + yArray[i])
            }
        });

        const dividend = (n * _.sum(sumXY)) - (_.sum(xArray) * _.sum(yArray));
        const quotient1 = _.sumBy(xArray, function (x) {
            return Math.pow(x, 2);
        });
        const quotient2 = Math.pow(_.sum(xArray), 2)
        const quotient = (n * quotient1) - quotient2;

        const a = dividend / quotient;
        const b = (_.sum(yArray) - (a * _.sum(xArray))) / n;

        _.forEach(xArray, function (value) {
            const y = a * value + b;
            yTrends.push(round(y));
        });

        return yTrends;
    }

    function getSum(entries) {
        return round(_.sum(entries.map((item, index) => {
            return parseFloat(item.value);
        })));
    }

    function round(float) {
        return Math.round((float + Number.EPSILON) * 100) / 100
    }

    return {
        getSumForYear,
        getSumMapForYear,
        getSumForYearMonth,
        getCategorySums,
        getExpenseSumPerCategoryFromEntries,
        getIncomeSumPerCategoryFromEntries,
        getTrendArray,
        round,
        getMonthStats
    };
};
