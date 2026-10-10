"use client";
import React, {useContext, useState} from "react";
import {getAvailableMonths, getAvailableYears} from "../../services/budget";
import {getStatsForYearMonth, round} from "../../services/statistics";
import EditMonth from "../form/EditMonth";
import dynamic from 'next/dynamic';
import {monthName} from "../../services/month";
import {DataContext} from "../../providers/DataContext";
import {useMounted, useToday} from "../../services/useToday";
import {getPositiveNegativeColor} from "../../services/colors";

const MonthAllChart = dynamic(() => import('../charts/MonthAllChart'), {ssr: false, loading: () => null});

export default function MonthContainer() {
    const dataContext = useContext(DataContext);
    if (!dataContext) throw new Error('MonthContainer requires a DataProvider');

    const mounted = useMounted();
    const today = useToday();

    // user-selected override; falls back to today (neutral {0, 0} until hydrated)
    const [selected, setSelected] = useState<{year: number, month: number} | null>(null);
    const yearMonth = selected ?? today;

    const availableYears = getAvailableYears(dataContext.budget);
    const availableMonths = getAvailableMonths(dataContext.budget, yearMonth.year);
    const currentMonth = getStatsForYearMonth(dataContext.statsContainer, yearMonth.year, yearMonth.month);

    function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const year = Number(e.target.value);
        const months = getAvailableMonths(dataContext.budget, year);
        const month = months.length > 0 ? Math.min(...months) : yearMonth.month;
        setSelected({year: year, month: month});
    }

    function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelected({year: yearMonth.year, month: Number(e.target.value)});
    }

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
                            {availableYears.length > 0 &&
                              <div>
                                  <label htmlFor="month-year-select" className="form-label">Jahr</label>
                                  <select id="month-year-select" value={yearMonth.year}
                                          onChange={(e) => handleYearChange(e)}
                                          className="mb-3 form-select">
                                      {availableYears.map((availableYear) => (
                                          <option key={availableYear} value={availableYear}>
                                              {availableYear}
                                          </option>
                                      ))}
                                  </select>
                              </div>
                            }
                        </div>
                        <div className="col">
                            {availableMonths.length > 0 &&
                              <div>
                                  <label htmlFor="month-select" className="form-label">Monat</label>
                                  <select id="month-select" value={yearMonth.month}
                                          onChange={(e) => handleMonthChange(e)}
                                          className="mb-3 form-select">
                                      {availableMonths.map((availableMonth) => (
                                          <option key={availableMonth} value={availableMonth}>
                                              {monthName(availableMonth)}
                                          </option>
                                      ))}
                                  </select>
                              </div>
                            }
                        </div>
                    </div>
                </div>
            </form>


            <h2>Ergebnis: &nbsp;
                {currentMonth?.sum &&
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
