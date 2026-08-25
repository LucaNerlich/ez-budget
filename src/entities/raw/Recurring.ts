export interface Recurring {
    category: string;
    value: number;
    comment?: string;
    from: string;   // "YYYY-MM"
    until?: string;  // "YYYY-MM"
}
