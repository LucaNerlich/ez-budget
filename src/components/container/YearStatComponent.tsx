'use client';
import React, {useEffect, useState} from 'react';
import {round} from "../../services/statistics";
import {getPositiveNegativeColor} from "../../services/colors";
import {Category} from "../../entities/stats/Category";
import {YearStats} from "../../entities/stats/YearStats";

function mapCategoriesToRows(categories: Category[]): React.ReactElement[] {
    return categories.map((value: Category, index: number) => {
        return (
            <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>{value.category}</td>
                <td>
                    <span className="amount" style={{color: getPositiveNegativeColor(value.sum)}}>
                        {value.sum}
                    </span>
                </td>
            </tr>
        );
    });
}

interface YearStatProps {
    currentYearStats: YearStats,
    opened: boolean
}

const YearStatComponent: React.FC<YearStatProps> = ({currentYearStats, opened}) => {
    const [categories, setCategories] = useState<Category[]>(currentYearStats.categories);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category, direction: 'asc' | 'desc' } | null>(null);
    const [categoryRows, setCategoryRows] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        setCategories(currentYearStats.categories);
    }, [currentYearStats.categories]);

    const sortCategories = (key: keyof Category) => {
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
        setCategoryRows(mapCategoriesToRows(categories));
    }, [categories])

    const ariaSortFor = (key: keyof Category): 'ascending' | 'descending' | 'none' =>
        sortConfig?.key === key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none';

    return (
        <div>
            <h3>{currentYearStats.year} - Gewinn: {round(currentYearStats.sum)}</h3>

            <details open={opened}>
              <summary className="mt-3"><p style={{display: 'inline'}}>Ergebnis pro Kategorie</p></summary>
              <div className="table-responsive">
                <table className="table">
                  <caption className="visually-hidden">Ergebnis pro Kategorie {currentYearStats.year}</caption>
                  <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" aria-sort={ariaSortFor('category')}>
                      <button type="button" className="btn btn-link p-0" onClick={() => sortCategories('category')}>
                        Kategorie
                      </button>
                    </th>
                    <th scope="col" aria-sort={ariaSortFor('sum')}>
                      <button type="button" className="btn btn-link p-0" onClick={() => sortCategories('sum')}>
                        Summe
                      </button>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {categoryRows}
                  </tbody>
                </table>
              </div>
            </details>
            <hr/>
        </div>
    );
}

export default YearStatComponent;
