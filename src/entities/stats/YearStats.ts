import {MonthStats} from "./MonthStats";

export interface CategorySum {
    category: string,
    sum: number
}

export interface YearStats {
    year: number,
    sum: number,
    categories: Array<CategorySum>,
    months: Array<MonthStats>
}
