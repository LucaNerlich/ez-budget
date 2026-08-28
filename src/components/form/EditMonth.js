"use client";
import React, {useContext, useState} from "react";
import {DataContext} from "../../providers/DataContext";
import {getEntriesForMonth} from "../../services/budget";
import {getPositiveNegativeColor} from "../../services/colors";
import orderBy from 'lodash/orderBy';

const sortableColumns = [
  {field: 'category', label: 'Kategorie'},
  {field: 'comment', label: 'Comment'},
  {field: 'value', label: 'Summe'},
];

export default function EditMonth(props) {
  const dataContext = useContext(DataContext);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');

  // Derived from context during render — the React Compiler caches this.
  const monthEntries = getEntriesForMonth(dataContext.budget, props.year, props.month);

  const sortedData = sortField === 'date'
    ? monthEntries.toSorted((a, b) => {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      })
    : (sortField ? orderBy(monthEntries, [sortField], [sortOrder]) : monthEntries);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const ariaSortFor = (field) =>
    field === sortField ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <table className="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        {sortableColumns.map((column) => (
          <th scope="col" key={column.field} aria-sort={ariaSortFor(column.field)}>
            <button type="button" className="btn btn-link p-0" onClick={() => handleSort(column.field)}>
              {column.label}
            </button>
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {sortedData.map((item, index) => (
        <tr key={`${item.category}|${item.comment || ''}|${item.date || ''}|${item.value}`}>
          <th scope="row">{index + 1}</th>
          <td>{item.category}</td>
          <td>
            {item.comment &&
              <span>{item.comment}</span>}
          </td>
          <td>
                    <span className="amount" style={{color: getPositiveNegativeColor(item.value)}}>
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
