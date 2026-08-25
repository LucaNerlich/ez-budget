"use client";
import React, {useMemo} from "react";
import {getSumForYearMonth, getTrendArray} from "../../services/statistics";
import dayjs from "dayjs";
import {Bar} from "react-chartjs-2";
import {getRedGreenForSum} from "../../services/colors";
import {getXforMonths} from "../../services/chartConfig";
import {monthName, pad} from "../../services/month";

export default function MonthSummary(props) {
  const entries = props.entries;
  const now = dayjs(new Date());

  const sums = useMemo(() => (
    Array.from({length: 12}, (_, i) => getSumForYearMonth(entries, now.year(), pad(i + 1)))
  ), [entries, now]);

  const sumChartConfig = useMemo(() => {
    const categoryLabels = Array.from({length: 12}, (_, i) => monthName(i + 1));
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
