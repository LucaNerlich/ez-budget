import {z} from 'zod';

/**
 * The raw uploaded payload ("budget file"): either a bare Year[] or
 * { years, recurring }. This is the only unsanitized boundary of the app —
 * every upload (remote fetch, local file, bundled test data) is validated
 * here once via zod before it may enter a Budget.
 */

const RecurringSchema = z.object({
    category: z.string().min(1),
    value: z.number().finite(),
    comment: z.string().optional(),
    from: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    until: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
}).refine((rule) => !rule.until || rule.until >= rule.from, {
    path: ['until'],
    message: 'until must not be earlier than from',
});

const EntrySchema = z.object({
    category: z.string().min(1),
    value: z.number().finite(),
    comment: z.string().optional(),
    date: z.string().optional(),
});

const MonthSchema = z.object({
    month: z.number().int().min(1).max(12),
    entries: z.array(EntrySchema).default([]),
});

const YearSchema = z.object({
    year: z.number().int().min(1900),
    months: z.array(MonthSchema).default([]),
});

/**
 * Reject a repeated year, or a repeated month within one year: lookups use the
 * first match while the aggregators iterate every occurrence, so duplicates
 * would silently render different totals per view.
 */
function addDuplicatePeriodIssues(years: Array<z.infer<typeof YearSchema>>, basePath: Array<string | number>, ctx: z.RefinementCtx) {
    const seenYears = new Set<number>();
    years.forEach((yearData, yearIndex) => {
        const yearPath = [...basePath, yearIndex];
        if (seenYears.has(yearData.year)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [...yearPath, 'year'],
                message: `duplicate year ${yearData.year}`,
            });
        } else {
            seenYears.add(yearData.year);
        }

        const seenMonths = new Set<number>();
        yearData.months.forEach((monthData, monthIndex) => {
            if (seenMonths.has(monthData.month)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [...yearPath, 'months', monthIndex, 'month'],
                    message: `duplicate month ${monthData.month} in ${yearData.year}`,
                });
            } else {
                seenMonths.add(monthData.month);
            }
        });
    });
}

export const BudgetFileSchema = z.union([
    z.array(YearSchema),
    z.object({
        years: z.array(YearSchema),
        recurring: z.array(RecurringSchema).default([]),
    }).strict(),
]).superRefine((file, ctx) => {
    if (Array.isArray(file)) {
        addDuplicatePeriodIssues(file, [], ctx);
    } else {
        addDuplicatePeriodIssues(file.years, ['years'], ctx);
    }
});

/**
 * A validated raw upload. Structurally compatible with Year[] / Recurring[],
 * so it feeds toBudget() and the data container directly.
 */
export type BudgetFile = z.infer<typeof BudgetFileSchema>;
