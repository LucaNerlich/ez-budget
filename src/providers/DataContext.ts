import {createContext} from 'react';
import {DataContextType} from "../entities/raw/DataContextType";

// Typed React Context
export const DataContext = createContext<DataContextType | undefined>(undefined);
DataContext.displayName = "EzBudget Data Context";
