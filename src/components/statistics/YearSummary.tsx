"use client";
import React, {useContext, useEffect, useState} from "react";
import {DataContextType} from "../../entities/raw/DataContextType";
import {DataContext} from "../../providers/DataProvider";
import {YearStats} from "../../entities/stats/YearStats";
import {monthName} from "../../services/month";
import {round} from "../../services/statistics";
import {getPositiveNegativeColor} from "../../services/colors";

export default function YearSummary(props) {
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [tableBodies, setTableBodies] = useState([]);


    useEffect(() => {
        const tableBodyDivs = [];
        const statsContainer = dataContext.statsContainer;
        for (let i = 0; i < statsContainer.length; i++) {
            const yearStat: YearStats = statsContainer[i];

            tableBodyDivs.push(
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
                                        <span
                                            style={{backgroundColor: getPositiveNegativeColor(month.sum)}}>
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
            )
        }
        setTableBodies(tableBodyDivs);
    }, [dataContext.statsContainer]);

    return (
        <div>
            <table className="table table-striped">
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
