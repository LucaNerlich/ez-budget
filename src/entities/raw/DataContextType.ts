import {YearStats} from "../stats/YearStats";

export interface DataContextType {
    dataContainer: Array<any>,
    setDataContainer: Function,
    fileName: string,
    setFileName: Function,
    statsContainer: Array<YearStats>,
    setStatsContainer: Function
}
