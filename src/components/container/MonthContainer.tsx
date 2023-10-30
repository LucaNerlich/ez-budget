import React, {useContext, useEffect, useRef, useState} from "react";
import {useDataService} from "../../services/DataService";
import EditMonth from "../form/EditMonth";
import MonthAllChart from "../charts/MonthAllChart";
import {useDateService} from "../../services/DateService";
import {DataContext} from "../../../pages/_app";
import {INDEX_MONTH_MAP} from "../../../constants";
import * as _ from "lodash";
import {DataContextType} from "../../entities/raw/DataContextType";
import {MonthStats} from "../../entities/stats/MonthStats";
import {useStatisticsService} from "../../services/StatisticsService";
import {useColorService} from "../../services/ColorService";

export default function MonthContainer(props) {
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);
    const dataService = useDataService();
    const dateService = useDateService();
    const colorService = useColorService();
    const statisticsService = useStatisticsService();

    const yearSelect = useRef(null);
    const monthSelect = useRef(null);
    const [yearOptions, setYearOptions] = useState([]);
    const [monthOptions, setMonthOptions] = useState([]);
    const [yearMonth, setYearMonth] = useState({
        year: dateService.NOW.year(),
        month: dateService.NOW.month() + 1
    })
    const [currentMonth, setCurrentMonth] = useState<MonthStats>({} as MonthStats);

    function handleYearChange(e) {
        setYearMonth({
            year: e.target.value,
            month: yearMonth.month
        })
    }

    function handleMonthChange(e) {
        setYearMonth({
            year: yearMonth.year,
            month: e.target.value
        })
    }

    function generateYearMonthOptions() {
        const availableMonths = dataService.getAvailableMonths(dataContext.dataContainer, yearMonth.year);
        const availableYears = dataService.getAvailableYears(dataContext.dataContainer);

        const yearOptionTags = [];
        availableYears.map(availableYear => {
            yearOptionTags.push(
                <option key={availableYear} value={availableYear}>
                    {availableYear}
                </option>
            )
        })
        setYearOptions(yearOptionTags);

        const monthOptionTags = [];
        availableMonths.map(availableMonth => {
            monthOptionTags.push(
                <option key={availableMonth} value={availableMonth}>
                    {INDEX_MONTH_MAP.get(availableMonth)}
                </option>
            )
        })
        setMonthOptions(monthOptionTags);
    }


    useEffect(() => {
        setCurrentMonth(dataService.getStatsForYearMonth(dataContext.statsContainer, yearMonth.year, yearMonth.month))
        generateYearMonthOptions();
    }, [dataContext.dataContainer, yearMonth])

    return (
        <div>
            <h1 className="mt-3">
                Übersicht {dateService.getMonthAsString(yearMonth.month)} - {yearMonth.year}
            </h1>

            {/* Jahr und Monatsdropdown */}
            <form className="mb-3">
                <div>
                    <div className="row">
                        <div className="col">
                            {!_.isEmpty(yearOptions) &&
                                <select ref={yearSelect} defaultValue={yearMonth.year}
                                        onChange={(e) => handleYearChange(e)}
                                        className="mt-3 mb-3 form-select">
                                    {yearOptions}
                                </select>
                            }
                        </div>
                        <div className="col">
                            {!_.isEmpty(monthOptions) &&
                                <select ref={monthSelect} defaultValue={yearMonth.month}
                                        onChange={(e) => handleMonthChange(e)}
                                        className="mt-3 mb-3 form-select">
                                    {monthOptions}
                                </select>
                            }
                        </div>
                    </div>
                </div>
            </form>


            <h2>Ergebnis: &nbsp;
                {currentMonth.sum &&
                    <span style={{backgroundColor: colorService.getPositiveNegativeColor(currentMonth.sum)}}>
                    {statisticsService.round(currentMonth.sum)}
                    </span>
                }
            </h2>
            <hr/>
            <MonthAllChart year={yearMonth.year} month={yearMonth.month}/>
            <hr/>
            <EditMonth year={yearMonth.year} month={yearMonth.month}/>
        </div>
    );
};
