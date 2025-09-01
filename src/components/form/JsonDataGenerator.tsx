"use client";
import React, {useEffect, useRef, useState} from 'react';
import {useDataService} from "../../services/DataService";
import {useDateService} from "../../services/DateService";
// dateService.NOW is a dayjs instance; use explicit format string
import {Entry} from "../../entities/raw/Entry";

export default function JsonDataGeneratorForm(props) {

    const dataService = useDataService();
    const dateService = useDateService();
    const generatorForm = useRef(null);
    const focusRef = useRef(null)
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        focusRef.current.focus()
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        const category = e.target[0].value;
        const value = e.target[1].value;
        const comment = e.target[2].value;

        const newEntry: Entry = {
            category: category,
            value: parseFloat(value),
            date: dateService.NOW.format('YYYY-MM-DD'),
        }
        if (comment) {
            newEntry.comment = comment
        }

        setEntries([...entries, newEntry]);

        // reset form
        if (generatorForm) {
            generatorForm.current.reset();
        }
    };

    /*
  todo date? maybe default immer aktueller Monat der 1.?
  reuse dateinput von ezbudget 1.0?

  maybe use focus trap to cycle through form with tab
  https://github.com/focus-trap/focus-trap
   */

    return (
        <div>
            <strong>WORK IN PROGRESS</strong>
            <form ref={generatorForm} onSubmit={onSubmit}>
                <div className="row">
                    <div className="col">
                        <label htmlFor="category" className="form-label">Kategorie*</label>
                        <input type="text"
                               ref={focusRef}
                               className="form-control"
                               required
                               id="category"
                               placeholder="Lebensmittel"/>
                    </div>
                    <div className="col">
                        <label htmlFor="value" className="form-label">Summe*</label>
                        <input type="number"
                               className="form-control"
                               required
                               id="value"
                               step="0.01"
                               placeholder="-12.99"/>
                    </div>
                </div>
                <div className='row'>
                    <div className="col">
                        <label htmlFor="comment" className="form-label">Kommentar</label>
                        <input type="text"
                               className="form-control"
                               id="comment"
                               placeholder="DB Ticket nach Hamburg"/>
                    </div>
                </div>
                <div>
                    <button type="submit" onBlur={() => focusRef.current.focus()}
                            className="mt-3 btn btn-primary">
                        Hinzufuegen
                    </button>
                </div>
                <hr/>
                {entries && entries.length > 0 &&
                    <a href={`data:text/json;charset=utf-8,${encodeURIComponent(dataService.jsFriendlyJSONStringify(entries))}`}
                       download="ezbudget-statistiken.json">
                        <button type="button" className="mt-3 mb-3 btn btn-success">
                            Json herunterladen
                        </button>
                    </a>
                }
            </form>

            {entries && entries.length > 0 &&
                <div>

                    <h2>Deine erzeugten Daten</h2>
                    <pre className="shadow">
                    {dataService.jsFriendlyJSONStringify(entries)}
                    </pre>
                </div>
            }
        </div>
    );
}
