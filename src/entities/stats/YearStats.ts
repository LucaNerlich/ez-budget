import {MonthStats} from "./MonthStats";

export interface Category {
    category: string,
    sum: number
}

export interface YearStats {
    year: number,
    sum: number,
    categories: Array<Category>,
    months: Array<MonthStats>
}
