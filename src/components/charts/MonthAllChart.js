"use client";
import React, {useContext, useState} from "react";
import {getScaleByAmount} from "../../services/colors";
import LazyChart from './LazyChart';
import {getExpenseSumPerCategoryFromEntries, getIncomeSumPerCategoryFromEntries} from "../../services/statistics";
import {DataContext} from "../../providers/DataContext";
import {getEntriesForMonth} from "../../services/budget";
import {sortMapByNumberValue} from "../../Util";

const numberFormat = new Intl.NumberFormat('de-DE');

// Draws "x%" centered on each slice when enabled via options.plugins.sliceLabels.show
const sliceLabelsPlugin = {
  id: 'sliceLabels',
  afterDatasetsDraw(chart, _args, opts) {
    if (!opts.show) return;
    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, v) => sum + Math.abs(v), 0);
    if (!total) return;

    const meta = chart.getDatasetMeta(0);
    const {ctx} = chart;
    ctx.save();
    ctx.font = '600 12px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    meta.data.forEach((arc, i) => {
      const pct = Math.round((Math.abs(data[i]) / total) * 1000) / 10;
      if (pct < 4) return; // skip tiny slices to avoid clutter
      const {x, y} = arc.tooltipPosition();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${pct}%`, x, y);
    });
    ctx.restore();
  }
};

function doughnutOptions(showPercent) {
  return {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      sliceLabels: {show: showPercent},
      legend: {position: 'bottom', labels: {boxWidth: 12, usePointStyle: true}},
      title: {display: false},
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const data = ctx.dataset.data;
            const idx = ctx.dataIndex;
            const signed = ctx.dataset.rawValues[idx];
            const total = data.reduce((a, b) => a + Math.abs(b), 0);
            const pct = total ? Math.round((Math.abs(data[idx]) / total) * 1000) / 10 : 0;
            const label = ctx.label;
            if (showPercent) {
              return `${label}: ${pct}%`;
            }
            const val = numberFormat.format(signed);
            return `${label}: ${val}`;
          }
        }
      }
    }
  };
}

function buildExpenseChartConfig(expenseMap) {
  if (!expenseMap || expenseMap.size === 0) {
    return {labels: [], datasets: [{data: []}]};
  }
  const sortedMap = sortMapByNumberValue(expenseMap);
  const labels = [];
  const signedValues = [];
  const magnitudes = [];
  for (let [key, value] of sortedMap) {
    labels.push(key);
    signedValues.push(value);
    magnitudes.push(Math.abs(value));
  }

  return {
    labels,
    datasets: [{
      label: '',
      data: magnitudes,
      backgroundColor: getScaleByAmount(labels.length),
      rawValues: signedValues
    }]
  };
}

function buildIncomeChartConfig(incomeMap) {
  if (!incomeMap || incomeMap.size === 0) {
    return {labels: [], datasets: [{data: []}]};
  }
  const sortedMap = sortMapByNumberValue(incomeMap);
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
      backgroundColor: getScaleByAmount(groupedLabels.length),
      rawValues: groupedValues
    }]
  };
}

function CategoryDoughnut({title, config, showPercent}) {
  return (
    <div className="col-12 col-md-6 mb-4">
      <h3>{title}</h3>
      <LazyChart
        type="doughnut"
        data={config}
        plugins={[sliceLabelsPlugin]}
        options={doughnutOptions(showPercent)}
      />
    </div>
  );
}

export default function MonthAllChart(props) {
  const dataContext = useContext(DataContext);

  // Derived from context during render — the React Compiler caches these.
  const monthEntries = getEntriesForMonth(dataContext.budget, props.year, props.month);
  const expenseMap = getExpenseSumPerCategoryFromEntries(monthEntries);
  const incomeMap = getIncomeSumPerCategoryFromEntries(monthEntries);
  const [showPercent, setShowPercent] = useState(false);

  const expenseChartConfig = buildExpenseChartConfig(expenseMap);
  const incomeChartConfig = buildIncomeChartConfig(incomeMap);

  return (
    <div className="container">
      {((incomeMap && incomeMap.size > 0) || (expenseMap && expenseMap.size > 0)) &&
        <div className="row text-center">
          {incomeMap && incomeMap.size > 0 &&
            <CategoryDoughnut title="Einzahlungen" config={incomeChartConfig} showPercent={showPercent}/>
          }
          {expenseMap && expenseMap.size > 0 &&
            <CategoryDoughnut title="Auszahlungen" config={expenseChartConfig} showPercent={showPercent}/>
          }
          <div className="col-12">
            <div className="form-check form-switch d-inline-block">
              <input className="form-check-input" type="checkbox" id="togglePercent"
                     checked={showPercent} onChange={() => setShowPercent(!showPercent)}/>
              <label className="form-check-label ms-2" htmlFor="togglePercent">Prozentwerte anzeigen</label>
            </div>
          </div>
        </div>
      }
    </div>
  );
};
