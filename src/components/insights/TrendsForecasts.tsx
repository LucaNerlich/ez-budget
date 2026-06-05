"use client";
import React, {useMemo} from 'react';
import {now} from '../../services/date';
import {useCashflow} from '../../services/useCashflow';
import {linearRegression, rollingAverage} from '../../services/cashflow';
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';

export default function TrendsForecasts() {
    const monthly = useCashflow();

    const rollingConfig = useMemo(() => {
        if (!monthly || monthly.length === 0) return {labels: [], datasets: [{data: []}]};
        const income = monthly.map(m => m.income);
        const expense = monthly.map(m => Math.abs(m.expense)); // show as positive magnitude
        const labels = monthly.map(m => m.key);
        const window = 12;
        return {
            labels,
            datasets: [
                {label: 'Ø Einkommen (12M)', data: rollingAverage(income, window), borderColor: '#2a7', backgroundColor: 'transparent'},
                {label: 'Ø Ausgaben (12M)', data: rollingAverage(expense, window), borderColor: '#e33', backgroundColor: 'transparent'}
            ]
        };
    }, [monthly]);

    const yoyConfig = useMemo(() => {
        const nowYear = now().year();
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
    }, [monthly]);

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
