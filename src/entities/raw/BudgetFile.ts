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
    from: z.string().regex(/^\d{4}-\d{2}$/),
    until: z.string().regex(/^\d{4}-\d{2}$/).optional(),
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

export const BudgetFileSchema = z.union([
    z.array(YearSchema),
    z.object({
        years: z.array(YearSchema),
        recurring: z.array(RecurringSchema).default([]),
    }),
]);

/**
 * A validated raw upload. Structurally compatible with Year[] / Recurring[],
 * so it feeds toBudget() and the data container directly.
 */
export type BudgetFile = z.infer<typeof BudgetFileSchema>;
