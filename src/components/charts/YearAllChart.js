"use client";
import React, {useMemo} from "react";
import '../../lib/chart';
import {Chart} from 'react-chartjs-2';
import {useStatisticsService} from "../../services/StatisticsService";
import dayjs from "dayjs";
import {useColorService} from "../../services/ColorService";

export default function YearAllChart(props) {
    const now = dayjs(new Date());
    const statisticsService = useStatisticsService();
    const colorService = useColorService();

    const entries = props.entries;
    const categorySumMap = useMemo(() => statisticsService.getSumMapForYear(entries, now.year()), [entries, now, statisticsService]);

    const categorySumConfig = useMemo(() => {
        if (!categorySumMap) return undefined;
        const categoryLabels = [];
        const categorySums = [];
        for (let [key, value] of categorySumMap) {
            categoryLabels.push(key);
            categorySums.push(value);
        }
        return {
            labels: categoryLabels,
            datasets: [
                {
                    label: '',
                    backgroundColor: colorService.getRedGreenForSum(categorySums),
                    data: categorySums
                }
            ]
        };
    }, [categorySumMap]);

    const categorySumChartConfig = categorySumConfig || { labels: [], datasets: [{ data: [] }] };

    return (
        <div className="row">
            <div className="col">
                <h3>Ergebnis pro Kategorie</h3>
                {categorySumChartConfig.datasets &&
                    <Chart type="bar"
                           data={categorySumChartConfig}
                           options={{
                               indexAxis: 'y',
                               responsive: true,
                               plugins: {
                                   legend: {
                                       position: 'right',
                                   },
                                   title: {
                                       display: true,
                                       text: 'Ergebnis pro Kategorie',
                                   },
                               },
                           }}
                    />
                }
            </div>
        </div>
    );
}
