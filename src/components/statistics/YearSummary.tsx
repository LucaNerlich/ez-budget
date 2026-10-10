"use client";
import React, {useContext} from "react";
import {DataContext} from "../../providers/DataContext";
import {YearStats} from "../../entities/stats/YearStats";
import {monthName} from "../../services/month";
import {round} from "../../services/statistics";
import {getPositiveNegativeColor} from "../../services/colors";

export default function YearSummary() {
    const dataContext = useContext(DataContext);
    if (!dataContext) throw new Error('YearSummary requires a DataProvider');

    // Derived during render — the React Compiler caches this.
    const tableBodies = dataContext.statsContainer.map((yearStat: YearStats, i: number) => (
        <tbody key={yearStat.year}>
        <tr>
            <th scope="row">{i + 1}</th>
            <td>{yearStat.year}</td>
            <td>{round(yearStat.sum)}</td>
        </tr>
        <tr>
            <td colSpan={3}>
                <table className="table mb-0">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Monat</th>
                        <th scope="col">Ergebnis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {yearStat.months.map((month) => {
                        return <tr key={month.month}>
                            <th scope="row">{month.month}</th>
                            <td>{monthName(month.month)}</td>
                            <td>
                                <span className="amount"
                                      style={{color: getPositiveNegativeColor(month.sum)}}>
                                    {round(month.sum)}
                                </span>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    ));

    return (
        <div>
            <table className="table table-striped">
                <caption className="visually-hidden">Ergebnis pro Jahr und Monat</caption>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Jahr</th>
                    <th scope="col">Ergebnis</th>
                </tr>
                </thead>
                {tableBodies}
            </table>
        </div>
    );
}
