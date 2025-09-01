"use client";
import React, {useContext, useEffect, useState} from "react";
import {useDataService} from "../../services/DataService";
import {DataContext} from "../../providers/DataProvider";
import {useColorService} from "../../services/ColorService";
import _ from 'lodash';

export default function EditMonth(props) {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();
    const colorService = useColorService();
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const [monthEntries, setMonthEntries] = useState([]);
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        setMonthEntries(dataService.getAllEntriesYearMonth(dataContext.dataContainer, props.year, props.month));
    }, [dataContext.dataContainer, props.year, props.month]);


    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    useEffect(() => {
        if (sortField === 'date') { // the date field should be compared as Date
            setSortedData(sortedData.sort((a, b) => {
                let dateA = new Date(a[sortField]);
                let dateB = new Date(b[sortField]);

                if (sortOrder === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            }));
        } else { // sorting for string and number fields
            setSortedData(_.orderBy(monthEntries, [sortField], [sortOrder]));
        }
    }, [monthEntries, sortOrder, sortField])

    console.log("sortedData", sortedData);

    return (
        <table className="table">
            <caption>Sortiert nach Kategorie</caption>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col" onClick={() => handleSort('category')}>Kategorie</th>
                <th scope="col" onClick={() => handleSort('comment')}>Comment</th>
                <th scope="col" onClick={() => handleSort('value')}>Summe</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((item, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.category}</td>
                    <td>
                        {item.comment &&
                            <span>{item.comment}</span>}
                    </td>
                    <td>
                    <span style={{backgroundColor: colorService.getPositiveNegativeColor(item.value)}}>
                        {item.value}
                    </span>
                    </td>
                </tr>
            ))
            }
            </tbody>
        </table>
    );
}
