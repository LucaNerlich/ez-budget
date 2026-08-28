"use client";
import {useContext} from "react";
import {DataContext} from "../providers/DataContext";
import {CashflowRow, monthlyCashflow} from "./cashflow";

/**
 * Thin adapter: reads the resolved Budget from context and calls the pure
 * monthlyCashflow(). Carries ergonomics, not logic. The React Compiler caches
 * the result per budget change.
 */
export function useCashflow(): CashflowRow[] {
    const dataContext = useContext(DataContext);
    if (!dataContext) {
        throw new Error('useCashflow must be used within a DataProvider');
    }
    return monthlyCashflow(dataContext.budget);
}
