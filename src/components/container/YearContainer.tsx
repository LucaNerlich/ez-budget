"use client";
import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../providers/DataProvider";
import {DataContextType} from "../../entities/raw/DataContextType";
import {YearStats} from "../../entities/stats/YearStats";
import {now} from "../../services/date";
import {getAvailableYears} from "../../services/budget";
import {getStatsForYear} from "../../services/statistics";
import {getPositiveNegativeColor} from "../../services/colors";
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

export function mapCategoriesToRows(categories: Category[]) {
    if (!categories) return;
    return categories.map((value: Category, index: number) => {
        return (
            <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>{value.category}</td>
                <td>
                    <span style={{backgroundColor: getPositiveNegativeColor(value.sum)}}>
                        {value.sum}
                    </span>
                </td>
            </tr>
        );
    });
}

export default function YearContainer() {
    // @ts-ignore
    const dataContext: DataContextType = useContext(DataContext);

    const [yearCategoryContainers, setYearCategoryContainers] = useState<YearCategoryContainer[]>([])

    useEffect(() => {
        const availableYears: number[] = getAvailableYears(dataContext.budget);

        const allYears: YearCategoryContainer[] = []
        availableYears.forEach(year => {
            const statsForYear = getStatsForYear(dataContext.statsContainer, year);
            const categoriesForYear = mapCategoriesToRows(statsForYear.categories);
            allYears.push({
                year,
                statsForYear,
                categoriesForYear
            })
        })
        allYears.reverse();
        setYearCategoryContainers(allYears);
    }, [dataContext.budget, dataContext.statsContainer]);

    return (
        <div>
            <h1 className="mt-3">Jahresergebnisse</h1>
            {yearCategoryContainers.map(container => {
                return <YearStatComponent
                    key={container.year}
                    currentYearStats={container.statsForYear}
                    opened={container.year === now().year()}/>
            })}
        </div>
    );
};
