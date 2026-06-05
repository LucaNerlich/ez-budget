import {useStatisticsService} from "./StatisticsService";
import {Year} from "../entities/raw/Year";
import {Budget} from "../entities/raw/Budget";
import {YearStats} from "../entities/stats/YearStats";
import _ from "lodash";
import {MonthStats} from "../entities/stats/MonthStats";
import {sortMapByNumberValue} from "../Util";
import {getAvailableMonths, getAvailableYears, getEntriesForMonth} from "./budget";

export const useDataService = () => {
    const statisticsService = useStatisticsService();

    function computeStatsData(budget: Budget): YearStats[] {
        const statsData: YearStats[] = [];
        const years = budget && budget.years ? budget.years : [];

        for (let i = 0; i < years.length; i++) {
            const yearData: Year = years[i];
            const year = yearData.year;

            const sumForYear = statisticsService.getSumForYear(yearData);
            const monthStats: Array<MonthStats> = statisticsService.getMonthStats(yearData.months);
            const categorySumsMap = statisticsService.getCategorySums(yearData.months);
            const sortedCategorySumsMap = sortMapByNumberValue(categorySumsMap);

            const categorySums = [];
            sortedCategorySumsMap.forEach((value, key) => {
                categorySums.push({
                    category: key,
                    sum: value
                })
            })

            const yearStatsData: YearStats = {} as YearStats;
            yearStatsData.year = year;
            yearStatsData.sum = statisticsService.round(sumForYear);
            yearStatsData.months = monthStats;
            yearStatsData.categories = categorySums;

            statsData.push(yearStatsData);
        }

        return statsData;
    }

    function init(budget: Budget, setStatsContainer: (arg0: YearStats[]) => void) {
        setStatsContainer(computeStatsData(budget))
    }

    /**
     * Retrieves the statistics for a specific year and month.
     *
     * @param {Array<YearStats>} statsData - The array of YearStats objects containing the statistics data.
     * @param {number} year - The year to retrieve the statistics for.
     * @param {number} month - The month to retrieve the statistics for.
     * @returns {MonthStats} - The MonthStats object representing the statistics for the given year and month.
     */
    function getStatsForYearMonth(statsData: Array<YearStats>, year: number, month: number): MonthStats {
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
     * Retrieves the statistics for a given year from an array of YearStats objects.
     *
     * @param {Array<YearStats>} statsData - The array of YearStats objects to search in.
     * @param {number} year - The year to retrieve the statistics for.
     * @return {YearStats} - The statistics for the given year. If no statistics are found, an empty YearStats object is returned.
     */
    function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats {
        const filteredEntries = _.filter(statsData, function (yearStats: YearStats) {
            return yearStats.year === year;
        });

        if (filteredEntries && filteredEntries.length > 0) {
            return filteredEntries[0];
        }

        return {} as YearStats;
    }

    function jsFriendlyJSONStringify(s) {
        // Preserve escapes; only prettify and normalize newlines for display
        const json = JSON.stringify(s, null, 4);
        return json.replace(/\r?\n/g, '\n');
    }

    return {
        init,
        computeStatsData,
        getAllEntriesYearMonth: getEntriesForMonth,
        getAvailableMonths,
        getAvailableYears,
        jsFriendlyJSONStringify,
        getStatsForYear,
        getStatsForYearMonth
    };
};
