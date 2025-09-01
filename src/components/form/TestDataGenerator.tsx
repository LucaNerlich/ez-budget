"use client";
import React, {useEffect, useState} from 'react';
import {useDataService} from "../../services/DataService";
import {getRandomCommentByCategory, getRandomFloat, TEST_CATEGORIES} from "../../../constants";
import {Year} from "../../entities/raw/Year";
import {Month} from "../../entities/raw/Month";
import {Entry} from "../../entities/raw/Entry";
import {getDateString, getRandomItemFromArray} from "../../Util";

export default function TestDataGenerator(props) {

    const latestDayInMonth: number = 28; // to avoid generating invalid dates
    const monthsToGenerate: number = 12;

    const dataService = useDataService();

    const [startYear, setStartYear] = useState<number>(2019);
    const [yearsToGenerate, setYearsToGenerate] = useState<number>(10);
    const [entriesToGenerate, setEntriesToGenerate] = useState<number>(getRandomFloat(15, 30, 0));
    const [testData, setTestData] = useState<Array<Year>>([]);

    function generateTestData() {
        const generatedData = [];

        function generateEntries(year: number, month: number): Array<Entry> {
            const entries: Array<Entry> = [];
            for (let i = 0; i < entriesToGenerate; i++) {
                const category = getRandomItemFromArray(TEST_CATEGORIES);
                const entryData: Entry = {
                    category: category,
                    date: getDateString(year, month, getRandomFloat(1, latestDayInMonth, 0)),
                    value: getRandomFloat(-1000, 1000, 2),
                    comment: getRandomCommentByCategory(category)
                }
                entries.push(entryData);
            }
            return entries;
        }

        function generateMonths(year: number): Array<Month> {
            const months: Array<Month> = [];
            for (let i = 1; i <= monthsToGenerate; i++) {
                const monthData: Month = {
                    month: i,
                    entries: generateEntries(year, i)
                }
                months.push(monthData)
            }
            return months;
        }

        // generate Years
        for (let i = startYear; i <= startYear + yearsToGenerate; i++) {
            const yearData: Year = {
                year: i,
                months: generateMonths(i)
            };
            generatedData.push(yearData);
        }

        setTestData(generatedData)
    }

    useEffect(() => {
        generateTestData();
    }, [])

    /*
    [
    {
        "year": 2021,
        "months": [
            {
                "month": 4,
                "entries": [
                    {
                        "category": "Abonnements",
                        "value": -10.5,
                        "date": "2021-04-29"
                    },
                    {
                        "category": "Abonnements",
                        "value": -5,
                        "date": "2021-04-30"
                    }
                ]
            },
      }
    ]
     */

    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" onClick={generateTestData} className="mt-3 btn btn-primary">
                    Testdaten generieren
                </button>
                {testData && testData.length > 0 &&
                    <button type="button" className="mt-3 btn btn-success">
                        <a href={`data:text/json;charset=utf-8,${encodeURIComponent(dataService.jsFriendlyJSONStringify(testData))}`}
                           className="linkdecoration__none"
                           download="testdata.json">
                            Testdaten herunterladen
                        </a>
                    </button>
                }
            </div>

            {testData && testData.length > 0 &&
                <div>
                    <hr/>
                    <pre className="shadow">{dataService.jsFriendlyJSONStringify(testData)}</pre>
                </div>
            }

        </div>
    )
}
