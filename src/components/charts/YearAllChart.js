"use client";
import React, {useEffect, useState} from "react";
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {useStatisticsService} from "../../services/StatisticsService";
import moment from "moment";
import {useColorService} from "../../services/ColorService";

export default function YearAllChart(props) {
    const now = moment(new Date());
    const statisticsService = useStatisticsService();
    const colorService = useColorService();

    const [categorySumMap, setCategorySumMap] = useState(null);
    const [categorySumChartConfig, setCategorySumChartConfig] = useState({});


    const entries = props.entries;

    useEffect(() => {
        setCategorySumMap(statisticsService.getSumMapForYear(entries, now.year()));
    }, [entries]);

    useEffect(() => {
        if (categorySumMap) {
            const categoryLabels = [];
            const categorySums = [];
            for (let [key, value] of categorySumMap) {
                categoryLabels.push(key);
                categorySums.push(value);
            }

            setCategorySumChartConfig({
                labels: categoryLabels,
                datasets: [
                    {
                        label: '',
                        backgroundColor: colorService.getRedGreenForSum(categorySums),
                        data: categorySums
                    }
                ]
            });
        }
    }, [categorySumMap]);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <div className="row">
            <div className="col">
                <h3>Ergebnis pro Kategorie</h3>
                {categorySumChartConfig.datasets &&
                    <Chart type="bar"
                           data={data}
                           options={{
                               indexAxis: 'y',
                               responsive: true,
                               plugins: {
                                   legend: {
                                       position: 'right',
                                   },
                                   title: {
                                       display: true,
                                       text: 'Chart.js Horizontal Bar Chart',
                                   },
                               },
                           }}
                    />
                }
            </div>
        </div>
    );
}
