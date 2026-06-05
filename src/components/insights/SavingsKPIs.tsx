"use client";
import React, {useMemo} from 'react';
import {useDateService} from '../../services/DateService';
import {useCashflow} from '../../services/useCashflow';

export default function SavingsKPIs() {
    const dateService = useDateService();
    const rows = useCashflow();

    const kpis = useMemo(() => {
        if (!rows || rows.length === 0) return null;

        // Current year
        const currentYear = dateService.NOW.year();
        const thisYear = rows.filter(m => m.year === currentYear);
        const incomeYear = thisYear.reduce((a, b) => a + b.income, 0);
        const expenseYear = thisYear.reduce((a, b) => a + b.expense, 0); // negative
        const netYear = incomeYear + expenseYear;
        const savingsRateYear = incomeYear > 0 ? Math.round(((netYear) / incomeYear) * 1000) / 10 : 0;

        // Average monthly savings (across all data)
        const avgMonthlySavings = Math.round((rows.reduce((a, b) => a + b.net, 0) / rows.length) * 100) / 100;
        // Best/Worst month by net
        const bestMonth = rows.reduce((best, cur) => cur.net > best.net ? cur : best, rows[0]);
        const worstMonth = rows.reduce((worst, cur) => cur.net < worst.net ? cur : worst, rows[0]);

        return {
            savingsRateYear,
            incomeYear,
            expenseYear,
            netYear,
            avgMonthlySavings,
            bestMonth,
            worstMonth
        };
    }, [rows, dateService]);

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
