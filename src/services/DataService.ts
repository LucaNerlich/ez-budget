import {useStatisticsService} from "./StatisticsService";
import {Year} from "../entities/raw/Year";
import {YearStats} from "../entities/stats/YearStats";
import _ from "lodash";
import {MonthStats} from "../entities/stats/MonthStats";
import {sortMapByNumberValue} from "../Util";

export const useDataService = () => {
    const statisticsService = useStatisticsService();

    function getYearMonthKey(year: number, month: number): string {
        const mm = month < 10 ? `0${month}` : `${month}`;
        return `${year}-${mm}`;
    }

    function normalizeInput(rawInput: any): { years: any[]; recurring: any[] } {
        if (Array.isArray(rawInput)) {
            return {years: rawInput, recurring: []};
        }
        if (rawInput && typeof rawInput === 'object') {
            const years = rawInput.years || rawInput.data || [];
            const recurring = rawInput.recurring || [];
            return {years, recurring};
        }
        return {years: [], recurring: []};
    }

    function findActiveRecurringFor(year: number, month: number, recurringRules: any[]): Map<string, any> {
        const key = getYearMonthKey(year, month);
        const active = recurringRules.filter((r) => {
            const from: string = (r.from || r.start || r.effective_from || '').slice(0, 7);
            const until: string | undefined = (r.until || r.end || r.effective_until || '')?.slice(0, 7) || undefined;
            if (!from) return false;
            const geFrom = key >= from;
            const leUntil = until ? key <= until : true;
            return geFrom && leUntil;
        });

        // Choose latest rule per (category, comment) tuple (max from)
        const chosen = new Map<string, any>();
        for (const r of active) {
            const category = r.category;
            const comment = r.comment || '';
            const from = (r.from || r.start || r.effective_from || '').slice(0, 7);
            if (!category || !from) continue;
            const keyTuple = `${category}||${comment}`;
            const prev = chosen.get(keyTuple);
            if (!prev) {
                chosen.set(keyTuple, r);
            } else {
                const prevFrom = (prev.from || prev.start || prev.effective_from || '').slice(0, 7);
                if (from > prevFrom) chosen.set(keyTuple, r);
            }
        }
        return chosen;
    }

    function applyRecurring(years: any[], recurringRules: any[]): any[] {
        if (!recurringRules || recurringRules.length === 0) return years;
        const result: any[] = [];
        for (let i = 0; i < years.length; i++) {
            const y = years[i];
            const months = y.months || [];
            const newMonths: any[] = [];
            for (let j = 0; j < months.length; j++) {
                const m = months[j];
                const ymActive = findActiveRecurringFor(y.year, m.month, recurringRules);
                // Track existing entries by (category, comment) to allow month-specific overrides
                const existingKeys = new Set<string>((m.entries || []).map((e) => `${e.category}||${(e.comment || '')}`));
                const mergedEntries = [...(m.entries || [])];
                ymActive.forEach((rule, keyTuple) => {
                    if (!existingKeys.has(keyTuple)) {
                        mergedEntries.push({category: rule.category, value: rule.value, comment: rule.comment});
                    }
                });
                newMonths.push({...m, entries: mergedEntries});
            }
            result.push({...y, months: newMonths});
        }
        return result;
    }

    function computeStatsData(dataContainer: any): any[] {
        const statsData = [];
        const {years, recurring} = normalizeInput(dataContainer);
        const rawData = applyRecurring(years, recurring);

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

        return statsData;
    }

    function init(dataContainer: any, setStatsContainer: (arg0: any[]) => void) {
        const statsData = computeStatsData(dataContainer);
        setStatsContainer(statsData)
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
        const {years, recurring} = normalizeInput(dataContainer);
        const data = applyRecurring(years, recurring);
        for (let i = 0, len = data.length; i < len; i++) {
            // if we do === comparison fails...
            if (data[i].year == year) {
                let monthEntries = data[i].months;
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
        // Preserve escapes; only prettify and normalize newlines for display
        const json = JSON.stringify(s, null, 4);
        return json.replace(/\r?\n/g, '\n');
    }

    function getAvailableMonths(dataContainer, year) {
        const {years, recurring} = normalizeInput(dataContainer);
        const data = applyRecurring(years, recurring);
        const months = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].year == year) {
                for (let j = 0; j < data[i].months.length; j++) {
                    months.push(data[i].months[j].month)
                }
                break;
            }
        }

        return months;
    }

    /**
     * Retrieves the available years from the data container.
     *
     * @param {Array} dataContainer - The container holding the data.
     * @return {Array} - An array of available years.
     */
    function getAvailableYears(dataContainer) {
        const {years, recurring} = normalizeInput(dataContainer);
        const data = applyRecurring(years, recurring);
        const yearList = [];

        for (let i = 0; i < data.length; i++) {
            yearList.push(data[i].year)
        }

        return yearList;
    }

    return {
        init,
        computeStatsData,
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
