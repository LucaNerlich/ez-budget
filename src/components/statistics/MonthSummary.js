"use client";
import React, {useEffect, useState} from "react";
import {useStatisticsService} from "../../services/StatisticsService";
import dayjs from "dayjs";
import {Bar} from "react-chartjs-2";
import {useColorService} from "../../services/ColorService";
import {useChartConfigService} from "../../services/ChartConfigService";

export default function MonthSummary(props) {
    const entries = props.entries;
    const now = dayjs(new Date());
    const statisticsService = useStatisticsService();
    const chartConfigService = useChartConfigService();
    const colorService = useColorService();

    const [sums, setSums] = useState([]);
    const [sumChartConfig, setSumChartConfig] = useState({});

    useEffect(() => {
        const sumAll = [];
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '01'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '02'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '03'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '04'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '05'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '06'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '07'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '08'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '09'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '10'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), '11'));
        sumAll.push(statisticsService.getSumForYearMonth(entries, now.year(), `12`));
        setSums(sumAll);
    }, [entries]);

    useEffect(() => {
        if (sums) {
            const categoryLabels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            setSumChartConfig({
                labels: categoryLabels,
                datasets: [
                    {
                        label: 'Trend',
                        type: 'line',
                        backgroundColor: 'black',
                        fill: false,
                        data: statisticsService.getTrendArray(chartConfigService.getXforMonths(), sums),
                    },
                    {
                        label: 'Ergebnis',
                        type: 'bar',
                        backgroundColor: colorService.getRedGreenForSum(sums),
                        data: sums
                    }

                ]
            });
        }
    }, [sums]);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="row">
            <div className="col">
                <h3>Ergebnis pro Monat</h3>
                <Bar
                    data={data}
                    options={{
                        maintainAspectRatio: true,
                    }}
                />
            </div>
        </div>
    );
}
