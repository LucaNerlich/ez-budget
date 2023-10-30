'use client';
import React, {useEffect, useState} from 'react';
import {useStatisticsService} from "../../services/StatisticsService";
import {YearStats} from "../../entities/stats/YearStats";
import {Category, mapCategoriesToRows} from "./YearContainer";
import {useColorService} from "../../services/ColorService";

interface YearStatProps {
    currentYearStats: YearStats,
    opened: boolean
}

const YearStatComponent: React.FC<YearStatProps> = ({currentYearStats, opened}) => {
    const statisticsService = useStatisticsService();
    const colorService = useColorService();
    const [categories, setCategories] = useState<Category[]>(currentYearStats.categories);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category, direction: 'asc' | 'desc' } | null>(null);
    const [categoryRows, setCategoryRows] = useState([]);

    const sortCategories = (key: keyof Category) => {
        if (!categories) return;
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        const sortedCategories = [...categories].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({key, direction});
        setCategories(sortedCategories);
    };

    useEffect(() => {
            setCategoryRows( mapCategoriesToRows(categories, colorService));
    },[categories])

    return (
        <div>
            {currentYearStats &&
                <>
                    <h3>{currentYearStats.year} - Gewinn: {statisticsService.round(currentYearStats.sum)}</h3>

                    <details open={opened}>
                        <summary className="mt-3"><p style={{display: 'inline'}}>Ergebnis pro Kategorie</p></summary>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" onClick={() => sortCategories('category')}>Kategorie</th>
                                    <th scope="col" onClick={() => sortCategories('sum')}>Summe</th>
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
