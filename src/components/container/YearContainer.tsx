import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../../pages/_app";
import {DataContextType} from "../../entities/raw/DataContextType";
import {YearStats} from "../../entities/stats/YearStats";
import {useDateService} from "../../services/DateService";
import {useDataService} from "../../services/DataService";
import {useStatisticsService} from "../../services/StatisticsService";
import {useColorService} from "../../services/ColorService";
import YearStatComponent from "./YearStatComponent";

export default function YearContainer(props) {
    const dateService = useDateService();
    const dataService = useDataService();
    const colorService = useColorService();
    const statisticsService = useStatisticsService();
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [categoryRows, setCategoryRows] = useState([]);
    const [currentYearStats, setCurrentYearStats] = useState<YearStats>({} as YearStats);
    const [yearStats, setYearStats] = useState<YearStats[]>([])

    useEffect(() => {
        const currentYear = dateService.NOW.year();
        const availableYears = dataService.getAvailableYears(dataContext.dataContainer);
        setCurrentYearStats(dataService.getStatsForYear(dataContext.statsContainer, currentYear))
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
            <YearStatComponent currentYearStats={currentYearStats} categoryRows={categoryRows}/>
        </div>
    );
};
