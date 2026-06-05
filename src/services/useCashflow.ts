"use client";
import {useContext, useMemo} from "react";
import {DataContext} from "../providers/DataProvider";
import {CashflowRow, monthlyCashflow} from "./cashflow";

/**
 * Thin adapter: reads the resolved Budget from context and calls the pure
 * monthlyCashflow(). Carries ergonomics, not logic.
 */
export function useCashflow(): CashflowRow[] {
    const dataContext = useContext(DataContext);
    const budget = dataContext?.budget;
    return useMemo(() => (budget ? monthlyCashflow(budget) : []), [budget]);
}
