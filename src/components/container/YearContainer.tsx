import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../../pages/_app";
import {DataContextType} from "../../entities/raw/DataContextType";
import {YearStats} from "../../entities/stats/YearStats";
import {useDateService} from "../../services/DateService";
import {useDataService} from "../../services/DataService";
import {useStatisticsService} from "../../services/StatisticsService";
import {useColorService} from "../../services/ColorService";
import YearStatComponent from "./YearStatComponent";

interface YearCategoryContainer {
    year: number,
    statsForYear: YearStats,
    categoriesForYear: any
}

interface Category {
    category: string,
    sum: number,
}

export default function YearContainer(props) {
    const dateService = useDateService();
    const dataService = useDataService();
    const colorService = useColorService();
    const statisticsService = useStatisticsService();
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [categoryRows, setCategoryRows] = useState([]);
    const [currentYearStats, setCurrentYearStats] = useState<YearStats>({} as YearStats);
    const [yearCategoryContainers, setYearCategoryContainers] = useState<YearCategoryContainer[]>([])

    const mapCategoriesToRows = (categories: any) => categories?.map((value: Category, index: number) => {
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
    });

    useEffect(() => {
        const currentYear = dateService.NOW.year();
        const availableYears: number[] = dataService.getAvailableYears(dataContext.dataContainer);
        setCurrentYearStats(dataService.getStatsForYear(dataContext.statsContainer, currentYear))

        const allYears: YearCategoryContainer[] = []
        availableYears.forEach(year => {
            if (year != currentYear) {
                const statsForYear = dataService.getStatsForYear(dataContext.statsContainer, year);
                const categoriesForYear = mapCategoriesToRows(statsForYear.categories);
                allYears.push({
                    year,
                    statsForYear,
                    categoriesForYear
                })
            }
        })
        allYears.reverse();
        setYearCategoryContainers(allYears);
    }, [dataContext.statsContainer]);

    useEffect(() => {
        setCategoryRows(mapCategoriesToRows(currentYearStats.categories));
    }, [currentYearStats]);

    return (
        <div>
            <h1 className="mt-3">Jahresergebnisse</h1>

            <YearStatComponent currentYearStats={currentYearStats} categoryRows={categoryRows} opened={true}/>

            <details>
                <summary className="mt-4 mb-4"><h2 style={{display: "inline"}}>Archiv</h2></summary>

                {yearCategoryContainers.map(container => {
                    return <YearStatComponent
                        key={container.year}
                        currentYearStats={container.statsForYear}
                        categoryRows={container.categoriesForYear}
                        opened={false}/>
                })}
            </details>
        </div>
    );
};
