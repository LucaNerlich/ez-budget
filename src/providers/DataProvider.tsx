"use client";

import React, {useEffect, useMemo, useState} from 'react';
import {toBudget} from "../services/budget";
import {computeStatsData} from "../services/statistics";
import {DataContextType} from "../entities/raw/DataContextType";

// Typed React Context
export const DataContext = React.createContext<DataContextType | undefined>(undefined);
DataContext.displayName = "EzBudget Data Context";

export default function DataProvider({children}: { children: React.ReactNode }) {
    const [fileName, setFileName] = useState("");
    const [dataContainer, setDataContainer] = useState([]);
    const [statsContainer, setStatsContainer] = useState([]);

    // Resolve the raw upload into a Budget once per change (recurring expanded here).
    const budget = useMemo(() => toBudget(dataContainer), [dataContainer]);

    useEffect(() => {
        setStatsContainer(computeStatsData(budget))
    }, [budget]);

    const INITIAL_CONTEXT: DataContextType = useMemo(() => ({
        dataContainer,
        setDataContainer,
        budget,
        fileName,
        setFileName,
        statsContainer,
        setStatsContainer
    }), [dataContainer, budget, fileName, statsContainer]);

    return (
        <DataContext.Provider value={INITIAL_CONTEXT}>
            {children}
        </DataContext.Provider>
    );
}
