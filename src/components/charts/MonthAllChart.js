"use client";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {useColorService} from "../../services/ColorService";
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';
import {useStatisticsService} from "../../services/StatisticsService";
import {DataContext} from "../../providers/DataProvider";
import {useDataService} from "../../services/DataService";
import {sortMapByNumberValue} from "../../Util";

export default function MonthAllChart(props) {
    const dataContext = useContext(DataContext);
    const colorService = useColorService();
    const statisticsService = useStatisticsService();
    const dataService = useDataService();

    const [monthEntries, setMonthEntries] = useState([]);
    const [showPercent, setShowPercent] = useState(false);
    const [expenseMap, setExpenseMap] = useState(null);
    const [incomeMap, setIncomeMap] = useState(null);
    // derive configs via useMemo to avoid state loops

    useEffect(() => {
        setMonthEntries(dataService.getAllEntriesYearMonth(dataContext.dataContainer, props.year, props.month));
    }, [dataContext.dataContainer, props.year, props.month]);

    useEffect(() => {
        setExpenseMap(statisticsService.getExpenseSumPerCategoryFromEntries(monthEntries));
        setIncomeMap(statisticsService.getIncomeSumPerCategoryFromEntries(monthEntries));
    }, [monthEntries]);

    const expenseChartConfig = useMemo(() => {
        if (!expenseMap || expenseMap.size === 0) {
            return { labels: [], datasets: [{ data: [] }] };
        }
        const sortedMap = sortMapByNumberValue(expenseMap);
        const labels = [];
        const rawValues = [];
        for (let [key, value] of sortedMap) {
            labels.push(key);
            rawValues.push(value); // negative sums expected for expenses
        }
        const positiveMagnitudes = rawValues.map((v) => Math.abs(v));

        return {
            labels,
            datasets: [{
                label: '',
                data: positiveMagnitudes,
                backgroundColor: colorService.getScaleByAmount(labels.length),
                // keep original signed values for tooltips
                rawValues
            }]
        };
    }, [expenseMap]);

    const incomeChartConfig = useMemo(() => {
        if (!incomeMap || incomeMap.size === 0) {
            return { labels: [], datasets: [{ data: [] }] };
        }
        let sortedMap = new Map([...incomeMap.entries()].sort((a, b) => b[1] - a[1]));
        const labels = [];
        const values = [];
        for (let [key, value] of sortedMap) {
            labels.push(key);
            values.push(value);
        }

        // Group small slices into "Andere"
        const total = values.reduce((a, b) => a + b, 0);
        const maxSlices = 8;
        const minShare = 0.05; // 5%
        const groupedLabels = [];
        const groupedValues = [];
        let others = 0;
        for (let i = 0; i < labels.length; i++) {
            const share = total ? values[i] / total : 0;
            if (i >= maxSlices || share < minShare) {
                others += values[i];
            } else {
                groupedLabels.push(labels[i]);
                groupedValues.push(values[i]);
            }
        }
        if (others > 0) {
            groupedLabels.push('Andere');
            groupedValues.push(others);
        }

        return {
            labels: groupedLabels,
            datasets: [{
                label: '',
                data: groupedValues,
                backgroundColor: colorService.getScaleByAmount(groupedLabels.length),
            }]
        };
    }, [incomeMap]);

    return (
        <div className="container">
            {(incomeMap && incomeMap.size > 0) &&
                <div className="row text-center">
                    <div className="col-12 col-md-6 mb-4">
                        <h3>Einzahlungen</h3>
                        {incomeChartConfig.datasets &&
                            <Chart
                                type="doughnut"
                                data={incomeChartConfig}
                                options={{
                                    responsive: true,
                                    aspectRatio: 1,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
                                        title: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (ctx) => {
                                                    const data = ctx.dataset.data || [];
                                                    const idx = ctx.dataIndex ?? 0;
                                                    const signed = (ctx.dataset.rawValues && ctx.dataset.rawValues[idx]) || 0;
                                                    const total = data.reduce((a, b) => a + Math.abs(b), 0);
                                                    const pct = total ? Math.round((Math.abs(data[idx]) / total) * 1000) / 10 : 0;
                                                    const label = ctx.label || '';
                                                    if (showPercent) {
                                                        return `${label}: ${pct}%`;
                                                    }
                                                    const val = new Intl.NumberFormat('de-DE').format(signed);
                                                    return `${label}: ${val}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        }
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                        <h3>Auszahlungen</h3>
                        {expenseChartConfig.datasets &&
                            <Chart
                                type="doughnut"
                                data={expenseChartConfig}
                                options={{
                                    responsive: true,
                                    aspectRatio: 1,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
                                        title: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (ctx) => {
                                                    const data = ctx.dataset.data || [];
                                                    const idx = ctx.dataIndex ?? 0;
                                                    const signed = (ctx.dataset.rawValues && ctx.dataset.rawValues[idx]) || 0;
                                                    const total = data.reduce((a, b) => a + Math.abs(b), 0);
                                                    const pct = total ? Math.round((Math.abs(data[idx]) / total) * 1000) / 10 : 0;
                                                    const label = ctx.label || '';
                                                    if (showPercent) {
                                                        return `${label}: ${pct}%`;
                                                    }
                                                    const val = new Intl.NumberFormat('de-DE').format(signed);
                                                    return `${label}: ${val}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        }
                    </div>
                    <div className="col-12">
                        <div className="form-check form-switch d-inline-block">
                            <input className="form-check-input" type="checkbox" id="togglePercent"
                                   checked={showPercent} onChange={() => setShowPercent(!showPercent)} />
                            <label className="form-check-label ms-2" htmlFor="togglePercent">Prozentwerte anzeigen</label>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};
