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
    const [expenseMap, setExpenseMap] = useState(null);
    const [incomeMap, setIncomeMap] = useState(null);
    const [chartConfigExpense, setChartConfigExpense] = useState({});
    const [chartConfigIncome, setChartConfigIncome] = useState({});

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
        const categoryLabels = [];
        const categorySums = [];
        for (let [key, value] of sortedMap) {
            categoryLabels.push(key);
            categorySums.push(value);
        }
        return {
            labels: categoryLabels,
            datasets: [{
                label: '',
                data: categorySums,
                backgroundColor: colorService.getScaleByAmount(expenseMap.size),
            }]
        };
    }, [expenseMap]);

    useEffect(() => {
        setChartConfigExpense(expenseChartConfig);
    }, [expenseChartConfig]);

    const incomeChartConfig = useMemo(() => {
        if (!incomeMap || incomeMap.size === 0) {
            return { labels: [], datasets: [{ data: [] }] };
        }
        let sortedMap = new Map([...incomeMap.entries()].sort((a, b) => b[1] - a[1]));
        const categoryLabels = [];
        const categorySums = [];
        for (let [key, value] of sortedMap) {
            categoryLabels.push(key);
            categorySums.push(value);
        }
        return {
            labels: categoryLabels,
            datasets: [{
                label: '',
                data: categorySums,
                backgroundColor: colorService.getScaleByAmount(incomeMap.size),
            }]
        };
    }, [incomeMap]);

    useEffect(() => {
        setChartConfigIncome(incomeChartConfig);
    }, [incomeChartConfig]);

    return (
        <div className="container">
            {(incomeMap && incomeMap.size > 0) &&
                <div className="row text-center">
                    <div className="col-12 col-md-6 mb-4">
                        <h3>Einzahlungen</h3>
                        {chartConfigIncome.datasets &&
                            <Chart
                                type="doughnut"
                                data={chartConfigIncome}
                                options={{
                                    responsive: true,
                                    aspectRatio: 1,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        }
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                        <h3>Auszahlungen</h3>
                        {chartConfigExpense.datasets &&
                            <Chart
                                type="doughnut"
                                data={chartConfigExpense}
                                options={{
                                    responsive: true,
                                    aspectRatio: 1,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                        title: { display: false }
                                    }
                                }}
                            />
                        }
                    </div>
                </div>
            }
        </div>
    );
};
