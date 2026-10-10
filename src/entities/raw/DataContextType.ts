import {Dispatch, SetStateAction} from "react";
import {YearStats} from "../stats/YearStats";
import {Budget} from "./Budget";
import {BudgetFile} from "./BudgetFile";

export interface DataContextType {
    dataContainer: BudgetFile,
    setDataContainer: Dispatch<SetStateAction<BudgetFile>>,
    budget: Budget,
    fileName: string,
    setFileName: Dispatch<SetStateAction<string>>,
    statsContainer: Array<YearStats>
}
