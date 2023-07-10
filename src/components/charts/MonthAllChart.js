import React, {useContext, useEffect, useState} from "react";
import {useColorService} from "../../services/ColorService";
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {useStatisticsService} from "../../services/StatisticsService";
import {DataContext} from "../../../pages/_app";
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

    useEffect(() => {
        if (expenseMap && expenseMap.size > 0) {
            const sortedMap = sortMapByNumberValue(expenseMap);
            const categoryLabels = [];
            const categorySums = [];
            for (let [key, value] of sortedMap) {
                categoryLabels.push(key);
                categorySums.push(value);
            }

            setChartConfigExpense({
                labels: categoryLabels,
                datasets: [{
                    label: '',
                    data: categorySums,
                    backgroundColor: colorService.getScaleByAmount(expenseMap.size),
                }]
            });
        } else {
            setChartConfigExpense({
                labels: [],
                datasets: [{
                    data: [],
                }]
            });
        }
    }, [expenseMap]);

    useEffect(() => {
        if (incomeMap && incomeMap.size > 0) {
            let sortedMap = new Map([...incomeMap.entries()].sort((a, b) => b[1] - a[1]));

            const categoryLabels = [];
            const categorySums = [];
            for (let [key, value] of sortedMap) {
                categoryLabels.push(key);
                categorySums.push(value);
            }

            setChartConfigIncome({
                labels: categoryLabels,
                datasets: [{
                    label: '',
                    data: categorySums,
                    backgroundColor: colorService.getScaleByAmount(incomeMap.size),
                }]
            });
        } else {
            setChartConfigIncome({
                labels: [],
                datasets: [{
                    data: [],
                }]
            });
        }
    }, [incomeMap]);

    return (
        <div className="container">
            {(incomeMap && incomeMap.size > 0) &&
                <div className="row text-center">
                    <div className="col">
                        <h3>Einzahlungen</h3>
                        {chartConfigIncome.datasets &&
                            <Chart type="pie"
                                   data={chartConfigIncome}
                                   options={{
                                       responsive: true,
                                   }}/>
                        }
                    </div>
                    <div className="col">
                        <h3>Auszahlungen</h3>
                        {chartConfigExpense.datasets &&
                            <Chart type="pie"
                                   data={chartConfigExpense}
                                   options={{
                                       responsive: true,
                                   }}/>
                        }
                    </div>
                </div>
            }
        </div>
    );
};
