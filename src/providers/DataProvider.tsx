"use client";

import React, {useState} from 'react';
import {DataContext} from './DataContext';
import {toBudget} from "../services/budget";
import {computeStatsData} from "../services/statistics";
import {DataContextType} from "../entities/raw/DataContextType";
import {BudgetFile} from "../entities/raw/BudgetFile";

export default function DataProvider({children}: { children: React.ReactNode }) {
    const [fileName, setFileName] = useState("");
    const [dataContainer, setDataContainer] = useState<BudgetFile>([]);

    // Resolve the raw upload into a Budget once per change (recurring expanded here).
    const budget = toBudget(dataContainer);

    // Derive stats in the same commit as the budget change so consumers never
    // see a new budget paired with the previous file's stats.
    const statsContainer = computeStatsData(budget);

    const contextValue: DataContextType = {
        dataContainer,
        setDataContainer,
        budget,
        fileName,
        setFileName,
        statsContainer
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
}
