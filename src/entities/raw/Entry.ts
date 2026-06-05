export interface Entry {
    category: string;
    value: number;
    date?: string; // "2021-04-29"; absent for Recurring-derived entries
    comment?: string;
}
