import {Category} from "./Category";
import {MonthStats} from "./MonthStats";

export type {Category};

export interface YearStats {
    year: number,
    sum: number,
    categories: Array<Category>,
    months: Array<MonthStats>
}
