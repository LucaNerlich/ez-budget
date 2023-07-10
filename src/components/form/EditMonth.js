import React, {useContext, useEffect, useState} from "react";
import {useDataService} from "../../services/DataService";
import {DataContext} from "../../../pages/_app";
import {useColorService} from "../../services/ColorService";

export default function EditMonth(props) {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();
    const colorService = useColorService();
    const [monthEntries, setMonthEntries] = useState([]);

    useEffect(() => {
        setMonthEntries(dataService.getAllEntriesYearMonth(dataContext.dataContainer, props.year, props.month));
    }, [dataContext.dataContainer, props.year, props.month]);

    return (
        <div>
            <h2>Alle Ein- und Auszahlungen</h2>
            <table className="table">
                <caption>Sortiert nach Kategorie</caption>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Datum</th>
                    <th scope="col">Kategorie</th>
                    <th scope="col">Comment</th>
                    <th scope="col">Summe</th>
                </tr>
                </thead>
                <tbody>
                {monthEntries &&
                    monthEntries.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{new Date(item.date).toLocaleDateString('de-DE')}</td>
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
        </div>
    );
}
