import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../../pages/_app";
import {DataContextType} from "../../entities/raw/DataContextType";
import {YearStats} from "../../entities/stats/YearStats";
import {useDateService} from "../../services/DateService";
import {useDataService} from "../../services/DataService";
import {useStatisticsService} from "../../services/StatisticsService";
import {useColorService} from "../../services/ColorService";

export default function YearContainer(props) {
    const dateService = useDateService();
    const dataService = useDataService();
    const colorService = useColorService();
    const statisticsService = useStatisticsService();
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [categoryRows, setCategoryRows] = useState([]);
    const [currentYearStats, setCurrentYearStats] = useState<YearStats>({} as YearStats);

    useEffect(() => {
        setCurrentYearStats(dataService.getStatsForYear(dataContext.statsContainer, dateService.NOW.year()))
    }, [dataContext.statsContainer]);

    useEffect(() => {
        setCategoryRows(currentYearStats.categories?.map((value, index) => {
            return (
                <tr key={index + 1}>
                    <th scope="row">{index + 1}</th>
                    <td>{value.category}</td>
                    <td>
                        <span style={{backgroundColor: colorService.getPositiveNegativeColor(value.sum)}}>
                            {value.sum}
                        </span>
                    </td>
                </tr>
            );
        }))
    }, [currentYearStats])

    return (
        <div>
            <h1 className="mt-3">
                Übersicht - {currentYearStats.year}
            </h1>
            <h2>Revenue: {statisticsService.round(currentYearStats.sum)}</h2>

            <hr/>

            <h2>Ergebnis pro Kategorie</h2>

            {/* maybe display as bar chart */}
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Kategorie</th>
                    <th scope="col">Summe</th>
                </tr>
                </thead>
                <tbody>
                {categoryRows}
                </tbody>
            </table>
            {/*<YearAllChart entries={entries}/>*/}

            <hr/>
            {/*<MonthSummary entries={entries}/>*/}
        </div>
    );
};
