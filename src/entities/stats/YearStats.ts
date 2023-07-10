import {MonthStats} from "./MonthStats";

export interface YearStats {
    year: number,
    sum: number,
    categories: Array<{
        category: string,
        sum: number
    }>,
    months: Array<MonthStats>
}
