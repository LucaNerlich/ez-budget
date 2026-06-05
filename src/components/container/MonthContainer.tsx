"use client";
import React, {useContext, useEffect, useRef, useState} from "react";
import {getAvailableMonths, getAvailableYears} from "../../services/budget";
import {getStatsForYearMonth, round} from "../../services/statistics";
import EditMonth from "../form/EditMonth";
import dynamic from 'next/dynamic';
import {now} from "../../services/date";
import {monthName} from "../../services/month";
import {DataContext} from "../../providers/DataProvider";
import isEmpty from 'lodash/isEmpty';
import {DataContextType} from "../../entities/raw/DataContextType";
import {MonthStats} from "../../entities/stats/MonthStats";
import {getPositiveNegativeColor} from "../../services/colors";

const MonthAllChart = dynamic(() => import('../charts/MonthAllChart'), {ssr: false, loading: () => null});

export default function MonthContainer(props) {
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const yearSelect = useRef(null);
    const monthSelect = useRef(null);
    const [yearOptions, setYearOptions] = useState([]);
    const [monthOptions, setMonthOptions] = useState([]);
    const [yearMonth, setYearMonth] = useState({
        year: now().year(),
        month: now().month() + 1
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
        const availableMonths = getAvailableMonths(dataContext.budget, yearMonth.year);
        const availableYears = getAvailableYears(dataContext.budget);

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
                    {monthName(availableMonth)}
                </option>
            )
        })
        setMonthOptions(monthOptionTags);
    }


    useEffect(() => {
        setCurrentMonth(getStatsForYearMonth(dataContext.statsContainer, yearMonth.year, yearMonth.month))
        generateYearMonthOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataContext.budget, dataContext.statsContainer, yearMonth])

    return (
        <div>
            <h1 className="mt-3">
                Übersicht {monthName(yearMonth.month)} - {yearMonth.year}
            </h1>

            {/* Jahr und Monatsdropdown */}
            <form className="mb-3">
                <div>
                    <div className="row">
                        <div className="col">
                            {!isEmpty(yearOptions) &&
                              <select ref={yearSelect} defaultValue={yearMonth.year}
                                      onChange={(e) => handleYearChange(e)}
                                      className="mt-3 mb-3 form-select">
                                  {yearOptions}
                              </select>
                            }
                        </div>
                        <div className="col">
                            {!isEmpty(monthOptions) &&
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
                  <span className="amount" style={{color: getPositiveNegativeColor(currentMonth.sum)}}>
                    {round(currentMonth.sum)}
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
