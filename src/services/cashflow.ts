import {Budget} from "../entities/raw/Budget";
import {getAvailableMonths, getAvailableYears, getEntriesForMonth} from "./budget";
import {monthKey} from "./month";

/**
 * Pure cashflow logic. No React. This is the test surface that three insight
 * modules used to each re-implement.
 *
 * Invariants: expense stays negative; net = income + expense; rows are sorted
 * ascending by key ("YYYY-MM") and carry raw (unrounded) numbers.
 */
export interface CashflowRow {
    year: number;
    month: number;
    key: string;
    income: number;
    expense: number;
    net: number;
}

export function monthlyCashflow(budget: Budget): CashflowRow[] {
    const rows: CashflowRow[] = [];
    const years = getAvailableYears(budget);
    for (let i = 0; i < years.length; i++) {
        const y = years[i];
        const months = getAvailableMonths(budget, y);
        for (let j = 0; j < months.length; j++) {
            const m = months[j];
            const entries = getEntriesForMonth(budget, y, m);
            let income = 0;
            let expense = 0;
            for (let k = 0; k < entries.length; k++) {
                const v = Number(entries[k].value) || 0;
                if (v >= 0) income += v; else expense += v;
            }
            rows.push({year: y, month: m, key: monthKey(y, m), income, expense, net: income + expense});
        }
    }
    rows.sort((a, b) => a.key.localeCompare(b.key));
    return rows;
}

/**
 * Cumulative net per year, in row order. Map<year, [{ key, cum }]>.
 */
export function cumulativeByYear(rows: CashflowRow[]): Map<number, Array<{ key: string; cum: number }>> {
    const byYear = new Map<number, Array<{ key: string; cum: number }>>();
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const list = byYear.get(r.year) || [];
        const prev = list.length > 0 ? list[list.length - 1].cum : 0;
        list.push({key: r.key, cum: prev + r.net});
        byYear.set(r.year, list);
    }
    return byYear;
}

/**
 * Running total across all years (does not reset at year boundaries).
 * Returns the cumulative net over all rows.
 */
export function totalCumulative(rows: CashflowRow[]): number {
    let total = 0;
    for (let i = 0; i < rows.length; i++) {
        total += rows[i].net;
    }
    return total;
}

/**
 * Trailing simple moving average over `window` points, rounded to 2 decimals.
 */
export function rollingAverage(values: number[], window: number): number[] {
    return values.map((_, idx) => {
        const start = Math.max(0, idx - window + 1);
        const slice = values.slice(start, idx + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return Math.round(avg * 100) / 100;
    });
}

/**
 * Least-squares fit over x = 1..n. Returns slope (a) and intercept (b).
 * https://math.stackexchange.com/questions/204020
 */
export function linearRegression(values: number[]): { a: number; b: number } {
    const n = values.length;
    const xs = Array.from({length: n}, (_, i) => i + 1);
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((a, y, i) => a + y * xs[i], 0);
    const sumXX = xs.reduce((a, x) => a + x * x, 0);
    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return {a: 0, b: 0};
    const a = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - a * sumX) / n;
    return {a, b};
}
