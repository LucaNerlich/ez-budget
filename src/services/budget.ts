import {Budget} from "../entities/raw/Budget";
import {Year} from "../entities/raw/Year";
import {Month} from "../entities/raw/Month";
import {Entry} from "../entities/raw/Entry";
import {monthKey} from "./month";

/**
 * Pure budget model. No React. The test surface for income/expense logic.
 *
 * A raw upload is either a Year[] or { years, recurring }. toBudget() normalizes
 * the shape and expands Recurring rules once, producing a resolved Budget that the
 * rest of the app reads.
 */

function normalizeInput(rawInput: any): { years: any[]; recurring: any[] } {
    if (Array.isArray(rawInput)) {
        return {years: rawInput, recurring: []};
    }
    if (rawInput && typeof rawInput === 'object') {
        const years = rawInput.years || rawInput.data || [];
        const recurring = rawInput.recurring || [];
        return {years, recurring};
    }
    return {years: [], recurring: []};
}

function findActiveRecurringFor(year: number, month: number, recurringRules: any[]): Map<string, any> {
    const key = monthKey(year, month);
    const active = recurringRules.filter((r) => {
        const from: string = (r.from || r.start || r.effective_from || '').slice(0, 7);
        const until: string | undefined = (r.until || r.end || r.effective_until || '')?.slice(0, 7) || undefined;
        if (!from) return false;
        const geFrom = key >= from;
        const leUntil = until ? key <= until : true;
        return geFrom && leUntil;
    });

    // Choose latest rule per (category, comment) tuple (max from)
    const chosen = new Map<string, any>();
    for (const r of active) {
        const category = r.category;
        const comment = r.comment || '';
        const from = (r.from || r.start || r.effective_from || '').slice(0, 7);
        if (!category || !from) continue;
        const keyTuple = `${category}||${comment}`;
        const prev = chosen.get(keyTuple);
        if (!prev) {
            chosen.set(keyTuple, r);
        } else {
            const prevFrom = (prev.from || prev.start || prev.effective_from || '').slice(0, 7);
            if (from > prevFrom) chosen.set(keyTuple, r);
        }
    }
    return chosen;
}

function applyRecurring(years: any[], recurringRules: any[]): Year[] {
    if (!recurringRules || recurringRules.length === 0) return years;
    const result: Year[] = [];
    for (let i = 0; i < years.length; i++) {
        const y = years[i];
        const months = y.months || [];
        const newMonths: Month[] = [];
        for (let j = 0; j < months.length; j++) {
            const m = months[j];
            const ymActive = findActiveRecurringFor(y.year, m.month, recurringRules);
            // Track existing entries by (category, comment) to allow month-specific overrides
            const existingKeys = new Set<string>((m.entries || []).map((e) => `${e.category}||${(e.comment || '')}`));
            const mergedEntries: Entry[] = [...(m.entries || [])];
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
 * Parse + normalize the uploaded shape and expand Recurring rules into a resolved Budget.
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
