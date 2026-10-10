"use client";
import React from 'react';
import {now} from '../../services/date';
import {monthKey} from '../../services/month';
import {useCashflow} from '../../services/useCashflow';

const numberFormat = new Intl.NumberFormat('de-DE');

export default function SavingsKPIs() {
    const rows = useCashflow();

    if (!rows || rows.length === 0) return null;

    // Derived during render — the React Compiler caches this.
    // Current year
    const currentYear = now().year();
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

    const nf = numberFormat;

    return (
        <div className="mt-4">
            <h2>Ersparnis KPIs</h2>
            <div className="row g-3 align-items-stretch">
                <div className="col-12 col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div>Sparquote (dieses Jahr)</div>
                            <strong>{savingsRateYear}%</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div>Durchschnittliche Monatsersparnis</div>
                            <strong>{nf.format(avgMonthlySavings)}</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div>Bester Monat</div>
                            <strong>{monthKey(bestMonth.year, bestMonth.month)}: {nf.format(bestMonth.net)}</strong>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div>Schlechtester Monat</div>
                            <strong>{monthKey(worstMonth.year, worstMonth.month)}: {nf.format(worstMonth.net)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
