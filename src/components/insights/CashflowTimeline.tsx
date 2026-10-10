"use client";
import React from 'react';
import {now} from '../../services/date';
import {useCashflow} from '../../services/useCashflow';
import {cumulativeByYear, totalCumulative} from '../../services/cashflow';
import LazyChart from '../charts/LazyChart';

export default function CashflowTimeline() {
    const rows = useCashflow();

    // Derived during render — the React Compiler caches these.
    const currentYear = now().year();
    const cur = cumulativeByYear(rows).get(currentYear) || [];

    // break-even month (first month cum >= 0)
    let breakEven: string | null = null;
    for (let i = 0; i < cur.length; i++) {
        if (cur[i].cum >= 0) {
            breakEven = cur[i].key;
            break;
        }
    }

    // runway: last cumulative across all data (carries prior-year savings),
    // avg burn over the most recent 12 months of available data
    const lastCum = totalCumulative(rows);
    const recentRows = rows.slice(-12);
    const avgNet = recentRows.length ? (recentRows.reduce((a, b) => a + b.net, 0) / recentRows.length) : 0;
    const runwayMonths = avgNet < 0 ? Math.max(0, Math.floor(lastCum / Math.abs(avgNet))) : null;

    const data = {
        labels: cur.map(p => p.key),
        datasets: [
            {
                label: 'Kumuliert (dieses Jahr)',
                data: cur.map(p => p.cum),
                borderColor: '#226ebd',
                backgroundColor: 'transparent'
            }
        ]
    };

    return (
        <div className="mt-4">
            <h2>Cashflow Timeline</h2>
            <LazyChart type="line" data={data} options={{responsive: true, plugins: {legend: {position: 'bottom'}}}}/>
            <div className="mt-3">
                {breakEven && <div>Break‑even Monat: <strong>{breakEven}</strong></div>}
                {runwayMonths !== null &&
                  <div>Runway (bei aktuellem Trend): <strong>{runwayMonths} Monate</strong></div>}
            </div>
        </div>
    );
}
