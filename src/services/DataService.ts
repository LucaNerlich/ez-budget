import {useStatisticsService} from "./StatisticsService";
import {Year} from "../entities/raw/Year";
import {YearStats} from "../entities/stats/YearStats";
import _ from "lodash";
import {MonthStats} from "../entities/stats/MonthStats";
import {sortMapByNumberValue} from "../Util";

export const useDataService = () => {
    const statisticsService = useStatisticsService();

    function init(dataContainer, setStatsContainer) {
        const statsData = [];
        const rawData = dataContainer;

        for (let i = 0; i < rawData.length; i++) {
            const yearData: Year = rawData[i];
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

        setStatsContainer(statsData)
    }

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

    function getStatsForYear(statsData: Array<YearStats>, year: number): YearStats {
        const filteredEntries = _.filter(statsData, function (yearStats: YearStats) {
            return yearStats.year === year;
        });

        if (filteredEntries && filteredEntries.length > 0) {
            return filteredEntries[0];
        }

        return {} as YearStats;
    }

    /**
     * Returns Array of all Entry Objects
     * @param setState -> pass method handler to setState with / or other method to handle data.
     */
    function getAllEntries(setState) {
        const documents = [];
        setState(documents);
    }

    /**
     * Get all entries for given month by number value
     * @param dataContainer
     * @param year -> number
     * @param month -> number
     */
    function getAllEntriesYearMonth(dataContainer, year, month) {
        for (let i = 0, len = dataContainer.length; i < len; i++) {
            // if we do === comparison fails...
            if (dataContainer[i].year == year) {
                let monthEntries = dataContainer[i].months;
                for (let j = 0, len = monthEntries.length; j < len; j++) {
                    if (monthEntries[j].month == month) {
                        const entries = monthEntries[j].entries;
                        // sort by category
                        return entries.sort(function (a, b) {
                            const nameA = a.category.toUpperCase(); // ignore upper and lowercase
                            const nameB = b.category.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                }
            }
        }
        return [];
    }

    /**
     * Returns Array of all Categories.
     * @param dataContainer
     */
    function getAllCategories(dataContainer) {
        const categories = [];
        return categories;
    }

    function jsFriendlyJSONStringify(s) {
        return JSON.stringify(s, null, 4)
            .replace(/\\r/g, '\r')
            .replace(/\\n/g, '\n')
            .replace(/\\/g, '');
    }

    function getAvailableMonths(dataContainer, year) {
        const months = [];

        for (let i = 0; i < dataContainer.length; i++) {
            if (dataContainer[i].year == year) {
                for (let j = 0; j < dataContainer[i].months.length; j++) {
                    months.push(dataContainer[i].months[j].month)
                }
                break;
            }
        }

        return months;
    }

    function getAvailableYears(dataContainer) {
        const years = [];

        for (let i = 0; i < dataContainer.length; i++) {
            years.push(dataContainer[i].year)
        }

        return years;
    }

    return {
        init,
        getAllEntries,
        getAllEntriesYearMonth,
        getAllCategories,
        getAvailableMonths,
        getAvailableYears,
        jsFriendlyJSONStringify,
        getStatsForYear,
        getStatsForYearMonth
    };
};
