import {Year} from "./Year";

/**
 * The resolved model the app works against: all Recurring rules already expanded
 * into the months they apply to. Built once at load via toBudget().
 */
export interface Budget {
    years: Year[];
}
