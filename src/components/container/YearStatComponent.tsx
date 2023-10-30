'use client';
import React from 'react';
import {useStatisticsService} from "../../services/StatisticsService";
import {YearStats} from "../../entities/stats/YearStats";

interface YearStatProps {
    currentYearStats: YearStats,
    categoryRows: React.ReactNode
}

const YearStatComponent: React.FC<YearStatProps> = ({currentYearStats, categoryRows}) => {
    const statisticsService = useStatisticsService();

    return (
        <div>
            {currentYearStats &&
                <>
                    <h1 className="mt-3">
                        Übersicht - {currentYearStats.year}
                    </h1>
                    <h2>Revenue: {statisticsService.round(currentYearStats.sum)}</h2>

                    <hr/>

                    <h2>Ergebnis pro Kategorie</h2>

                    {/* maybe display as bar chart */}
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Kategorie</th>
                            <th scope="col">Summe</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categoryRows}
                        </tbody>
                    </table>
                </>
            }
        </div>
    );
}

export default YearStatComponent;
