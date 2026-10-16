"use client";
import React, {useContext} from "react";
import {DataContext} from "../../providers/DataContext";
import {now} from "../../services/date";
import {useMounted} from "../../services/useToday";
import YearStatComponent from "./YearStatComponent";

export default function YearContainer() {
    const dataContext = useContext(DataContext);
    if (!dataContext) throw new Error('YearContainer requires a DataProvider');

    // avoid a hydration mismatch at year boundaries: "opened" is date-dependent
    const mounted = useMounted();

    // Newest year first; statsContainer is already emitted in budget.years order.
    const stats = dataContext.statsContainer.toReversed();

    return (
        <div>
            <h1 className="mt-3">Jahresergebnisse</h1>
            {stats.map((yearStats) => (
                <YearStatComponent
                    key={yearStats.year}
                    currentYearStats={yearStats}
                    opened={mounted && yearStats.year === now().year()}/>
            ))}
        </div>
    );
}
