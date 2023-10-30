'use client';
import React from 'react';
import {useStatisticsService} from "../../services/StatisticsService";
import {YearStats} from "../../entities/stats/YearStats";

interface YearStatProps {
    currentYearStats: YearStats,
    categoryRows: React.ReactNode,
    opened: boolean
}

const YearStatComponent: React.FC<YearStatProps> = ({currentYearStats, categoryRows, opened}) => {
    const statisticsService = useStatisticsService();

    return (
        <div>
            {currentYearStats &&
                <>
                    <h3>{currentYearStats.year} - Revenue: {statisticsService.round(currentYearStats.sum)}</h3>

                    <details open={opened}>
                        <summary className="mt-3"><p style={{display: 'inline'}}>Ergebnis pro Kategorie</p></summary>
                        <div className="table-responsive">
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
                        </div>
                    </details>
                    <hr/>
                </>
            }
        </div>
    );
}

export default YearStatComponent;
