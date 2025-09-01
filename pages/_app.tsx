import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Head from 'next/head'
import '../src/styles/app.css'
import {useDataService} from "../src/services/DataService";
import {DataContextType} from "../src/entities/raw/DataContextType";

// @ts-ignore
export const DataContext: DataContextType = React.createContext();
DataContext.displayName = "EzBudget Data Context"

function App(props) {

    const {Component, pageProps} = props;

    const [fileName, setFileName] = useState("");
    const [dataContainer, setDataContainer] = useState([]);
    const [statsContainer, setStatsContainer] = useState([]);
    const dataService = useDataService();


    useEffect(() => {
        dataService.init(dataContainer, setStatsContainer)
    }, [dataContainer])

    useEffect(() => {
    }, [statsContainer])

    const INITIAL_CONTEXT: DataContextType = {
        Provider: DataContext.Provider,
        displayName: DataContext.displayName,
        dataContainer,
        setDataContainer,
        fileName,
        setFileName,
        statsContainer,
        setStatsContainer
    }

    useEffect(() => {
        if (typeof document !== undefined) {
            require('bootstrap/dist/js/bootstrap')
        }
    }, [])

    // @ts-ignore
    return (
        <div>
            <Head>
                <title>EzBudget</title>
                <meta name="keywords"
                      content="Budget Calculate"/>
                <meta name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                      key="viewport"/>
                {/* Robots */}
                <meta name='robots' content='index, follow' />
                <meta property="og:type"
                      content="website"/>
                <meta property="og:site_name"
                      content="ezbudget.de"/>
                <meta name="twitter:card"
                      content="summary_large_image"/>
                <meta name="twitter:title"
                      content="ezbudget.de"/>
                <meta charSet="utf-8"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="msapplication-config"
                      content="/icons/favicons/browserconfig.xml"/>
                <meta name="theme-color" content="#ffffff"/>
                <script defer src="https://umami-t8kgsg4o4wc4o80wgwwo484c.lucanerlich.com/script.js"
                        data-website-id="cc45fb2f-c85e-4c87-8332-43ef11b3a215"></script>
            </Head>
            {/* https://reactjs.org/docs/strict-mode.html */}
            <React.StrictMode>
                <div className="text-gray-800">
                <DataContext.Provider value={INITIAL_CONTEXT}>
                        <Component {...pageProps} />
                    </DataContext.Provider>
                </div>
            </React.StrictMode>
        </div>
    );
}

export default App;
