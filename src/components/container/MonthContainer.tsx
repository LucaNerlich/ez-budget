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
    // neutral values during SSR/hydration; filled after mount to avoid
    // hydration mismatches at month/year boundaries
    const [mounted, setMounted] = useState(false);
    const [yearMonth, setYearMonth] = useState({
        year: 0,
        month: 0
    })
    const [currentMonth, setCurrentMonth] = useState<MonthStats>({} as MonthStats);

    useEffect(() => {
        setYearMonth({
            year: now().year(),
            month: now().month() + 1
        });
        setMounted(true);
    }, [])

    function handleYearChange(e) {
        const year = e.target.value;
        const availableMonths = getAvailableMonths(dataContext.budget, year);
        const month = availableMonths.length > 0 ? Math.min(...availableMonths) : yearMonth.month;
        setYearMonth({
            year: year,
            month: month
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
                {mounted ? `Übersicht ${monthName(yearMonth.month)} - ${yearMonth.year}` : 'Übersicht'}
            </h1>

            {/* Jahr und Monatsdropdown */}
            <form className="mb-3">
                <div>
                    <div className="row">
                        <div className="col">
                            {!isEmpty(yearOptions) &&
                              <div>
                                  <label htmlFor="month-year-select" className="form-label">Jahr</label>
                                  <select ref={yearSelect} id="month-year-select" value={yearMonth.year}
                                          onChange={(e) => handleYearChange(e)}
                                          className="mb-3 form-select">
                                      {yearOptions}
                                  </select>
                              </div>
                            }
                        </div>
                        <div className="col">
                            {!isEmpty(monthOptions) &&
                              <div>
                                  <label htmlFor="month-select" className="form-label">Monat</label>
                                  <select ref={monthSelect} id="month-select" value={yearMonth.month}
                                          onChange={(e) => handleMonthChange(e)}
                                          className="mb-3 form-select">
                                      {monthOptions}
                                  </select>
                              </div>
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
