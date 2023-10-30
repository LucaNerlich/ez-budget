import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../../pages/_app";
import {DataContextType} from "../../entities/raw/DataContextType";
import {YearStats} from "../../entities/stats/YearStats";
import {useDateService} from "../../services/DateService";
import {useDataService} from "../../services/DataService";
import {useColorService} from "../../services/ColorService";
import YearStatComponent from "./YearStatComponent";

interface YearCategoryContainer {
    year: number,
    statsForYear: YearStats,
    categoriesForYear: any
}

export interface Category {
    category: string,
    sum: number,
}

export function mapCategoriesToRows(categories: Category[], colorService) {
    if (!categories) return;
    return categories.map((value: Category, index: number) => {
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
}

export default function YearContainer() {
    const dateService = useDateService();
    const dataService = useDataService();
    const colorService = useColorService();
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [yearCategoryContainers, setYearCategoryContainers] = useState<YearCategoryContainer[]>([])

    useEffect(() => {
        const currentYear = dateService.NOW.year();
        const availableYears: number[] = dataService.getAvailableYears(dataContext.dataContainer);

        const allYears: YearCategoryContainer[] = []
        availableYears.forEach(year => {
            const statsForYear = dataService.getStatsForYear(dataContext.statsContainer, year);
            const categoriesForYear = mapCategoriesToRows(statsForYear.categories, colorService);
            allYears.push({
                year,
                statsForYear,
                categoriesForYear
            })
        })
        allYears.reverse();
        setYearCategoryContainers(allYears);
    }, [dataContext.statsContainer]);

    return (
        <div>
            <h1 className="mt-3">Jahresergebnisse</h1>
            {yearCategoryContainers.map(container => {
                return <YearStatComponent
                    key={container.year}
                    currentYearStats={container.statsForYear}
                    opened={container.year === dateService.NOW.year()}/>
            })}
        </div>
    );
};
