import React, {useContext} from 'react';
import Layout from "../src/components/Layout";
import CustomHead from "../src/components/CustomHead";
import {DataContext} from "./_app";
import {useDataService} from "../src/services/DataService";

export default function DataInspector(props) {
    const dataContext = useContext(DataContext);
    const dataService = useDataService();

    return (
        <Layout>
            <CustomHead title="DataInspector"
                        description="Inspect uploaded data"/>

            <h1>DataInspector</h1>
            <h2>Errechnete Statistiken</h2>
            <pre className="shadow">{dataService.jsFriendlyJSONStringify(dataContext.statsContainer)}</pre>

            {dataContext.statsContainer && dataContext.statsContainer.length > 0 &&
                <a href={`data:text/json;charset=utf-8,${encodeURIComponent(dataService.jsFriendlyJSONStringify(dataContext.statsContainer))}`}
                   download="ezbudget-statistiken.json">
                    <button type="button" className="mt-3 btn btn-primary">
                        Statistiken herunterladen
                    </button>
                </a>
            }
            <hr/>
            <h2>Hochgeladene Datei</h2>
            <pre className="shadow">{dataService.jsFriendlyJSONStringify(dataContext.dataContainer)}</pre>
        </Layout>
    );
}
