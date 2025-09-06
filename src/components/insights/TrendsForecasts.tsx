"use client";
import React, {useContext, useMemo} from 'react';
import {DataContext} from '../../providers/DataProvider';
import {useDataService} from '../../services/DataService';
import {useDateService} from '../../services/DateService';
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';

function linearRegression(yValues: number[]): { a: number; b: number } {
    const n = yValues.length;
    const xValues = Array.from({length: n}, (_, i) => i + 1);
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = yValues.reduce((a, y, i) => a + y * xValues[i], 0);
    const sumXX = xValues.reduce((a, x) => a + x * x, 0);
    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return {a: 0, b: 0};
    const a = (n * sumXY - sumX * sumY) / denom; // slope
    const b = (sumY - a * sumX) / n; // intercept
    return {a, b};
}

export default function TrendsForecasts() {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();
    const dateService = useDateService();

    const monthly = useMemo(() => {
        const rows: Array<{
            key: string;
            year: number;
            month: number;
            income: number;
            expense: number;
            net: number
        }> = [];
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
                rows.push({
                    key: `${y}-${m < 10 ? '0' + m : m}`,
                    year: y,
                    month: m,
                    income,
                    expense,
                    net: income + expense
                });
            }
        }
        rows.sort((a, b) => a.key.localeCompare(b.key));
        return rows;
    }, [dataContext.dataContainer, dataService]);

    const rollingConfig = useMemo(() => {
        if (!monthly || monthly.length === 0) return {labels: [], datasets: [{data: []}]};
        const income = monthly.map(m => m.income);
        const expense = monthly.map(m => Math.abs(m.expense)); // show as positive magnitude
        const labels = monthly.map(m => m.key);
        const window = 12;
        const roll = (arr: number[]) => arr.map((_, idx) => {
            const start = Math.max(0, idx - window + 1);
            const slice = arr.slice(start, idx + 1);
            const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
            return Math.round(avg * 100) / 100;
        });
        return {
            labels,
            datasets: [
                {label: 'Ø Einkommen (12M)', data: roll(income), borderColor: '#2a7', backgroundColor: 'transparent'},
                {label: 'Ø Ausgaben (12M)', data: roll(expense), borderColor: '#e33', backgroundColor: 'transparent'}
            ]
        };
    }, [monthly]);

    const yoyConfig = useMemo(() => {
        const nowYear = dateService.NOW.year();
        const prevYear = nowYear - 1;
        const thisYear = monthly.filter(m => m.year === nowYear);
        const lastYear = monthly.filter(m => m.year === prevYear);
        if (thisYear.length === 0 || lastYear.length === 0) return {labels: [], datasets: [{data: []}]};
        const labels = Array.from({length: 12}, (_, i) => i + 1);
        const valFor = (arr: any[], m: number) => {
            const f = arr.find(x => x.month === m);
            return f ? f.net : 0;
        };
        const deltas = labels.map(m => Math.round((valFor(thisYear, m) - valFor(lastYear, m)) * 100) / 100);
        return {
            labels: labels.map(m => String(m).padStart(2, '0')),
            datasets: [
                {label: 'YoY Delta (Netto)', data: deltas, backgroundColor: deltas.map(v => v >= 0 ? '#2a7' : '#e33')}
            ]
        };
    }, [monthly, dateService]);

    const forecastConfig = useMemo(() => {
        if (!monthly || monthly.length < 3) return {labels: [], datasets: [{data: []}]};
        const net = monthly.map(m => m.net);
        const labelsHist = monthly.map(m => m.key);
        const {a, b} = linearRegression(net);
        const horizon = 6;
        const n = net.length;
        const forecast = Array.from({length: horizon}, (_, i) => {
            const x = n + i + 1;
            return Math.round((a * x + b) * 100) / 100;
        });
        const labelsFc = Array.from({length: horizon}, (_, i) => {
            const last = monthly[monthly.length - 1];
            const base = new Date(`${last.year}-${String(last.month).padStart(2, '0')}-01`);
            const d = new Date(base.getFullYear(), base.getMonth() + i + 1, 1);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        });
        return {
            labels: [...labelsHist, ...labelsFc],
            datasets: [
                {label: 'Netto (historisch)', data: net, borderColor: '#226ebd', backgroundColor: 'transparent'},
                {
                    label: 'Forecast (6M)',
                    data: [...Array(net.length).fill(null), ...forecast],
                    borderColor: '#999',
                    borderDash: [6, 6],
                    backgroundColor: 'transparent'
                }
            ]
        };
    }, [monthly]);

    return (
        <div className="mt-4">
            <h2>Trends & Forecasts</h2>
            <div className="row g-4">
                <div className="col-12">
                    <h3>12‑Monats‑Durchschnitt</h3>
                    <Chart type="line" data={rollingConfig}
                           options={{responsive: true, plugins: {legend: {position: 'bottom'}}}}/>
                </div>
                <div className="col-12 col-md-6">
                    <h3>Year‑over‑Year (Netto)</h3>
                    <Chart type="bar" data={yoyConfig}
                           options={{responsive: true, plugins: {legend: {display: false}}, aspectRatio: 1}}/>
                </div>
                <div className="col-12 col-md-6">
                    <h3>Forecast (6 Monate)</h3>
                    <Chart type="line" data={forecastConfig}
                           options={{responsive: true, plugins: {legend: {position: 'bottom'}}, aspectRatio: 1}}/>
                </div>
            </div>
        </div>
    );
}


