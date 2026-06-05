"use client";
import React, {useMemo} from "react";
import {getSumForYearMonth, getTrendArray} from "../../services/statistics";
import dayjs from "dayjs";
import {Bar} from "react-chartjs-2";
import {getRedGreenForSum} from "../../services/colors";
import {getXforMonths} from "../../services/chartConfig";

export default function MonthSummary(props) {
  const entries = props.entries;
  const now = dayjs(new Date());

  const sums = useMemo(() => {
    const sumAll = [];
    sumAll.push(getSumForYearMonth(entries, now.year(), '01'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '02'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '03'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '04'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '05'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '06'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '07'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '08'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '09'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '10'));
    sumAll.push(getSumForYearMonth(entries, now.year(), '11'));
    sumAll.push(getSumForYearMonth(entries, now.year(), `12`));
    return sumAll;
  }, [entries, now]);

  const sumChartConfig = useMemo(() => {
    const categoryLabels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Trend',
          type: 'line',
          backgroundColor: 'black',
          fill: false,
          data: getTrendArray(getXforMonths(), sums),
        },
        {
          label: 'Ergebnis',
          type: 'bar',
          backgroundColor: getRedGreenForSum(sums),
          data: sums
        }

      ]
    };
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
          data={sumChartConfig}
          options={{
            maintainAspectRatio: true,
          }}
        />
      </div>
    </div>
  );
}
