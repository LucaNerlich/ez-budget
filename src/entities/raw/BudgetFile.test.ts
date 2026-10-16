import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import YAML from 'yaml';
import {BudgetFileSchema} from './BudgetFile';

describe('BudgetFileSchema', () => {
    const year2024 = {year: 2024, months: [{month: 1, entries: [{category: 'Miete', value: -100}]}]};
    const rule = {category: 'Miete', value: -950, from: '2024-05'};

    it('accepts a bare Year[] and a {years, recurring} object', () => {
        expect(BudgetFileSchema.safeParse([year2024]).success).toBe(true);
        expect(BudgetFileSchema.safeParse({years: [year2024], recurring: [rule]}).success).toBe(true);
    });

    it('rejects a duplicate month within a year and a duplicate year', () => {
        expect(BudgetFileSchema.safeParse({years: [{year: 2024, months: [{month: 1}, {month: 1}]}]}).success).toBe(false);
        expect(BudgetFileSchema.safeParse([year2024, year2024]).success).toBe(false);
    });

    it('rejects unknown top-level keys so misspelled ones cannot be stripped', () => {
        expect(BudgetFileSchema.safeParse({years: [], recurrring: []}).success).toBe(false);
    });

    it('rejects impossible months and inverted recurring ranges', () => {
        expect(BudgetFileSchema.safeParse({years: [], recurring: [{...rule, from: '2024-13'}]}).success).toBe(false);
        expect(BudgetFileSchema.safeParse({years: [], recurring: [{...rule, from: '2024-00'}]}).success).toBe(false);
        expect(BudgetFileSchema.safeParse({years: [], recurring: [{...rule, until: '2023-01'}]}).success).toBe(false);
        expect(BudgetFileSchema.safeParse({years: [], recurring: [{...rule, until: '2024-05'}]}).success).toBe(true);
    });

    it('accepts the bundled testdata and template files', () => {
        for (const file of ['src/testdata.yaml', 'public/template.yaml']) {
            const parsed = YAML.parse(readFileSync(file, 'utf8'));
            const result = BudgetFileSchema.safeParse(parsed);
            if (!result.success) console.error(file, result.error.issues);
            expect(result.success, file).toBe(true);
        }
    });
});
