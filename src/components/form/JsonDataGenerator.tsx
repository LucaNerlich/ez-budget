"use client";
import React, {useEffect, useRef, useState} from 'react';
import {now} from "../../services/date";
import {jsFriendlyJSONStringify} from "../../Util";
import {Entry} from "../../entities/raw/Entry";

export default function JsonDataGeneratorForm() {

    const generatorForm = useRef<HTMLFormElement | null>(null);
    const focusRef = useRef<HTMLInputElement | null>(null)
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        focusRef.current?.focus()
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const category = String(formData.get('category') ?? '');
        const value = String(formData.get('value') ?? '');
        const comment = String(formData.get('comment') ?? '');

        const newEntry: Entry = {
            category: category,
            value: parseFloat(value),
            date: now().format('YYYY-MM-DD'),
        }
        if (comment) {
            newEntry.comment = comment
        }

        setEntries([...entries, newEntry]);

        // reset form
        generatorForm.current?.reset();
        if (focusRef.current) {
            focusRef.current.focus();
        }
    };

    return (
        <div>
            <form ref={generatorForm} onSubmit={onSubmit}>
                <div className="row">
                    <div className="col">
                        <label htmlFor="category" className="form-label">Kategorie*</label>
                        <input type="text"
                               name="category"
                               ref={focusRef}
                               className="form-control"
                               required
                               id="category"
                               placeholder="Lebensmittel"/>
                    </div>
                    <div className="col">
                        <label htmlFor="value" className="form-label">Summe*</label>
                        <input type="number"
                               name="value"
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
                               name="comment"
                               className="form-control"
                               id="comment"
                               placeholder="DB Ticket nach Hamburg"/>
                    </div>
                </div>
                <div>
                    <button type="submit"
                            className="mt-3 btn btn-primary">
                        Hinzufuegen
                    </button>
                </div>
                <hr/>
                {entries && entries.length > 0 &&
                  <a
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(jsFriendlyJSONStringify(entries))}`}
                    download="ezbudget-statistiken.json"
                    className="mt-3 mb-3 btn btn-success">
                    Json herunterladen
                  </a>
                }
            </form>

            {entries && entries.length > 0 &&
              <div>

                <h2>Deine erzeugten Daten</h2>
                <pre className="shadow">
                    {jsFriendlyJSONStringify(entries)}
                    </pre>
              </div>
            }
        </div>
    );
}
