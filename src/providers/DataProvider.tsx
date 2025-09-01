"use client";

import React, {useEffect, useMemo, useState} from 'react';
import {useDataService} from "../services/DataService";
import {DataContextType} from "../entities/raw/DataContextType";

// Typed React Context
export const DataContext = React.createContext<DataContextType | undefined>(undefined);
DataContext.displayName = "EzBudget Data Context";

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [fileName, setFileName] = useState("");
  const [dataContainer, setDataContainer] = useState([]);
  const [statsContainer, setStatsContainer] = useState([]);
  const dataService = useDataService();

  useEffect(() => {
    dataService.init(dataContainer, setStatsContainer)
  }, [dataContainer]);

  const INITIAL_CONTEXT: DataContextType = useMemo(() => ({
    dataContainer,
    setDataContainer,
    fileName,
    setFileName,
    statsContainer,
    setStatsContainer
  }), [dataContainer, fileName, statsContainer]);

  return (
    <DataContext.Provider value={INITIAL_CONTEXT}>
      {children}
    </DataContext.Provider>
  );
}


