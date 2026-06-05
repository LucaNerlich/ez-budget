"use client";
import React, {useMemo} from 'react';
import {useDateService} from '../../services/DateService';
import {useCashflow} from '../../services/useCashflow';
import {cumulativeByYear} from '../../services/cashflow';
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';

export default function CashflowTimeline() {
    const dateService = useDateService();
    const rows = useCashflow();

    const timeline = useMemo(() => {
        const currentYear = dateService.NOW.year();
        const cur = cumulativeByYear(rows).get(currentYear) || [];

        // break-even month (first month cum >= 0)
        let breakEven: string | null = null;
        for (let i = 0; i < cur.length; i++) {
            if (cur[i].cum >= 0) {
                breakEven = cur[i].key;
                break;
            }
        }

        // runway: if current monthly burn negative, months until zero at current avg
        const monthsThisYear = rows.filter(r => r.year === currentYear);
        const avgNet = monthsThisYear.length ? (monthsThisYear.reduce((a, b) => a + b.net, 0) / monthsThisYear.length) : 0;
        const lastCum = cur.length ? cur[cur.length - 1].cum : 0;
        const runwayMonths = avgNet < 0 ? Math.max(0, Math.floor(lastCum / Math.abs(avgNet))) : null;

        return {cur, breakEven, runwayMonths};
    }, [rows, dateService]);

    const data = useMemo(() => {
        return {
            labels: timeline.cur.map(p => p.key),
            datasets: [
                {
                    label: 'Kumuliert (dieses Jahr)',
                    data: timeline.cur.map(p => p.cum),
                    borderColor: '#226ebd',
                    backgroundColor: 'transparent'
                }
            ]
        };
    }, [timeline]);

    return (
        <div className="mt-4">
            <h2>Cashflow Timeline</h2>
            <Chart type="line" data={data} options={{responsive: true, plugins: {legend: {position: 'bottom'}}}}/>
            <div className="mt-3">
                {timeline.breakEven && <div>Break‑even Monat: <strong>{timeline.breakEven}</strong></div>}
                {typeof timeline.runwayMonths === 'number' &&
                  <div>Runway (bei aktuellem Trend): <strong>{timeline.runwayMonths} Monate</strong></div>}
            </div>
        </div>
    );
}
