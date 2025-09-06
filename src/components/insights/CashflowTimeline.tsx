"use client";
import React, {useContext, useMemo} from 'react';
import {DataContext} from '../../providers/DataProvider';
import {useDataService} from '../../services/DataService';
import {useDateService} from '../../services/DateService';
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';

export default function CashflowTimeline() {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();
    const dateService = useDateService();

    const timeline = useMemo(() => {
        const rows: Array<{ key: string; year: number; month: number; net: number; income: number; expense: number }> = [];
        if (!dataContext.dataContainer) return { cur: [], breakEven: null, runwayMonths: null } as any;
        const years = (dataService as any).getAvailableYears ? (dataService as any).getAvailableYears(dataContext.dataContainer) : [];
        for (let i = 0; i < years.length; i++) {
            const y = years[i];
            const months = (dataService as any).getAvailableMonths ? (dataService as any).getAvailableMonths(dataContext.dataContainer, y) : [];
            for (let j = 0; j < months.length; j++) {
                const m = months[j];
                const entries = (dataService as any).getAllEntriesYearMonth ? (dataService as any).getAllEntriesYearMonth(dataContext.dataContainer, y, m) : [];
                let income = 0; let expense = 0;
                for (let k = 0; k < entries.length; k++) {
                    const v = Number(entries[k].value) || 0;
                    if (v >= 0) income += v; else expense += v;
                }
                rows.push({ key: `${y}-${m < 10 ? '0'+m : m}`, year: y, month: m, net: income + expense, income, expense });
            }
        }
        rows.sort((a, b) => a.key.localeCompare(b.key));
        // cumulative per year
        const byYear: Record<string, Array<{ key: string; cum: number }>> = {};
        for (let i = 0; i < rows.length; i++) {
            const r = rows[i];
            const list = byYear[r.year] || [];
            const prev = list.length > 0 ? list[list.length - 1].cum : 0;
            list.push({ key: r.key, cum: prev + r.net });
            byYear[r.year] = list;
        }
        const currentYear = dateService.NOW.year();
        const cur = byYear[currentYear] || [];

        // break-even month (first month cum >= 0)
        let breakEven: string | null = null;
        for (let i = 0; i < cur.length; i++) {
            if (cur[i].cum >= 0) { breakEven = cur[i].key; break; }
        }

        // runway: if current monthly burn negative, months until zero at current avg
        const monthsThisYear = rows.filter(r => r.year === currentYear);
        const avgNet = monthsThisYear.length ? (monthsThisYear.reduce((a, b) => a + b.net, 0) / monthsThisYear.length) : 0;
        const lastCum = cur.length ? cur[cur.length - 1].cum : 0;
        const runwayMonths = avgNet < 0 ? Math.max(0, Math.floor(lastCum / Math.abs(avgNet))) : null;

        return { cur, breakEven, runwayMonths };
    }, [dataContext.dataContainer, dataService, dateService]);

    const data = useMemo(() => {
        return {
            labels: timeline.cur.map(p => p.key),
            datasets: [
                { label: 'Kumuliert (dieses Jahr)', data: timeline.cur.map(p => p.cum), borderColor: '#226ebd', backgroundColor: 'transparent' }
            ]
        };
    }, [timeline]);

    return (
        <div className="mt-4">
            <h2>Cashflow Timeline</h2>
            <Chart type="line" data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            <div className="mt-3">
                {timeline.breakEven && <div>Break‑even Monat: <strong>{timeline.breakEven}</strong></div>}
                {typeof timeline.runwayMonths === 'number' && <div>Runway (bei aktuellem Trend): <strong>{timeline.runwayMonths} Monate</strong></div>}
            </div>
        </div>
    );
}


