import {YearStats} from "../stats/YearStats";
import {Budget} from "./Budget";

export interface DataContextType {
    dataContainer: Array<any>,
    setDataContainer: Function,
    budget: Budget,
    fileName: string,
    setFileName: Function,
    statsContainer: Array<YearStats>
}
