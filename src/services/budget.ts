import {Budget} from "../entities/raw/Budget";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {Recurring} from "../entities/raw/Recurring";
import {BudgetFileSchema} from "../entities/raw/BudgetFile";
import {monthKey} from "./month";

/**
 * Pure budget model. No React. The test surface for income/expense logic.
 *
 * A raw upload is either a Year[] or { years, recurring }. toBudget() validates
 * that shape and expands Recurring rules once, producing a resolved Budget that
 * the rest of the app reads. Anything that does not validate yields an empty
 * Budget — uploads are already surfaced with a proper error by app/actions.ts,
 * which validates against the same BudgetFileSchema before data lands here.
 */

function normalizeInput(rawInput: unknown): { years: Year[]; recurring: Recurring[] } {
    const parsed = BudgetFileSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {years: [], recurring: []};
    }
    if (Array.isArray(parsed.data)) {
        return {years: parsed.data, recurring: []};
    }
    return {years: parsed.data.years, recurring: parsed.data.recurring};
}

/**
 * Latest active rule per (category, comment) tuple for one year-month.
 */
function findActiveRecurringFor(year: number, month: number, recurringRules: Recurring[]): Map<string, Recurring> {
    const key = monthKey(year, month);
    const chosen = new Map<string, Recurring>();
    for (const rule of recurringRules) {
        const geFrom = key >= rule.from;
        const leUntil = rule.until ? key <= rule.until : true;
        if (!geFrom || !leUntil) continue;
        const keyTuple = `${rule.category}||${rule.comment || ''}`;
        const prev = chosen.get(keyTuple);
        if (!prev || rule.from > prev.from) {
            chosen.set(keyTuple, rule);
        }
    }
    return chosen;
}

function applyRecurring(years: Year[], recurringRules: Recurring[]): Year[] {
    if (!recurringRules || recurringRules.length === 0) return years;
    const result: Year[] = [];
    for (let i = 0; i < years.length; i++) {
        const y = years[i];
        const months = y.months;
        const newMonths: Month[] = [];
        for (let j = 0; j < months.length; j++) {
            const m = months[j];
            const ymActive = findActiveRecurringFor(y.year, m.month, recurringRules);
            // Track existing entries by (category, comment) to allow month-specific overrides
            const existingKeys = new Set<string>(m.entries.map((e) => `${e.category}||${(e.comment || '')}`));
            const mergedEntries: Entry[] = [...m.entries];
            ymActive.forEach((rule, keyTuple) => {
                if (!existingKeys.has(keyTuple)) {
                    mergedEntries.push({category: rule.category, value: rule.value, comment: rule.comment});
                }
            });
            newMonths.push({...m, entries: mergedEntries});
        }
        result.push({...y, months: newMonths});
    }
    return result;
}

/**
 * Parse + validate the uploaded shape and expand Recurring rules into a resolved Budget.
 */
export function toBudget(rawInput: unknown): Budget {
    const {years, recurring} = normalizeInput(rawInput);
    return {years: applyRecurring(years, recurring)};
}

export function getAvailableYears(budget: Budget): number[] {
    if (!budget || !budget.years) return [];
    return budget.years.map((y) => y.year);
}

export function findYear(budget: Budget, year: number | string): Year | undefined {
    if (!budget || !budget.years) return undefined;
    return budget.years.find((y) => y.year === Number(year));
}

export function findMonth(budget: Budget, year: number | string, month: number | string): Month | undefined {
    return findYear(budget, year)?.months.find((m) => m.month === Number(month));
}

// String years/months are accepted at this boundary on purpose: selects hand us
// strings, and budget.test.ts pins the coercion ("coerces string year/month").

export function getAvailableMonths(budget: Budget, year: number | string): number[] {
    const found = findYear(budget, year);
    return found ? found.months.map((m) => m.month) : [];
}

/**
 * Entries for one month, sorted by category. Returns [] when the month is absent.
 */
export function getEntriesForMonth(budget: Budget, year: number | string, month: number | string): Entry[] {
    const foundMonth = findMonth(budget, year, month);
    if (!foundMonth) return [];
    return [...foundMonth.entries].sort((a, b) => {
        const nameA = a.category.toUpperCase();
        const nameB = b.category.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}
