"use client";
import React, {useContext} from "react";
import {DataContext} from "../../providers/DataContext";
import {YearStats} from "../../entities/stats/YearStats";
import {now} from "../../services/date";
import {getAvailableYears} from "../../services/budget";
import {getStatsForYear} from "../../services/statistics";
import {useMounted} from "../../services/useToday";
import YearStatComponent from "./YearStatComponent";

interface YearCategoryContainer {
    year: number,
    statsForYear: YearStats,
}

export default function YearContainer() {
    const dataContext = useContext(DataContext);
    if (!dataContext) throw new Error('YearContainer requires a DataProvider');

    // avoid a hydration mismatch at year boundaries: "opened" is date-dependent
    const mounted = useMounted();

    // Derived from context during render — the React Compiler caches this.
    const yearCategoryContainers: YearCategoryContainer[] = getAvailableYears(dataContext.budget)
        .map((year) => ({year, statsForYear: getStatsForYear(dataContext.statsContainer, year)}))
        .reverse();

    return (
        <div>
            <h1 className="mt-3">Jahresergebnisse</h1>
            {yearCategoryContainers.map(container => {
                return <YearStatComponent
                    key={container.year}
                    currentYearStats={container.statsForYear}
                    opened={mounted && container.year === now().year()}/>
            })}
        </div>
    );
};
