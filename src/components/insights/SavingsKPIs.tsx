"use client";
import React, {useContext, useMemo} from 'react';
import {DataContext} from '../../providers/DataProvider';
import {useDataService} from '../../services/DataService';
import {useDateService} from '../../services/DateService';

export default function SavingsKPIs() {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();
    const dateService = useDateService();

    const monthsAll = useMemo(() => {
        const rows: Array<{ year: number; month: number; income: number; expense: number; net: number }> = [];
        if (!dataContext.dataContainer) return rows;
        const years = (dataService as any).getAvailableYears ? (dataService as any).getAvailableYears(dataContext.dataContainer) : [];
        for (let i = 0; i < years.length; i++) {
            const y = years[i];
            const months = (dataService as any).getAvailableMonths ? (dataService as any).getAvailableMonths(dataContext.dataContainer, y) : [];
            for (let j = 0; j < months.length; j++) {
                const m = months[j];
                const entries = (dataService as any).getAllEntriesYearMonth ? (dataService as any).getAllEntriesYearMonth(dataContext.dataContainer, y, m) : [];
                let income = 0;
                let expense = 0;
                for (let k = 0; k < entries.length; k++) {
                    const v = Number(entries[k].value) || 0;
                    if (v >= 0) income += v; else expense += v;
                }
                rows.push({year: y, month: m, income, expense, net: income + expense});
            }
        }
        return rows;
    }, [dataContext.dataContainer, dataService]);

    const kpis = useMemo(() => {
        if (!monthsAll || monthsAll.length === 0) return null;

        // Current year
        const currentYear = dateService.NOW.year();
        const thisYear = monthsAll.filter(m => m.year === currentYear);
        const incomeYear = thisYear.reduce((a, b) => a + b.income, 0);
        const expenseYear = thisYear.reduce((a, b) => a + b.expense, 0); // negative
        const netYear = incomeYear + expenseYear;
        const savingsRateYear = incomeYear > 0 ? Math.round(((netYear) / incomeYear) * 1000) / 10 : 0;

        // Average monthly savings (across all data)
        const avgMonthlySavings = Math.round((monthsAll.reduce((a, b) => a + b.net, 0) / monthsAll.length) * 100) / 100;
        // Best/Worst month by net
        const bestMonth = monthsAll.reduce((best, cur) => cur.net > best.net ? cur : best, monthsAll[0]);
        const worstMonth = monthsAll.reduce((worst, cur) => cur.net < worst.net ? cur : worst, monthsAll[0]);

        return {
            savingsRateYear,
            incomeYear,
            expenseYear,
            netYear,
            avgMonthlySavings,
            bestMonth,
            worstMonth
        };
    }, [monthsAll, dateService]);

    if (!kpis) return null;

    function ym({year, month}: { year: number; month: number }) {
        return `${year}-${month < 10 ? '0' + month : month}`;
    }

    const nf = new Intl.NumberFormat('de-DE');

    return (
        <div className="mt-4">
            <h2>Ersparnis KPIs</h2>
            <div className="row g-3">
                <div className="col-12 col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div>Sparquote (dieses Jahr)</div>
                            <strong>{kpis.savingsRateYear}%</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div>Durchschnittliche Monatsersparnis</div>
                            <strong>{nf.format(kpis.avgMonthlySavings)}</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div>Bester Monat</div>
                            <strong>{ym(kpis.bestMonth)}: {nf.format(kpis.bestMonth.net)}</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div>Schlechtester Monat</div>
                            <strong>{ym(kpis.worstMonth)}: {nf.format(kpis.worstMonth.net)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


