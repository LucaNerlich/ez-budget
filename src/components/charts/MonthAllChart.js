"use client";
import React, {useContext, useState} from "react";
import {getScaleByAmount} from "../../services/colors";
import LazyChart from './LazyChart';
import {getExpenseSumPerCategoryFromEntries, getIncomeSumPerCategoryFromEntries} from "../../services/statistics";
import {DataContext} from "../../providers/DataContext";
import {getEntriesForMonth} from "../../services/budget";
import {sortMapByNumberValue} from "../../Util";

const numberFormat = new Intl.NumberFormat('de-DE');

// Percentage of a slice's magnitude within the dataset total, one decimal.
function sharePercent(value, total) {
  return total ? Math.round((Math.abs(value) / total) * 1000) / 10 : 0;
}

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
      const pct = sharePercent(data[i], total);
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
            const pct = sharePercent(data[idx], total);
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

function buildCategoryConfig(map, {groupSmall = false} = {}) {
  const sortedMap = sortMapByNumberValue(map);
  const labels = [];
  const signedValues = [];
  for (const [key, value] of sortedMap) {
    labels.push(key);
    signedValues.push(value);
  }

  let outLabels = labels;
  let outValues = signedValues;

  if (groupSmall) {
    // Group small slices into "Andere"
    const total = signedValues.reduce((a, b) => a + b, 0);
    const maxSlices = 8;
    const minShare = 0.05; // 5%
    outLabels = [];
    outValues = [];
    let others = 0;
    for (let i = 0; i < labels.length; i++) {
      const share = total ? signedValues[i] / total : 0;
      if (i >= maxSlices || share < minShare) {
        others += signedValues[i];
      } else {
        outLabels.push(labels[i]);
        outValues.push(signedValues[i]);
      }
    }
    if (others > 0) {
      outLabels.push('Andere');
      outValues.push(others);
    }
  }

  return {
    labels: outLabels,
    datasets: [{
      label: '',
      data: outValues.map((value) => Math.abs(value)),
      backgroundColor: getScaleByAmount(outLabels.length),
      rawValues: outValues
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

  const expenseChartConfig = buildCategoryConfig(expenseMap);
  const incomeChartConfig = buildCategoryConfig(incomeMap, {groupSmall: true});

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
