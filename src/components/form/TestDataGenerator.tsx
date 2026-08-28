"use client";
import React, {useState} from 'react';
import {getRandomCommentByCategory, getRandomFloat, TEST_CATEGORIES} from "../../../constants";
import {Year} from "../../entities/raw/Year";
import {Month} from "../../entities/raw/Month";
import {Entry} from "../../entities/raw/Entry";
import {getDateString, getRandomItemFromArray, jsFriendlyJSONStringify} from "../../Util";

const latestDayInMonth: number = 28; // to avoid generating invalid dates
const monthsToGenerate: number = 12;
const startYear: number = 2019;
const yearsToGenerate: number = 10;
const entriesPerMonth: number = getRandomFloat(15, 30, 0);

function generateTestData(): Array<Year> {
    const generatedData: Year[] = [];

    function generateEntries(year: number, month: number): Array<Entry> {
        const entries: Array<Entry> = [];
        for (let i = 0; i < entriesPerMonth; i++) {
            const category = getRandomItemFromArray(TEST_CATEGORIES) ?? '';
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

    for (let i = startYear; i < startYear + yearsToGenerate; i++) {
        const yearData: Year = {
            year: i,
            months: generateMonths(i)
        };
        generatedData.push(yearData);
    }

    return generatedData;
}

export default function TestDataGenerator() {
    const [testData, setTestData] = useState<Array<Year>>(() => generateTestData());

    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" onClick={() => setTestData(generateTestData())} className="mt-3 btn btn-primary">
                    Testdaten generieren
                </button>
                {testData && testData.length > 0 &&
                  <a
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(jsFriendlyJSONStringify(testData))}`}
                    className="mt-3 btn btn-success linkdecoration__none"
                    download="testdata.json">
                    Testdaten herunterladen
                  </a>
                }
            </div>

            {testData && testData.length > 0 &&
              <div>
                <hr/>
                <pre className="shadow">{jsFriendlyJSONStringify(testData)}</pre>
              </div>
            }

        </div>
    )
}
