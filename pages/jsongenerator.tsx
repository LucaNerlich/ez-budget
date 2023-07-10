import React from "react";
import Layout from "../src/components/Layout";
import CustomHead from "../src/components/CustomHead";
import JsonDataGeneratorForm from "../src/components/form/JsonDataGenerator";
import {useDataService} from "../src/services/DataService";

const demoJson = [
    {
        "category": "Warmmiete",
        "value": -1390,
        "date": "2022-01-01",
        "comment": 'some-comment'
    },
    {
        "category": "Gehalt",
        "value": 3333,
        "date": "2022-01-01",
        "comment": 'some-other-comment'
    },
]

export default function JsonGenerator(props) {

    const dataService = useDataService();

    return (
        <Layout>
            <CustomHead title="Json Generator"
                        description="Create json Snippest to quickly generate ez-budget data entries."/>

            <h1>EzBudget Json Generator</h1>
            <p>Es werden die einzelnen Datenpunkte eines Monats generiert. Kopiere diese danach in dein bereits
                vorhandenes Dokument sämtlicher Daten. Dieses Formular soll lediglich das Erzeugen der
                Kategorie-Wertpaare beschleunigen.</p>

            <h2>Output Beispiel</h2>

            <pre className="shadow">
                {dataService.jsFriendlyJSONStringify(demoJson)}
            </pre>

            <h2>Eintragsgenerator</h2>
            <div className="alert alert-danger" role="alert">
                Lade das generierte Json runter, bevor du die Seite wechselst oder neu lädst! Andernfalls ist es
                verloren!
            </div>

            <JsonDataGeneratorForm/>
        </Layout>
    );
}
